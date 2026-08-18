import React from 'react';
import { Search, Globe, Sparkles, X, Loader2, ArrowRight } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, isSearching, placeholder }) {
  const isUrl = value && (
    value.trim().startsWith('http://') ||
    value.trim().startsWith('https://') ||
    /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(value.trim())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && value) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className="search-container-hero">
      <form onSubmit={handleSubmit} className="search-input-wrapper">
        <div className="search-mode-indicator-box">
          {isUrl ? (
            <div className="mode-pill-url" title="URL Mode: Backend will crawl & summarize this website">
              <Globe size={16} />
              <span>URL Mode</span>
            </div>
          ) : (
            <div className="mode-pill-text" title="Semantic Vector Search">
              <Sparkles size={16} />
              <span>Semantic</span>
            </div>
          )}
        </div>

        <input
          type="text"
          className="search-input-hero"
          placeholder={
            placeholder || "Describe your startup idea OR paste any website URL (e.g. https://stripe.com)..."
          }
          value={value || ''}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />

        <div className="search-actions-right">
          {isSearching ? (
            <div className="search-loading-tag">
              <Loader2 className="spinner" size={16} />
              <span>{isUrl ? 'Crawling...' : 'Searching...'}</span>
            </div>
          ) : value ? (
            <button 
              type="button" 
              className="search-clear-btn" 
              onClick={clearSearch} 
              title="Clear search"
            >
              <X size={18} />
            </button>
          ) : null}

          <button 
            type="submit" 
            className="btn-search-action"
            disabled={!value || isSearching}
            title="Execute Search"
          >
            <span>Search</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
