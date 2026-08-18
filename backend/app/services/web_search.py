import logging
import time
import requests
from app.config import settings

logger = logging.getLogger(__name__)

def search_web(query: str, max_results: int = 5) -> list[dict]:
    """
    Returns [] on failure (logged, not raised) -- external search is a
    fallback and shouldn't crash the whole chatbot response if down.
    """
    params = {"q": query, "format": "json"}
    for attempt in range(1, 3):
        try:
            resp = requests.get(settings.SEARXNG_URL, params=params, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", [])[:max_results]
            return [
                {
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "snippet": r.get("content", "")
                }
                for r in results
            ]
        except requests.RequestException as e:
            logger.warning(f"SearXNG request failed (attempt {attempt}/2): {e}")
            if attempt < 2:
                time.sleep(1)
                
    logger.warning("SearXNG unreachable -- returning no external results. "
                   "Check the instance is running and `json` is enabled in settings.yml.")
    return []
