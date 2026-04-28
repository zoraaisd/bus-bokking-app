import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { UserHeader } from '../../../components/layout/UserHeader';
import { Bus, BusSearch, BoardingPoint, PassengerDetail, Seat } from '../../../types';
import { useAuthStore } from '../../../store/authStore';

const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
  borderRadius: 12, fontSize: 14, fontFamily: 'Inter', background: '#fff',
  color: '#111827', outline: 'none', boxSizing: 'border-box',
};
const errInp: React.CSSProperties = { ...inp, borderColor: '#EF4444' };
const lbl: React.CSSProperties = { fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 6, display: 'block' };

export default function PassengerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const { bus, search, selectedSeats, boardingPoint, droppingPoint } = location.state as {
    bus: Bus; search: BusSearch; selectedSeats: Seat[];
    boardingPoint: BoardingPoint; droppingPoint: BoardingPoint;
  };

  const [passengers, setPassengers] = useState<PassengerDetail[]>(
    selectedSeats.map((_, i) => ({
      name: i === 0 ? authUser?.name || '' : '',
      age: i === 0 ? 28 : 0,
      gender: 'male' as const,
      email: i === 0 ? authUser?.email || '' : '',
      phone: i === 0 ? authUser?.phone || '' : '',
    }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (idx: number, field: keyof PassengerDetail, value: string | number) => {
    setPassengers((prev) => { const a = [...prev]; a[idx] = { ...a[idx], [field]: value }; return a; });
    setErrors((prev) => { const c = { ...prev }; delete c[`${idx}-${field}`]; return c; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    passengers.forEach((p, i) => {
      if (!p.name.trim()) e[`${i}-name`] = 'Name required';
      if (!p.age || p.age < 1) e[`${i}-age`] = 'Valid age required';
      if (!p.email.trim() || !/^\S+@\S+\.\S+$/.test(p.email)) e[`${i}-email`] = 'Valid email required';
      if (!p.phone.trim() || p.phone.replace(/\D/g, '').length < 10) e[`${i}-phone`] = 'Valid phone required';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) { toast.error('Please fill all details correctly'); return; }
    navigate('/bus/payment', { state: { bus, search, selectedSeats, boardingPoint, droppingPoint, passengers } });
  };

  const totalAmount = selectedSeats.reduce((s, x) => s + x.price, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 90 }}>
      <Toaster position="top-center" />
      <UserHeader title="Passenger Details" subtitle={`${selectedSeats.length} passenger(s)`} showBack />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {passengers.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            {/* Card header */}
            <div style={{ background: i === 0 ? '#FEF2F2' : '#F9FAFB', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: i === 0 ? '#DC2626' : '#E5E7EB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#fff' : '#6B7280', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14 }}>{i + 1}</div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>Passenger {i + 1} · Seat {selectedSeats[i]?.number}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280', marginTop: 1 }}>{bus.from} → {bus.to}</p>
                </div>
              </div>
              {i === 0 && <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 11, fontFamily: 'Inter', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>Primary</span>}
            </div>

            {/* Fields */}
            <div style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Full Name</label>
                  <input id={`p${i}-name`} placeholder="As on government ID" value={p.name}
                    onChange={(e) => update(i, 'name', e.target.value)} style={errors[`${i}-name`] ? errInp : inp} />
                  {errors[`${i}-name`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-name`]}</p>}
                </div>
                <div>
                  <label style={lbl}>Age</label>
                  <input id={`p${i}-age`} type="number" placeholder="Your age" value={p.age || ''}
                    onChange={(e) => update(i, 'age', Number(e.target.value))} style={errors[`${i}-age`] ? errInp : inp} />
                  {errors[`${i}-age`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-age`]}</p>}
                </div>
                <div>
                  <label style={lbl}>Gender</label>
                  <select id={`p${i}-gender`} value={p.gender} onChange={(e) => update(i, 'gender', e.target.value as any)} style={inp}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Email Address</label>
                  <input id={`p${i}-email`} type="email" placeholder="ticket@email.com" value={p.email}
                    onChange={(e) => update(i, 'email', e.target.value)} style={errors[`${i}-email`] ? errInp : inp} />
                  {errors[`${i}-email`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-email`]}</p>}
                </div>
                <div>
                  <label style={lbl}>Mobile Number</label>
                  <input id={`p${i}-phone`} type="tel" placeholder="+91 9XXXXXXXXX" value={p.phone}
                    onChange={(e) => update(i, 'phone', e.target.value)} style={errors[`${i}-phone`] ? errInp : inp} />
                  {errors[`${i}-phone`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-phone`]}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Fare summary */}
        <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: 18, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#92400E' }}>{selectedSeats.length} Seat(s) × ₹{selectedSeats[0]?.price}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#B45309', marginTop: 3 }}>Taxes & fees included</p>
          </div>
          <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#92400E' }}>₹{totalAmount}</p>
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.button id="passenger-continue-btn" whileTap={{ scale: 0.98 }} onClick={handleContinue}
            style={{ width: '100%', padding: '15px', border: 'none', borderRadius: 14, background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,0.3)' }}>
            Proceed to Payment · ₹{totalAmount}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
