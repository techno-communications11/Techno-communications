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
  const [markets,setMarkets]=useState([])
    // console.log(captureDate,"dates",markets,"marks","status",captureStatus)
    localStorage.setItem("markets",markets);
  return (
    <MyContext.Provider value={{ applicant_uuid, setapplicant_uuid ,captureStatus,setCaptureStatus,captureDate,setCaptureDate,markets,setMarkets}}>
    {children}
  </MyContext.Provider>
  );
};
