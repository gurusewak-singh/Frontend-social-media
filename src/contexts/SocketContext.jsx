import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (token && user) {
      // Ensure your backend URL is correct, especially if it's different from API base
      const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
        // auth: { token } // If your socket connection requires token for auth
        // query: { userId: user._id } // Or send userId in query
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        newSocket.emit('user-connected', user._id); // Notify backend user is online
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
      
      // Example: Welcome message from server
      newSocket.on('welcome', (message) => {
        console.log('Server says:', message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('welcome');
        newSocket.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [token, user]); // Reconnect if user or token changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};