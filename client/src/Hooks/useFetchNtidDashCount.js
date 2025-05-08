import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../Constants/ApiUrl';

const useFetchNtidDashCount = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/applicants/ntidDashboardCount`, { withCredentials: true });
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