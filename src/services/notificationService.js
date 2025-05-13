import api from './api';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data; // Expects array of notification objects
};

export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data; // Expects { message: "..." }
};

export const markAllAsRead = async () => {
    // You'll need to implement this endpoint on the backend if you want a "mark all" feature
    // Example: PUT /notifications/read-all
    // For now, this is a placeholder to show where it would go.
    // const response = await api.put('/notifications/read-all');
    // return response.data;
    console.warn("markAllAsRead service function called, but backend endpoint might not exist.");
    return Promise.resolve({ message: "Mark all as read (simulated)"});
};