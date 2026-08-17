from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc
from typing import Optional

from app.database import get_db
from app.models import Company
from app.schemas import PaginatedResponse, CompanyListItem, CompanyDetail
from app.config import settings

router = APIRouter(prefix="/api/companies", tags=["companies"])

@router.get("", response_model=PaginatedResponse)
async def list_companies(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
    batch: Optional[str] = None,
    industry: Optional[str] = None,
    status: Optional[str] = None,
    is_hiring: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = Query("launched_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a paginated list of companies with optional filtering and sorting.
    """
    query = select(Company)
    
    if batch:
        query = query.where(Company.batch == batch)
    if industry:
        query = query.where(Company.industry == industry)
    if status:
        query = query.where(Company.status == status)
    if is_hiring is not None:
        query = query.where(Company.is_hiring == is_hiring)
    if search:
        query = query.where(Company.company_name.ilike(f"%{search}%"))
        
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    sort_column = getattr(Company, sort_by, Company.launched_at)
    if sort_order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
        
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(query)
    companies = result.scalars().all()
    
    total_pages = (total + page_size - 1) // page_size
    
    return PaginatedResponse(
        data=[CompanyListItem.model_validate(c) for c in companies],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/{slug}", response_model=CompanyDetail)
async def get_company(slug: str, db: AsyncSession = Depends(get_db)):
    """
    Get detailed information about a single company by slug.
    """
    result = await db.execute(select(Company).where(Company.slug == slug))
    company = result.scalars().first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    return company
