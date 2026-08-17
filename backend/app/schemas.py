from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class CompanyListItem(BaseModel):
    slug: str
    company_name: str
    one_liner: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    batch: Optional[str] = None
    status: Optional[str] = None
    stage: Optional[str] = None
    team_size: Optional[int] = None
    industry: Optional[str] = None
    subindustry: Optional[str] = None
    industries: Optional[Any] = None
    tags: Optional[Any] = None
    regions: Optional[Any] = None
    all_locations: Optional[str] = None
    is_hiring: Optional[bool] = None
    top_company: Optional[bool] = None
    nonprofit: Optional[bool] = None
    yc_profile_url: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class CompanyDetail(CompanyListItem):
    long_description: Optional[str] = None
    launched_at: Optional[int] = None
    first_seen_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None

class PaginatedResponse(BaseModel):
    data: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int

class SearchRequest(BaseModel):
    query: str
    limit: int = 20
    batch: Optional[str] = None
    industry: Optional[str] = None

class SearchResult(CompanyListItem):
    similarity_score: float

class SearchResponse(BaseModel):
    results: List[SearchResult]
    query: str
    total: int

class BatchInfo(BaseModel):
    batch: str
    count: int

class IndustryInfo(BaseModel):
    industry: str
    count: int

class StatsResponse(BaseModel):
    total_companies: int
    total_batches: int
    total_industries: int
    hiring_count: int
    top_industries: List[IndustryInfo]
