import { useState, useEffect } from 'react';
import api from '../api/axios';

// Custom hook to fetch markets from the API
const useFetchMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/markets');
        //  console.log(data,'data')
        setMarkets(data);
        setError('');
      } catch {
        setError('Failed to fetch markets.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [api]);

  return { markets, loading, error };
};

export default useFetchMarkets;