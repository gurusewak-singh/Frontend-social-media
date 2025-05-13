import React from 'react';
import { Outlet, Link } from 'react-router-dom';

// Placeholder SVG Icon
const AppLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 text-brand-primary">
    <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
  </svg>
);


const AuthLayout = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-brand-bg group/design-root overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-brand-secondary px-4 sm:px-10 py-3">
        <Link to="/" className="flex items-center gap-3 text-brand-text-dark">
          <AppLogo />
          <h2 className="text-brand-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">SocialApp</h2>
        </Link>
        {/* Navigation can be conditional based on current route if needed */}
        {/* e.g., show "Sign Up" on login page, "Sign In" on register page */}
      </header>
      <div className="flex flex-1 justify-center items-center py-5 px-4">
        <div className="layout-content-container flex flex-col w-full max-w-md bg-brand-white shadow-xl rounded-lg p-6 sm:p-8">
          <Outlet /> {/* Login or Register form will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;