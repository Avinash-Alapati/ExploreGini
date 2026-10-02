import argparse
import logging
import os
import sys
import uvicorn
from contextlib import asynccontextmanager

# Ensure backend root is in sys.path when running app/main.py directly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.services.embedding import load_model, get_model, build_embedding_text
from app.routes import companies, search, filters, stats

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

DB_SETUP_SQL = """
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
    -- If yc_companies exists, add embedding & indexes
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'yc_companies') THEN
        ALTER TABLE yc_companies ADD COLUMN IF NOT EXISTS embedding vector(384);
        CREATE INDEX IF NOT EXISTS idx_yc_companies_embedding
            ON yc_companies USING ivfflat (embedding vector_cosine_ops)
            WITH (lists = 80);
        CREATE INDEX IF NOT EXISTS idx_yc_companies_batch ON yc_companies (batch);
        CREATE INDEX IF NOT EXISTS idx_yc_companies_industry ON yc_companies (industry);
        CREATE INDEX IF NOT EXISTS idx_yc_companies_status ON yc_companies (status);
        CREATE INDEX IF NOT EXISTS idx_yc_companies_launched_at ON yc_companies (launched_at DESC);
        CREATE INDEX IF NOT EXISTS idx_yc_companies_name_trgm ON yc_companies USING gin (company_name gin_trgm_ops);
    END IF;

    -- If companies exists, add embedding & indexes
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'companies') THEN
        ALTER TABLE companies ADD COLUMN IF NOT EXISTS embedding vector(384);
        CREATE INDEX IF NOT EXISTS idx_companies_embedding
            ON companies USING ivfflat (embedding vector_cosine_ops)
            WITH (lists = 80);
        CREATE INDEX IF NOT EXISTS idx_companies_batch ON companies (batch);
        CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies (industry);
        CREATE INDEX IF NOT EXISTS idx_companies_status ON companies (status);
        CREATE INDEX IF NOT EXISTS idx_companies_launched_at ON companies (launched_at DESC);
        CREATE INDEX IF NOT EXISTS idx_companies_name_trgm ON companies USING gin (company_name gin_trgm_ops);
    END IF;

    -- Ensure aliases exist for cross-compatibility
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'yc_companies') 
       AND NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'companies') 
       AND NOT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'companies') THEN
        CREATE VIEW companies AS SELECT * FROM yc_companies;
    ELSIF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'companies') 
       AND NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'yc_companies') 
       AND NOT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'yc_companies') THEN
        CREATE VIEW yc_companies AS SELECT * FROM companies;
    END IF;
END $$;
"""

def setup_db():
    import psycopg2
    db_url = settings.sync_database_url
    logger.info("Running DB setup (pgvector extension + embedding column + indexes)...")
    try:
        conn = psycopg2.connect(db_url)
        try:
            with conn.cursor() as cur:
                cur.execute(DB_SETUP_SQL)
            conn.commit()
            logger.info("DB setup complete.")
        finally:
            conn.close()
    except Exception as e:
        logger.error(f"DB setup error: {e}")
        raise

def run_embed_all(force: bool = False):
    import psycopg2
    from psycopg2.extras import execute_values
    from app.models import Company

    logger.info(f"Loading embedding model '{settings.EMBEDDING_MODEL}' (first run downloads it)...")
    model = get_model()

    table_name = Company.__tablename__
    db_url = settings.sync_database_url
    conn = psycopg2.connect(db_url)
    try:
        where_clause = "" if force else "WHERE embedding IS NULL"
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT slug, company_name, one_liner, long_description,
                       industry, subindustry, tags
                FROM {table_name} {where_clause};
            """)
            cols = [desc[0] for desc in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]

        logger.info(f"{len(rows)} rows need embeddings.")
        if not rows:
            logger.info("Nothing to do.")
            return

        batch_size = settings.EMBED_BATCH_SIZE
        for i in range(0, len(rows), batch_size):
            batch = rows[i:i + batch_size]
            texts = [build_embedding_text(r) for r in batch]
            vectors = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
            pairs = [(r["slug"], vec.tolist()) for r, vec in zip(batch, vectors)]

            with conn.cursor() as cur:
                execute_values(
                    cur,
                    f"UPDATE {table_name} AS t SET embedding = v.embedding "
                    "FROM (VALUES %s) AS v(slug, embedding) "
                    "WHERE t.slug = v.slug",
                    pairs,
                    template="(%s, %s::vector)",
                )
            conn.commit()
            logger.info(f"Embedded and saved rows {i + 1}-{i + len(batch)} of {len(rows)}.")

        logger.info("Embedding run complete.")
    finally:
        conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Preload the embedding model asynchronously in background thread
    # This allows Uvicorn to immediately bind to $PORT without waiting for model downloads
    import asyncio
    asyncio.create_task(asyncio.to_thread(load_model))
    yield

app = FastAPI(
    title="openDB API",
    description="Backend API for openDB with pgvector semantic similarity search, website crawling, and SearXNG fallback.",
    version="1.0.0",
    lifespan=lifespan
)

cors_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if isinstance(settings.CORS_ORIGINS, str) else settings.CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(companies.router)
app.include_router(search.router)
app.include_router(filters.router)
app.include_router(stats.router)

@app.get("/")
async def root():
    return {"message": "openDB API", "version": "1.0.0", "status": "running"}

@app.get("/api/health")
@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    default_host = os.environ.get("HOST", settings.HOST)
    default_port = int(os.environ.get("PORT", settings.PORT))

    parser = argparse.ArgumentParser(description="openDB API Server and Embeddings Manager")
    parser.add_argument("--setup-db", action="store_true", help="Enable pgvector + add embedding column, then exit.")
    parser.add_argument("--embed", action="store_true", help="Generate embeddings for all companies, then exit.")
    parser.add_argument("--force", action="store_true", help="With --embed, re-embed all rows (not just NULL ones).")
    parser.add_argument("--host", default=default_host, help="Host address for API server")
    parser.add_argument("--port", type=int, default=default_port, help="Port number for API server")
    args = parser.parse_args()

    if args.setup_db:
        setup_db()
    elif args.embed:
        run_embed_all(force=args.force)
    else:
        uvicorn.run("app.main:app" if isinstance(app, FastAPI) else app, host=args.host, port=args.port, reload=False)
