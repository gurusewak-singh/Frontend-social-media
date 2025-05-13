import React, { useEffect, useState } from 'react';
import CreatePostForm from './CreatePostForm';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Delay hiding to allow for fade-out animation
      const timer = setTimeout(() => setShow(false), 300); // Match duration-300
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null; // Fully hidden

  return (
    // Modal overlay
    <div
      className={`fixed inset-0 bg-white z-[60] flex justify-center items-center p-4 transition-opacity duration-300 ease-out ${isOpen ? 'bg-opacity-75 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'}`}
      onClick={onClose} // Close on overlay click
    >
      {/* Modal content - stopPropagation to prevent closing when clicking inside */}
      <div
        className={`create-post-modal-content bg-brand-white rounded-lg shadow-xl w-full max-w-lg relative transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-brand-text-dark">Create New Post</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-0"> {/* CreatePostForm likely has its own padding */}
          <CreatePostForm onPostCreated={(newPost) => {
            onPostCreated(newPost);
            onClose();
          }} />
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;