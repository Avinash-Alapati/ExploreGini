import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas import SearchRequest, SearchResponse, ChatRequest, ChatResponse
from app.services.search import answer_query

logger = logging.getLogger(__name__)

router = APIRouter(tags=["search"])

@router.post("/api/search", response_model=SearchResponse)
async def search_companies(
    request: SearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Perform semantic vector search on companies using text query or website URL.
    Falls back to SearXNG external search if similarity is below threshold.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    limit = request.top_k or request.limit or 20
    try:
        data = await answer_query(
            user_input=request.query,
            db_session=db,
            top_k=limit,
            batch_filter=request.batch,
            industry_filter=request.industry
        )
        return SearchResponse(**data)
    except Exception as e:
        logger.exception("Semantic search failed")
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
@router.post("/api/chat", response_model=ChatResponse)
async def chat_query(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Chatbot endpoint for startup similarity queries (text description or URL).
    """
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="`query` must not be empty.")
    try:
        data = await answer_query(
            user_input=req.query,
            db_session=db,
            top_k=req.top_k
        )
        return ChatResponse(
            input_type=data["input_type"],
            query_text_used=data["query_text_used"],
            source_page_url=data["source_page_url"],
            db_matches=data["db_matches"],
            used_external_fallback=data["used_external_fallback"],
            external_results=data["external_results"]
        )
    except Exception as e:
        logger.exception("chat() failed")
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")
