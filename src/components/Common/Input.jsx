import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, name, id, className = '', error = null, label, ...props }) => {
  const baseStyles = "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-brand-text-dark focus:outline-0 focus:ring-0 border h-14 placeholder:text-brand-text-light p-4 text-base font-normal leading-normal";
  
  // Style based on HTML provided (Register page has border, Login page has bg-brand-secondary)
  // We can make this configurable via props if needed, or create variants.
  // For now, let's use a consistent style with border.
  const styleMode = "border-gray-300 bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary";
  // const altStyleMode = "border-none bg-brand-secondary focus:border-none";

  const errorStyles = error ? "border-brand-error focus:border-brand-error focus:ring-brand-error" : "border-gray-300 focus:border-brand-primary";


  return (
    <div className="w-full">
      {label && <label htmlFor={id || name} className="block text-sm font-medium text-brand-text-dark mb-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={id || name}
        className={`${baseStyles} ${styleMode} ${errorStyles} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-brand-error">{error}</p>}
    </div>
  );
};

export default Input;