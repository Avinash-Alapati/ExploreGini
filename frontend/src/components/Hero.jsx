import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { Sparkles, Globe, Zap, Search } from 'lucide-react';

export default function Hero({ searchValue, onSearchChange, onSearchSubmit, isSearching }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ideas', 'urls'

  const ideaSuggestions = [
    'AI Agents for DevOps',
    'B2B Fintech & Billing',
    'Developer Tools & Cloud IDE',
    'Climate Tech & Carbon Accounting',
    'AI Healthcare Automation',
    'Robotics & Autonomous Drones'
  ];

  const urlSuggestions = [
    'https://stripe.com',
    'https://replit.com',
    'https://scale.com',
    'https://posthog.com'
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
          <span>AI-Powered Startup Intelligence</span>
        </div>

        <h1>
          Explore similar startups <br />
          <span className="gradient-text">by concept or website URL.</span>
        </h1>
        
        <p>
          Semantic vector embeddings match your idea with YC startups in milliseconds. 
          Paste a company website URL to analyze and find competitors automatically.
        </p>
        
        <SearchBar 
          value={searchValue} 
          onChange={onSearchChange}
          onSearch={onSearchSubmit}
          isSearching={isSearching}
          placeholder="Describe an idea (e.g. 'AI code review tool') OR paste URL (e.g. 'https://stripe.com')..."
        />
        
        <div className="hero-chips-container">
          <div className="hero-chips-header">
            <span className="chips-label">
              <Zap size={13} /> Try an example:
            </span>
            <div className="chips-filter-toggle">
              <button 
                type="button"
                className={`chips-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                type="button"
                className={`chips-tab ${activeTab === 'ideas' ? 'active' : ''}`}
                onClick={() => setActiveTab('ideas')}
              >
                Ideas
              </button>
              <button 
                type="button"
                className={`chips-tab ${activeTab === 'urls' ? 'active' : ''}`}
                onClick={() => setActiveTab('urls')}
              >
                <Globe size={12} /> URLs
              </button>
            </div>
          </div>

          <div className="hero-chips">
            {(activeTab === 'all' || activeTab === 'ideas') && ideaSuggestions.slice(0, activeTab === 'all' ? 4 : 6).map((chip) => (
              <button 
                key={chip} 
                className="hero-chip"
                onClick={() => handleChipClick(chip)}
              >
                <Sparkles size={12} className="chip-icon-text" />
                <span>{chip}</span>
              </button>
            ))}

            {(activeTab === 'all' || activeTab === 'urls') && urlSuggestions.map((chip) => (
              <button 
                key={chip} 
                className="hero-chip hero-chip-url"
                onClick={() => handleChipClick(chip)}
              >
                <Globe size={12} className="chip-icon-url" />
                <span>{chip.replace('https://', '')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
