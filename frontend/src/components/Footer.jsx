import React from 'react';
import { Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-styled">
      <div className="container footer-inner">
        <div className="footer-brand-meta">
          <div className="navbar-logo">
            <div className="navbar-logo-icon">
              <Database size={18} />
            </div>
            <span>openDB</span>
          </div>
          <p>Open startup discovery database for exploring startups, industries and YC batches.</p>
        </div>

        <div className="footer-nav-links">
          <Link to="/companies">Companies</Link>
          <Link to="/industries">Industries</Link>
          <Link to="/batches">Batches</Link>
          <span>&copy; {new Date().getFullYear()} openDB</span>
        </div>
      </div>
    </footer>
  );
}
