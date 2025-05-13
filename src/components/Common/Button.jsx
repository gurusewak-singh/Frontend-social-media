import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', fullWidth = false, className = '', disabled = false, ...props }) => {
  const baseStyles = "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-brand-primary text-brand-white hover:bg-blue-700 focus:ring-brand-primary",
    secondary: "bg-brand-secondary text-brand-text-dark hover:bg-gray-300 focus:ring-brand-secondary",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    // Add more variants as needed: outline, ghost, etc.
  };

  const widthClass = fullWidth ? 'w-full flex-1' : '';
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className} ${disabledClasses}`}
      disabled={disabled}
      {...props}
    >
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;