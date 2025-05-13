import api from './api';

export const getAllPosts = async () => {
  const response = await api.get('/posts/posts'); // Ensure this matches your backend route in postRoutes.js
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const createPost = async (postData) => {
  // postData should be like { textContent: "...", image: "url..." }
  const response = await api.post('/posts', postData);
  return response.data; // Expects { message: "...", post: newPopulatedPost }
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data; // Expects { message: "..." }
};

export const toggleLikePost = async (postId) => {
  const response = await api.put(`/posts/${postId}/like`);
  return response.data; // Expects { message: "...", post: updatedPost }
};

export const addComment = async (postId, commentData) => {
  // commentData should be like { text: "..." }
  const response = await api.post(`/posts/${postId}/comment`, commentData);
  return response.data; // Expects { message: "...", post: updatedPostWithNewComment }
};

export const getPostsByUserId = async (userId) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};