import { useState, useEffect } from 'react';
import api from '../api/axios';

const useFetchNtidDashCount = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/applicants/ntidDashboardCount');
        // Set data to response.data.data, which is the array
        const fetchedData = Array.isArray(response.data.data) ? response.data.data : [];
        setData(fetchedData);
        setError('');
      } catch (err) {
        console.error('Error fetching NTID dashboard count:', err);
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  return { data, loading, error };
};

export default useFetchNtidDashCount;