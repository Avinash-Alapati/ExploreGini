import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "We couldn't load this data right now. Please check your connection or backend status.", 
  onRetry 
}) {
  return (
    <div className="state-box-styled">
      <div className="state-icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
        <AlertCircle size={32} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-subtitle">{message}</p>
      {onRetry && (
        <button className="btn-primary-styled" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
