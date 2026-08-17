import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CircleDot, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <CircleDot size={24} color="var(--accent)" style={{ marginRight: '0.5rem' }} />
          openDB
        </Link>
        <div className="navbar-separator" style={{ display: 'block', margin: '0 1rem' }} />
        <div className="navbar-links desktop-only" style={{ display: 'flex', gap: '1.5rem' }}>
          <NavLink 
            to="/" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/companies" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Companies
          </NavLink>
        </div>
      </div>
      
      <div className="mobile-only" style={{ display: 'none' }}>
        <button onClick={toggleMenu} style={{ color: 'var(--text-primary)' }}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
