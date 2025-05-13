import React from 'react';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const handleNotificationClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
  };

  let content = <p>{notification.message}</p>;
  let linkTo = '#';

  switch (notification.type) {
    case 'like':
    case 'comment':
      if (notification.post) {
        // Assuming you'll have a single post view page later, or scroll to post on feed
        // linkTo = `/post/${notification.post._id || notification.post}`;
        linkTo = `/feed#post-${notification.post._id || notification.post}`; // Placeholder link
      }
      break;
    case 'friend_request':
      // Link to friend requests page or directly to sender's profile
      linkTo = notification.sender ? `/profile/${notification.sender._id || notification.sender}` : '/friends';
      break;
    default:
      break;
  }

  return (
    <Link
      to={linkTo}
      onClick={handleNotificationClick}
      className={`block p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50 font-medium' : 'bg-white'}`}
    >
      <div className="flex items-center">
        {notification.sender?.profilePic && (
           <img src={notification.sender.profilePic} alt={notification.sender.username} className="w-8 h-8 rounded-full mr-3 object-cover" />
        )}
        <div>
          {content}
          <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleTimeString()} - {new Date(notification.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Link>
  );
};

export default NotificationItem;