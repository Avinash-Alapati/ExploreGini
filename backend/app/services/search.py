from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

async def semantic_search(
    db_session: AsyncSession, 
    query_vector: List[float], 
    limit: int, 
    batch_filter: Optional[str] = None, 
    industry_filter: Optional[str] = None
) -> List[dict]:
    
    query = """
        SELECT *, 
        1 - (embedding <=> :query_vector::vector) AS similarity_score 
        FROM companies 
        WHERE 1=1
    """
    
    params = {"query_vector": str(query_vector), "limit": limit}
    
    if batch_filter:
        query += " AND batch = :batch"
        params["batch"] = batch_filter
        
    if industry_filter:
        query += " AND industry = :industry"
        params["industry"] = industry_filter
        
    query += " ORDER BY embedding <=> :query_vector::vector LIMIT :limit"
    
    result = await db_session.execute(text(query), params)
    rows = result.mappings().all()
    return [dict(row) for row in rows]
