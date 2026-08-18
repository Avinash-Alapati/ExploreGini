import logging
from urllib.parse import urlparse
from typing import List, Optional, Dict, Any
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services.embedding import get_embedding
from app.services.crawler import fetch_page_summary_async
from app.services.web_search import search_web

logger = logging.getLogger(__name__)

def _looks_like_url(text_val: str) -> bool:
    text_val = text_val.strip()
    if text_val.startswith("http://") or text_val.startswith("https://"):
        try:
            return bool(urlparse(text_val).netloc)
        except Exception:
            return False
    return False

async def semantic_search(
    db_session: AsyncSession, 
    query_vector: List[float], 
    limit: int, 
    batch_filter: Optional[str] = None, 
    industry_filter: Optional[str] = None
) -> List[dict]:
    
    query = """
        SELECT 
            slug, company_name, one_liner, long_description, website,
            yc_profile_url, logo_url, batch, status, stage, team_size,
            industry, subindustry, industries, tags, regions, all_locations,
            is_hiring, top_company, nonprofit, launched_at,
            1 - (embedding <=> CAST(:query_vector AS vector)) AS similarity_score
        FROM companies 
        WHERE embedding IS NOT NULL
    """
    
    params: Dict[str, Any] = {"query_vector": str(query_vector), "limit": limit}
    
    if batch_filter:
        query += " AND batch = :batch"
        params["batch"] = batch_filter
        
    if industry_filter:
        query += " AND industry = :industry"
        params["industry"] = industry_filter
        
    query += " ORDER BY embedding <=> CAST(:query_vector AS vector) LIMIT :limit"
    
    result = await db_session.execute(text(query), params)
    rows = result.mappings().all()
    
    # Return formatted list of dicts with both similarity_score and similarity key
    res = []
    for row in rows:
        d = dict(row)
        score = float(d.get("similarity_score") or 0.0)
        d["similarity_score"] = score
        d["similarity"] = score
        res.append(d)
    return res

async def answer_query(
    user_input: str, 
    db_session: AsyncSession,
    top_k: int = settings.DEFAULT_TOP_K,
    batch_filter: Optional[str] = None,
    industry_filter: Optional[str] = None
) -> dict:
    input_type = "url" if _looks_like_url(user_input) else "text"
    source_page_url = None

    if input_type == "url":
        source_page_url = user_input.strip()
        logger.info(f"Input classified as URL: {source_page_url}")
        crawled_summary = await fetch_page_summary_async(source_page_url)
        query_text = crawled_summary if crawled_summary else user_input
        if not crawled_summary:
            logger.warning("Crawl returned nothing usable; using raw URL as query text.")
    else:
        logger.info("Input classified as free-text description.")
        query_text = user_input

    query_vector = get_embedding(query_text)
    db_matches = await semantic_search(
        db_session=db_session,
        query_vector=query_vector,
        limit=top_k,
        batch_filter=batch_filter,
        industry_filter=industry_filter
    )

    best_similarity = db_matches[0]["similarity_score"] if db_matches else 0.0
    logger.info(f"Top DB match similarity: {best_similarity:.3f} (threshold {settings.SIMILARITY_FALLBACK_THRESHOLD})")

    used_external_fallback = (best_similarity < settings.SIMILARITY_FALLBACK_THRESHOLD) or (len(db_matches) == 0)
    external_results = []
    if used_external_fallback:
        logger.info("DB matches weak/absent -- supplementing with SearXNG.")
        search_term = f"startups similar to: {query_text[:200]}"
        external_results = search_web(search_term, max_results=5)

    return {
        "input_type": input_type,
        "query_text_used": query_text,
        "source_page_url": source_page_url,
        "db_matches": db_matches,
        "results": db_matches,
        "used_external_fallback": used_external_fallback,
        "external_results": external_results,
        "total": len(db_matches),
        "query": user_input
    }
