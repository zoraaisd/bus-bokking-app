import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Luggage, Utensils, RotateCcw, Info } from 'lucide-react';
import { UserHeader } from '../../../components/layout/UserHeader';
import { Flight, FlightSearch } from '../../../types';
import { airlineColors } from '../../../data/flights';

const W: React.CSSProperties = { background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 };

export default function FlightReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, search } = location.state as { flight: Flight; search: FlightSearch };
  const color = airlineColors[flight.airline] || '#DC2626';
  const savings = flight.originalPrice - flight.price;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 100 }}>
      <UserHeader title="Flight Details" subtitle={`${flight.airline} · ${flight.flightNumber}`} showBack />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', boxSizing: 'border-box', width: '100%' }}>
        {/* Airline + Route Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={W}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 24px', borderBottom: '1px solid #F9FAFB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
                {flight.airline.charAt(0)}
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 17, color: '#111827' }}>{flight.airline}</p>
                <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{flight.flightNumber} · {flight.aircraft} · {flight.cabinClass}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24, color: '#DC2626' }}>₹{flight.price.toLocaleString()}</p>
              {savings > 0 && <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', textDecoration: 'line-through' }}>₹{flight.originalPrice.toLocaleString()}</p>}
              {savings > 0 && <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#16A34A', fontWeight: 600 }}>Save ₹{savings.toLocaleString()}</p>}
            </div>
          </div>

          {/* Route */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center', padding: '24px 24px' }}>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 34, color: '#111827', lineHeight: 1 }}>{flight.departure}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#374151', marginTop: 4 }}>{flight.fromCode}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{flight.from}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Terminal {flight.terminal.departure}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>{flight.duration}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 2, background: '#F1F5F9' }} />
                <Plane size={18} color="#DC2626" style={{ transform: 'rotate(90deg)' }} />
                <div style={{ flex: 1, height: 2, background: '#F1F5F9' }} />
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#16A34A', fontWeight: 600, marginTop: 8 }}>
                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 34, color: '#111827', lineHeight: 1 }}>{flight.arrival}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#374151', marginTop: 4 }}>{flight.toCode}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{flight.to}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Terminal {flight.terminal.arrival}</p>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 24px 20px' }}>
            {flight.tags.map((t) => (
              <span key={t} style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, background: '#F0FDF4', color: '#16A34A', padding: '4px 12px', borderRadius: 20 }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* 2-col info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Baggage */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={W}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid #F9FAFB' }}>
              <Luggage size={16} color="#DC2626" />
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>Baggage Allowance</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 20 }}>
              {[
                { icon: '🧳', label: 'Check-in', val: `${flight.baggageIncluded} kg` },
                { icon: '👜', label: 'Cabin', val: `${flight.handBaggage} kg` },
              ].map((b) => (
                <div key={b.label} style={{ background: '#F9FAFB', borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: 28 }}>{b.icon}</span>
                  <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>{b.label} Baggage</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: '#111827', marginTop: 2 }}>{b.val}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF' }}>Per passenger</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={W}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F9FAFB' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>Amenities & Info</p>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: <Utensils size={15} color={flight.meal ? '#F97316' : '#D1D5DB'} />, label: 'In-flight Meal', ok: flight.meal },
                { icon: <RotateCcw size={15} color={flight.refundable ? '#3B82F6' : '#D1D5DB'} />, label: 'Refundable Ticket', ok: flight.refundable },
                { icon: <Info size={15} color="#8B5CF6" />, label: `Dep. Terminal ${flight.terminal.departure}`, ok: true },
                { icon: <Info size={15} color="#10B981" />, label: `Arr. Terminal ${flight.terminal.arrival}`, ok: true },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {a.icon}
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: a.ok ? '#374151' : '#9CA3AF', textDecoration: a.ok ? 'none' : 'line-through' }}>{a.label}</span>
                  {a.ok && <span style={{ marginLeft: 'auto', fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#16A34A' }}>✓</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Seats left */}
        <div style={{ background: flight.seatsLeft <= 5 ? '#FEF2F2' : '#EFF6FF', border: `1.5px solid ${flight.seatsLeft <= 5 ? '#FEE2E2' : '#DBEAFE'}`, borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Info size={15} color={flight.seatsLeft <= 5 ? '#DC2626' : '#3B82F6'} />
          <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: flight.seatsLeft <= 5 ? '#B91C1C' : '#1D4ED8' }}>
            {flight.seatsLeft <= 5 ? `⚠️ Only ${flight.seatsLeft} seats left! Book now.` : `${flight.seatsLeft} seats available in ${flight.cabinClass}`}
          </p>
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 24px', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ flexShrink: 0 }}>
            <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24, color: '#DC2626' }}>₹{flight.price.toLocaleString()}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF' }}>per traveller</p>
          </div>
          <motion.button id="flight-review-continue-btn" whileTap={{ scale: 0.98 }} onClick={() => navigate('/flight/traveller', { state: { flight, search } })}
            style={{ flex: 1, padding: '15px', border: 'none', borderRadius: 14, background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
            Continue to Traveller Details →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
