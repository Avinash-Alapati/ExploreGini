from sqlalchemy import Column, String, Integer, BigInteger, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from .database import Base

class Company(Base):
    __tablename__ = 'companies'

    slug = Column(String, primary_key=True)
    company_name = Column(String, nullable=False)
    one_liner = Column(String)
    long_description = Column(String)
    website = Column(String)
    yc_profile_url = Column(String)
    logo_url = Column(String)
    batch = Column(String)
    status = Column(String)
    stage = Column(String)
    team_size = Column(Integer)
    industry = Column(String)
    subindustry = Column(String)
    industries = Column(JSONB)
    tags = Column(JSONB)
    regions = Column(JSONB)
    all_locations = Column(String)
    is_hiring = Column(Boolean)
    top_company = Column(Boolean)
    nonprofit = Column(Boolean)
    launched_at = Column(BigInteger)
    first_seen_at = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_at = Column(DateTime(timezone=True), server_default=func.now())
    embedding = Column(Vector(384))
