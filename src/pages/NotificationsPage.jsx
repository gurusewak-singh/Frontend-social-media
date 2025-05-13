import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../contexts/SocketContext';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import NotificationItem from '../components/Notification/NotificationItem';
import Button from '../components/Common/Button';
import Spinner from '../components/Common/Spinner';

const NotificationsPage = () => {
  const { isAuthenticated } = useAuth();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Socket listener for new notifications
  useEffect(() => {
    if (socket) {
      // Generic new notification event, could be friend request, like, comment
      const handleNewNotification = ( /* newNotificationData */ ) => {
        // You could add the new notification to the top of the list,
        // or simply re-fetch all notifications to keep it simple.
        fetchNotifications(); 
        // Optionally show a toast "You have a new notification"
      };
      
      // Listen to more specific events if your backend emits them distinctly for notifications
      socket.on('friend-request-received', handleNewNotification);
      socket.on('friend-request-accepted', handleNewNotification);
      socket.on('post-notification', handleNewNotification); // If this also triggers a DB notification

      return () => {
        socket.off('friend-request-received', handleNewNotification);
        socket.off('friend-request-accepted', handleNewNotification);
        socket.off('post-notification', handleNewNotification);
      };
    }
  }, [socket, fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
      alert('Could not mark notification as read.');
    }
  };
  
  const handleMarkAllRead = async () => {
    try {
        // This needs a backend endpoint: PUT /api/notifications/read-all
        // await markAllAsRead(); 
        // For now, let's simulate by marking all client-side and fetching
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        alert("Mark all as read (simulated). Backend implementation needed for persistence.");
        // fetchNotifications(); // Or update locally
    } catch (error) {
        console.error("Failed to mark all notifications as read", error);
        alert("Could not mark all as read.");
    }
  };


  if (!isAuthenticated) return <div className="text-center p-10">Please log in to view notifications.</div>;
  if (loading) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size="lg" /></div>;
  if (error) return <div className="text-center p-10 text-red-500 bg-red-50 rounded-md">{error}</div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-text-dark">Notifications</h1>
        {notifications.length > 0 && unreadCount > 0 && (
            <Button onClick={handleMarkAllRead} variant="secondary" className="text-sm">
              Mark all as read ({unreadCount})
            </Button>
        )}
      </div>
      <div className="bg-brand-white shadow-lg rounded-lg overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        ) : (
          <p className="p-6 text-center text-gray-500">You have no notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;