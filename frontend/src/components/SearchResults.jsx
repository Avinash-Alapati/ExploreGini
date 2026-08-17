import React from 'react';
import CompanyCard from './CompanyCard';
import { SkeletonGrid } from './Skeleton';

export default function SearchResults({ results, loading, query, onCompanyClick }) {
  if (!query) return null;

  if (loading) {
    return (
      <div className="search-results-section">
        <h2 className="search-results-header">Searching for "{query}"...</h2>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results-section" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>No matching companies found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          We couldn't find any startups matching "{query}". Try a different description or idea.
        </p>
      </div>
    );
  }

  return (
    <div className="search-results-section">
      <h2 className="search-results-header">
        Found {results.length} companies similar to "{query}"
      </h2>
      <div className="company-grid">
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
