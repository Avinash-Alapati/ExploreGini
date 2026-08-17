import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 3);
    let endPage = Math.min(totalPages, page + 3);
    
    if (page <= 4) {
      endPage = Math.min(totalPages, 7);
    }
    
    if (page >= totalPages - 3) {
      startPage = Math.max(1, totalPages - 6);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        className="page-btn" 
        disabled={page === 1}
        onClick={() => {
          onPageChange(page - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ChevronLeft size={16} />
      </button>
      
      {getPageNumbers().map(p => (
        <button 
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
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
      
      <span className="page-info">Page {page} of {totalPages}</span>
      
      <button 
        className="page-btn" 
        disabled={page === totalPages}
        onClick={() => {
          onPageChange(page + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
