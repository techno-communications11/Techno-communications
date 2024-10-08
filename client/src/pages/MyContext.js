import React, { createContext, useState } from 'react';

// Create the context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [applicant_uuid, setapplicant_uuid] = useState(null);
  // const [profileId, setProfileId] = useState(null); // Added profileId state
  // console.log(profileId,'ppiidd')  

  return (
    <MyContext.Provider value={{ applicant_uuid, setapplicant_uuid }}>
      {children}
    </MyContext.Provider>
  );
};
