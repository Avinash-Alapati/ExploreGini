import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import SearchResults from '../components/SearchResults';
import CompanyGrid from '../components/CompanyGrid';
import CompanyDrawer from '../components/CompanyDrawer';
import Footer from '../components/Footer';
import useSearch from '../hooks/useSearch';
import { fetchCompanies } from '../api/client';
import { Building2, Briefcase, Layers, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  
  const { results: searchResults, loading: searchLoading } = useSearch(searchQuery);

  useEffect(() => {
    let mounted = true;
    const loadFeatured = async () => {
      try {
        const data = await fetchCompanies({ page: 1, pageSize: 9, sortBy: 'launched_at', sortOrder: 'desc' });
        if (mounted) {
          setFeaturedCompanies(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load featured companies:", err);
      } finally {
        if (mounted) setFeaturedLoading(false);
      }
    };
    
    loadFeatured();
    return () => { mounted = false; };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (term) => {
    setSearchQuery(term);
  };

  const closeDrawer = () => setSelectedCompany(null);

  const exploreHubCards = [
    {
      title: 'Companies',
      description: 'Explore startups, company profiles, stages, team sizes and locations.',
      icon: Building2,
      path: '/companies',
      badge: 'Database'
    },
    {
      title: 'Industries',
      description: 'Discover companies grouped by industry domains from AI to Climate Tech.',
      icon: Briefcase,
      path: '/industries',
      badge: 'Categories'
    },
    {
      title: 'Batches',
      description: 'Explore startups by YC batch cohorts across summer and winter seasons.',
      icon: Layers,
      path: '/batches',
      badge: 'Timeline'
    }
  ];

  return (
    <>
      <Navbar />
      
      <Hero 
        searchValue={searchQuery} 
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        isSearching={searchLoading}
      />
      
      <main className="container">
        {!searchQuery && (
          <>
            <StatsBar />

            {/* Explore Section Cards */}
            <section className="explore-hub-section">
              <div className="section-header-styled">
                <div className="section-title-group">
                  <h2>Explore the Platform</h2>
                  <p>Browse startup intelligence across primary categories</p>
                </div>
              </div>

              <div className="explore-cards-grid">
                {exploreHubCards.map((card, idx) => (
                  <Link key={idx} to={card.path} className="explore-card">
                    <div>
                      <div className="explore-card-icon">
                        <card.icon size={26} />
                      </div>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>

                    <div className="explore-card-link">
                      <span>Explore {card.title}</span>
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Content / Search Results */}
        {searchQuery ? (
          <SearchResults 
            results={searchResults} 
            loading={searchLoading} 
            query={searchQuery}
            onCompanyClick={setSelectedCompany}
          />
        ) : (
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header-styled">
              <div className="section-title-group">
                <h2>Featured Startups</h2>
                <p>Recently added and active companies in openDB</p>
              </div>
              <Link to="/companies" className="explore-card-link" style={{ fontSize: '0.9rem' }}>
                <span>View all companies</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <CompanyGrid 
              companies={featuredCompanies} 
              loading={featuredLoading}
              onCompanyClick={setSelectedCompany}
            />
          </section>
        )}
      </main>

      <Footer />

      <CompanyDrawer 
        company={selectedCompany} 
        isOpen={!!selectedCompany} 
        onClose={closeDrawer} 
      />
    </>
  );
}
