import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserHeader } from '../../../components/layout/UserHeader';
import { generateSeats } from '../../../data/buses';
import { Bus, BusSearch, Seat } from '../../../types';

export default function SeatSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, search } = location.state as { bus: Bus; search: BusSearch };

  const [seats, setSeats] = useState<Seat[]>([]);
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => { setSeats(generateSeats(bus.id, bus.price)); }, [bus]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'booked') return;
    const isSelected = !!selectedSeats.find((s) => s.id === seat.id);
    setSelectedSeats((p) => isSelected ? p.filter((s) => s.id !== seat.id) : [...p, seat]);
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    navigate('/bus/boarding', { state: { bus, search, selectedSeats } });
  };

  const currentDeck = seats.filter((s) => s.deck === activeDeck);
  const rows: Seat[][] = [];
  for (let i = 0; i < currentDeck.length; i += 4) rows.push(currentDeck.slice(i, i + 4));

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 90 }}>
      <UserHeader title="Select Seats" subtitle={`${bus.operatorName} · ${bus.busType}`} showBack />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box', width: '100%' }}>
        {/* Bus Info Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 20, alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Departure</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#111827' }}>{bus.departure}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{bus.from}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>{bus.duration}</p>
              <div style={{ height: 2, background: '#F1F5F9', borderRadius: 2 }} />
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#DC2626', fontWeight: 600, marginTop: 8 }}>{bus.busType}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Arrival</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#111827' }}>{bus.arrival}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>{bus.to}</p>
            </div>
          </div>
        </div>

        {/* Main grid: seat map + side info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'start', justifyContent: 'center' }}>
          {/* Seat Map */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', flex: '0 0 auto', minWidth: 280 }}>
            {/* Deck Toggle */}
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 12, padding: 4, gap: 4, marginBottom: 20 }}>
              {(['lower', 'upper'] as const).map((deck) => (
                <button key={deck} id={`deck-${deck}`} onClick={() => setActiveDeck(deck)} style={{ flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, background: activeDeck === deck ? '#fff' : 'transparent', color: activeDeck === deck ? '#DC2626' : '#6B7280', boxShadow: activeDeck === deck ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
                  {deck === 'lower' ? '🪑 Lower' : '🛏 Upper'}
                </button>
              ))}
            </div>

            {/* Driver label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F3F4F6', borderRadius: 10, padding: '8px 14px', width: 'fit-content', marginBottom: 18 }}>
              <span style={{ fontSize: 18 }}>🚌</span>
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, color: '#6B7280' }}>Driver</span>
            </div>

            {/* Seat Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  {row.slice(0, 2).map((seat) => <SeatBtn key={seat.id} seat={seat} isSelected={!!selectedSeats.find((s) => s.id === seat.id)} onClick={() => toggleSeat(seat)} />)}
                  <div style={{ width: 20 }} />
                  {row.slice(2, 4).map((seat) => <SeatBtn key={seat.id} seat={seat} isSelected={!!selectedSeats.find((s) => s.id === seat.id)} onClick={() => toggleSeat(seat)} />)}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '1 1 300px' }}>
            {/* Legend */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 16 }}>Seat Legend</p>
              {[
                { color: '#fff', border: '#D1D5DB', label: 'Available' },
                { color: '#E5E7EB', border: '#9CA3AF', label: 'Booked' },
                { color: '#10B981', border: '#059669', label: 'Selected' },
              ].map((l) => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: l.color, border: `2px solid ${l.border}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#374151' }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Price Info */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 12 }}>Fare Info</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280' }}>Base fare/seat</span>
                <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#111827' }}>₹{bus.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280' }}>Type</span>
                <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#111827' }}>{bus.busType} · {bus.isAC ? 'AC' : 'Non-AC'}</span>
              </div>
            </div>

            {/* Selected Summary */}
            {selectedSeats.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 20, padding: '18px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, color: '#065F46' }}>{selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#059669', marginTop: 4 }}>{selectedSeats.map((s) => s.number).join(', ')}</p>
                  </div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#065F46' }}>₹{totalPrice}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 24px', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.button id="seat-continue-btn" whileTap={{ scale: 0.98 }} onClick={handleContinue} disabled={selectedSeats.length === 0}
            style={{ width: '100%', padding: '15px', border: 'none', borderRadius: 14, background: selectedSeats.length === 0 ? '#F1F5F9' : 'linear-gradient(135deg,#DC2626,#B91C1C)', color: selectedSeats.length === 0 ? '#9CA3AF' : '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer', boxShadow: selectedSeats.length > 0 ? '0 4px 20px rgba(220,38,38,0.3)' : 'none' }}>
            {selectedSeats.length === 0 ? 'Select at least 1 seat' : `Continue · ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} · ₹${totalPrice}`}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function SeatBtn({ seat, isSelected, onClick }: { seat: Seat; isSelected: boolean; onClick: () => void }) {
  const booked = seat.status === 'booked';
  return (
    <motion.button whileTap={!booked ? { scale: 0.88 } : {}} onClick={onClick} id={`seat-${seat.number}`} disabled={booked} title={`Seat ${seat.number} · ₹${seat.price}`}
      style={{ width: 46, height: 46, borderRadius: 12, border: `2px solid ${booked ? '#D1D5DB' : isSelected ? '#059669' : '#E5E7EB'}`, background: booked ? '#E5E7EB' : isSelected ? '#10B981' : '#fff', color: booked ? '#9CA3AF' : isSelected ? '#fff' : '#374151', fontFamily: 'Poppins', fontWeight: 700, fontSize: 12, cursor: booked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
      {seat.number.replace(/[LU]/, '')}
    </motion.button>
  );
}
