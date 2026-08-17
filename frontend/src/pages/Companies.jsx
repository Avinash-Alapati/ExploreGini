import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import CompanyGrid from '../components/CompanyGrid';
import Pagination from '../components/Pagination';
import CompanyDrawer from '../components/CompanyDrawer';
import Footer from '../components/Footer';
import ErrorState from '../components/ErrorState';
import useFilters from '../hooks/useFilters';
import useCompanies from '../hooks/useCompanies';

export default function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const initialBatch = searchParams.get('batch') || '';
  const initialIndustry = searchParams.get('industry') || '';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    search: initialSearch,
    batch: initialBatch,
    industry: initialIndustry,
    status: '',
    sortBy: ''
  });

  // Sync state if URL query params change
  useEffect(() => {
    const b = searchParams.get('batch') || '';
    const ind = searchParams.get('industry') || '';
    const s = searchParams.get('search') || '';
    setFilters(prev => ({
      ...prev,
      batch: b,
      industry: ind,
      search: s
    }));
    setPage(1);
  }, [searchParams]);

  const { batches, industries } = useFilters();
  
  // Transform filters for API hook
  const apiFilters = {
    search: filters.search || undefined,
    batch: filters.batch || undefined,
    industry: filters.industry || undefined,
    status: filters.status || undefined,
    sortBy: filters.sortBy ? filters.sortBy.split('-')[0] : undefined,
    sortOrder: filters.sortBy ? filters.sortBy.split('-')[1] : undefined
  };

  const { companies, loading, error, pagination } = useCompanies(apiFilters, page);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
    
    // Update URL query params cleanly
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearAll = () => {
    setFilters({ search: '', batch: '', industry: '', status: '', sortBy: '' });
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <Navbar />
      
      <main className="container" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Explore Companies
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Discover startups across industries, batches and categories.
          </p>
        </div>
        
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          batches={batches}
          industries={industries}
        />
        
        {error ? (
          <ErrorState 
            title="Failed to load companies"
            message={error}
            onRetry={() => setPage(1)}
          />
        ) : (
          <>
            <CompanyGrid 
              companies={companies}
              loading={loading}
              total={pagination.total}
              onCompanyClick={setSelectedCompany}
              onResetFilters={handleClearAll}
            />
            
            {!loading && pagination.totalPages > 1 && (
              <Pagination 
                page={page} 
                totalPages={pagination.totalPages} 
                onPageChange={setPage} 
              />
            )}
          </>
        )}
      </main>
      
      <Footer />
      
      <CompanyDrawer 
        company={selectedCompany} 
        isOpen={!!selectedCompany} 
        onClose={() => setSelectedCompany(null)} 
      />
    </>
  );
}
