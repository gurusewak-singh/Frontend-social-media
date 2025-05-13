import React from 'react';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colors = {
    primary: 'border-brand-primary',
    white: 'border-white',
  };

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 ${colors[color]}`}></div>
  );
};

export default Spinner;