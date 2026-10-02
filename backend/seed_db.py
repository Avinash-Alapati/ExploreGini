import logging
import sys
import os
import psycopg2
from app.config import settings
from app.main import setup_db, run_embed_all

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def check_db_health():
    db_url = settings.sync_database_url
    logger.info("Checking database connection...")
    try:
        conn = psycopg2.connect(db_url)
        with conn.cursor() as cur:
            cur.execute("SELECT version();")
            ver = cur.fetchone()[0]
            logger.info(f"Connected to PostgreSQL: {ver}")

            # Check pgvector
            cur.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
            ext = cur.fetchone()
            if ext:
                logger.info("pgvector extension is installed.")
            else:
                logger.warning("pgvector extension not installed yet. Running setup_db()...")
                setup_db()

            # Check table yc_companies
            cur.execute("""
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_name IN ('yc_companies', 'companies');
            """)
            table_count = cur.fetchone()[0]
            if table_count > 0:
                cur.execute("SELECT COUNT(*) FROM yc_companies;")
                count = cur.fetchone()[0]
                logger.info(f"Database contains {count} companies in 'yc_companies'.")
            else:
                logger.warning("No companies table found. Please restore backup.sql or run migrations.")
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--setup":
        setup_db()
    elif len(sys.argv) > 1 and sys.argv[1] == "--embed":
        run_embed_all()
    else:
        check_db_health()
