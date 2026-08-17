import React from 'react';
import { MapPin, Users } from 'lucide-react';

export default function CompanyCard({ company, onClick, index = 0, similarityScore }) {
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';
  
  const statusClass = company.status?.toLowerCase() === 'active' 
    ? 'active' 
    : company.status?.toLowerCase() === 'public' 
      ? 'public' 
      : '';

  return (
    <div 
      className="company-card" 
      onClick={() => onClick(company)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {similarityScore != null && (
        <div className="similarity-badge">
          {Math.round(similarityScore * 100)}% Match
        </div>
      )}
      
      <div className={`status-indicator ${statusClass}`} title={company.status}></div>
      
      <div className="company-card-header">
        {company.logo_url ? (
          <img src={company.logo_url} alt={company.company_name} className="company-logo" />
        ) : (
          <div className="company-logo">{getInitial(company.company_name)}</div>
        )}
        
        <div>
          <div className="company-name">{company.company_name}</div>
          {company.batch && <div className="company-batch">{company.batch}</div>}
        </div>
      </div>
      
      <div className="company-desc">{company.one_liner || 'No description available.'}</div>
      
      <div className="company-tags">
        {company.industry && <span className="tag-pill">{company.industry}</span>}
        {company.subindustry && <span className="tag-pill">{company.subindustry}</span>}
      </div>
      
      <div className="company-footer">
        {company.all_locations && (
          <div className="footer-item">
            <MapPin size={14} />
            <span>{company.all_locations.split(',')[0]}</span>
          </div>
        )}
        
        {company.team_size && (
          <div className="footer-item">
            <Users size={14} />
            <span>{company.team_size}</span>
          </div>
        )}
        
        {company.is_hiring && (
          <div className="hiring-badge">Hiring</div>
        )}
      </div>
    </div>
  );
}
