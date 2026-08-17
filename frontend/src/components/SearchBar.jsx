import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, isSearching }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className="search-bar">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        placeholder="Describe your startup idea or search companies..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {isSearching ? (
        <Loader2 className="spinner" size={20} />
      ) : value ? (
        <button className="search-clear" onClick={clearSearch}>
          <X size={20} />
        </button>
      ) : null}
    </div>
  );
}
