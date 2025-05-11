import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from '../MainContent';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={handleNavigate}
        currentPath={currentPath}
      />
      
      <main className="flex-1 pt-16 md:pl-64 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
          <MainContent currentPath={currentPath} />
        </div>
      </main>
    </div>
  );
};

export default Layout;