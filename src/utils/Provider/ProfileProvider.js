import React, { createContext, useContext, useEffect, useState } from 'react';
import Loading from '../Loader/Loading';
import { fetchAddress, fetchAddresswithunid } from '../APIURL';

const ProfileContext = createContext();

export const ProfileThemeProvider = ({ children }) => {
  // console.log('hi')
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userID = localStorage.getItem('userid');


  useEffect(() => {
    if (userID !=null) {
      getProfileData(userID);
    }
  }, [userID]);

  const getProfileData = async (id) => {
    try {
      const result = await fetchAddresswithunid(id);

      if (result?.data) {
        setProfile(result?.data[0]);
      } else {
        setProfile(null); 
      }
    } catch (error) {
      // console.error("Error fetching theme data:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ProfileContext.Provider value={{ profile, setProfile , getProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to access profile data
export const useProfileTheme = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileTheme must be used within a ProfileThemeProvider');
  }
  return context;
};
