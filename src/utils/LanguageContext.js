import React, { createContext, useContext, useState } from 'react';

// Language context
const LanguageContext = createContext();

// Language provider component to wrap around the app
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language is English

  // Function to change the language
  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to access language context
export const useLanguage = () => useContext(LanguageContext);
