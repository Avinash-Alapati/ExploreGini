import React, { useState, useEffect } from 'react';
import { fetchStats } from '../api/client';
import { Building2, Layers, Briefcase, Activity } from 'lucide-react';

export default function StatsBar() {
  const [stats, setStats] = useState({ total_companies: 0, total_batches: 0, total_industries: 0, hiring_companies: 0 });

  useEffect(() => {
    let mounted = true;
    fetchStats().then(data => {
      if (mounted && data) {
        setStats(data);
      }
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  const statItems = [
    { label: 'Total Companies', value: stats.total_companies || 0, icon: Building2 },
    { label: 'Batches', value: stats.total_batches || 0, icon: Layers },
    { label: 'Industries', value: stats.total_industries || 0, icon: Briefcase },
    { label: 'Hiring Now', value: stats.hiring_count || 0, icon: Activity }
  ];

  return (
    <div className="stats-bar">
      {statItems.map((item, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon">
            <item.icon size={24} />
          </div>
          <div className="stat-info">
            <div className="value">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</div>
            <div className="label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

