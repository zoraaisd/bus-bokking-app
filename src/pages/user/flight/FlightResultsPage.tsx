import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Utensils } from 'lucide-react';
import { UserHeader } from '../../../components/layout/UserHeader';
import { mockFlights, airlineColors } from '../../../data/flights';
import { Flight, FlightSearch } from '../../../types';

type Sort = 'price' | 'duration' | 'departure';

const card: React.CSSProperties = { background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 14 };

export default function FlightResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const search = (location.state as FlightSearch) || { from: 'Chennai', fromCode: 'MAA', to: 'Mumbai', toCode: 'BOM', date: '', travellers: 1, cabinClass: 'Economy' };

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filtered, setFiltered] = useState<Flight[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState<Sort>('price');
  const [fMeal, setFMeal] = useState(false);
  const [fRefund, setFRefund] = useState(false);
  const [fPrice, setFPrice] = useState(10000);
  const [fAirlines, setFAirlines] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      const localizedFlights = mockFlights.map(f => ({
        ...f,
        from: search.from,
        fromCode: search.fromCode,
        to: search.to,
        toCode: search.toCode
      }));
      setFlights(localizedFlights);
      setLoading(false);
    }, 800);
  }, [search.from, search.fromCode, search.to, search.toCode]);

  useEffect(() => {
    let r = [...flights];
    if (fMeal) r = r.filter((f) => f.meal);
    if (fRefund) r = r.filter((f) => f.refundable);
    r = r.filter((f) => f.price <= fPrice);
    if (fAirlines.length > 0) r = r.filter((f) => fAirlines.includes(f.airline));
    if (sort === 'price') r.sort((a, b) => a.price - b.price);
    else if (sort === 'duration') r.sort((a, b) => a.duration.localeCompare(b.duration));
    else r.sort((a, b) => a.departure.localeCompare(b.departure));
    setFiltered(r);
  }, [flights, fMeal, fRefund, fPrice, fAirlines, sort]);

  const airlines = [...new Set(mockFlights.map((f) => f.airline))];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB' }}>
      <UserHeader title={`${search.from} → ${search.to}`} subtitle={`${search.travellers || 1} Adult · ${search.cabinClass || 'Economy'}`} showBack />

      {/* Sort Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6', position: 'sticky', top: 56, zIndex: 30, padding: '10px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto' }}>
          <button onClick={() => setShowFilter(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${fMeal || fRefund || fPrice < 10000 || fAirlines.length > 0 ? '#DC2626' : '#E5E7EB'}`, background: fMeal || fRefund || fPrice < 10000 || fAirlines.length > 0 ? '#DC2626' : '#fff', color: fMeal || fRefund || fPrice < 10000 || fAirlines.length > 0 ? '#fff' : '#374151', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <SlidersHorizontal size={13} /> Filters
          </button>
          {(['price', 'duration', 'departure'] as Sort[]).map((s) => (
            <button key={s} onClick={() => setSort(s)} style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${sort === s ? '#DC2626' : '#E5E7EB'}`, background: sort === s ? '#FEF2F2' : '#fff', color: sort === s ? '#DC2626' : '#374151', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {s === 'price' ? 'Cheapest' : s === 'duration' ? 'Duration' : 'Departure'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 40px', boxSizing: 'border-box', width: '100%' }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ ...card, height: 120, background: 'linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)' }} />)
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✈️</div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#374151' }}>No flights found</p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginBottom: 14 }}>{filtered.length} flights found</p>
            {filtered.map((f, i) => {
              const color = airlineColors[f.airline] || '#DC2626';
              const savings = f.originalPrice - f.price;
              return (
                <motion.div key={f.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }} style={card}>
                  {/* Airline + Price Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', padding: '18px 22px 14px', borderBottom: '1px solid #F9FAFB' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Poppins', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                      {f.airline.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>{f.airline}</p>
                      <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{f.flightNumber} · {f.aircraft}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#DC2626' }}>₹{f.price.toLocaleString()}</p>
                      {savings > 0 && <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#16A34A', marginTop: 2 }}>Save ₹{savings.toLocaleString()}</p>}
                    </div>
                  </div>

                  {/* Route + CTA */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 16, alignItems: 'center', padding: '16px 22px' }}>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 26, color: '#111827' }}>{f.departure}</p>
                      <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#6B7280', marginTop: 2 }}>{f.fromCode}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>{f.duration}</p>
                      <div style={{ height: 2, background: '#F1F5F9', borderRadius: 2, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 6, height: 6, background: '#3B82F6', borderRadius: '50%' }} />
                      </div>
                      <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#16A34A', fontWeight: 600, marginTop: 5 }}>Non-stop</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 26, color: '#111827' }}>{f.arrival}</p>
                      <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#6B7280', marginTop: 2 }}>{f.toCode}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      {f.meal && <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFF7ED', color: '#C2410C', fontSize: 11, fontFamily: 'Inter', fontWeight: 600, padding: '3px 9px', borderRadius: 10 }}><Utensils size={10} /> Meal</span>}
                      {f.refundable && <span style={{ background: '#F0FDF4', color: '#16A34A', fontSize: 11, fontFamily: 'Inter', fontWeight: 600, padding: '3px 9px', borderRadius: 10 }}>Refundable</span>}
                      <motion.button
                        id={`book-flight-${f.id}`}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/flight/review', { state: { flight: f, search } })}
                        style={{ padding: '10px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                      >
                        Book
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16 }}>Filters</p>
                <button onClick={() => setShowFilter(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 14 }}>Amenities</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <FToggle label="Includes Meal" checked={fMeal} onChange={setFMeal} />
                    <FToggle label="Refundable" checked={fRefund} onChange={setFRefund} />
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 14 }}>Airlines</p>
                  {airlines.map((a) => (
                    <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                      <input type="checkbox" checked={fAirlines.includes(a)} onChange={(e) => setFAirlines((p) => e.target.checked ? [...p, a] : p.filter((x) => x !== a))} style={{ accentColor: '#DC2626', width: 16, height: 16 }} />
                      <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#374151' }}>{a}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#374151' }}>Max Price</p>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#DC2626' }}>₹{fPrice.toLocaleString()}</p>
                  </div>
                  <input type="range" min={2000} max={10000} step={200} value={fPrice} onChange={(e) => setFPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#DC2626' }} />
                </div>
                <button onClick={() => setShowFilter(false)} style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
      <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#374151' }}>{label}</span>
      <div style={{ position: 'relative' }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <div style={{ width: 42, height: 22, borderRadius: 11, background: checked ? '#DC2626' : '#E5E7EB', transition: 'background 0.2s', cursor: 'pointer' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', margin: '2px', transition: 'transform 0.2s', transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
        </div>
      </div>
    </label>
  );
}
