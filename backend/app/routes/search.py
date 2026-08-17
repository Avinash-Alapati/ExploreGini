from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import SearchRequest, SearchResponse, SearchResult
from app.services.embedding import get_embedding
from app.services.search import semantic_search

router = APIRouter(prefix="/api/search", tags=["search"])

@router.post("", response_model=SearchResponse)
async def search_companies(
    request: SearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Perform semantic vector search on companies using text query.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    query_vector = get_embedding(request.query)
    
    results = await semantic_search(
        db_session=db,
        query_vector=query_vector,
        limit=request.limit,
        batch_filter=request.batch,
        industry_filter=request.industry
    )
    
    return SearchResponse(
        results=[SearchResult(**row) for row in results],
        query=request.query,
        total=len(results)
    )
