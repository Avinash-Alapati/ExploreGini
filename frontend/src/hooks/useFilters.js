import { useState, useEffect } from 'react';
import { fetchBatches, fetchIndustries } from '../api/client';

export default function useFilters() {
  const [batches, setBatches] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFilters = async () => {
      try {
        const [batchData, industryData] = await Promise.all([
          fetchBatches(),
          fetchIndustries()
        ]);

        if (mounted) {
          // API returns [{batch: "W24", count: 123}, ...] — extract names
          setBatches(batchData.map(b => b.batch).filter(Boolean));
          setIndustries(industryData.map(i => i.industry).filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to load filters', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFilters();
    return () => { mounted = false; };
  }, []);

  return { batches, industries, loading };
}
