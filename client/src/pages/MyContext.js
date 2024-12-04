import React, { createContext, useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [applicant_uuid, setapplicant_uuid] = useState(null);
  const [captureStatus, setCaptureStatus] = useState(null);
  const [captureDate, setCaptureDate] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [markets, setMarkets] = useState([]);
const [startDate,setStartDateForContext]=useState('');
const [endDate,setEndDateForContext]=useState('');
  useEffect(() => {
    console.log(startDate,endDate,markets,captureStatus, 'mycp'); // Logs only when `captureStatus` changes
  }, [startDate,endDate,markets,captureStatus]);

  localStorage.setItem("markets", markets);

  return (
    <MyContext.Provider
      value={{
        applicant_uuid,
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
        setEndDateForContext
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
