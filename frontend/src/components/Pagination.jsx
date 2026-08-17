import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);
    
    if (page <= 3) {
      endPage = Math.min(totalPages, 5);
    }
    
    if (page >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination-wrapper">
      <button 
        className="page-btn-modern" 
        disabled={page === 1}
        onClick={() => {
          onPageChange(page - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>
      
      {getPageNumbers().map(p => (
        <button 
          key={p}
          className={`page-btn-modern ${p === page ? 'active' : ''}`}
          onClick={() => {
            if (p !== page) {
              onPageChange(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          {p}
        </button>
      ))}
      
      <span className="pagination-text">Page {page} of {totalPages}</span>
      
      <button 
        className="page-btn-modern" 
        disabled={page === totalPages}
        onClick={() => {
          onPageChange(page + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
