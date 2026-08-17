const BASE_URL = 'http://localhost:8000';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${res.status}`);
  }
  return res.json();
};

export const fetchCompanies = async ({ page = 1, pageSize = 20, batch, industry, status, search, sortBy, sortOrder }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('page_size', pageSize);
  if (batch) params.append('batch', batch);
  if (industry) params.append('industry', industry);
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if (sortBy) params.append('sort_by', sortBy);
  if (sortOrder) params.append('sort_order', sortOrder);

  const res = await fetch(`${BASE_URL}/api/companies?${params.toString()}`);
  return handleResponse(res);
};

export const fetchCompany = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/companies/${slug}`);
  return handleResponse(res);
};

export const searchCompanies = async (query, limit = 20, batch, industry) => {
  const body = { query, limit };
  if (batch) body.batch = batch;
  if (industry) body.industry = industry;

  const res = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return handleResponse(res);
};

export const fetchBatches = async () => {
  const res = await fetch(`${BASE_URL}/api/batches`);
  return handleResponse(res);
};

export const fetchIndustries = async () => {
  const res = await fetch(`${BASE_URL}/api/industries`);
  return handleResponse(res);
};

export const fetchStats = async () => {
  const res = await fetch(`${BASE_URL}/api/stats`);
  return handleResponse(res);
};
