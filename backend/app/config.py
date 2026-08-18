from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:Prasad123@localhost:5432/ycombinator_db"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIM: int = 384
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Search & Crawling settings
    SEARXNG_URL: str = "http://localhost:8080/search"
    SIMILARITY_FALLBACK_THRESHOLD: float = 0.35
    CRAWL_TIMEOUT_SECONDS: int = 30
    DEFAULT_TOP_K: int = 5
    EMBED_BATCH_SIZE: int = 256
    TEAM_PAGE_HINTS: List[str] = ["team", "about", "about-us", "founders", "people", "leadership"]

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        extra = "ignore"

settings = Settings()
