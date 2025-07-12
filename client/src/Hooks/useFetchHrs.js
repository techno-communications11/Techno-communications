import { useState, useEffect } from 'react';
import api from '../api/axios';

// Custom hook to fetch markets from the API
const useFetchHrs = () => {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/hrs');
        setHrs(data);
        setError('');
      } catch {
        setError('Failed to fetch markets.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [api]);

  return { hrs, loading, error };
};

export default useFetchHrs;