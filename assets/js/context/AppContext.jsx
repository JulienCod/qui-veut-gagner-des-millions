import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [admin, setAdmin] = useState(false);

  return (
    <AppContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AppContext.Provider>
  );
};