import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../contexts/SocketContext';
import { getFriendList, getFriendRequests, acceptFriendRequest, rejectFriendRequest, sendFriendRequest } from '../services/friendService';
import { searchUsers } from '../services/userService';
import FriendListItem from '../components/Friend/FriendListItem';
import FriendRequestItem from '../components/Friend/FriendRequestItem';
import UserProfileCard from '../components/User/UserProfileCard';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import Spinner from '../components/Common/Spinner';

const FriendsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const socket = useSocket();

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  const [error, setError] = useState('');

  const fetchFriendsAndRequests = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingFriends(true);
    setLoadingRequests(true);
    setError('');
    try {
      const [friendsData, requestsData] = await Promise.all([
        getFriendList(),
        getFriendRequests()
      ]);
      setFriends(friendsData);
      setRequests(requestsData);
    } catch (err) {
      setError('Failed to load friend data. Please try again.');
      console.error(err);
    } finally {
      setLoadingFriends(false);
      setLoadingRequests(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFriendsAndRequests();
  }, [fetchFriendsAndRequests]);

  // Socket listeners for friend updates
  useEffect(() => {
    if (socket) {
      const handleFriendUpdate = () => {
        fetchFriendsAndRequests(); // Re-fetch all data on any friend-related socket event
      };
      socket.on('friend-request-received', handleFriendUpdate);
      socket.on('friend-request-accepted', handleFriendUpdate);
      // Add listener for 'friend-request-rejected' or 'friend-removed' if your backend emits them

      return () => {
        socket.off('friend-request-received', handleFriendUpdate);
        socket.off('friend-request-accepted', handleFriendUpdate);
      };
    }
  }, [socket, fetchFriendsAndRequests]);

  const handleAccept = async (senderId) => {
    try {
      await acceptFriendRequest(senderId);
      fetchFriendsAndRequests(); // Refresh lists
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept request.');
    }
  };

  const handleReject = async (senderId) => {
    try {
      await rejectFriendRequest(senderId);
      fetchFriendsAndRequests(); // Refresh lists
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    try {
      const results = await searchUsers(searchQuery);
      // Filter out current user and existing friends/pending requests from search
      const filteredResults = results.filter(foundUser => {
        if (foundUser._id === user?._id) return false;
        // if (friends.some(f => f._id === foundUser._id)) return false; // Already friends
        // if (requests.some(r => r._id === foundUser._id)) return false; // Already have a request from them
        // More complex: check if currentUser sent a request to foundUser (need to store this state or check profile)
        return true;
      });
      setSearchResults(filteredResults);
    } catch (err) {
      alert(err.response?.data?.message || 'Search failed.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleAddFriendFromSearch = async (targetUserId) => {
    try {
        await sendFriendRequest(targetUserId);
        alert('Friend request sent!');
        // Update search result to show "Pending" or remove from list
        setSearchResults(prev => prev.map(u => u._id === targetUserId ? {...u, requestSent: true} : u));
        // Optionally, re-fetch friend requests to update main list if needed, or rely on socket.
    } catch (error) {
        alert(error.response?.data?.message || 'Failed to send friend request.');
    }
  };


  if (!isAuthenticated) return <div className="text-center p-10">Please log in to manage friends.</div>;
  if (error) return <div className="text-center p-10 text-red-500 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-brand-text-dark">Manage Friends</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Friend Requests Section */}
        <div className="bg-brand-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-brand-text-dark border-b pb-2">Friend Requests ({requests.length})</h2>
          {loadingRequests ? <div className="flex justify-center py-4"><Spinner /></div> : (
            requests.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {requests.map(req => (
                  <FriendRequestItem key={req._id} request={req} onAccept={handleAccept} onReject={handleReject} />
                ))}
              </div>
            ) : <p className="text-gray-500">No pending friend requests.</p>
          )}
        </div>

        {/* My Friends Section */}
        <div className="bg-brand-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-brand-text-dark border-b pb-2">My Friends ({friends.length})</h2>
          {loadingFriends ? <div className="flex justify-center py-4"><Spinner /></div> : (
            friends.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {friends.map(friend => (
                  <FriendListItem key={friend._id} friend={friend} onUnfriend={() => {/* Implement unfriend */}} />
                ))}
              </div>
            ) : <p className="text-gray-500">You have no friends yet. Find some!</p>
          )}
        </div>
      </div>

      {/* Find Friends Section */}
      <div className="bg-brand-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-brand-text-dark border-b pb-2">Find Friends</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            name="search"
            className="flex-grow h-10"
          />
          <Button type="submit" variant="primary" className="h-10" disabled={loadingSearch}>
            {loadingSearch ? <Spinner size="sm" color="white" /> : 'Search'}
          </Button>
        </form>
        {loadingSearch && <div className="flex justify-center py-4"><Spinner /></div>}
        {!loadingSearch && searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map(foundUser => (
              <UserProfileCard 
                key={foundUser._id} 
                user={foundUser} 
                onAddFriend={handleAddFriendFromSearch}
                friendStatus={foundUser.requestSent ? 'pending_them' : 'not_friends'} // Simplified status for search
              />
            ))}
          </div>
        )}
        {!loadingSearch && searchResults.length === 0 && searchQuery && (
          <p className="text-gray-500 text-center py-4">No users found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;