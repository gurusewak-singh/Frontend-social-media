import React, { useState } from 'react'; // Added useState for potential future click-based dropdown
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

const AppLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 text-brand-primary">
    <path
      d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
      fill="currentColor"
    ></path>
  </svg>
);

const Navbar = ({ onOpenCreatePostModal }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showCreatePostButton = isAuthenticated && (location.pathname === '/feed' || location.pathname.startsWith('/profile'));

  return (
    <header className="sticky top-0 z-[51] flex items-center justify-between whitespace-nowrap border-b border-solid border-brand-secondary bg-brand-bg px-4 sm:px-10 py-3">
      <Link to={isAuthenticated ? "/feed" : "/"} className="flex items-center gap-3 text-brand-text-dark">
        <AppLogo />
        <h2 className="text-brand-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">SocialApp</h2>
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2">
        {isAuthenticated ? (
          <>
            {showCreatePostButton && (
              <Button
                variant="primary"
                onClick={onOpenCreatePostModal}
                className="h-9 px-3 text-sm mr-2 sm:mr-4"
              >
                Create Post
              </Button>
            )}
            <Link to="/feed" className="text-sm font-medium hover:text-brand-primary px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">Feed</Link>
            <Link to="/friends" className="text-sm font-medium hover:text-brand-primary px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">Friends</Link>
            <Link to="/notifications" className="text-sm font-medium hover:text-brand-primary px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
              Notifications
            </Link>
            <Link to="/chat" className="text-sm font-medium hover:text-brand-primary px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">Chat</Link>

            {/* --- REFINED PROFILE DROPDOWN --- */}
            <div className="relative ml-2 group"> {/* This is the main group container */}
              {/* Trigger Button - This is part of the group */}
              <button
                type="button"
                className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary transition-colors"
                aria-expanded="false" // Consider managing this with state for click-based dropdown
                aria-haspopup="true"
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.username} className="size-8 rounded-full object-cover border border-gray-300"/>
                ) : (
                  <span className="size-8 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary border border-gray-300 text-base font-semibold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden lg:inline text-sm font-medium text-brand-text-dark group-hover:text-brand-primary">{user?.username}</span>
                <svg className="hidden sm:inline w-4 h-4 text-gray-500 group-hover:text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {/* Dropdown Menu - This is also part of the group */}
              {/* Added opacity transition and slight delay for appearing/disappearing */}
              <div
                className="absolute right-0 mt-2 w-48 origin-top-right bg-brand-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none
                           opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                           transition-all duration-150 ease-out group-hover:duration-75" // Added transition
              >
                <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-secondary hover:text-brand-primary rounded-t-md"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-secondary hover:text-brand-primary rounded-b-md"
                >
                  Logout
                </button>
              </div>
            </div>
            {/* --- END REFINED PROFILE DROPDOWN --- */}
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button variant="secondary" onClick={() => navigate('/register')}>
              Sign up
            </Button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;