import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/userService';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/friendService'; // Add unfriend if needed
import PostCard from '../components/Post/PostCard';
import Button from '../components/Common/Button';
import Spinner from '../components/Common/Spinner';

const UserProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]); // To store this user's posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friendActionLoading, setFriendActionLoading] = useState(false);

  const fetchUserProfileData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserProfile(userId);
      setProfileUser(data);
      // Fetch posts for this user - you'll need a service for this, e.g., getPostsByUserId(userId)
      // For now, we'll assume this isn't implemented or comes with getUserProfile.
      // setUserPosts(data.posts || []); // if backend populates this
    } catch (err) {
      setError('Failed to load profile.');
      if (err.response?.status === 404) setError('User not found.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (currentUser && userId === currentUser._id) {
      navigate('/profile'); // Redirect to own profile page
      return;
    }
    fetchUserProfileData();
  }, [userId, currentUser, navigate, fetchUserProfileData]);
  
  // This would re-fetch all posts and filter, which isn't ideal.
  // A dedicated `getPostsByUserId` service would be better.
  // For now, we'll just show the profile info.
  // Posts can be added later or if your `getUserProfile` includes them.

  const handleFriendAction = async (action) => {
    if (!isAuthenticated) return alert('Please login to interact with users.');
    setFriendActionLoading(true);
    try {
      let message = '';
      if (action === 'sendRequest') {
        const res = await sendFriendRequest(userId);
        message = res.message;
      } else if (action === 'acceptRequest') {
        const res = await acceptFriendRequest(userId); // userId here is the sender of the request to currentUser
        message = res.message;
      } else if (action === 'rejectRequest') {
         const res = await rejectFriendRequest(userId);
         message = res.message;
      }
      // Add unfriend logic if needed
      alert(message || 'Action successful!');
      fetchUserProfileData(); // Re-fetch profile to update friend status
    } catch (err) {
      alert(err.response?.data?.message || 'Friend action failed.');
      console.error(err);
    } finally {
      setFriendActionLoading(false);
    }
  };
  
  const handlePostUpdated = (updatedPost) => {
    setUserPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setUserPosts(prevPosts => prevPosts.filter(p => p._id !== deletedPostId));
  };


  if (loading) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size="lg" /></div>;
  if (error) return <div className="text-center p-10 text-red-500 bg-red-50 rounded-md">{error}</div>;
  if (!profileUser) return <div className="text-center p-10">Profile data could not be loaded.</div>;

  // Determine friend status
  let friendStatus = 'not_friends';
  if (isAuthenticated && currentUser) {
    if (currentUser.friends?.some(friend => friend === profileUser._id || friend._id === profileUser._id)) {
      friendStatus = 'friends';
    } else if (profileUser.friendRequests?.some(req => req === currentUser._id || req._id === currentUser._id)) {
      // Current user has sent a request to profileUser
      friendStatus = 'request_sent_by_me';
    } else if (currentUser.friendRequests?.some(req => req === profileUser._id || req._id === profileUser._id)) {
      // ProfileUser has sent a request to current user
      friendStatus = 'request_received_by_me';
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-brand-white shadow-xl rounded-lg p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
          <img 
            src={profileUser.profilePic || `https://avatar.vercel.sh/${profileUser.username}.svg?text=${profileUser.username[0]}`} 
            alt={profileUser.username} 
            className="size-24 sm:size-32 rounded-full object-cover border-4 border-brand-primary shadow-md" 
          />
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-3xl font-bold text-brand-text-dark">{profileUser.username}</h1>
            {/* <p className="text-brand-text-light">{profileUser.email}</p> */} {/* Usually don't show email of others */}
            {profileUser.bio && <p className="text-sm text-gray-700 mt-2">{profileUser.bio}</p>}
             <p className="text-xs text-gray-500 mt-1">Joined: {new Date(profileUser.createdAt).toLocaleDateString()}</p>
             <div className="mt-3">
                <span className="mr-4 text-sm text-gray-600"><strong>{profileUser.friends?.length || 0}</strong> Friends</span>
             </div>
          </div>
          {isAuthenticated && currentUser?._id !== profileUser._id && (
            <div className="mt-4 sm:mt-0">
              {friendStatus === 'not_friends' && (
                <Button onClick={() => handleFriendAction('sendRequest')} variant="primary" disabled={friendActionLoading}>
                  {friendActionLoading ? <Spinner size="sm" color="white"/> : 'Add Friend'}
                </Button>
              )}
              {friendStatus === 'request_sent_by_me' && (
                <Button variant="secondary" disabled>Request Sent</Button>
              )}
              {friendStatus === 'request_received_by_me' && (
                <div className="flex gap-2">
                  <Button onClick={() => handleFriendAction('acceptRequest')} variant="primary" disabled={friendActionLoading}>
                    {friendActionLoading ? <Spinner size="sm" color="white"/> : 'Accept'}
                  </Button>
                   <Button onClick={() => handleFriendAction('rejectRequest')} variant="secondary" disabled={friendActionLoading}>
                    {friendActionLoading ? <Spinner size="sm"/> : 'Reject'}
                  </Button>
                </div>
              )}
              {friendStatus === 'friends' && (
                <Button variant="secondary" disabled>Friends</Button> // Add Unfriend later
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-brand-text-dark">{profileUser.username}'s Posts</h2>
         {userPosts.length > 0 ? (
            userPosts.map(post => (
                <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} onPostDeleted={handlePostDeleted}/>
            ))
        ) : (
            <p className="text-center text-gray-500 py-6">{profileUser.username} hasn't made any posts yet.</p>
        )}
        {!userPosts.length && !loading && (
             <p className="text-center text-gray-500 py-6">No posts to display. (Note: Implement fetching user-specific posts)</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;