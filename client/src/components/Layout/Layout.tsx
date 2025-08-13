import React from 'react';
import { Outlet } from 'react-router-dom';
import { SkipToContentLink } from '../UI/Accessibility';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkipToContentLink />
      
      {/* Main content area */}
      <main id="main-content" className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
