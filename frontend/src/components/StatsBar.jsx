import React, { useState, useEffect } from 'react';
import { fetchStats } from '../api/client';
import { Building2, Layers, Briefcase, Activity } from 'lucide-react';

export default function StatsBar() {
  const [stats, setStats] = useState({ total_companies: 0, total_batches: 0, total_industries: 0, hiring_count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchStats()
      .then(data => {
        if (mounted && data) {
          setStats(data);
        }
      })
      .catch(err => console.error('Failed to load stats:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
      
    return () => { mounted = false; };
  }, []);

  const statItems = [
    { label: 'Total Companies', value: stats.total_companies, icon: Building2, styleClass: 'stat-icon-violet' },
    { label: 'YC Batches', value: stats.total_batches, icon: Layers, styleClass: 'stat-icon-cyan' },
    { label: 'Industries', value: stats.total_industries, icon: Briefcase, styleClass: 'stat-icon-purple' },
    { label: 'Hiring Now', value: stats.hiring_count, icon: Activity, styleClass: 'stat-icon-green' }
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, i) => (
        <div key={i} className="stat-card-modern">
          <div className={`stat-icon-wrapper ${item.styleClass}`}>
            <item.icon size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-val">
              {loading ? '—' : (typeof item.value === 'number' ? item.value.toLocaleString() : (item.value || 0))}
            </div>
            <div className="stat-lbl">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
