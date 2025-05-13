// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPostsByUserId } from '../services/postService';
import EditProfileForm from '../components/Profile/EditProfileForm';
import PostCard from '../components/Post/PostCard';
import Button from '../components/Common/Button';
import Spinner from '../components/Common/Spinner';

const ProfilePage = () => {
  const { user: authUser } = useAuth(); // Use authUser directly for profile data
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(''); // For post loading errors mainly
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserPosts = useCallback(async () => {
    if (!authUser?._id) return;
    setLoadingPosts(true);
    setError(''); // Clear previous errors
    try {
      const posts = await getPostsByUserId(authUser._id);
      setUserPosts(posts);
    } catch (err) {
      console.error("Failed to load user posts:", err);
      setError("Failed to load posts.");
    } finally {
      setLoadingPosts(false);
    }
  }, [authUser?._id]);

  useEffect(() => {
    if (authUser?._id) { // Only fetch posts if authUser is available
        fetchUserPosts();
    }
  }, [authUser, fetchUserPosts]); // Re-fetch posts if authUser changes (e.g. after login)

  // This function is passed to EditProfileForm, but EditProfileForm now updates AuthContext directly.
  // So, ProfilePage will re-render with fresh authUser data.
  // We might not even need onProfileUpdated prop anymore if ProfilePage always relies on authUser.
  const handleProfileUpdated = (updatedUserFromForm) => {
    // authUser from context is already updated by EditProfileForm via updateUser context function
    setIsEditing(false);
  };
  
  const handlePostUpdated = (updatedPost) => {
    setUserPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setUserPosts(prevPosts => prevPosts.filter(p => p._id !== deletedPostId));
  };

  if (!authUser) { // If authUser is null (e.g., still loading auth state or not logged in)
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size="lg" /></div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-brand-white shadow-xl rounded-lg p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
          <img 
            src={authUser.profilePic || `https://avatar.vercel.sh/${authUser.username}.svg?text=${authUser.username[0]}`} 
            alt={authUser.username} 
            className="size-24 sm:size-32 rounded-full object-cover border-4 border-brand-primary shadow-md" 
          />
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-3xl font-bold text-brand-text-dark">{authUser.username}</h1>
            <p className="text-brand-text-light">{authUser.email}</p>
            {authUser.bio && <p className="text-sm text-gray-700 mt-2 max-w-md whitespace-pre-wrap">{authUser.bio}</p>}
            <p className="text-xs text-gray-500 mt-1">Joined: {new Date(authUser.createdAt).toLocaleDateString()}</p>
             <div className="mt-3">
                <span className="mr-4 text-sm text-gray-600"><strong>{authUser.friends?.length || 0}</strong> Friends</span>
                <span className="text-sm text-gray-600"><strong>{userPosts?.length || 0}</strong> Posts</span>
             </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="mt-4 sm:mt-0 self-start sm:self-auto">
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing && (
          <EditProfileForm 
            onProfileUpdated={handleProfileUpdated} // This will be called, authUser will be fresh
            toggleEditMode={setIsEditing} 
          />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-brand-text-dark">My Posts</h2>
        {loadingPosts ? <div className="flex justify-center py-6"><Spinner /></div> :
          userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map(post => (
                  <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} onPostDeleted={handlePostDeleted}/>
              ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 py-6">You haven't made any posts yet.</p>
        )}
        {error && <p className="text-red-500 text-center py-2">{error}</p>}
      </div>
    </div>
  );
};
export default ProfilePage;