import React, { useEffect } from 'react';
import { X, ExternalLink, MapPin, Users } from 'lucide-react';

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

  // Safe URL parsing helper
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
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      
      <div className={`drawer-content ${isOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="drawer-header">
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.company_name} className="drawer-logo" />
          ) : (
            <div className="drawer-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {company.company_name?.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="drawer-title-area">
            <h2>{company.company_name}</h2>
            <div className="drawer-badges">
              {company.batch && <span className="company-batch">{company.batch}</span>}
              {company.status && <span className="tag-pill" style={{ borderColor: 'var(--info)', color: 'var(--info)' }}>{company.status}</span>}
              {company.stage && <span className="tag-pill">{company.stage}</span>}
              {company.is_hiring && <span className="hiring-badge">Hiring Now</span>}
              {company.top_company && <span className="tag-pill" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>Top Company</span>}
            </div>
          </div>
        </div>
        
        {company.one_liner && (
          <div className="drawer-oneliner">{company.one_liner}</div>
        )}
        
        {company.long_description && (
          <div className="drawer-longdesc">{company.long_description}</div>
        )}
        
        <div className="drawer-info-grid">
          {company.website && (
            <div className="info-item">
              <span className="info-label">Website</span>
              <span className="info-value">
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  {getHostname(company.website)}
                </a>
                <ExternalLink size={14} />
              </span>
            </div>
          )}
          
          {company.yc_profile_url && (
            <div className="info-item">
              <span className="info-label">YC Profile</span>
              <span className="info-value">
                <a href={company.yc_profile_url} target="_blank" rel="noopener noreferrer">View Profile</a>
                <ExternalLink size={14} />
              </span>
            </div>
          )}
          
          {company.team_size && (
            <div className="info-item">
              <span className="info-label">Team Size</span>
              <span className="info-value"><Users size={16} /> {company.team_size} employees</span>
            </div>
          )}
          
          {company.all_locations && (
            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value"><MapPin size={16} /> {company.all_locations}</span>
            </div>
          )}

          {company.industry && (
            <div className="info-item">
              <span className="info-label">Industry</span>
              <span className="info-value">{company.industry}</span>
            </div>
          )}

          {company.subindustry && (
            <div className="info-item">
              <span className="info-label">Sub-Industry</span>
              <span className="info-value">{company.subindustry}</span>
            </div>
          )}
        </div>
        
        {company.industries && company.industries.length > 0 && (
          <div className="drawer-tags-section">
            <h3>Industries</h3>
            <div className="company-tags">
              {company.industries.map(ind => (
                <span key={typeof ind === 'string' ? ind : JSON.stringify(ind)} className="tag-pill">
                  {typeof ind === 'string' ? ind : ind.name || ind}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {company.regions && company.regions.length > 0 && (
          <div className="drawer-tags-section">
            <h3>Regions</h3>
            <div className="company-tags">
              {company.regions.map(r => (
                <span key={typeof r === 'string' ? r : JSON.stringify(r)} className="tag-pill">
                  {typeof r === 'string' ? r : r.name || r}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {company.tags && company.tags.length > 0 && (
          <div className="drawer-tags-section">
            <h3>Tags</h3>
            <div className="company-tags">
              {company.tags.map(t => (
                <span key={typeof t === 'string' ? t : JSON.stringify(t)} className="tag-pill">
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
