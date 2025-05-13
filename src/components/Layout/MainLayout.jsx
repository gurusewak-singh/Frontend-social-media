import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import CreatePostModal from '../Post/CreatePostModal';

const MainLayout = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const location = useLocation();
  const previousPathnameRef = useRef(location.pathname); // To track pathname changes

  useEffect(() => {
    // Only close modal if the pathname has actually changed AND the modal was open
    if (isCreatePostModalOpen && location.pathname !== previousPathnameRef.current) {
      setIsCreatePostModalOpen(false);
    }
    // Update the ref to the current pathname for the next comparison
    previousPathnameRef.current = location.pathname;
  }, [location.pathname, isCreatePostModalOpen]); // Rerun when path changes or modal state changes


  const handlePostCreatedInModal = (newPost) => {
    console.log("Post created via modal:", newPost);
    // The CreatePostModal now calls onClose internally after its onPostCreated prop is called.
  };

  const fabHiddenPaths = ['/chat']; // Example: hide on chat page
  const showCreatePostButtonInNavbar = !fabHiddenPaths.some(path => location.pathname.startsWith(path));


  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-50">
      <Navbar 
        onOpenCreatePostModal={() => {
          if (showCreatePostButtonInNavbar) { // Ensure button is meant to be active
            setIsCreatePostModalOpen(true)
          }
        }} 
      />
      <main className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 px-4 sm:px-10 md:px-20 lg:px-40">
          <div className="layout-content-container flex flex-col w-full max-w-screen-lg flex-1">
            <Outlet />
          </div>
        </div>
      </main>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={handlePostCreatedInModal} // This is mainly for logging or further actions here
      />
    </div>
  );
};

export default MainLayout;