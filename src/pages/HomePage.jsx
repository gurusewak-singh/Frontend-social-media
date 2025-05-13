import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar'; // Using the Main Navbar here
import Button from '../components/Common/Button';

const HomePage = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-brand-bg group/design-root overflow-x-hidden">
      <Navbar /> {/* Using the main Navbar which will show Sign in/Sign up */}
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5"> {/* Responsive padding */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[400px] sm:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 shadow-lg"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://cdn.usegalileo.ai/sdxl10/842867ce-d0fa-496c-b5a9-a929f087dee6.png")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
                      Welcome to SocialApp
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base max-w-md mx-auto">
                      A community of people committed to connecting, sharing, and growing. We're here to learn, interact, and support each other.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-3 flex justify-center">
                    <Link to="/register">
                      <Button
                        variant="primary"
                        className="h-10 px-4 @[480px]:h-12 @[480px]:px-5 text-sm @[480px]:text-base"
                      >
                        Join Now
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="h-10 px-4 @[480px]:h-12 @[480px]:px-5 text-sm @[480px]:text-base"
                      onClick={() => alert('Learn More clicked!')} // Placeholder
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="text-brand-text-dark tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl max-w-[720px]">
                  What you'll get by joining SocialApp
                </h1>
                <p className="text-brand-text-dark text-base font-normal leading-normal max-w-[720px]">
                  We believe that the most meaningful connections happen when we share our experiences. That's why we've created a platform that connects you with
                  a community of kind, curious, and supportive people.
                </p>
              </div>
              {/* Add more sections if desired */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;