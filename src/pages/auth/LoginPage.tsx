import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Bus, Plane, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const result = login(username.trim(), password);
    setLoading(false);
    if (result === 'admin') {
      toast.success('Welcome, Admin! 🎉');
      setTimeout(() => navigate('/admin'), 400);
    } else if (result === 'client') {
      toast.success('Welcome back! 🚌');
      setTimeout(() => navigate('/home'), 400);
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8F9FB' }}>
      <Toaster position="top-center" />

      {/* ── LEFT PANEL (desktop) ──────────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: 420, flexShrink: 0, flexDirection: 'column', justifyContent: 'space-between',
          background: 'linear-gradient(135deg,#DC2626 0%,#B91C1C 55%,#9F1239 100%)',
          padding: '48px 40px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.18)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bus size={24} color="#fff" />
          </div>
          <div>
            <p style={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 20 }}>Tripio</p>
            <p style={{ color: '#FCA5A5', fontFamily: 'Inter', fontSize: 12 }}>Travel Booking Platform</p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h1 style={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 800, fontSize: 40, lineHeight: 1.2, marginBottom: 20 }}>
            Your Journey,<br /><span style={{ color: '#FDE68A' }}>Simplified.</span>
          </h1>
          <p style={{ color: '#FECACA', fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Book buses and flights with ease. Real-time tracking, instant confirmations, and the best prices.
          </p>
          {[
            { icon: Bus, label: 'Book Buses', desc: 'Across 1000+ routes' },
            { icon: Plane, label: 'Book Flights', desc: 'Best fares guaranteed' },
            { icon: Zap, label: 'Instant Confirm', desc: 'Real-time booking' },
          ].map((f) => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.icon size={20} color="#fff" />
              </div>
              <div>
                <p style={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 14 }}>{f.label}</p>
                <p style={{ color: '#FCA5A5', fontFamily: 'Inter', fontSize: 12 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: '#FCA5A5', fontFamily: 'Inter', fontSize: 12 }}>© 2025 BusFlight Technologies Pvt. Ltd.</p>
      </div>

      {/* ── RIGHT PANEL — Form ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#DC2626,#B91C1C)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}>
              <Bus size={22} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#111827' }}>BusFlight</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>Travel Booking Platform</p>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#111827' }}>Sign In</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 1.6 }}>
              Welcome back! Enter your credentials to continue.
            </p>
          </div>

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <p style={labelStyle}>Username</p>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <User size={16} color="#9CA3AF" />
              </div>
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors({}); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{ ...fieldStyle, paddingLeft: 42, borderColor: errors.username ? '#EF4444' : '#E5E7EB' }}
              />
            </div>
            {errors.username && <p style={errorStyle}>{errors.username}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <p style={labelStyle}>Password</p>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Lock size={16} color="#9CA3AF" />
              </div>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{ ...fieldStyle, paddingLeft: 42, paddingRight: 44, borderColor: errors.password ? '#EF4444' : '#E5E7EB' }}
              />
              <button
                onClick={() => setShowPw((p) => !p)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPw ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
              </button>
            </div>
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          {/* Submit */}
          <motion.button
            id="login-submit-btn"
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '15px', border: 'none', borderRadius: 14, cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#F87171' : 'linear-gradient(135deg,#DC2626,#B91C1C)',
              color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15,
              boxShadow: '0 4px 20px rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </motion.button>
          <p style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF' }}>
            By signing in, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8, display: 'block',
};
const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '13px 14px', border: '1.5px solid #E5E7EB', borderRadius: 12,
  fontSize: 14, fontFamily: 'Inter', background: '#fff', color: '#111827',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
};
const errorStyle: React.CSSProperties = {
  fontFamily: 'Inter', fontSize: 12, color: '#EF4444', marginTop: 6,
};
const codeStyle: React.CSSProperties = {
  fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#92400E',
  background: '#FEF3C7', padding: '2px 8px', borderRadius: 6,
};
