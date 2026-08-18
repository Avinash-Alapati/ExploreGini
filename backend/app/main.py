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

ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS embedding vector(384);

CREATE INDEX IF NOT EXISTS idx_companies_embedding
    ON companies USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 80);
"""

def setup_db():
    import psycopg2
    # Convert asyncpg URL to sync postgresql params or connect directly
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    logger.info("Running DB setup (pgvector extension + embedding column + index)...")
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

    logger.info(f"Loading embedding model '{settings.EMBEDDING_MODEL}' (first run downloads it)...")
    model = get_model()

    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    conn = psycopg2.connect(db_url)
    try:
        where_clause = "" if force else "WHERE embedding IS NULL"
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT slug, company_name, one_liner, long_description,
                       industry, subindustry, tags
                FROM companies {where_clause};
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
                    "UPDATE companies AS t SET embedding = v.embedding "
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
    # Preload the model in background/startup
    try:
        load_model()
    except Exception as e:
        logger.warning(f"Embedding model eager loading notice: {e}")
    yield

app = FastAPI(
    title="openDB API",
    description="Backend API for openDB with pgvector semantic similarity search, website crawling, and SearXNG fallback.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    return {"message": "openDB API", "version": "1.0.0"}

@app.get("/api/health")
@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="openDB API Server and Embeddings Manager")
    parser.add_argument("--setup-db", action="store_true", help="Enable pgvector + add embedding column, then exit.")
    parser.add_argument("--embed", action="store_true", help="Generate embeddings for all companies, then exit.")
    parser.add_argument("--force", action="store_true", help="With --embed, re-embed all rows (not just NULL ones).")
    parser.add_argument("--host", default="127.0.0.1", help="Host address for API server")
    parser.add_argument("--port", type=int, default=8000, help="Port number for API server")
    args = parser.parse_args()

    if args.setup_db:
        setup_db()
    elif args.embed:
        run_embed_all(force=args.force)
    else:
        uvicorn.run(app, host=args.host, port=args.port)
