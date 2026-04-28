import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock } from 'lucide-react';
import { UserHeader } from '../../../components/layout/UserHeader';
import { boardingPoints, droppingPoints } from '../../../data/boardingPoints';
import { Bus, BusSearch, BoardingPoint, Seat } from '../../../types';

const inp: React.CSSProperties = { width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 13, fontFamily: 'Inter', background: '#fff', color: '#111827', outline: 'none', boxSizing: 'border-box' };

export default function BoardingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bus, search, selectedSeats } = state as { bus: Bus; search: BusSearch; selectedSeats: Seat[] };

  const [bSearch, setBSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const localizedB = boardingPoints.map(p => ({
    ...p,
    name: p.name.includes('Chennai') || p.address.includes('Chennai') ? p.name : `${search.from} - ${p.name}`,
    address: p.address.replace('Chennai', search.from)
  }));
  const localizedD = droppingPoints.map(p => ({
    ...p,
    name: p.name.includes('Bangalore') || p.address.includes('Bangalore') ? p.name : `${search.to} - ${p.name}`,
    address: p.address.replace('Bangalore', search.to)
  }));

  const [selB, setSelB] = useState<BoardingPoint>(localizedB[0]);
  const [selD, setSelD] = useState<BoardingPoint>(localizedD[0]);

  const fB = localizedB.filter((p) => p.name.toLowerCase().includes(bSearch.toLowerCase()) || p.landmark.toLowerCase().includes(bSearch.toLowerCase()));
  const fD = localizedD.filter((p) => p.name.toLowerCase().includes(dSearch.toLowerCase()) || p.landmark.toLowerCase().includes(dSearch.toLowerCase()));

  const handleContinue = () => navigate('/bus/passenger', { state: { bus, search, selectedSeats, boardingPoint: selB, droppingPoint: selD } });

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 90 }}>
      <UserHeader title="Boarding & Dropping" subtitle="Select your pickup and drop points" showBack />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
          {/* Boarding */}
          <div style={{ flex: '1 1 300px', background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid #F3F4F6', background: '#FEF2F2' }}>
              <MapPin size={16} color="#DC2626" />
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>Boarding Point</p>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>{bus.from} · {selB.time}</p>
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input id="boarding-search" type="text" placeholder="Search boarding points..." value={bSearch} onChange={(e) => setBSearch(e.target.value)} style={inp} />
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fB.map((p) => <PointCard key={p.id} point={p} selected={selB.id === p.id} onSelect={() => setSelB(p)} id={`boarding-${p.id}`} />)}
              </div>
            </div>
          </div>

          {/* Dropping */}
          <div style={{ flex: '1 1 300px', background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid #F3F4F6', background: '#EFF6FF' }}>
              <MapPin size={16} color="#3B82F6" />
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>Dropping Point</p>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>{bus.to} · {selD.time}</p>
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input id="dropping-search" type="text" placeholder="Search dropping points..." value={dSearch} onChange={(e) => setDSearch(e.target.value)} style={inp} />
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fD.map((p) => <PointCard key={p.id} point={p} selected={selD.id === p.id} onSelect={() => setSelD(p)} id={`dropping-${p.id}`} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Journey Summary */}
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FEE2E2', borderRadius: 20, padding: '20px 24px' }}>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#DC2626', marginBottom: 16 }}>Journey Summary</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { icon: MapPin, color: '#DC2626', label: 'Board At', value: `${selB.name}`, sub: selB.time },
              { icon: MapPin, color: '#3B82F6', label: 'Drop At', value: `${selD.name}`, sub: selD.time },
              { icon: Clock, color: '#6B7280', label: 'Duration', value: bus.duration, sub: `${bus.from} → ${bus.to}` },
            ].map((r) => (
              <div key={r.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <r.icon size={16} color={r.color} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#B91C1C' }}>{r.label}</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827', marginTop: 2 }}>{r.value}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{r.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 24px', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.button id="boarding-continue-btn" whileTap={{ scale: 0.98 }} onClick={handleContinue}
            style={{ width: '100%', padding: '15px', border: 'none', borderRadius: 14, background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,0.3)' }}>
            Continue to Passenger Details →
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function PointCard({ point, selected, onSelect, id }: { point: BoardingPoint; selected: boolean; onSelect: () => void; id: string }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} onClick={onSelect} id={id}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 14, border: `2px solid ${selected ? '#DC2626' : '#F3F4F6'}`, background: selected ? '#FEF2F2' : '#FAFAFA', cursor: 'pointer', transition: 'all 0.15s' }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selected ? '#DC2626' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{point.name}</p>
        <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{point.landmark}</p>
      </div>
      <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: selected ? '#DC2626' : '#374151', flexShrink: 0 }}>{point.time}</p>
    </motion.div>
  );
}
