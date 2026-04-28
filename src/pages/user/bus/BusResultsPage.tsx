import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Star } from 'lucide-react';
import { UserHeader } from '../../../components/layout/UserHeader';
import { mockBuses } from '../../../data/buses';
import { Bus, BusSearch } from '../../../types';

type Sort = 'price_asc' | 'price_desc' | 'rating' | 'departure';

const card: React.CSSProperties = { background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 14 };

export default function BusResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const search = (location.state as BusSearch) || { from: 'Chennai', to: 'Bangalore', date: '' };

  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filtered, setFiltered] = useState<Bus[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState<Sort>('price_asc');
  const [fAC, setFAC] = useState(false);
  const [fSleeper, setFSleeper] = useState(false);
  const [fRating, setFRating] = useState(0);
  const [fPrice, setFPrice] = useState(2000);

  useEffect(() => {
    setTimeout(() => {
      const localizedBuses = mockBuses.map(b => ({
        ...b,
        from: search.from,
        to: search.to
      }));
      setBuses(localizedBuses);
      setLoading(false);
    }, 900);
  }, [search.from, search.to]);

  useEffect(() => {
    let r = [...buses];
    if (fAC) r = r.filter((b) => b.isAC);
    if (fSleeper) r = r.filter((b) => b.busType === 'Sleeper');
    if (fRating > 0) r = r.filter((b) => b.rating >= fRating);
    r = r.filter((b) => b.price <= fPrice);
    if (sort === 'price_asc') r.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') r.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') r.sort((a, b) => b.rating - a.rating);
    else r.sort((a, b) => a.departure.localeCompare(b.departure));
    setFiltered(r);
  }, [buses, fAC, fSleeper, fRating, fPrice, sort]);

  const dateLabel = search.date ? new Date(search.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '';
  const sortBtns: { label: string; v: Sort }[] = [
    { label: 'Cheapest', v: 'price_asc' }, { label: 'Top Rated', v: 'rating' },
    { label: 'Departure', v: 'departure' }, { label: 'Expensive', v: 'price_desc' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB' }}>
      <UserHeader title={`${search.from} → ${search.to}`} subtitle={dateLabel} showBack />

      {/* Sort Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6', position: 'sticky', top: 56, zIndex: 30, padding: '10px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto' }}>
          <button onClick={() => setShowFilter(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${fAC || fSleeper || fRating > 0 || fPrice < 2000 ? '#DC2626' : '#E5E7EB'}`, background: fAC || fSleeper || fRating > 0 || fPrice < 2000 ? '#DC2626' : '#fff', color: fAC || fSleeper || fRating > 0 || fPrice < 2000 ? '#fff' : '#374151', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <SlidersHorizontal size={13} /> Filters
          </button>
          {sortBtns.map((s) => (
            <button key={s.v} onClick={() => setSort(s.v)} style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${sort === s.v ? '#DC2626' : '#E5E7EB'}`, background: sort === s.v ? '#FEF2F2' : '#fff', color: sort === s.v ? '#DC2626' : '#374151', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 40px', boxSizing: 'border-box', width: '100%' }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ ...card, height: 140, background: 'linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.6s infinite' }} />
          ))
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🚌</div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#374151' }}>No buses found</p>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#9CA3AF', marginTop: 6 }}>Try adjusting your filters</p>
            <button onClick={() => { setFAC(false); setFSleeper(false); setFRating(0); setFPrice(2000); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, border: '1.5px solid #DC2626', background: '#fff', color: '#DC2626', fontFamily: 'Poppins', fontWeight: 600, cursor: 'pointer' }}>Reset Filters</button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginBottom: 14 }}>{filtered.length} buses found</p>
            {filtered.map((bus, i) => (
              <motion.div key={bus.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }} style={card}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '18px 20px 14px', borderBottom: '1px solid #F9FAFB' }}>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>{bus.operatorName}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 3 }}>{bus.busName} · {bus.busType} · {bus.isAC ? 'AC' : 'Non-AC'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#DC2626' }}>₹{bus.price}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF' }}>per seat</p>
                  </div>
                </div>

                {/* Route */}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', padding: '16px 20px' }}>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24, color: '#111827' }}>{bus.departure}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{bus.from}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>{bus.duration}</p>
                    <div style={{ height: 2, background: '#F1F5F9', borderRadius: 2, position: 'relative' }}>
                      <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, background: '#DC2626', borderRadius: '50%' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24, color: '#111827' }}>{bus.arrival}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{bus.to}</p>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #F9FAFB', background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFF7ED', padding: '3px 10px', borderRadius: 20 }}>
                      <Star size={12} color="#F97316" fill="#F97316" />
                      <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12, color: '#C2410C' }}>{bus.rating}</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF' }}>({bus.totalRatings.toLocaleString()})</span>
                    </div>
                    {bus.tags.slice(0, 3).map((tag) => (
                      <span key={tag} style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, background: '#F0FDF4', color: '#16A34A', padding: '2px 8px', borderRadius: 10 }}>{tag}</span>
                    ))}
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: bus.seatsAvailable <= 5 ? '#DC2626' : '#16A34A', fontWeight: 600 }}>
                      {bus.seatsAvailable} seats left
                    </span>
                  </div>
                  <motion.button
                    id={`select-bus-${bus.id}`}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/bus/seats', { state: { bus, search } })}
                    style={{ padding: '10px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    View Seats
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilter(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50 }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 320, background: '#fff', zIndex: 51, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>Filters</p>
                <button onClick={() => setShowFilter(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 14 }}>Bus Type</p>
                  <Toggle label="AC Buses Only" checked={fAC} onChange={setFAC} />
                  <div style={{ marginTop: 10 }}><Toggle label="Sleeper Only" checked={fSleeper} onChange={setFSleeper} /></div>
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 14 }}>Min Rating</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {[0, 3.5, 4.0, 4.5].map((r) => (
                      <button key={r} onClick={() => setFRating(r)} style={{ padding: '8px 4px', borderRadius: 10, border: `1.5px solid ${fRating === r ? '#F97316' : '#E5E7EB'}`, background: fRating === r ? '#FFF7ED' : '#fff', color: fRating === r ? '#C2410C' : '#6B7280', fontFamily: 'Inter', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>{r === 0 ? 'All' : `${r}+`}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#374151' }}>Max Price</p>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#DC2626' }}>₹{fPrice}</p>
                  </div>
                  <input type="range" min={300} max={2000} step={50} value={fPrice} onChange={(e) => setFPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#DC2626' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF' }}>₹300</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF' }}>₹2000</span>
                  </div>
                </div>
                <button onClick={() => setShowFilter(false)} style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Apply Filters</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
      <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#374151' }}>{label}</span>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <div style={{ width: 42, height: 22, borderRadius: 11, background: checked ? '#DC2626' : '#E5E7EB', transition: 'background 0.2s', cursor: 'pointer' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', margin: '2px', transition: 'transform 0.2s', transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
        </div>
      </div>
    </label>
  );
}
