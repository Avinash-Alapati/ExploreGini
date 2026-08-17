import React from 'react';
import { CircleDot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer container">
      <div>
        <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CircleDot size={18} color="var(--accent)" />
          openDB
        </div>
        <div>Open database for YC startups</div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          openDB is an independent project and is not affiliated with Y Combinator.
        </div>
      </div>
      <div className="footer-links">
        <a href="#">GitHub</a>
        <a href="#">API Docs</a>
        <span>&copy; {new Date().getFullYear()} openDB</span>
      </div>
    </footer>
  );
}
