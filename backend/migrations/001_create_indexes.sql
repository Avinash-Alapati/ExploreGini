-- HNSW index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_companies_embedding_hnsw
ON companies USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- B-Tree indexes
CREATE INDEX IF NOT EXISTS idx_companies_batch ON companies (batch);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies (industry);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies (status);
CREATE INDEX IF NOT EXISTS idx_companies_launched_at ON companies (launched_at DESC);

-- Trigram index for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_companies_name_trgm
ON companies USING gin (company_name gin_trgm_ops);
