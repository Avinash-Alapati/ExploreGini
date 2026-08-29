import logging
from functools import lru_cache
from typing import List, Dict, Any, Tuple
from sentence_transformers import SentenceTransformer
from app.config import settings

logger = logging.getLogger(__name__)

_model = None

def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        logger.info(f"Loading embedding model '{settings.EMBEDDING_MODEL}'...")
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model

def load_model() -> SentenceTransformer:
    return get_model()

@lru_cache(maxsize=4096)
def _cached_embed_text(text: str) -> Tuple[float, ...]:
    model = get_model()
    vec = model.encode(text, normalize_embeddings=True)
    return tuple(vec.tolist())

def embed_text(text: str) -> List[float]:
    return list(_cached_embed_text(text))

def get_embedding(text: str) -> List[float]:
    return embed_text(text)

def build_embedding_text(row: Dict[str, Any]) -> str:
    tags = row.get("tags") or []
    if isinstance(tags, list):
        tags_str = " ".join(str(t) for t in tags)
    else:
        tags_str = str(tags)

    parts = [
        row.get("company_name") or "",
        row.get("one_liner") or "",
        row.get("long_description") or "",
        row.get("industry") or "",
        row.get("subindustry") or "",
        tags_str,
    ]
    return " ".join(p for p in parts if p).strip()
