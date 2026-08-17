import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import SearchResults from '../components/SearchResults';
import CompanyGrid from '../components/CompanyGrid';
import CompanyDrawer from '../components/CompanyDrawer';
import Footer from '../components/Footer';
import useSearch from '../hooks/useSearch';
import { fetchCompanies } from '../api/client';

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
        console.error("Failed to load featured companies", err);
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

  return (
    <>
      <Navbar />
      <Hero 
        searchValue={searchQuery} 
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        isSearching={searchLoading}
      />
      
      {!searchQuery && (
        <div className="container">
          <StatsBar />
        </div>
      )}

      <main className="container">
        {searchQuery ? (
          <SearchResults 
            results={searchResults} 
            loading={searchLoading} 
            query={searchQuery}
            onCompanyClick={setSelectedCompany}
          />
        ) : (
          <div className="search-results-section">
            <h2 className="search-results-header" style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>Featured Companies</h2>
            <CompanyGrid 
              companies={featuredCompanies} 
              loading={featuredLoading}
              onCompanyClick={setSelectedCompany}
            />
          </div>
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
