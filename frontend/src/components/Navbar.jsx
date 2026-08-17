import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Database, Menu, X, Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Database size={20} />
          </div>
          <span>openDB</span>
        </Link>

        <nav className="navbar-links">
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
          <NavLink 
            to="/industries" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Industries
          </NavLink>
          <NavLink 
            to="/batches" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Batches
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            aria-label="Toggle Theme" 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Navigation">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav-menu">
          <NavLink 
            to="/" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/companies" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Companies
          </NavLink>
          <NavLink 
            to="/industries" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Industries
          </NavLink>
          <NavLink 
            to="/batches" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Batches
          </NavLink>
        </div>
      )}
    </header>
  );
}
