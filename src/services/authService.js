import api from './api';

export const loginUser = async (credentials) => {
  // Backend expects emailOrUsername
  const response = await api.post('/api/auth/login', credentials);
  if (response.data.token && response.data.user) {
    // Store user object along with token for easier access
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data; // Should contain { token, user }
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data; // Should contain { message }
};

// Add other auth-related services if needed, e.g., forgot password
