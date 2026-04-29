import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Ticket, Users, LogOut, Bus, ChevronLeft, X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'bookings', label: 'All Bookings', icon: Ticket, path: '/admin/bookings' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Content = (
    <div className="h-full flex flex-col bg-white">
      {/* Logo Section */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-linear-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
            <Bus size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-950 font-poppins text-2xl leading-tight block tracking-tight">BusFlight</span>
            <p className="text-[11px] text-slate-400 font-inter font-bold uppercase tracking-[0.16em] mt-0.5">Admin</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate(item.path);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[1.05rem] font-bold font-inter transition-all duration-300 relative group overflow-hidden
                ${isActive 
                  ? 'text-red-500 bg-red-50 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-red-500 rounded-r-full"
                />
              )}
              
              <Icon 
                size={20} 
                className={`transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-900'}`}
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className="relative z-10">{item.label}</span>
              
              {!isActive && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                </div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer / Logout Section */}
      <div className="p-4 mt-auto">
        <div className="border-t border-slate-200 pt-4" />
        <div className="mt-2 rounded-2xl p-2 space-y-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            id="admin-logout-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold font-inter text-slate-600 hover:bg-slate-50 transition-all cursor-pointer border-0"
          >
            <LogOut size={16} />
            Logout
          </motion.button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 font-inter cursor-pointer border-0 bg-transparent transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-400" />
            Switch to Client
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[245px] min-h-screen bg-white border-r border-slate-200 flex-col shadow-sm sticky top-0 h-screen">
        {Content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-[70] flex flex-col shadow-2xl lg:hidden"
            >
              {Content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
