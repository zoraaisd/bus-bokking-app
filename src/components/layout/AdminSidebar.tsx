import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Ticket, Users, LogOut, Bus, ChevronLeft, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'bookings', label: 'All Bookings', icon: Ticket, path: '/admin/bookings' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
];

export const AdminSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Content = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Logo Section */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #111827, #374151)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.12)' }}>
            <Bus size={20} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#111827', letterSpacing: '-0.5px' }}>Admin</span>
            <p style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>Workspace</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ padding: 8, background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate(item.path); if (onClose && window.innerWidth <= 1024) onClose(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: isActive ? '#F8FAFC' : 'transparent',
                color: isActive ? '#0F172A' : '#64748B',
                fontFamily: 'Inter', fontWeight: isActive ? 700 : 600, fontSize: 15,
                transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
              }}
            >
              {isActive && <motion.div layoutId="active-nav" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: 24, background: '#0F172A', borderRadius: '0 4px 4px 0' }} />}
              <Icon size={20} style={{ color: isActive ? '#0F172A' : '#94A3B8' }} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ zIndex: 10 }}>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div style={{ padding: 20, borderTop: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, border: 'none', background: 'transparent', color: '#64748B', fontFamily: 'Inter', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <aside className="hidden lg:flex" style={{ width: 280, height: '100vh', background: '#fff', borderRight: '1px solid #E2E8F0', flexDirection: 'column', position: 'sticky', top: 0 }}>
          {Content}
        </aside>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 60 }} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ position: 'fixed', inset: '0 auto 0 0', width: 280, background: '#fff', zIndex: 70, boxShadow: '4px 0 24px rgba(0,0,0,0.1)' }}>
              {Content}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
