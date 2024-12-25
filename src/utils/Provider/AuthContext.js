import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userid');
    // console.log("🚀 ~ useEffect ~ loggedInUser:", loggedInUser)
    setUser(loggedInUser);
  }, []);

  const login = (userData) => {
    // console.log("🚀 ~ login ~ userData:", userData)
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
