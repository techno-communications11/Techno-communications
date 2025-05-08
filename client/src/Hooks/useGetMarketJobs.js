import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../Constants/ApiUrl';

// Custom hook to fetch markets from the API
const useGetMarketJobs = () => {
  const [marketJobs, setMarketJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/getmarketjobs`,{withCredentials:true});
        setMarketJobs(response.data);
        setError('');
      } catch {
        setError('Failed to fetch markets.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [API_URL]);

  return { marketJobs, loading, error };
};

export default useGetMarketJobs;