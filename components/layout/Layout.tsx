
import React from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
   useSelector((state: RootState) => state.ui.isSidebarOpen);

  return (
    <div className="flex h-screen bg-white dark:bg-[#09090b] text-gray-800 dark:text-dark-text transition-colors duration-300">
      <Sidebar />
      {/* pl-[64px] ensures the fixed sidebar rail on mobile doesn't overlap content */}
      <div className="flex-1 flex flex-col overflow-hidden pl-[64px] md:pl-0 transition-all duration-300">
        <TopNavBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-black p-4 sm:p-6 transition-all duration-300 rounded-tl-3xl border-t border-l border-green-500 dark:border-green-500/30">
          <div className="max-w-[1600px] mx-auto h-full">
            <motion.div
                {...({
                    initial: { opacity: 0, y: 15 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.4, ease: "easeOut" }
                } as any)}
                className="h-full"
            >
                {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
