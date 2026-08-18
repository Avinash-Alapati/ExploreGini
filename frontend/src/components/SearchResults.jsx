import React, { useState } from 'react';
import CompanyCard from './CompanyCard';
import { SkeletonGrid } from './Skeleton';
import EmptyState from './EmptyState';
import { 
  Globe, 
  ExternalLink, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Layers, 
  Compass,
  AlertCircle
} from 'lucide-react';

export default function SearchResults({ 
  results = [], 
  externalResults = [],
  usedExternalFallback = false,
  inputType = 'text',
  queryTextUsed = '',
  sourcePageUrl = null,
  loading = false, 
  query = '', 
  onCompanyClick 
}) {
  const [showCrawledText, setShowCrawledText] = useState(false);

  if (!query) return null;

  if (loading) {
    return (
      <div className="search-results-wrapper">
        <div className="search-loading-banner">
          <div className="search-loading-spinner-ring" />
          <div>
            <h3>
              {query.startsWith('http://') || query.startsWith('https://') 
                ? 'Crawling website & extracting startup intelligence...' 
                : `Computing semantic vector embeddings for "${query}"...`}
            </h3>
            <p>Scanning companies using cosine similarity and AI embeddings</p>
          </div>
        </div>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  const hasDbResults = results && results.length > 0;
  const hasExternalResults = externalResults && externalResults.length > 0;

  if (!hasDbResults && !hasExternalResults) {
    return (
      <EmptyState 
        title="No matching startups found" 
        message={`We couldn't find any startups matching "${query}". Try describing the core technology, industry, or another website URL.`}
      />
    );
  }

  const topSimilarity = hasDbResults ? results[0].similarity_score || results[0].similarity : null;

  return (
    <div className="search-results-wrapper">
      {/* Query Context Metadata Header */}
      <div className="search-meta-banner">
        <div className="search-meta-top">
          <div className="search-meta-left">
            <span className={`search-type-badge ${inputType === 'url' ? 'badge-url' : 'badge-semantic'}`}>
              {inputType === 'url' ? (
                <>
                  <Globe size={14} /> Website Analysis
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Semantic Match
                </>
              )}
            </span>

            <div className="search-meta-query-info">
              {inputType === 'url' ? (
                <div className="query-url-display">
                  <span className="query-label">Crawled Target:</span>
                  <a 
                    href={sourcePageUrl || query} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="query-url-link"
                  >
                    <span>{sourcePageUrl || query}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              ) : (
                <div className="query-text-display">
                  <span className="query-label">Query:</span>
                  <span className="query-text-quote">"{query}"</span>
                </div>
              )}
            </div>
          </div>

          <div className="search-meta-stats">
            {hasDbResults && (
              <div className="stat-pill">
                <Layers size={13} />
                <span><strong>{results.length}</strong> YC Matches</span>
              </div>
            )}
            {topSimilarity != null && (
              <div className={`stat-pill ${topSimilarity >= 0.5 ? 'pill-high' : 'pill-medium'}`}>
                <Sparkles size={13} />
                <span>Top Match: <strong>{Math.round(topSimilarity * 100)}%</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Crawled Summary Drawer for URLs */}
        {inputType === 'url' && queryTextUsed && (
          <div className="crawled-summary-section">
            <button 
              type="button"
              className="btn-toggle-crawled-summary"
              onClick={() => setShowCrawledText(!showCrawledText)}
            >
              <span>{showCrawledText ? 'Hide extracted page text' : 'View extracted website context used for embedding'}</span>
              {showCrawledText ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showCrawledText && (
              <div className="crawled-text-box">
                <div className="crawled-text-header">
                  <span>Page Text Summary (Passed to SentenceTransformer):</span>
                </div>
                <p className="crawled-text-body">{queryTextUsed}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Internal Database Semantic Matches */}
      {hasDbResults && (
        <section className="results-group-section">
          <div className="results-group-header">
            <div className="results-group-title">
              <h2>Similar YC Startups</h2>
              <p>Ranked by embedding vector similarity in the open database</p>
            </div>
            <span className="results-count-pill">{results.length} companies</span>
          </div>

          <div className="company-grid-container">
            {results.map((company, i) => (
              <CompanyCard 
                key={company.slug || company.id || i} 
                company={company} 
                index={i}
                onClick={onCompanyClick}
                similarityScore={company.similarity_score || company.similarity}
              />
            ))}
          </div>
        </section>
      )}

      {/* External Web Search Fallback (SearXNG) */}
      {usedExternalFallback && hasExternalResults && (
        <section className="external-fallback-section">
          <div className="fallback-banner-header">
            <div className="fallback-badge">
              <Compass size={16} />
              <span>SearXNG Live Web Intelligence</span>
            </div>
            <h3 className="fallback-title">Web Search Fallback Results</h3>
            <p className="fallback-subtitle">
              {topSimilarity && topSimilarity < 0.35
                ? `The closest database match similarity (${Math.round(topSimilarity * 100)}%) was below threshold (35%). Here are complementary startup results found on the live web:`
                : `External web results found for "${query}":`}
            </p>
          </div>

          <div className="external-results-grid">
            {externalResults.map((item, idx) => {
              let domain = '';
              try {
                domain = new URL(item.url).hostname.replace('www.', '');
              } catch {
                domain = item.url;
              }

              return (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="external-result-card"
                >
                  <div className="external-card-top">
                    <div className="external-domain-badge">
                      <Globe size={13} />
                      <span>{domain}</span>
                    </div>
                    <ExternalLink size={15} className="external-link-arrow" />
                  </div>

                  <h4 className="external-card-title">{item.title || domain}</h4>
                  
                  {item.snippet && (
                    <p className="external-card-snippet">{item.snippet}</p>
                  )}

                  <div className="external-card-footer">
                    <span>Visit website</span>
                    <ExternalLink size={13} />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
