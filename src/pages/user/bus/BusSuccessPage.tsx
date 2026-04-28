import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, MapPin, Download, Home, ArrowRight } from 'lucide-react';
import { BusBooking } from '../../../types';

export default function BusSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = (location.state as { booking: BusBooking }) || {};

  if (!booking) return <Navigate to="/" replace />;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        style={{ width: 80, height: 80, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <CheckCircle2 size={40} color="#10B981" />
      </motion.div>

      <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#111827', marginBottom: 8, textAlign: 'center' }}>Booking Confirmed!</h1>
      <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B7280', marginBottom: 32, textAlign: 'center' }}>Your bus tickets have been successfully booked.</p>

      <div style={{ width: '100%', maxWidth: 600, background: '#fff', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
        <div style={{ background: '#DC2626', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#FCA5A5' }}>Booking ID</p>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 4 }}>{booking.bookingId}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#FCA5A5' }}>PNR</p>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 4 }}>{booking.pnr}</p>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, background: '#FEF2F2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24 }}>🚌</span>
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>{booking.bus.operatorName}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{booking.bus.busType} · {booking.seats.join(', ')}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 24, color: '#111827' }}>{booking.bus.departure}</p>
              <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#374151', marginTop: 4 }}>{booking.bus.from}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{new Date(booking.travelDate).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>{booking.bus.duration}</p>
              <ArrowRight size={20} color="#DC2626" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 24, color: '#111827' }}>{booking.bus.arrival}</p>
              <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#374151', marginTop: 4 }}>{booking.bus.to}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{new Date(booking.travelDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ height: 1, background: 'repeating-linear-gradient(to right, #E5E7EB 0, #E5E7EB 5px, transparent 5px, transparent 10px)', marginBottom: 24 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <MapPin size={18} color="#DC2626" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>Boarding Point</p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#111827', marginTop: 2 }}>{booking.boardingPoint.name}</p>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{booking.boardingPoint.time} · {booking.boardingPoint.landmark}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#F9FAFB', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6' }}>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B7280' }}>Total Paid</p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: '#111827' }}>₹{booking.finalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 32, width: '100%', maxWidth: 600 }}>
        <button onClick={() => {}} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 12, background: '#fff', border: '1.5px solid #E5E7EB', color: '#374151', fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          <Download size={18} /> Download Ticket
        </button>
        <button onClick={() => navigate('/')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 12, background: '#111827', border: 'none', color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          <Home size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
}
