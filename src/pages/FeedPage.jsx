import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../contexts/SocketContext';
import { getAllPosts } from '../services/postService';
import PostCard from '../components/Post/PostCard';
import Spinner from '../components/Common/Spinner';

const FeedPage = () => {
  const { user, isAuthenticated } = useAuth();
  const socket = useSocket();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated, fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    window.scrollTo(0, 0); // Scroll to top after new post
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setPosts(prevPosts => prevPosts.filter(p => p._id !== deletedPostId));
  };

  // Socket listeners for real-time post updates (like/comment notifications from backend)
  useEffect(() => {
    if (socket) {
      const handlePostNotification = (notification) => {
        console.log('Post notification received via socket:', notification);
        // This is a generic notification. For specific post updates (likes/comments count),
        // the backend should ideally send the *updated post object* or specific data to update.
        // If it only sends a notification message, we might need to re-fetch or handle more granularly.
        // For now, let's assume a 'post-updated' event might come with the full post.
        // Or, we can show a toast and let the user refresh or click to see updates.
        // For now, let's make a simple update to a post if its ID matches for likes/comments
        if (notification.postId && (notification.type === 'like' || notification.type === 'comment')) {
             // Re-fetch all posts to get the latest state. Less efficient but simpler for now.
             // A better approach would be for the backend to emit the updated post data.
             fetchPosts();
        }
      };

      socket.on('post-notification', handlePostNotification);

      return () => {
        socket.off('post-notification', handlePostNotification);
      };
    }
  }, [socket, fetchPosts]);


  if (!isAuthenticated) {
    return <div className="text-center p-10">Please log in to see the feed.</div>;
  }

  if (loading && posts.length === 0) return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Spinner size="lg" />
    </div>
  );

  if (error) return <div className="text-center p-10 text-red-500 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="w-full max-w-2xl mx-auto"> {/* Centered content */}
      <h1 className="text-3xl font-bold mb-6 text-brand-text-dark sr-only">Feed</h1>
      {/* <p className="mb-4 text-lg">Welcome to your feed, {user?.username}!</p> */}
      

      
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard 
                key={post._id} 
                post={post} 
                onPostUpdated={handlePostUpdated} 
                onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500 py-10">No posts yet. Follow some users or be the first to share!</p>
      )}
    </div>
  );
};

export default FeedPage;