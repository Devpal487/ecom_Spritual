import React, { createContext, useContext, useEffect, useState } from 'react';
import { GetThemeMaster } from '../APIURL';
import { previewpaththeme } from '../config';
import Loading from '../Loader/Loading';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getThemeData();
  }, []);

  const getThemeData = async () => {
    const initialValues = {
      themeId: -1,
    };
    try {
      const result = await GetThemeMaster(initialValues);
      // console.log("🚀 ~ getThemeData ~ result:", result);
      const baseUrl = previewpaththeme;

      if (result?.data?.length > 0) {
        const activeTheme = result?.data?.find((theme) => theme.isActive);
        // console.log("🚀 ~ getThemeData ~ activeTheme:", activeTheme);
        if (activeTheme) {
          setTheme({
            backgroundColor: activeTheme.backgroundImage ,
            textColor: activeTheme.textColor ,
            navbarTextColor: activeTheme.navbarTextColor ,
            navbarBackgroundColor: activeTheme.navbarColor ,
            fontSize: `text-${activeTheme.fontSize || 'base'}`,
            fontFamily: activeTheme.fontFamily,
            backgroundImage: activeTheme.backgroundImage?`${baseUrl}${activeTheme.backgroundImage}`:'',
            // primaryColor: '#00e676',
          });
        } else {
          setTheme({
            backgroundColor: 'bg-white',
            textColor: 'text-black',
            navbarTextColor: 'text-white',
            navbarBackgroundColor: 'bg-[#433487]',
            fontSize: 'text-base',
            fontFamily: 'font-sans',
            backgroundImage: '',
            // primaryColor: '#00e676',
          });
      
    } }}catch (error) {
      // console.error("Error fetching theme data:", error);
    } finally {
      setLoading(false); 
    }
  };


  if (loading) {
    return <div><Loading /></div>; 
  }

  return (
    <ThemeContext.Provider value={{ theme, getThemeData }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
