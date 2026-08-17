from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.database import get_db
from app.models import Company
from app.schemas import BatchInfo, IndustryInfo
from typing import List

router = APIRouter(prefix="/api", tags=["filters"])

@router.get("/batches", response_model=List[BatchInfo])
async def get_batches(db: AsyncSession = Depends(get_db)):
    """
    Get all distinct batches with their company count.
    """
    query = (
        select(Company.batch, func.count().label('count'))
        .where(Company.batch.is_not(None))
        .group_by(Company.batch)
        .order_by(desc(Company.batch))
    )
    result = await db.execute(query)
    rows = result.all()
    return [{"batch": row.batch, "count": row.count} for row in rows]

@router.get("/industries", response_model=List[IndustryInfo])
async def get_industries(db: AsyncSession = Depends(get_db)):
    """
    Get all distinct industries with their company count.
    """
    query = (
        select(Company.industry, func.count().label('count'))
        .where(Company.industry.is_not(None))
        .group_by(Company.industry)
        .order_by(desc(func.count()))
    )
    result = await db.execute(query)
    rows = result.all()
    return [{"industry": row.industry, "count": row.count} for row in rows]
