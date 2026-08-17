import React from 'react';

export function CompanyCardSkeleton() {
  return (
    <div className="skeleton-card-container">
      <div className="card-top">
        <div className="skeleton-box" style={{ width: '48px', height: '48px', borderRadius: '12px' }}></div>
        <div style={{ flexGrow: 1 }}>
          <div className="skeleton-box" style={{ width: '60%', height: '18px', marginBottom: '8px' }}></div>
          <div className="skeleton-box" style={{ width: '35%', height: '14px' }}></div>
        </div>
      </div>
      <div className="skeleton-box" style={{ width: '100%', height: '36px', marginBottom: '16px' }}></div>
      <div className="tag-pills-row" style={{ marginBottom: '16px' }}>
        <div className="skeleton-box" style={{ width: '70px', height: '22px', borderRadius: '20px' }}></div>
        <div className="skeleton-box" style={{ width: '90px', height: '22px', borderRadius: '20px' }}></div>
      </div>
      <div className="card-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        <div className="skeleton-box" style={{ width: '100px', height: '14px' }}></div>
        <div className="skeleton-box" style={{ width: '50px', height: '18px', borderRadius: '4px' }}></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 9 }) {
  return (
    <div className="company-grid-container">
      {Array.from({ length: count }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SkeletonCardsRow({ count = 6 }) {
  return (
    <div className="grid-cards-interactive">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-interactive-item" style={{ height: '150px' }}>
          <div className="skeleton-box" style={{ width: '44px', height: '44px', borderRadius: '12px', marginBottom: '16px' }}></div>
          <div className="skeleton-box" style={{ width: '70%', height: '20px', marginBottom: '8px' }}></div>
          <div className="skeleton-box" style={{ width: '40%', height: '14px' }}></div>
        </div>
      ))}
    </div>
  );
}
