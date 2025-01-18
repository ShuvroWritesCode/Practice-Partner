import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated from localStorage
    return (localStorage.isAuthenticated && JSON.parse(localStorage.isAuthenticated ));
  });

  const login = () => {
    // Perform login logic here, e.g., call your backend API to authenticate the user
    // If login is successful, set isAuthenticated to true
    setIsAuthenticated(true);
    // Store isAuthenticated state in localStorage
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    // Perform logout logic here, e.g., clear authentication tokens, etc.
    // Set isAuthenticated to false
    setIsAuthenticated(false);
    // Remove isAuthenticated state from localStorage
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
