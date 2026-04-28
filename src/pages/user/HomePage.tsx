import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Search, Shield, Clock, HeadphonesIcon, Star, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { BottomNav } from '../../components/layout/BottomNav';
import { offers, cities, flightCities } from '../../data/offers';
import { BusSearch, FlightSearch } from '../../types';

type Tab = 'bus' | 'flight';
const today = new Date().toISOString().split('T')[0];
const W = '100%';
const offerBgs = [
  'linear-gradient(135deg,#DC2626,#E11D48)',
  'linear-gradient(135deg,#F97316,#F59E0B)',
  'linear-gradient(135deg,#7C3AED,#6D28D9)',
  'linear-gradient(135deg,#059669,#0D9488)',
];

/* ─── Shared styles ─────────────────────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: W, padding: '12px 14px', border: '1.5px solid #E5E7EB',
  borderRadius: 12, fontSize: 14, fontFamily: 'Inter', fontWeight: 500,
  background: '#fff', color: '#111827', outline: 'none', boxSizing: 'border-box',
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>('bus');
  const [oi, setOi] = useState(0);
  const [busS, setBusS] = useState<BusSearch>({ from: 'Chennai', to: 'Bangalore', date: today });
  const [flyS, setFlyS] = useState<FlightSearch>({ from: 'Chennai', fromCode: 'MAA', to: 'Mumbai', toCode: 'BOM', date: today, travellers: 1, cabinClass: 'Economy' });
  const [showPax, setShowPax] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setOi((i) => (i + 1) % offers.length), 3500);
    return () => clearInterval(t);
  }, []);

  const g = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 80 }}>
      <Toaster position="top-center" />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,#DC2626 0%,#B91C1C 55%,#9F1239 100%)', padding: '36px 24px 100px', width: W, boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <p style={{ color: '#FCA5A5', fontSize: 13, fontFamily: 'Inter' }}>{g}</p>
              <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, fontFamily: 'Poppins', margin: '4px 0' }}>
                {user?.name?.split(' ')[0] || 'Traveller'} 👋
              </h1>
              <p style={{ color: '#FECACA', fontSize: 14, fontFamily: 'Inter' }}>Where are you heading today?</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { v: '50K+', l: 'Trips Booked' },
                { v: '200+', l: 'Routes' },
                { v: '4.8★', l: 'Avg Rating' },
              ].map((s) => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '10px 16px', textAlign: 'center', minWidth: 72 }}>
                  <p style={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 16 }}>{s.v}</p>
                  <p style={{ color: '#FCA5A5', fontFamily: 'Inter', fontSize: 11 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 0 }}>
            {(['bus', 'flight'] as Tab[]).map((t) => (
              <button key={t} id={`tab-${t}`} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#DC2626' : '#fff', transition: 'all 0.2s' }}>
                {t === 'bus' ? '🚌' : '✈️'} {t === 'bus' ? 'Bus' : 'Flight'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH CARD ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '-72px auto 0', padding: '0 24px', boxSizing: 'border-box', width: W }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.13)', padding: 24 }}>
          <AnimatePresence mode="wait">
            {tab === 'bus' ? (
              <motion.div key="bus" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end' }}>
                  <div style={{ flex: '1 1 160px' }}>
                    <Lbl>From</Lbl>
                    <select value={busS.from} onChange={(e) => setBusS((p) => ({ ...p, from: e.target.value }))} id="bus-from" style={inp}>
                      {cities.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <motion.button whileTap={{ rotate: 180, scale: 0.85 }} onClick={() => setBusS((p) => ({ ...p, from: p.to, to: p.from }))} id="bus-swap" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 0 }}>
                    <ArrowLeftRight size={15} color="#6B7280" />
                  </motion.button>
                  <div style={{ flex: '1 1 160px' }}>
                    <Lbl>To</Lbl>
                    <select value={busS.to} onChange={(e) => setBusS((p) => ({ ...p, to: e.target.value }))} id="bus-to" style={inp}>
                      {cities.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 160px' }}>
                    <Lbl>Travel Date</Lbl>
                    <input id="bus-date" type="date" min={today} value={busS.date} onChange={(e) => setBusS((p) => ({ ...p, date: e.target.value }))} style={inp} />
                  </div>
                  <SBtn id="bus-search-btn" label="Search Buses" onClick={() => { if (busS.from === busS.to) { toast.error('Same city!'); return; } navigate('/bus/results', { state: busS }); }} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="flight" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end' }}>
                  <div style={{ flex: '1 1 140px' }}>
                    <Lbl>From</Lbl>
                    <select value={flyS.from} id="flight-from" onChange={(e) => { const o = flightCities.find((x) => x.city === e.target.value); if (o) setFlyS((p) => ({ ...p, from: o.city, fromCode: o.code })); }} style={inp}>
                      {flightCities.map((o) => <option key={o.code} value={o.city}>{o.city} ({o.code})</option>)}
                    </select>
                  </div>
                  <motion.button whileTap={{ rotate: 180, scale: 0.85 }} onClick={() => setFlyS((p) => ({ ...p, from: p.to, fromCode: p.toCode, to: p.from, toCode: p.fromCode }))} id="flight-swap" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ArrowLeftRight size={15} color="#6B7280" />
                  </motion.button>
                  <div style={{ flex: '1 1 140px' }}>
                    <Lbl>To</Lbl>
                    <select value={flyS.to} id="flight-to" onChange={(e) => { const o = flightCities.find((x) => x.city === e.target.value); if (o) setFlyS((p) => ({ ...p, to: o.city, toCode: o.code })); }} style={inp}>
                      {flightCities.map((o) => <option key={o.code} value={o.city}>{o.city} ({o.code})</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <Lbl>Date</Lbl>
                    <input type="date" min={today} value={flyS.date} onChange={(e) => setFlyS((p) => ({ ...p, date: e.target.value }))} style={inp} />
                  </div>
                  <div style={{ position: 'relative', flex: '1 1 180px' }}>
                    <Lbl>Travellers & Class</Lbl>
                    <div onClick={() => setShowPax(true)} style={{ ...inp, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{flyS.travellers} Traveller(s) · {flyS.cabinClass}</span>
                    </div>
                  </div>
                  <SBtn id="flight-search-btn" label="Search Flights" onClick={() => navigate('/flight/results', { state: flyS })} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── PAX MODAL ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPax && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '20px', borderBottom: '1px solid #F3F4F6' }}>
                <button onClick={() => setShowPax(false)} style={{ position: 'absolute', left: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <ChevronRight size={20} color="#111827" style={{ transform: 'rotate(180deg)' }} />
                </button>
                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 16, color: '#111827' }}>Travellers & Class</p>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 20px', overflowY: 'auto', flex: 1 }}>
                
                {/* Adults */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: '#111827' }}>Adults</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>12 yrs or above</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <NumPill key={n} n={n} sel={adults === n} onClick={() => setAdults(n)} />
                    ))}
                  </div>
                </div>

                {/* Children */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: '#111827' }}>Children</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>2 - 12 yrs</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <NumPill key={n} n={n} sel={children === n} onClick={() => setChildren(n)} />
                    ))}
                  </div>
                </div>

                {/* Infants */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: '#111827' }}>Infants</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>0 - 2 yrs</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <NumPill key={n} n={n} sel={infants === n} onClick={() => { if (n <= adults) setInfants(n); else toast.error('Infants cannot exceed adults'); }} />
                    ))}
                  </div>
                </div>

                {/* Group Booking Info */}
                <div style={{ background: '#F3F4F6', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                  <div style={{ flexShrink: 0 }}><Shield size={18} color="#4B5563" /></div>
                  <div>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#374151' }}>Planning a trip for <b>more than 9 travellers?</b></p>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#EF4444', textDecoration: 'underline', cursor: 'pointer', marginTop: 2 }}>Create Group Booking</p>
                  </div>
                </div>

                {/* Class */}
                <div>
                  <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#111827', marginBottom: 12 }}>Class</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {['Economy', 'Premium Economy', 'Business'].map((c) => (
                      <ClassPill key={c} label={c} sel={flyS.cabinClass === c} onClick={() => setFlyS((p) => ({ ...p, cabinClass: c as any }))} />
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#111827' }}>{adults + children + infants} Traveller(s) · {flyS.cabinClass}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>{flyS.fromCode} - {flyS.toCode} · {new Date(flyS.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
                <button onClick={() => { setFlyS((p) => ({ ...p, travellers: adults + children + infants })); setShowPax(false); }}
                  style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OFFERS ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 24px', boxSizing: 'border-box', width: W }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#111827' }}>Offers & Deals</h2>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#DC2626', fontWeight: 600, cursor: 'pointer' }}>View all</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
          {offers.map((o, i) => (
            <div key={o.id} style={{ background: offerBgs[i % offerBgs.length], borderRadius: 20, padding: '20px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{o.icon}</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 11, fontFamily: 'Inter', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{o.code}</span>
              </div>
              <p style={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15 }}>{o.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter', fontSize: 12, marginTop: 4 }}>{o.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', fontSize: 11 }}>Min ₹{o.minAmount}</span>
                <span style={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 900, fontSize: 24 }}>
                  {o.type === 'flat' ? `₹${o.discount}` : `${o.discount}%`} <span style={{ fontSize: 13, fontWeight: 600 }}>OFF</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── POPULAR ROUTES ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 24px', boxSizing: 'border-box', width: W }}>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 14 }}>Popular Routes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
          {[
            { from:'Chennai',to:'Bangalore',icon:'🚌',price:349,dur:'8h',type:'bus'},
            { from:'Chennai',to:'Mumbai',icon:'✈️',price:3299,dur:'2h 10m',type:'flight'},
            { from:'Chennai',to:'Hyderabad',icon:'✈️',price:2499,dur:'1h 30m',type:'flight'},
            { from:'Chennai',to:'Coimbatore',icon:'🚌',price:299,dur:'5h',type:'bus'},
            { from:'Bangalore',to:'Pune',icon:'🚌',price:799,dur:'12h',type:'bus'},
            { from:'Mumbai',to:'Goa',icon:'✈️',price:2899,dur:'55m',type:'flight'},
            { from:'Delhi',to:'Jaipur',icon:'🚌',price:499,dur:'6h',type:'bus'},
            { from:'Hyderabad',to:'Chennai',icon:'✈️',price:3199,dur:'1h 20m',type:'flight'},
          ].map((r, i) => (
            <motion.div key={i} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(220,38,38,0.12)' }} whileTap={{ scale: 0.97 }}
              onClick={() => r.type === 'bus'
                ? navigate('/bus/results', { state: { from: r.from, to: r.to, date: today } })
                : navigate('/flight/results', { state: { from: r.from, fromCode: 'MAA', to: r.to, toCode: 'BOM', date: today, travellers: 1, cabinClass: 'Economy' } })}
              style={{ background: '#fff', borderRadius: 18, padding: '18px 16px', border: '1px solid #F3F4F6', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{r.icon}</span>
                <ChevronRight size={16} color="#D1D5DB" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#1F2937', lineHeight: 1.4 }}>{r.from} → {r.to}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', margin: '4px 0 8px' }}>{r.dur} · {r.type === 'bus' ? 'Bus' : 'Flight'}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, color: '#DC2626' }}>from ₹{r.price.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── WHY CHOOSE US ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 24px', boxSizing: 'border-box', width: W }}>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 6 }}>Why Choose BusFlight?</h2>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B7280', marginBottom: 20 }}>Trusted by millions of travelers across India</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {[
            { icon: Shield, color: '#3B82F6', bg: '#EFF6FF', title: '100% Secure', desc: 'SSL encrypted payments with RazorPay & Paytm' },
            { icon: Clock, color: '#F97316', bg: '#FFF7ED', title: 'Instant Booking', desc: 'Confirm tickets in under 30 seconds' },
            { icon: HeadphonesIcon, color: '#8B5CF6', bg: '#F5F3FF', title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
            { icon: Star, color: '#EAB308', bg: '#FEFCE8', title: 'Best Prices', desc: 'Price match guarantee on all routes' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 20, padding: 22, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 48, height: 48, background: f.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <f.icon size={22} color={f.color} />
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 24px', boxSizing: 'border-box', width: W }}>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 20 }}>What Travelers Say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {[
            { name:'Priya Nair', loc:'Chennai → Bangalore', txt:'Super smooth booking! Got my seats in seconds. The sleeper bus was amazing value.', stars: 5 },
            { name:'Rahul Mehta', loc:'Mumbai → Delhi', txt:'Business class flight at an unbeatable price. Will always use BusFlight!', stars: 5 },
            { name:'Sneha Reddy', loc:'Hyderabad → Goa', txt:'Booked 3 tickets at once, no hassle. The family group booking feature is great.', stars: 4 },
          ].map((t) => (
            <div key={t.name} style={{ background: '#fff', borderRadius: 20, padding: 22, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={14} color="#EAB308" fill="#EAB308" />)}
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.txt}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#DC2626,#B91C1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15 }}>{t.name[0]}</div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#111827' }}>{t.name}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF' }}>{t.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 24px', boxSizing: 'border-box', width: W }}>
        <div style={{ background: 'linear-gradient(135deg,#1E1B4B,#312E81)', borderRadius: 24, padding: '36px 32px' }}>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 8 }}>How It Works</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#C7D2FE', marginBottom: 28 }}>Book in 3 simple steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { n: '1', title: 'Search', desc: 'Enter your origin, destination and travel date. Choose bus or flight.' },
              { n: '2', title: 'Select & Pay', desc: 'Pick your preferred seat, apply offers, and pay securely in seconds.' },
              { n: '3', title: 'Travel Happy', desc: 'Get instant e-ticket confirmation on your phone. Just board and go!' },
            ].map((s) => (
              <div key={s.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 800, fontSize: 18, color: '#A5B4FC', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>{s.title}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#C7D2FE', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 6 }}>{children}</p>;
}
function SBtn({ id, label, onClick }: { id: string; label: string; onClick: () => void }) {
  return (
    <motion.button id={id} whileTap={{ scale: 0.97 }} onClick={onClick}
      style={{ padding: '12px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}>
      <Search size={16} />{label}
    </motion.button>
  );
}

function NumPill({ n, sel, onClick }: { n: number; sel: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? '#EF4444' : 'transparent', color: sel ? '#fff' : '#374151', fontFamily: 'Inter', fontWeight: sel ? 600 : 400, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}>
      {n}
    </div>
  );
}

function ClassPill({ label, sel, onClick }: { label: string; sel: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ padding: '10px 18px', borderRadius: 24, border: `1px solid ${sel ? '#EF4444' : '#E5E7EB'}`, background: sel ? '#EF4444' : '#fff', color: sel ? '#fff' : '#374151', fontFamily: 'Inter', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
      {label}
    </div>
  );
}
