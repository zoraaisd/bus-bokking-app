import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bus, Plane, Search, Filter, CalendarDays, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { getPrimaryTraveller, getRouteLabel, getOperatorLabel, ADMIN_BOOKING_SEED } from '../../data/adminSeed';
import { Booking, BookingStatus } from '../../types';

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export default function AdminBookingsPage() {
  const bookings = ADMIN_BOOKING_SEED;
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [search, setSearch] = useState('');
  const [transportFilter, setTransportFilter] = useState<'all' | 'bus' | 'flight'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter(b => {
      const pax = getPrimaryTraveller(b);
      const route = getRouteLabel(b).toLowerCase();
      const operator = getOperatorLabel(b).toLowerCase();
      
      if (transportFilter !== 'all' && b.type !== transportFilter) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      
      if (!q) return true;
      return [pax.name, pax.email, b.bookingId, b.pnr, route, operator].some(v => v.toLowerCase().includes(q));
    });
  }, [bookings, search, transportFilter, statusFilter]);

  return (
    <AdminLayout title="All Bookings" subtitle={`Managing ${bookings.length} total bookings on the platform.`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Filters Area */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between' }}>
          
          <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : 400 }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search PNR, Traveller, Route..." 
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: 12, outline: 'none', fontFamily: 'Inter', fontSize: 14, color: '#0F172A', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
              {['all', 'bus', 'flight'].map(f => (
                <button key={f} onClick={() => setTransportFilter(f as any)} style={{ padding: '8px 16px', background: transportFilter === f ? '#fff' : 'transparent', color: transportFilter === f ? '#0F172A' : '#64748B', border: 'none', borderRadius: 8, fontFamily: 'Inter', fontWeight: 700, fontSize: 13, textTransform: 'capitalize', cursor: 'pointer', boxShadow: transportFilter === f ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
              {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
                <button key={f} onClick={() => setStatusFilter(f as any)} style={{ padding: '8px 16px', background: statusFilter === f ? '#fff' : 'transparent', color: statusFilter === f ? '#0F172A' : '#64748B', border: 'none', borderRadius: 8, fontFamily: 'Inter', fontWeight: 700, fontSize: 13, textTransform: 'capitalize', cursor: 'pointer', boxShadow: statusFilter === f ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        {filteredBookings.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: '#fff', borderRadius: 24, border: '1px dashed #CBD5E1' }}>
            <Filter size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>No bookings found</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#64748B', margin: '8px 0 0 0' }}>Try adjusting your filters or search terms.</p>
          </div>
        ) : isMobile ? (
          // Mobile Cards
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredBookings.map((b, i) => <BookingCard key={b.bookingId} booking={b} index={i} />)}
          </div>
        ) : (
          // Desktop Table
          <div style={{ background: '#fff', borderRadius: 24, padding: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  {['Booking Info', 'Traveller', 'Journey', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '16px 24px', fontFamily: 'Inter', fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b, i) => (
                  <BookingTableRow key={b.bookingId} booking={b} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

const getStatusColor = (status: BookingStatus) => {
  if (status === 'confirmed') return { bg: '#D1FAE5', text: '#059669', icon: CheckCircle2 };
  if (status === 'completed') return { bg: '#E0E7FF', text: '#4F46E5', icon: CheckCircle2 };
  return { bg: '#FEE2E2', text: '#DC2626', icon: XCircle };
};

function BookingTableRow({ booking, index }: { booking: Booking; index: number }) {
  const pax = getPrimaryTraveller(booking);
  const route = getRouteLabel(booking);
  const st = getStatusColor(booking.status);
  
  return (
    <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 > 1 ? 0 : index * 0.05 }} style={{ borderBottom: '1px solid #F1F5F9' }}>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: booking.type === 'bus' ? '#FFF7ED' : '#EFF6FF', color: booking.type === 'bus' ? '#EA580C' : '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {booking.type === 'bus' ? <Bus size={18} /> : <Plane size={18} />}
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>{booking.bookingId}</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>{booking.pnr}</span>
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{pax.name}</div>
        <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: '#64748B', marginTop: 2 }}>{pax.email}</div>
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{route}</div>
        <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <CalendarDays size={12} />
          {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </div>
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 15, color: '#0F172A' }}>{currencyFormatter.format(booking.finalAmount)}</div>
        {booking.discount > 0 && <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 10, color: '#10B981', marginTop: 2 }}>SAVED {currencyFormatter.format(booking.discount)}</div>}
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: st.bg, color: st.text, fontFamily: 'Inter', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          <st.icon size={14} />
          {booking.status}
        </div>
      </td>
      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
        <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 8 }}>
          <MoreHorizontal size={20} />
        </button>
      </td>
    </motion.tr>
  );
}

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  const pax = getPrimaryTraveller(booking);
  const route = getRouteLabel(booking);
  const st = getStatusColor(booking.status);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 > 1 ? 0 : index * 0.05 }}
      style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: booking.type === 'bus' ? '#FFF7ED' : '#EFF6FF', color: booking.type === 'bus' ? '#EA580C' : '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {booking.type === 'bus' ? <Bus size={18} /> : <Plane size={18} />}
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>{booking.bookingId}</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 11, color: '#64748B', marginTop: 2 }}>PNR: {booking.pnr}</div>
          </div>
        </div>
        <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 12, background: st.bg, color: st.text, fontFamily: 'Inter', fontWeight: 800, fontSize: 10, textTransform: 'uppercase' }}>
          {booking.status}
        </div>
      </div>

      <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748B', fontWeight: 600 }}>Traveller</span>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{pax.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748B', fontWeight: 600 }}>Route</span>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{route}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748B', fontWeight: 600 }}>Date</span>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Amount Paid</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 18, color: '#0F172A', fontWeight: 800 }}>{currencyFormatter.format(booking.finalAmount)}</div>
        </div>
        <button style={{ padding: '8px 16px', background: '#0F172A', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'Inter', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          Details
        </button>
      </div>
    </motion.div>
  );
}
