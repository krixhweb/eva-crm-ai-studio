import React from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useSelector((state: RootState) => state.ui.isSidebarOpen);

  return (
    <div className="flex h-screen bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar />
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-black p-4 sm:p-6 transition-all duration-300 rounded-tl-2xl border-t-2 border-l-2 border-green-500 dark:border-green-500/20"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;