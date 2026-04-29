import React, { useState, useEffect } from 'react';
import { Menu, Bus, Search, Bell, CalendarDays, ChevronDown } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { useAuthStore } from '../../store/authStore';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const user = useAuthStore((s) => s.user);
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'A';

  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Handle window resize to auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar (Desktop & Mobile) */}
        <div style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} style={{ padding: 8, background: '#F1F5F9', border: 'none', color: '#0F172A', cursor: 'pointer', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Menu size={20} />
              </button>
            )}
            
            {/* Logo/Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #111827, #374151)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bus size={14} color="#fff" />
              </div>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 16, color: '#111827' }}>Admin</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Desktop Stats (Hidden on mobile) */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '6px 12px', borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13 }}>
                <CalendarDays size={14} color="#94A3B8" />
                <span style={{ fontFamily: 'Inter', fontWeight: 600, color: '#334155' }}>{todayStr}</span>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, cursor: 'pointer' }}>
              <div style={{ width: 28, height: 28, borderRadius: 10, background: '#DC2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 700, fontSize: 11 }}>
                {userInitials}
              </div>
              <span className="hidden sm:inline" style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{user?.name || 'Admin'}</span>
              <ChevronDown size={14} color="#94A3B8" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          
          {/* Page Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h1 style={{ fontFamily: 'Poppins', fontSize: window.innerWidth > 640 ? 36 : 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-1px' }}>{title}</h1>
              {subtitle && <p style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: '#64748B', margin: 0 }}>{subtitle}</p>}
            </div>
          </div>

          {/* Page Content */}
          <div style={{ width: '100%' }}>
            {children}
          </div>

        </div>
      </main>
    </div>
  );
};
