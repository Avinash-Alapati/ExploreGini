-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- HNSW index for vector similarity search on yc_companies
CREATE INDEX IF NOT EXISTS idx_yc_companies_embedding_hnsw
ON yc_companies USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- B-Tree indexes
CREATE INDEX IF NOT EXISTS idx_yc_companies_batch ON yc_companies (batch);
CREATE INDEX IF NOT EXISTS idx_yc_companies_industry ON yc_companies (industry);
CREATE INDEX IF NOT EXISTS idx_yc_companies_status ON yc_companies (status);
CREATE INDEX IF NOT EXISTS idx_yc_companies_launched_at ON yc_companies (launched_at DESC);

-- Trigram index for text search
CREATE INDEX IF NOT EXISTS idx_yc_companies_name_trgm
ON yc_companies USING gin (company_name gin_trgm_ops);

