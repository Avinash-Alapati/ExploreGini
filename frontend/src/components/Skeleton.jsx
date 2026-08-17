import React from 'react';

export function CompanyCardSkeleton() {
  return (
    <div className="skeleton-card skeleton">
      <div className="sk-header">
        <div className="sk-logo skeleton"></div>
        <div>
          <div className="sk-title skeleton"></div>
          <div className="sk-badge skeleton"></div>
        </div>
      </div>
      <div className="sk-desc skeleton"></div>
      <div className="sk-tags">
        <div className="sk-tag skeleton"></div>
        <div className="sk-tag skeleton"></div>
      </div>
      <div className="sk-footer">
        <div className="sk-icon skeleton"></div>
        <div className="sk-icon skeleton"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="company-grid">
      {Array.from({ length: count }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}
