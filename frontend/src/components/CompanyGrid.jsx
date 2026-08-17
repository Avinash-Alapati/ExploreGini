import React from 'react';
import CompanyCard from './CompanyCard';
import { SkeletonGrid } from './Skeleton';

export default function CompanyGrid({ companies, loading, onCompanyClick, total }) {
  if (loading) {
    return <SkeletonGrid count={9} />;
  }

  if (!companies || companies.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No companies found.</p>
        <p>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <>
      {total !== undefined && (
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Showing {companies.length} of {total.toLocaleString()} companies
        </div>
      )}
      <div className="company-grid">
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
