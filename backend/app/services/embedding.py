import logging
from functools import lru_cache
from typing import List, Dict, Any, Tuple
from fastembed import TextEmbedding
from app.config import settings

logger = logging.getLogger(__name__)

_model = None

def get_model() -> TextEmbedding:
    global _model
    if _model is None:
        model_name = settings.EMBEDDING_MODEL
        if not model_name.startswith("sentence-transformers/") and model_name == "all-MiniLM-L6-v2":
            model_name = "sentence-transformers/all-MiniLM-L6-v2"
        logger.info(f"Loading lightweight embedding model '{model_name}'...")
        _model = TextEmbedding(model_name=model_name)
    return _model

def load_model() -> TextEmbedding:
    return get_model()

@lru_cache(maxsize=4096)
def _cached_embed_text(text: str) -> Tuple[float, ...]:
    model = get_model()
    embeddings = list(model.embed([text]))
    return tuple(float(x) for x in embeddings[0])

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
