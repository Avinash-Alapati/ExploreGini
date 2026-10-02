from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:Prasad123@localhost:5432/ycombinator_db"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIM: int = 384
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "*"
    
    # Search & Crawling settings
    SEARXNG_URL: str = "http://localhost:8080/search"
    SIMILARITY_FALLBACK_THRESHOLD: float = 0.35
    CRAWL_TIMEOUT_SECONDS: int = 30
    DEFAULT_TOP_K: int = 5
    EMBED_BATCH_SIZE: int = 256
    TEAM_PAGE_HINTS: List[str] = ["team", "about", "about-us", "founders", "people", "leadership"]

    @property
    def async_database_url(self) -> str:
        """
        Formats DATABASE_URL for SQLAlchemy asyncpg engine.
        Converts postgres:// or postgresql:// to postgresql+asyncpg://
        and converts sslmode=require to ssl=require (required by asyncpg),
        and removes unsupported parameters like channel_binding.
        """
        url = os.environ.get("DATABASE_URL", self.DATABASE_URL)
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        
        # Clean query parameters for asyncpg compatibility (e.g. Neon connection strings)
        if "channel_binding=" in url:
            import re
            url = re.sub(r'[&?]channel_binding=[^&]+', '', url)
            if '?' not in url and '&' in url:
                url = url.replace('&', '?', 1)

        if "sslmode=require" in url:
            url = url.replace("sslmode=require", "ssl=require")
        elif "sslmode=" in url:
            import re
            url = re.sub(r'sslmode=[^&]+', 'ssl=require', url)

        return url

    @property
    def sync_database_url(self) -> str:
        """
        Formats DATABASE_URL for psycopg2 sync connection (used in migrations and CLI).
        Converts postgresql+asyncpg:// or postgres:// to postgresql://
        """
        url = os.environ.get("DATABASE_URL", self.DATABASE_URL)
        if url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        extra = "ignore"

settings = Settings()
