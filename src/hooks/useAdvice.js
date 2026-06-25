import { useState, useCallback, useRef } from 'react';

// Cooldown time in ms to prevent API spamming
const API_COOLDOWN_MS = 1500;

export const useAdvice = () => {
  const [advice, setAdvice] = useState('Click the button and get the Advice');
  const [slipId, setSlipId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const lastFetchTimeRef = useRef(0);

  // Fetch a random advice slip
  const fetchRandomAdvice = useCallback(async (onSuccess) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;

    // Client-side rate-limiting / cooldown
    if (timeSinceLastFetch < API_COOLDOWN_MS) {
      // Just wait a tiny bit or ignore to prevent spamming the Advice API (which caches/throttles on CDN anyway)
      const waitTime = API_COOLDOWN_MS - timeSinceLastFetch;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    setLoading(true);
    setError(null);
    lastFetchTimeRef.current = Date.now();

    try {
      // Add a cache buster query parameter to bypass local browser cache if necessary
      const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch advice from server.');
      }
      const data = await response.json();
      
      if (data && data.slip) {
        const { id, advice: text } = data.slip;
        setAdvice(text);
        setSlipId(id);
        if (onSuccess) {
          onSuccess({ id, advice: text });
        }
      } else {
        throw new Error('Malformed response received from advice API.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific advice slip by ID
  const fetchAdviceById = useCallback(async (id, onSuccess) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.adviceslip.com/advice/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch advice slip #${id}`);
      }
      const data = await response.json();
      
      if (data && data.slip) {
        const { id: slipId, advice: text } = data.slip;
        setAdvice(text);
        setSlipId(slipId);
        if (onSuccess) {
          onSuccess({ id: slipId, advice: text });
        }
      } else if (data && data.message) {
        throw new Error(data.message.text || 'Slip not found.');
      } else {
        throw new Error('Advice slip not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to retrieve that advice.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search advice slips by query keyword
  const searchAdvice = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(`https://api.adviceslip.com/advice/search/${encodeURIComponent(query.trim())}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve search results.');
      }
      const data = await response.json();
      
      if (data && data.slips && Array.isArray(data.slips)) {
        setSearchResults(data.slips);
      } else if (data && data.message) {
        // The API returns a 'notice' type message if no results match
        if (data.message.type === 'notice') {
          setSearchResults([]);
          setSearchError(`No advice slips found matching "${query}".`);
        } else {
          throw new Error(data.message.text);
        }
      } else {
        setSearchResults([]);
        setSearchError(`No results found for "${query}".`);
      }
    } catch (err) {
      console.error(err);
      setSearchError(err.message || 'An error occurred during search.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const loadLocalAdvice = useCallback((item) => {
    setAdvice(item.advice);
    setSlipId(item.id);
  }, []);

  return {
    advice,
    slipId,
    loading,
    error,
    searchResults,
    searchLoading,
    searchError,
    fetchRandomAdvice,
    fetchAdviceById,
    searchAdvice,
    loadLocalAdvice,
  };
};
