import api from './api';

export const sendFriendRequest = async (receiverId) => {
  const response = await api.post(`/friend/friend-request/${receiverId}`);
  return response.data; // Expects { message: "..." }
};

export const acceptFriendRequest = async (senderId) => {
  const response = await api.post(`/friend/friend-request/${senderId}/accept`);
  return response.data; // Expects { message: "..." }
};

export const rejectFriendRequest = async (senderId) => {
  const response = await api.post(`/friend/friend-request/${senderId}/reject`);
  return response.data; // Expects { message: "..." }
};

export const getFriendRequests = async () => {
  const response = await api.get('/friend/friend-requests');
  return response.data; // Expects array of user objects (populated)
};

export const getFriendList = async () => {
  const response = await api.get('/friend/friends');
  return response.data; // Expects array of user objects (populated)
};