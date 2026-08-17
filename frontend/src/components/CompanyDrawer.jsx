import React, { useEffect } from 'react';
import { X, ExternalLink, MapPin, Users, Globe, Award, Sparkles, Building } from 'lucide-react';

export default function CompanyDrawer({ company, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.classList.remove('drawer-open');
      };
    } else {
      document.body.classList.remove('drawer-open');
    }
  }, [isOpen, onClose]);

  if (!company) return null;

  const getHostname = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <div 
        className={`drawer-backdrop-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      
      <div className={`drawer-panel-content ${isOpen ? 'active' : ''}`}>
        <button className="btn-drawer-close" onClick={onClose} aria-label="Close drawer">
          <X size={20} />
        </button>
        
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
              {company.top_company && <span className="batch-tag" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)', color: 'var(--warning)' }}>Top Startup</span>}
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
                  <span>View YC Profile</span>
                  <ExternalLink size={13} />
                </a>
              </span>
            </div>
          )}
          
          {company.team_size && (
            <div className="info-grid-cell">
              <span className="info-grid-label">Team Size</span>
              <span className="info-grid-val"><Users size={16} /> {company.team_size} employees</span>
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
        
        {company.industries && company.industries.length > 0 && (
          <div className="drawer-tags-block">
            <h4>Industries</h4>
            <div className="tag-pills-row">
              {company.industries.map(ind => (
                <span key={typeof ind === 'string' ? ind : JSON.stringify(ind)} className="pill-item">
                  {typeof ind === 'string' ? ind : ind.name || ind}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {company.regions && company.regions.length > 0 && (
          <div className="drawer-tags-block">
            <h4>Regions</h4>
            <div className="tag-pills-row">
              {company.regions.map(r => (
                <span key={typeof r === 'string' ? r : JSON.stringify(r)} className="pill-item">
                  {typeof r === 'string' ? r : r.name || r}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {company.tags && company.tags.length > 0 && (
          <div className="drawer-tags-block">
            <h4>Tags</h4>
            <div className="tag-pills-row">
              {company.tags.map(t => (
                <span key={typeof t === 'string' ? t : JSON.stringify(t)} className="pill-item">
                  {typeof t === 'string' ? t : t.name || t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
