import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../Constants/ApiUrl';

// Custom hook to fetch markets from the API
const useFetchHrs = () => {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/hrs`,{withCredentials:true});
        setHrs(data);
        setError('');
      } catch {
        setError('Failed to fetch markets.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [API_URL]);

  return { hrs, loading, error };
};

export default useFetchHrs;