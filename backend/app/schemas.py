from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Any
from datetime import datetime

class CompanyListItem(BaseModel):
    slug: str
    company_name: str
    one_liner: Optional[str] = None
    long_description: Optional[str] = None
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
    launched_at: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)

class CompanyDetail(CompanyListItem):
    first_seen_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None

class PaginatedResponse(BaseModel):
    data: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int

class SearchResult(CompanyListItem):
    similarity_score: float = 0.0
    similarity: Optional[float] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ExternalSearchResult(BaseModel):
    title: str
    url: str
    snippet: str

class SearchRequest(BaseModel):
    query: str = Field(..., description="Startup description or website URL")
    limit: Optional[int] = Field(20, ge=1, le=50, description="Max matches to return")
    top_k: Optional[int] = Field(None, ge=1, le=50, description="Alias for limit")
    batch: Optional[str] = None
    industry: Optional[str] = None

class SearchResponse(BaseModel):
    input_type: str = "text"
    query_text_used: str
    source_page_url: Optional[str] = None
    db_matches: List[SearchResult] = []
    results: List[SearchResult] = []
    used_external_fallback: bool = False
    external_results: List[ExternalSearchResult] = []
    total: int = 0
    query: str

class ChatRequest(BaseModel):
    query: str = Field(..., description="A startup idea/description, OR a URL to a startup's website.")
    top_k: int = Field(5, ge=1, le=25, description="How many similar companies to return.")

class ChatResponse(BaseModel):
    input_type: str
    query_text_used: str
    source_page_url: Optional[str] = None
    db_matches: List[dict]
    used_external_fallback: bool
    external_results: List[dict]

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
