import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button';
import Spinner from '../Common/Spinner';

const FriendRequestItem = ({ request, onAccept, onReject }) => {
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const handleAccept = async () => {
    setLoadingAccept(true);
    await onAccept(request._id);
    setLoadingAccept(false);
  };

  const handleReject = async () => {
    setLoadingReject(true);
    await onReject(request._id);
    setLoadingReject(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
      <Link to={`/profile/${request._id}`} className="flex items-center group">
        <img
          src={request.profilePic || `https://avatar.vercel.sh/${request.username}.svg?text=${request.username[0]}`}
          alt={request.username}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <span className="font-semibold text-brand-text-dark group-hover:underline">{request.username}</span>
          <p className="text-xs text-gray-500">{request.email}</p>
        </div>
      </Link>
      <div className="flex gap-2">
        <Button onClick={handleAccept} variant="primary" className="h-8 px-3 text-xs" disabled={loadingAccept || loadingReject}>
          {loadingAccept ? <Spinner size="sm" color="white"/> : 'Accept'}
        </Button>
        <Button onClick={handleReject} variant="secondary" className="h-8 px-3 text-xs" disabled={loadingAccept || loadingReject}>
         {loadingReject ? <Spinner size="sm" /> : 'Reject'}
        </Button>
      </div>
    </div>
  );
};

export default FriendRequestItem;