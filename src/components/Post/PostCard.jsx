import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toggleLikePost, addComment, deletePost as deletePostService } from '../../services/postService';
import Button from '../Common/Button';
import Spinner from '../Common/Spinner';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

// Placeholder Icons (Consider using react-icons or similar)
const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-red-500 fill-current' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);
const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.839 8.839 0 01-4.082-.978L4 17.618V14.11C2.325 12.845 1 10.98 1 9c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
  </svg>
);
 const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


const PostCard = ({ post: initialPost, onPostUpdated, onPostDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!post || !post.userId) {
    return <div className="bg-red-100 p-3 rounded-md my-2">Error: Invalid post data provided to PostCard.</div>;
  }

  const isLikedByCurrentUser = isAuthenticated && post.likes?.some(like => like === user?._id || like._id === user?._id);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) return alert('Please login to like posts.');
    setLikeLoading(true);
    try {
      const updatedPostData = await toggleLikePost(post._id);
      setPost(updatedPostData.post);
      if (onPostUpdated) onPostUpdated(updatedPostData.post); // Notify parent
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert(error.response?.data?.message || "Could not update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentAdded = async (postId, commentData) => { // Re-fetch or update post from response
    const updatedPostData = await addComment(postId, commentData);
    setPost(updatedPostData.post);
    if (onPostUpdated) onPostUpdated(updatedPostData.post);
    setShowComments(true); // Ensure comments are visible after adding one
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleteLoading(true);
    try {
        await deletePostService(post._id);
        if(onPostDeleted) onPostDeleted(post._id);
    } catch (error) {
        console.error("Failed to delete post:", error);
        alert(error.response?.data?.message || "Could not delete post.");
    } finally {
        setDeleteLoading(false);
    }
  };


  return (
    <div className="bg-brand-white p-4 sm:p-5 shadow-lg rounded-lg mb-6">
      <div className="flex items-start justify-between mb-3">
        <Link to={`/profile/${post.userId._id}`} className="flex items-center group">
          <img
            src={post.userId.profilePic || `https://avatar.vercel.sh/${post.userId.username}.svg?text=${post.userId.username[0]}`}
            alt={post.userId.username}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 object-cover border border-gray-200"
          />
          <div>
            <span className="font-semibold text-brand-text-dark group-hover:underline">
              {post.userId.username}
            </span>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </Link>
        {isAuthenticated && user?._id === post.userId._id && (
            <Button onClick={handleDeletePost} variant="danger" className="p-1 h-auto min-w-0 bg-transparent hover:bg-red-100 text-red-500" disabled={deleteLoading}>
                {deleteLoading ? <Spinner size="sm" color="primary" /> : <TrashIcon />}
            </Button>
        )}
      </div>

      {post.textContent && <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.textContent}</p>}
      {post.image && (
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
            <img src={post.image} alt="Post content" className="max-h-[500px] w-full object-contain" />
        </div>
      )}

      <div className="flex justify-between items-center text-gray-600 text-sm border-t border-b border-gray-200 py-2">
        <button onClick={handleLikeToggle} className="flex items-center gap-1 hover:text-red-500 disabled:opacity-50" disabled={likeLoading}>
          <HeartIcon filled={isLikedByCurrentUser} />
          {post.likes?.length || 0} {likeLoading && <Spinner size="sm" />}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 hover:text-brand-primary">
          <CommentIcon />
          {post.comments?.length || 0} Comments
        </button>
      </div>

      {showComments && (
        <div className="mt-3">
          {isAuthenticated && <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />}
          <CommentList comments={post.comments || []} />
        </div>
      )}
    </div>
  );
};

export default PostCard;