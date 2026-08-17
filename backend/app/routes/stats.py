from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.database import get_db
from app.models import Company
from app.schemas import StatsResponse, IndustryInfo

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("", response_model=StatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    """
    Get aggregate statistics about the database.
    """
    total_companies_query = select(func.count(Company.slug))
    total_companies = (await db.execute(total_companies_query)).scalar() or 0
    
    total_batches_query = select(func.count(func.distinct(Company.batch))).where(Company.batch.is_not(None))
    total_batches = (await db.execute(total_batches_query)).scalar() or 0
    
    total_industries_query = select(func.count(func.distinct(Company.industry))).where(Company.industry.is_not(None))
    total_industries = (await db.execute(total_industries_query)).scalar() or 0
    
    hiring_count_query = select(func.count(Company.slug)).where(Company.is_hiring == True)
    hiring_count = (await db.execute(hiring_count_query)).scalar() or 0
    
    top_industries_query = (
        select(Company.industry, func.count().label('count'))
        .where(Company.industry.is_not(None))
        .group_by(Company.industry)
        .order_by(desc(func.count()))
        .limit(5)
    )
    top_industries_result = await db.execute(top_industries_query)
    top_industries = [{"industry": row.industry, "count": row.count} for row in top_industries_result.all()]
    
    return StatsResponse(
        total_companies=total_companies,
        total_batches=total_batches,
        total_industries=total_industries,
        hiring_count=hiring_count,
        top_industries=top_industries
    )
