import React from 'react';
import { MapPin, Users, ArrowUpRight } from 'lucide-react';

export default function CompanyCard({ company, onClick, index = 0, similarityScore }) {
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';
  
  const statusClass = company.status?.toLowerCase() === 'active' 
    ? 'active' 
    : company.status?.toLowerCase() === 'public' 
      ? 'public' 
      : '';

  return (
    <div 
      className="company-card-modern" 
      onClick={() => onClick(company)}
      style={{ animationDelay: `${(index % 9) * 0.04}s` }}
    >
      {similarityScore != null && (
        <div className="match-score-badge">
          {Math.round(similarityScore * 100)}% Match
        </div>
      )}
      
      <div>
        <div className="card-top">
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.company_name} className="company-logo-box" />
          ) : (
            <div className="company-logo-box">{getInitial(company.company_name)}</div>
          )}
          
          <div className="company-header-info">
            <div className="company-name-text">{company.company_name}</div>
            <div className="badge-row">
              {company.batch && <span className="batch-tag">{company.batch}</span>}
              {company.status && <span className={`status-tag ${statusClass}`}>{company.status}</span>}
            </div>
          </div>
        </div>
        
        <div className="company-oneliner">
          {company.one_liner || 'No description available for this startup.'}
        </div>
        
        <div className="tag-pills-row">
          {company.industry && <span className="pill-item">{company.industry}</span>}
          {company.subindustry && <span className="pill-item">{company.subindustry}</span>}
        </div>
      </div>
      
      <div className="card-footer">
        <div className="footer-meta-item">
          {company.all_locations ? (
            <>
              <MapPin size={13} />
              <span>{company.all_locations.split(',')[0]}</span>
            </>
          ) : company.team_size ? (
            <>
              <Users size={13} />
              <span>{company.team_size} members</span>
            </>
          ) : (
            <span style={{ opacity: 0.5 }}>View Startup</span>
          )}
        </div>
        
        {company.is_hiring ? (
          <div className="hiring-badge-live">Hiring</div>
        ) : (
          <ArrowUpRight size={16} style={{ opacity: 0.4 }} />
        )}
      </div>
    </div>
  );
}
