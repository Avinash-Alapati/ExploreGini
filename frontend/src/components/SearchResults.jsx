import React from 'react';
import CompanyCard from './CompanyCard';
import { SkeletonGrid } from './Skeleton';
import EmptyState from './EmptyState';

export default function SearchResults({ results, loading, query, onCompanyClick }) {
  if (!query) return null;

  if (loading) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          Searching startups matching "<span style={{ color: 'var(--text-main)' }}>{query}</span>"...
        </h2>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <EmptyState 
        title="No matching startups found" 
        message={`We couldn't find any startups matching "${query}". Try a different idea or industry term.`}
      />
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        Found <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{results.length}</span> startups matching "<span style={{ color: 'var(--text-main)' }}>{query}</span>"
      </h2>
      
      <div className="company-grid-container">
        {results.map((company, i) => (
          <CompanyCard 
            key={company.id || company.slug || i} 
            company={company} 
            index={i}
            onClick={onCompanyClick}
            similarityScore={company.similarity_score}
          />
        ))}
      </div>
    </div>
  );
}
