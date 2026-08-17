import React from 'react';
import SearchBar from './SearchBar';

export default function Hero({ searchValue, onSearchChange, onSearchSubmit, isSearching }) {
  const suggestions = [
    'AI Agents', 'Fintech', 'Developer Tools', 'Healthcare', 'Climate Tech', 'B2B SaaS'
  ];

  const handleChipClick = (term) => {
    onSearchChange({ target: { value: term } });
    if (onSearchSubmit) onSearchSubmit(term);
  };

  return (
    <div className="hero">
      <h1>Discover 6,100+ YC Companies</h1>
      <p>The open database for Y Combinator startups — search by idea, filter by batch & industry.</p>
      
      <SearchBar 
        value={searchValue} 
        onChange={onSearchChange}
        onSearch={onSearchSubmit}
        isSearching={isSearching}
      />
      
      <div className="hero-chips">
        {suggestions.map((chip) => (
          <button 
            key={chip} 
            className="hero-chip"
            onClick={() => handleChipClick(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
