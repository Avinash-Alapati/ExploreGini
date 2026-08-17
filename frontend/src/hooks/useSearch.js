import { useState, useEffect } from 'react';
import { searchCompanies } from '../api/client';
import useDebounce from './useDebounce';

export default function useSearch(query, filters = {}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const loadSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchCompanies(debouncedQuery, 20, filters.batch, filters.industry);
        if (mounted) {
          setResults(data.results || []);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSearch();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, filters.batch, filters.industry]);

  return { results, loading, error };
}
