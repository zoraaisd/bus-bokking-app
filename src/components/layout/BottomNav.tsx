import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Ticket, User } from 'lucide-react';

const tabs = [
  { id: 'nav-home',     to: '/home',     Icon: Home,   label: 'Home' },
  { id: 'nav-bookings', to: '/bookings', Icon: Ticket, label: 'Bookings' },
  { id: 'nav-account',  to: '/account',  Icon: User,   label: 'Account' },
];

export function BottomNav() {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: '#fff',
      borderTop: '1px solid #F3F4F6',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex' }}>
        {tabs.map(({ id, to, Icon, label }) => (
          <NavLink key={to} to={to} id={id} style={{ flex: 1, textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 6, paddingBottom: 8, gap: 2 }}>
                {/* Top indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 28, height: 3, background: '#DC2626', borderRadius: '0 0 4px 4px' }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.82 }}
                  style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? '#FEF2F2' : 'transparent' }}
                >
                  <Icon size={20} color={isActive ? '#DC2626' : '#9CA3AF'} strokeWidth={isActive ? 2.5 : 1.8} />
                </motion.div>
                <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: isActive ? 600 : 400, color: isActive ? '#DC2626' : '#9CA3AF' }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
