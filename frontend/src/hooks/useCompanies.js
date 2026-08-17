import { useState, useEffect } from 'react';
import { fetchCompanies } from '../api/client';

export default function useCompanies(filters, page) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCompanies({ ...filters, page });
        if (mounted) {
          setCompanies(data.data || []);
          setPagination({
            total: data.total || 0,
            totalPages: data.total_pages || 0,
          });
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(filters), page]);

  return { companies, loading, error, pagination };
}
