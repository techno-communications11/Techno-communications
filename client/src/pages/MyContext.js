import React, { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [applicant_uuid, setapplicant_uuid] = useState(null);
  const [captureStatus, setCaptureStatus] = useState(null);
  const [captureDate, setCaptureDate] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    console.log(captureStatus, 'myc'); // Logs only when `captureStatus` changes
  }, [captureStatus]);

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
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
