import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorState from '../components/ErrorState';
import { fetchCompany } from '../api/client';
import { ExternalLink, MapPin, Users, Globe, ArrowLeft, Building2 } from 'lucide-react';

export default function CompanyDetail() {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        const data = await fetchCompany(slug);
        if (mounted) {
          setCompany(data);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (slug) loadCompanyData();
    return () => { mounted = false; };
  }, [slug]);

  const getHostname = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <Navbar />

      <main className="container" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
        <Link to="/companies" className="explore-card-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} />
          <span>Back to Companies</span>
        </Link>

        {error ? (
          <ErrorState 
            title="Company not found"
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : loading ? (
          <div className="state-box-styled skeleton-box" style={{ height: '400px' }} />
        ) : company ? (
          <div className="state-box-styled" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
            <div className="drawer-header-main">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.company_name} className="drawer-logo-large" />
              ) : (
                <div className="drawer-logo-large">
                  {company.company_name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="drawer-title-box">
                <h2>{company.company_name}</h2>
                <div className="drawer-badge-group">
                  {company.batch && <span className="batch-tag">{company.batch}</span>}
                  {company.status && <span className="status-tag active">{company.status}</span>}
                  {company.stage && <span className="status-tag">{company.stage}</span>}
                  {company.is_hiring && <span className="hiring-badge-live">Hiring Now</span>}
                </div>
              </div>
            </div>
            
            {company.one_liner && (
              <div className="drawer-quote-oneliner">{company.one_liner}</div>
            )}
            
            {company.long_description && (
              <div className="drawer-description-text">{company.long_description}</div>
            )}
            
            <div className="drawer-info-grid-panel">
              {company.website && (
                <div className="info-grid-cell">
                  <span className="info-grid-label">Website</span>
                  <span className="info-grid-val">
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      <Globe size={15} />
                      <span>{getHostname(company.website)}</span>
                      <ExternalLink size={13} />
                    </a>
                  </span>
                </div>
              )}
              
              {company.yc_profile_url && (
                <div className="info-grid-cell">
                  <span className="info-grid-label">YC Profile</span>
                  <span className="info-grid-val">
                    <a href={company.yc_profile_url} target="_blank" rel="noopener noreferrer">
                      <span>View Profile</span>
                      <ExternalLink size={13} />
                    </a>
                  </span>
                </div>
              )}
              
              {company.team_size && (
                <div className="info-grid-cell">
                  <span className="info-grid-label">Team Size</span>
                  <span className="info-grid-val"><Users size={16} /> {company.team_size} members</span>
                </div>
              )}
              
              {company.all_locations && (
                <div className="info-grid-cell">
                  <span className="info-grid-label">Location</span>
                  <span className="info-grid-val"><MapPin size={16} /> {company.all_locations}</span>
                </div>
              )}

              {company.industry && (
                <div className="info-grid-cell">
                  <span className="info-grid-label">Industry</span>
                  <span className="info-grid-val">{company.industry}</span>
                </div>
              )}

              {company.subindustry && (
                <div className="info-grid-cell">
                  <span className="info-grid-label">Sub-Industry</span>
                  <span className="info-grid-val">{company.subindustry}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
