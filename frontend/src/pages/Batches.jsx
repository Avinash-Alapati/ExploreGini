import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorState from '../components/ErrorState';
import { fetchBatches } from '../api/client';
import { Layers, Calendar, ArrowRight, Search, Sparkles, Clock } from 'lucide-react';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchBatches();
        if (mounted) {
          setBatches(data || []);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  const formatBatchSeason = (batchCode) => {
    if (!batchCode) return 'Cohort';

    const raw = String(batchCode).trim();

    // 1. Handle full strings like "WINTER 2026", "SUMMER 2026", "FALL 2026", "SPRING 2026"
    const words = raw.split(/\s+/);
    if (words.length >= 2) {
      const season = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
      const year = words.slice(1).join(' ');
      return `${season} ${year}`;
    }

    // 2. Handle shortcodes like W24, S23, F22, Sp26
    const code = raw.toUpperCase();
    const match = code.match(/^([WSF]|SP)(\d{2,4})$/);
    if (match) {
      const [, prefix, year] = match;
      const seasonMap = { W: 'Winter', S: 'Summer', F: 'Fall', SP: 'Spring' };
      const fullYear = year.length === 2 ? `20${year}` : year;
      return `${seasonMap[prefix]} ${fullYear}`;
    }

    return raw;
  };

  const filteredBatches = batches.filter(item => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return item.batch?.toLowerCase().includes(query) || formatBatchSeason(item.batch).toLowerCase().includes(query);
  });

  const handleBatchClick = (batchCode) => {
    navigate(`/companies?batch=${encodeURIComponent(batchCode)}`);
  };

  return (
    <>
      <Navbar />

      <main className="container" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Timeline Explorer</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Explore YC Batches
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px' }}>
            Browse Y Combinator startup cohorts by funding season and batch timeline.
          </p>
        </div>

        {/* Filter Input */}
        <div style={{ maxWidth: '420px', marginBottom: '2rem', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search batches (e.g. W24, Summer 2023)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input-search"
            style={{ width: '100%' }}
          />
        </div>

        {error ? (
          <ErrorState 
            title="Failed to load batches"
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : loading ? (
          <div className="grid-cards-interactive">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card-interactive-item skeleton-box" style={{ height: '140px' }} />
            ))}
          </div>
        ) : (
          <div className="grid-cards-interactive">
            {filteredBatches.map((item, idx) => {
              const formattedName = formatBatchSeason(item.batch);
              return (
                <div 
                  key={idx} 
                  className="card-interactive-item"
                  onClick={() => handleBatchClick(item.batch)}
                >
                  <div>
                    <div className="interactive-card-header">
                      <span className="batch-tag" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                        {formattedName}
                      </span>
                      <ArrowRight size={18} className="interactive-arrow" />
                    </div>

                    <div className="interactive-card-title" style={{ marginTop: '0.5rem' }}>
                      {formattedName}
                    </div>
                  </div>

                  <div className="interactive-card-count" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} style={{ color: 'var(--secondary-light)' }} />
                    <span>{item.count ? `${item.count.toLocaleString()} startups` : 'Explore Batch'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}