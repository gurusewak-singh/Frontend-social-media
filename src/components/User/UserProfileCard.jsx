import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button'; // For 'View Profile' or 'Add Friend'

const UserProfileCard = ({ user, onAddFriend, friendStatus }) => {
  // friendStatus could be 'not_friends', 'pending_them', 'pending_me', 'friends'
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <Link to={`/profile/${user._id}`} className="flex items-center group">
        <img
          src={user.profilePic || `https://avatar.vercel.sh/${user.username}.svg?text=${user.username[0]}`}
          alt={user.username}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <span className="font-semibold text-brand-text-dark group-hover:underline">{user.username}</span>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </Link>
      <div>
        {/* Logic for Add Friend / Pending / Friends button can be complex, depends on overall state */}
        {friendStatus === 'not_friends' && onAddFriend && (
          <Button onClick={() => onAddFriend(user._id)} variant="primary" className="h-8 px-3 text-xs">
            Add Friend
          </Button>
        )}
         {friendStatus === 'pending_them' && (
          <Button variant="secondary" className="h-8 px-3 text-xs" disabled>Request Sent</Button>
        )}
        {friendStatus === 'friends' && (
          <Button variant="secondary" className="h-8 px-3 text-xs" disabled>Friends</Button>
        )}
        {/* Add more states like 'pending_me' to accept */}
         {!friendStatus && (
            <Link to={`/profile/${user._id}`}>
                <Button variant="secondary" className="h-8 px-3 text-xs">View Profile</Button>
            </Link>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;