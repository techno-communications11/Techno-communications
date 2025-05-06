import React, { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Loader from '../utils/Loader';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [applicant_uuid, setapplicant_uuid] = useState(null);
  const [captureStatus, setCaptureStatus] = useState(null);
  const [captureDate, setCaptureDate] = useState([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [markets, setMarkets] = useState([]);
  const [startDate, setStartDateForContext] = useState('');
  const [endDate, setEndDateForContext] = useState('');
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${process.env.REACT_APP_API}/user/me`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          if (!userData?.id || !userData?.role) {
            throw new Error('Invalid user data');
          }
          setUserData({
            id: userData.id,
            role: userData.role,
            email: userData.email,
            market: userData.market,
            name: userData.name,
            ...userData,
          });
          setIsAuthenticated(true);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setUserData(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []); // Removed isAuthenticated dependency

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <MyContext.Provider
      value={{
        applicant_uuid,
        userData,
        setUserData,
        isAuthenticated,
        setIsAuthenticated,
        setapplicant_uuid,
        captureStatus,
        setCaptureStatus,
        captureDate,
        setCaptureDate,
        markets,
        setMarkets,
        startDate,
        setStartDateForContext,
        endDate,
        setEndDateForContext,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};