import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({ 
  title = "No companies found", 
  message = "Try adjusting your search or exploring another category.", 
  onReset 
}) {
  return (
    <div className="state-box-styled">
      <div className="state-icon-circle">
        <SearchX size={32} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-subtitle">{message}</p>
      {onReset && (
        <button className="btn-primary-styled" onClick={onReset}>
          <RotateCcw size={16} />
          <span>Reset Search & Filters</span>
        </button>
      )}
    </div>
  );
}
