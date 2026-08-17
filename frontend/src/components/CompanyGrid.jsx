import React from 'react';
import CompanyCard from './CompanyCard';
import { SkeletonGrid } from './Skeleton';
import EmptyState from './EmptyState';

export default function CompanyGrid({ companies, loading, onCompanyClick, total, onResetFilters }) {
  if (loading) {
    return <SkeletonGrid count={9} />;
  }

  if (!companies || companies.length === 0) {
    return (
      <EmptyState 
        title="No companies found" 
        message="Try adjusting your filter settings or search keywords." 
        onReset={onResetFilters}
      />
    );
  }

  return (
    <>
      {total !== undefined && (
        <div style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
          Showing <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{companies.length}</span> of <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{total.toLocaleString()}</span> companies
        </div>
      )}
      
      <div className="company-grid-container">
        {companies.map((company, i) => (
          <CompanyCard 
            key={company.id || company.slug || i} 
            company={company} 
            index={i}
            onClick={onCompanyClick}
          />
        ))}
      </div>
    </>
  );
}
