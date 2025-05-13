import api from './api';

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
  return response.data; // Expects array of user objects { username, email, _id }
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/profile/${userId}`);
  return response.data; // Expects full user object (except password)
};

export const editProfile = async (profileData) => {
  // profileData might be { username, email, bio, profilePic (URL) }
  const response = await api.put('/users/edit', profileData);
  return response.data; // Expects { message: "...", user: updatedUser }
};