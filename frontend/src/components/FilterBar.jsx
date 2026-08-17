import React from 'react';
import { X } from 'lucide-react';

export default function FilterBar({ filters, onFilterChange, batches, industries, onClearAll }) {
  const hasActiveFilters = filters.batch || filters.industry || filters.status || filters.search || filters.sortBy;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const removeFilter = (name) => {
    onFilterChange(name, '');
  };

  return (
    <div>
      <div className="filter-bar">
        <input 
          type="text" 
          name="search"
          placeholder="Filter by name..." 
          className="filter-input"
          value={filters.search || ''}
          onChange={handleChange}
        />
        
        <select 
          name="batch" 
          className="filter-select"
          value={filters.batch || ''}
          onChange={handleChange}
        >
          <option value="">All Batches</option>
          {batches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        
        <select 
          name="industry" 
          className="filter-select"
          value={filters.industry || ''}
          onChange={handleChange}
        >
          <option value="">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        
        <select 
          name="status" 
          className="filter-select"
          value={filters.status || ''}
          onChange={handleChange}
        >
          <option value="">Any Status</option>
          <option value="Active">Active</option>
          <option value="Acquired">Acquired</option>
          <option value="Public">Public</option>
          <option value="Inactive">Inactive</option>
        </select>
        
        <select 
          name="sortBy" 
          className="filter-select"
          value={filters.sortBy || ''}
          onChange={handleChange}
          style={{ marginLeft: 'auto' }}
        >
          <option value="">Sort By...</option>
          <option value="launched_at-desc">Newest First</option>
          <option value="launched_at-asc">Oldest First</option>
          <option value="company_name-asc">Name A-Z</option>
          <option value="company_name-desc">Name Z-A</option>
          <option value="team_size-desc">Team Size</option>
        </select>
      </div>
      
      {hasActiveFilters && (
        <div className="active-filters">
          {filters.search && (
            <div className="active-filter-pill">
              Search: {filters.search}
              <button onClick={() => removeFilter('search')}><X size={12}/></button>
            </div>
          )}
          {filters.batch && (
            <div className="active-filter-pill">
              Batch: {filters.batch}
              <button onClick={() => removeFilter('batch')}><X size={12}/></button>
            </div>
          )}
          {filters.industry && (
            <div className="active-filter-pill">
              Industry: {filters.industry}
              <button onClick={() => removeFilter('industry')}><X size={12}/></button>
            </div>
          )}
          {filters.status && (
            <div className="active-filter-pill">
              Status: {filters.status}
              <button onClick={() => removeFilter('status')}><X size={12}/></button>
            </div>
          )}
          {filters.sortBy && (
            <div className="active-filter-pill">
              Sort: {filters.sortBy.split('-').join(' ')}
              <button onClick={() => removeFilter('sortBy')}><X size={12}/></button>
            </div>
          )}
          
          <button className="clear-filters-btn" onClick={onClearAll}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
