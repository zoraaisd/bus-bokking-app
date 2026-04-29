import React, { useState } from 'react';
import { Menu, Bus, Search, Bell, CalendarDays, ChevronDown } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-panel-shell flex min-h-screen">
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
        <div className="mx-auto flex min-h-full w-full max-w-[1400px] flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 admin-content-gap">
          <div className="hidden lg:flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-[2.9rem] leading-none font-black font-poppins text-slate-950 tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-3 text-slate-500 font-inter text-[1.05rem] font-medium">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm min-w-[320px]">
                <Search size={18} className="text-slate-400" />
                <span className="flex-1 text-sm font-semibold text-slate-400">Search bookings, users...</span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500">⌘K</span>
              </div>

              <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
                <Bell size={18} />
                <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">3</span>
              </button>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 font-poppins text-sm font-black text-white">AS</div>
                <div className="leading-tight">
                  <p className="text-sm font-black text-slate-900">Admin</p>
                  <p className="text-xs font-semibold text-slate-400">Super Admin</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <CalendarDays size={18} className="text-slate-500" />
              <span className="text-sm font-black text-slate-700">Wednesday, 29 April 2026</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col gap-2 lg:hidden">
            <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-gray-500 font-inter text-sm font-medium flex items-center gap-2">
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
