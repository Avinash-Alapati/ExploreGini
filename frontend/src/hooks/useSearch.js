import { useState, useEffect } from 'react';
import { searchCompanies } from '../api/client';
import useDebounce from './useDebounce';

export default function useSearch(query, filters = {}) {
  const [results, setResults] = useState([]);
  const [dbMatches, setDbMatches] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [usedExternalFallback, setUsedExternalFallback] = useState(false);
  const [inputType, setInputType] = useState('text');
  const [queryTextUsed, setQueryTextUsed] = useState('');
  const [sourcePageUrl, setSourcePageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setDbMatches([]);
      setExternalResults([]);
      setUsedExternalFallback(false);
      setInputType('text');
      setQueryTextUsed('');
      setSourcePageUrl(null);
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
          const matches = data.db_matches || data.results || [];
          setResults(matches);
          setDbMatches(matches);
          setExternalResults(data.external_results || []);
          setUsedExternalFallback(Boolean(data.used_external_fallback));
          setInputType(data.input_type || 'text');
          setQueryTextUsed(data.query_text_used || '');
          setSourcePageUrl(data.source_page_url || null);
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

  return { 
    results, 
    dbMatches,
    externalResults, 
    usedExternalFallback, 
    inputType, 
    queryTextUsed, 
    sourcePageUrl, 
    loading, 
    error 
  };
}
