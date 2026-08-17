from sentence_transformers import SentenceTransformer
from app.config import settings

_model = None

def load_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model

def get_embedding(text: str) -> list[float]:
    if not _model:
        load_model()
    embedding = _model.encode(text, normalize_embeddings=True)
    return embedding.tolist()
