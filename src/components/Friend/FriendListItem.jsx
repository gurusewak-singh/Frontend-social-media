import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button'; // For potential 'Unfriend' button

const FriendListItem = ({ friend, onUnfriend }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
      <Link to={`/profile/${friend._id}`} className="flex items-center group">
        <img
          src={friend.profilePic || `https://avatar.vercel.sh/${friend.username}.svg?text=${friend.username[0]}`}
          alt={friend.username}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <span className="font-semibold text-brand-text-dark group-hover:underline">{friend.username}</span>
          <p className="text-xs text-gray-500">{friend.email}</p>
        </div>
      </Link>
      {/* <Button onClick={() => onUnfriend(friend._id)} variant="danger" className="h-8 px-3 text-xs">
        Unfriend
      </Button> */}
    </div>
  );
};

export default FriendListItem;