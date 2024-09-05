// AppContext.js
import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [applicant_uuid, setapplicant_uuid] = useState(null);

  return (
    <MyContext.Provider value={{ applicant_uuid, setapplicant_uuid }}>
      {children}
    </MyContext.Provider>
  );
};
