import { useState, useEffect } from 'react';
import api from '../api/axios';

// Custom hook to fetch markets from the API
const useGetMarketJobs = () => {
  const [marketJobs, setMarketJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/getmarketjobs');
        setMarketJobs(response.data);
        setError('');
      } catch {
        setError('Failed to fetch markets.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [api]);

  return { marketJobs, loading, error };
};

export default useGetMarketJobs;