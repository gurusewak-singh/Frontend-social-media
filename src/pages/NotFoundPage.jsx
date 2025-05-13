import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg text-center px-4">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-brand-text-dark mb-6">Page Not Found</h2>
      <p className="text-brand-text-light mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;