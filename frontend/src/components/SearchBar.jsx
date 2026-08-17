import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, isSearching, placeholder }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className="search-container-hero">
      <div className="search-input-wrapper">
        <Search className="search-icon-hero" size={22} />
        <input
          type="text"
          className="search-input-hero"
          placeholder={placeholder || "Search companies, industries, batches..."}
          value={value || ''}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        {isSearching ? (
          <Loader2 className="search-clear-hero spinner" size={20} />
        ) : value ? (
          <button className="search-clear-hero" onClick={clearSearch} title="Clear search">
            <X size={20} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
