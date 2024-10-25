import React, { createContext, useState } from 'react';
import dayjs from 'dayjs';
// Create the context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [applicant_uuid, setapplicant_uuid] = useState(null);
  // const [profileId, setProfileId] = useState(null); // Added profileId state
  // console.log(profileId,'ppiidd')  
  const [captureStatus,setCaptureStatus]=useState(null)
  const[captureDate,setCaptureDate]=useState([dayjs().subtract(7, 'day'), dayjs()])
    console.log(captureDate,"caps")
  return (
    <MyContext.Provider value={{ applicant_uuid, setapplicant_uuid ,captureStatus,setCaptureStatus,captureDate,setCaptureDate}}>
    {children}
  </MyContext.Provider>
  );
};
