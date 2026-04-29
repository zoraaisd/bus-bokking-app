import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Ticket, LogOut, ChevronRight, Shield, Bell, HelpCircle, User, MapPin, CreditCard, Settings, Star } from 'lucide-react';
import { BottomNav } from '../../components/layout/BottomNav';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';

export default function AccountPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const bookings = useBookingStore((s) => s.bookings);
  const totalSpend = useBookingStore((s) => s.getTotalRevenue());
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;

  const [activeView, setActiveView] = useState<string | null>(null);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const menuGroups = [
    {
      title: 'Travel',
      items: [
        { id: 'menu-bookings', icon: Ticket, color: '#DC2626', bg: '#FEF2F2', label: 'My Bookings', sub: `${bookings.length} total booking(s)`, action: () => navigate('/bookings') },
        { id: 'menu-trips', icon: MapPin, color: '#F97316', bg: '#FFF7ED', label: 'Saved Routes', sub: 'Your favourite destinations', action: () => setActiveView('menu-trips') },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'menu-payments', icon: CreditCard, color: '#3B82F6', bg: '#EFF6FF', label: 'Payment Methods', sub: 'Cards, UPI & Wallets', action: () => setActiveView('menu-payments') },
        { id: 'menu-notifications', icon: Bell, color: '#8B5CF6', bg: '#F5F3FF', label: 'Notifications', sub: 'Booking alerts & updates', action: () => setActiveView('menu-notifications') },
        { id: 'menu-security', icon: Shield, color: '#10B981', bg: '#ECFDF5', label: 'Privacy & Security', sub: 'Manage your data', action: () => setActiveView('menu-security') },
        { id: 'menu-settings', icon: Settings, color: '#6B7280', bg: '#F9FAFB', label: 'App Settings', sub: 'Theme, language & more', action: () => setActiveView('menu-settings') },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'menu-help', icon: HelpCircle, color: '#EAB308', bg: '#FEFCE8', label: 'Help & Support', sub: '24/7 customer assistance', action: () => setActiveView('menu-help') },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 84 }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center' }}>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>My Account</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px', width: '100%', boxSizing: 'border-box' }}>
        {/* ── PROFILE HERO CARD ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg,#DC2626 0%,#B91C1C 55%,#9F1239 100%)', borderRadius: 24, padding: '24px', marginBottom: 24, overflow: 'hidden', position: 'relative' }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -20, width: 180, height: 180, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24, position: 'relative' }}>
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 200px' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.3)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 800, fontSize: 24, color: '#fff', flexShrink: 0 }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: '#fff' }}>{user?.name}</p>
                <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#FCA5A5', marginTop: 2 }}>@{user?.username}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Star size={12} color="#FDE68A" fill="#FDE68A" />
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#FDE68A', fontWeight: 600 }}>Gold Member</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 10, flex: '1 1 auto', justifyContent: 'space-between' }}>
              {[
                { val: bookings.length, lbl: 'Trips' },
                { val: confirmed, lbl: 'Next' },
                { val: `₹${(totalSpend / 1000).toFixed(0)}K`, lbl: 'Spent' },
              ].map((s) => (
                <div key={s.lbl} style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 16, padding: '12px 16px', textAlign: 'center', flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 18, color: '#fff' }}>{s.val}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 10, color: '#FCA5A5', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 2-COLUMN LAYOUT ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'start' }}>

          {/* LEFT — Contact Info */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>Contact Information</p>
              </div>
              {[
                { icon: User, label: 'Full Name', value: user?.name || 'N/A' },
                { icon: Mail, label: 'Email Address', value: user?.email || 'N/A' },
                { icon: Phone, label: 'Mobile Number', value: user?.phone || 'N/A' },
              ].map((row, i) => (
                <div key={row.label}>
                  {i > 0 && <div style={{ height: 1, background: '#F9FAFB', margin: '0 20px' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px' }}>
                    <div style={{ width: 36, height: 36, background: '#F9FAFB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <row.icon size={16} color="#6B7280" />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF' }}>{row.label}</p>
                      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#111827', marginTop: 1 }}>{row.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Logout */}
            <motion.button
              id="account-logout-btn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', background: '#FEF2F2', border: '2px solid #FEE2E2', borderRadius: 16, color: '#DC2626', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              <LogOut size={18} /> Sign Out
            </motion.button>

            <p style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF' }}>BusFlight v1.0 · Made with ❤️ in India</p>
          </div>

          {/* RIGHT — Menu Groups */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {menuGroups.map((group, gi) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + gi * 0.06 }}
                style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}
              >
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #F9FAFB' }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{group.title}</p>
                </div>
                {group.items.map((item, ii) => (
                  <div key={item.id}>
                    {ii > 0 && <div style={{ height: 1, background: '#F9FAFB', margin: '0 20px' }} />}
                    <motion.button
                      id={item.id}
                      whileTap={{ scale: 0.99 }}
                      onClick={item.action}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ width: 42, height: 42, background: item.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <item.icon size={19} color={item.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#111827' }}>{item.label}</p>
                        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280', marginTop: 2 }}>{item.sub}</p>
                      </div>
                      <ChevronRight size={16} color="#D1D5DB" />
                    </motion.button>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />

      <AnimatePresence>
        {activeView && (
          <DetailView activeView={activeView} onClose={() => setActiveView(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailView({ activeView, onClose }: { activeView: string, onClose: () => void }) {
  let title = '';
  let content = null;

  const ToggleRow = ({ label, defaultChecked }: { label: string, defaultChecked?: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
        <span style={{ fontFamily: 'Inter', fontSize: 15, color: '#374151', fontWeight: 500 }}>{label}</span>
        <div onClick={() => setChecked(!checked)} style={{ width: 44, height: 24, borderRadius: 12, background: checked ? '#10B981' : '#E5E7EB', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: checked ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </div>
      </div>
    );
  };

  switch (activeView) {
    case 'menu-trips':
      title = 'Saved Routes';
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto' }}>
          {[
            { from: 'Chennai', to: 'Bangalore', type: 'Bus', date: 'Frequent' },
            { from: 'Mumbai', to: 'Goa', type: 'Flight', date: 'Saved on 12 Apr' },
            { from: 'Delhi', to: 'Manali', type: 'Bus', date: 'Saved on 05 Mar' }
          ].map((r, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>{r.from} → {r.to}</p>
                <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 4 }}>{r.type} · {r.date}</p>
              </div>
              <ChevronRight size={20} color="#9CA3AF" />
            </div>
          ))}
        </div>
      );
      break;
    case 'menu-payments':
      title = 'Payment Methods';
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: 16, padding: 20, color: '#fff' }}>
            <p style={{ fontFamily: 'Inter', fontSize: 14, opacity: 0.8 }}>HDFC Bank Credit Card</p>
            <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 20, marginTop: 12, letterSpacing: 2 }}>**** **** **** 4532</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <p style={{ fontFamily: 'Inter', fontSize: 12 }}>Valid Thru: 09/27</p>
              <div style={{ display: 'flex', gap: -8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,0,0,0.6)' }} />
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,165,0,0.6)', marginLeft: -12 }} />
              </div>
            </div>
          </div>
          <button style={{ width: '100%', padding: 16, borderRadius: 16, border: '2px dashed #D1D5DB', background: 'transparent', color: '#6B7280', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            + Add New Card
          </button>
        </div>
      );
      break;
    case 'menu-notifications':
      title = 'Notifications';
      content = (
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 16, padding: '0 20px', border: '1px solid #E5E7EB' }}>
          <ToggleRow label="Push Notifications" defaultChecked={true} />
          <ToggleRow label="SMS Alerts" defaultChecked={true} />
          <ToggleRow label="Email Newsletters" defaultChecked={false} />
          <ToggleRow label="Price Drop Alerts" defaultChecked={true} />
        </div>
      );
      break;
    case 'menu-security':
      title = 'Privacy & Security';
      content = (
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 16, padding: '0 20px', border: '1px solid #E5E7EB' }}>
          <ToggleRow label="Biometric Login (Face/Touch ID)" defaultChecked={true} />
          <ToggleRow label="Two-Factor Authentication" defaultChecked={false} />
          <ToggleRow label="Share Data with Partners" defaultChecked={false} />
        </div>
      );
      break;
    case 'menu-settings':
      title = 'App Settings';
      content = (
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 16, padding: '0 20px', border: '1px solid #E5E7EB' }}>
          <ToggleRow label="Dark Mode" defaultChecked={false} />
          <ToggleRow label="Data Saver Mode" defaultChecked={false} />
          <div style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 15, color: '#374151', fontWeight: 500 }}>Currency</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B7280', fontWeight: 600 }}>INR (₹)</span>
          </div>
          <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 15, color: '#374151', fontWeight: 500 }}>Language</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B7280', fontWeight: 600 }}>English</span>
          </div>
        </div>
      );
      break;
    case 'menu-help':
      title = 'Help & Support';
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #E5E7EB' }}>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 12 }}>Frequently Asked Questions</p>
            {['How to cancel a booking?', 'Where is my refund?', 'Can I change my travel date?'].map((q, i) => (
               <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#4B5563' }}>{q}</span>
                 <ChevronRight size={16} color="#9CA3AF" />
               </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: 16, borderRadius: 16, border: 'none', background: '#2563EB', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            Chat with an Agent
          </button>
        </div>
      );
      break;
  }

  return (
    <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ position: 'fixed', inset: 0, background: '#F8F9FB', zIndex: 60, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: '50%', background: '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronRight size={20} color="#111827" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#111827' }}>{title}</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, paddingBottom: 100 }}>
        {content}
      </div>
    </motion.div>
  );
}
