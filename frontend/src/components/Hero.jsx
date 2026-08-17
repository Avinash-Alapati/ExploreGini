import React from 'react';
import SearchBar from './SearchBar';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function Hero({ searchValue, onSearchChange, onSearchSubmit, isSearching }) {
  const suggestions = [
    'AI Agents', 'Fintech', 'Developer Tools', 'Healthcare', 'Climate Tech', 'B2B SaaS'
  ];

  const handleChipClick = (term) => {
    onSearchChange({ target: { value: term } });
    if (onSearchSubmit) onSearchSubmit(term);
  };

  return (
    <section className="hero-wrapper">
      <div className="hero-glow-bg" />
      
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Open Startup Intelligence</span>
        </div>

        <h1>
          Explore the <span className="gradient-text">startup ecosystem.</span>
        </h1>
        
        <p>
          Discover companies, industries and batches through an open startup database.
        </p>
        
        <SearchBar 
          value={searchValue} 
          onChange={onSearchChange}
          onSearch={onSearchSubmit}
          isSearching={isSearching}
          placeholder="Search companies, industries, batches..."
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
    </section>
  );
}
