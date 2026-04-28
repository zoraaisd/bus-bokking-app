import React, { useState } from 'react';
import { Menu, Bus } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 glass sticky top-0 z-30 mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2.5 -ml-2 text-gray-600 bg-white/50 rounded-xl shadow-sm hover:bg-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-red-600 to-rose-700 rounded-xl flex items-center justify-center shadow-md shadow-red-200">
                <Bus size={18} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 font-poppins text-sm leading-tight block">Admin Panel</span>
                <span className="text-[10px] text-gray-400 font-inter uppercase tracking-wider">BusFlight</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="text-gray-500 font-inter text-xs font-bold px-3 py-1.5 bg-gray-100 rounded-lg active:scale-95 transition-transform"
          >
            Back
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 sm:px-10 py-8 sm:py-12 max-w-7xl mx-auto min-h-full flex flex-col admin-content-gap">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-poppins text-gray-900 tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-gray-500 font-inter text-sm sm:text-base font-medium flex items-center gap-2">
                <span className="w-8 h-[2px] bg-red-600/20 rounded-full" />
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
