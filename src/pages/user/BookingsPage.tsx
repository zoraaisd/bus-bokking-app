import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Plane, ArrowRight, Calendar, PackageOpen } from 'lucide-react';
import { BottomNav } from '../../components/layout/BottomNav';
import { useBookingStore } from '../../store/bookingStore';
import { Booking } from '../../types';

type Tab = 'upcoming' | 'completed';

const S = {
  page: { minHeight: '100vh', background: '#F8F9FB', paddingBottom: 84 } as React.CSSProperties,
  header: { background: '#fff', borderBottom: '1px solid #F3F4F6', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' } as React.CSSProperties,
  headerInner: { maxWidth: 560, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center' } as React.CSSProperties,
  title: { fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' } as React.CSSProperties,
  container: { maxWidth: 560, margin: '0 auto', padding: '16px 16px 8px' } as React.CSSProperties,
};

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const bookings = useBookingStore((s) => s.bookings);
  const upcoming = bookings.filter((b) => b.status === 'confirmed');
  const completed = bookings.filter((b) => b.status === 'completed');
  const list = tab === 'upcoming' ? upcoming : completed;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <span style={S.title}>My Bookings</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6', padding: '12px 16px', position: 'sticky', top: 56, zIndex: 30 }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 12, padding: 4, maxWidth: 240, gap: 4 }}>
            {(['upcoming', 'completed'] as Tab[]).map((t) => (
              <button
                key={t}
                id={`bookings-tab-${t}`}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontFamily: 'Poppins', fontWeight: 600, fontSize: 13,
                  background: tab === t ? '#fff' : 'transparent',
                  color: tab === t ? '#DC2626' : '#6B7280',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'upcoming' && upcoming.length > 0 && (
                  <span style={{ marginLeft: 6, background: '#FEE2E2', color: '#DC2626', fontSize: 10, fontFamily: 'Inter', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>
                    {upcoming.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div style={S.container}>
        <AnimatePresence mode="wait">
          {list.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, textAlign: 'center' }}
            >
              <div style={{ width: 80, height: 80, background: '#F3F4F6', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <PackageOpen size={36} color="#D1D5DB" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#374151' }}>No {tab} bookings</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#9CA3AF', marginTop: 8, maxWidth: 220, lineHeight: 1.6 }}>
                {tab === 'upcoming' ? 'Book a bus or flight to see trips here.' : 'Completed trips will appear here.'}
              </p>
            </motion.div>
          ) : (
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {list.map((b, i) => (
                <motion.div key={b.bookingId} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <BookingCard booking={b} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const isBus = booking.type === 'bus';
  const from = isBus ? booking.bus.from : booking.flight.from;
  const to = isBus ? booking.bus.to : booking.flight.to;
  const dep = isBus ? booking.bus.departure : booking.flight.departure;
  const arr = isBus ? booking.bus.arrival : booking.flight.arrival;
  const operator = isBus ? booking.bus.operatorName : booking.flight.airline;
  const sub = isBus ? `${booking.bus.busType} · ${booking.bus.isAC ? 'AC' : 'Non-AC'}` : `${booking.flight.flightNumber} · ${booking.cabinClass}`;
  const travelDate = new Date(booking.travelDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{ background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}
    >
      {/* Top strip */}
      <div style={{ background: isBus ? '#FEF2F2' : '#EFF6FF', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isBus ? <Bus size={13} color="#DC2626" /> : <Plane size={13} color="#3B82F6" />}
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 11, color: isBus ? '#DC2626' : '#3B82F6', letterSpacing: '0.05em' }}>
            {isBus ? 'BUS' : 'FLIGHT'}
          </span>
        </div>
        <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, background: '#DCFCE7', color: '#16A34A', padding: '2px 10px', borderRadius: 20 }}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 16px 14px' }}>
        {/* Route */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#111827', lineHeight: 1 }}>{dep}</p>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#374151', marginTop: 3 }}>{from}</p>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <ArrowRight size={20} color="#D1D5DB" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#111827', lineHeight: 1 }}>{arr}</p>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#374151', marginTop: 3 }}>{to}</p>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ borderTop: '1px solid #F9FAFB', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <Calendar size={11} color="#9CA3AF" />
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>{travelDate}</span>
            </div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#374151' }}>{operator}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{sub}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: '#DC2626' }}>₹{booking.finalAmount.toLocaleString()}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              PNR: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#6B7280', letterSpacing: '0.1em' }}>{booking.pnr}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
