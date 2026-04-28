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
      <div className="p-8 pb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-red-600 to-rose-700 rounded-2xl flex items-center justify-center shadow-xl shadow-red-200">
            <Bus size={22} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 font-poppins text-lg leading-tight block tracking-tight">BusFlight</span>
            <p className="text-[10px] text-gray-400 font-inter font-bold uppercase tracking-[0.2em] mt-0.5">Admin Central</p>
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
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4">Main Menu</p>
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
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold font-inter transition-all duration-300 relative group overflow-hidden
                ${isActive 
                  ? 'text-red-600 bg-red-50/50 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-red-600 rounded-r-full"
                />
              )}
              
              <Icon 
                size={20} 
                className={`transition-colors duration-300 ${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-900'}`}
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
      <div className="p-6 mt-auto">
        <div className="bg-gray-50 rounded-3xl p-4 space-y-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            id="admin-logout-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold font-inter text-red-600 hover:bg-red-100/50 transition-all cursor-pointer border-0"
          >
            <LogOut size={18} />
            Logout Session
          </motion.button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-500 hover:text-gray-900 font-inter cursor-pointer border-0 bg-transparent transition-colors"
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
      <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-gray-100 flex-col shadow-sm sticky top-0 h-screen">
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
              className="fixed inset-y-0 left-0 w-72 bg-white z-[70] flex flex-col shadow-2xl lg:hidden"
            >
              {Content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
