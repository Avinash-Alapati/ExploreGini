import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorState from '../components/ErrorState';
import { fetchIndustries } from '../api/client';
import { 
  Briefcase, 
  Cpu, 
  HeartPulse, 
  ShieldCheck, 
  Landmark, 
  GraduationCap, 
  Cloud, 
  ShoppingBag, 
  Zap, 
  Plane, 
  Truck, 
  Building2, 
  ArrowRight,
  Search,
  Sparkles
} from 'lucide-react';

export default function Industries() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchIndustries();
        if (mounted) {
          setIndustries(data || []);
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

  const getIndustryIcon = (name) => {
    const lower = name?.toLowerCase() || '';
    if (lower.includes('b2b') || lower.includes('saas') || lower.includes('software')) return Cpu;
    if (lower.includes('health') || lower.includes('bio') || lower.includes('med')) return HeartPulse;
    if (lower.includes('fintech') || lower.includes('finance') || lower.includes('crypto')) return Landmark;
    if (lower.includes('edu')) return GraduationCap;
    if (lower.includes('security') || lower.includes('cyber')) return ShieldCheck;
    if (lower.includes('climate') || lower.includes('energy') || lower.includes('clean')) return Zap;
    if (lower.includes('consumer') || lower.includes('e-commerce') || lower.includes('retail')) return ShoppingBag;
    if (lower.includes('cloud') || lower.includes('infrastructure') || lower.includes('data')) return Cloud;
    if (lower.includes('logistics') || lower.includes('supply') || lower.includes('transport')) return Truck;
    if (lower.includes('aerospace') || lower.includes('travel')) return Plane;
    return Briefcase;
  };

  const filteredIndustries = industries.filter(item => {
    if (!searchTerm) return true;
    return item.industry?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleIndustryClick = (industryName) => {
    navigate(`/companies?industry=${encodeURIComponent(industryName)}`);
  };

  return (
    <>
      <Navbar />

      <main className="container" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Category Explorer</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Explore Industries
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px' }}>
            Discover companies grouped by industry sectors, technical domains, and market categories.
          </p>
        </div>

        {/* Filter Input */}
        <div style={{ maxWidth: '420px', marginBottom: '2rem', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input-search"
            style={{ width: '100%' }}
          />
        </div>

        {error ? (
          <ErrorState 
            title="Failed to load industries"
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
            {filteredIndustries.map((item, idx) => {
              const IconComp = getIndustryIcon(item.industry);
              return (
                <div 
                  key={idx} 
                  className="card-interactive-item"
                  onClick={() => handleIndustryClick(item.industry)}
                >
                  <div>
                    <div className="interactive-card-header">
                      <div className="interactive-icon-box">
                        <IconComp size={22} />
                      </div>
                      <ArrowRight size={18} className="interactive-arrow" />
                    </div>

                    <div className="interactive-card-title">{item.industry}</div>
                  </div>

                  <div className="interactive-card-count">
                    {item.count ? `${item.count.toLocaleString()} companies` : 'Explore Category'}
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
