// src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Ensure all expected values are returned
  return {
    user: context.user,
    token: context.token,
    login: context.login,
    logout: context.logout,
    updateUser: context.updateUser, // EXPOSE THIS
    isAuthenticated: context.isAuthenticated,
    loading: context.loading,
  };
};