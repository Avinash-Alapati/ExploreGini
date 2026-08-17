import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import CompanyGrid from '../components/CompanyGrid';
import Pagination from '../components/Pagination';
import CompanyDrawer from '../components/CompanyDrawer';
import Footer from '../components/Footer';
import useFilters from '../hooks/useFilters';
import useCompanies from '../hooks/useCompanies';

export default function Companies() {
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    batch: '',
    industry: '',
    status: '',
    sortBy: ''
  });

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

  const { companies, loading, pagination } = useCompanies(apiFilters, page);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to page 1 on filter change
  };

  const handleClearAll = () => {
    setFilters({ search: '', batch: '', industry: '', status: '', sortBy: '' });
    setPage(1);
  };

  return (
    <>
      <Navbar />
      
      <main className="container">
        <h1 className="page-title">Browse Companies</h1>
        
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          batches={batches}
          industries={industries}
        />
        
        <CompanyGrid 
          companies={companies}
          loading={loading}
          total={pagination.total}
          onCompanyClick={setSelectedCompany}
        />
        
        {!loading && pagination.totalPages > 1 && (
          <Pagination 
            page={page} 
            totalPages={pagination.totalPages} 
            onPageChange={setPage} 
          />
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
