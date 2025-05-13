// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => { // Initialize from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback((updatedUserData) => {
    setUserState(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }, []);

  const login = useCallback(async (loginData) => { // loginData is { token, user } from backend
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('user', JSON.stringify(loginData.user));
    setTokenState(loginData.token);
    setUserState(loginData.user);
    api.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTokenState(null);
    setUserState(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      // User is already loaded from localStorage on init,
      // but you might want a /auth/me endpoint to verify token and get fresh user
      // on initial load if localStorage user could be very stale.
      // For now, relying on localStorage user on init is simpler.
    }
    setLoading(false);
  }, []);


  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;