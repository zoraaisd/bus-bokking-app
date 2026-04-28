import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Smartphone, CreditCard, Wallet, Tag, Shield, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { UserHeader } from '../../../components/layout/UserHeader';
import { offers } from '../../../data/offers';
import { useBookingStore, generateBookingId, generatePNR } from '../../../store/bookingStore';
import { Bus, BusSearch, BoardingPoint, PassengerDetail, Seat, BusBooking } from '../../../types';

type PaymentMethod = 'upi' | 'card' | 'wallet';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 16
};

export default function BusPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const addBooking = useBookingStore((s) => s.addBooking);

  const { bus, search, selectedSeats, boardingPoint, droppingPoint, passengers } = location.state as {
    bus: Bus; search: BusSearch; selectedSeats: Seat[];
    boardingPoint: BoardingPoint; droppingPoint: BoardingPoint; passengers: PassengerDetail[];
  };

  const baseAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedOffer, setSelectedOffer] = useState(offers[0]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const discount = selectedOffer.type === 'flat'
    ? Math.min(selectedOffer.discount, baseAmount)
    : Math.min(Math.floor((baseAmount * selectedOffer.discount) / 100), selectedOffer.maxDiscount);
  const finalAmount = baseAmount - discount;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1600));
    setProcessing(false);
    setSuccess(true);

    const booking: BusBooking = {
      type: 'bus', bookingId: generateBookingId(), pnr: generatePNR(),
      bus, seats: selectedSeats.map((s) => s.number), boardingPoint, droppingPoint, passengers,
      totalAmount: baseAmount, discount, finalAmount, paymentMethod,
      bookingDate: new Date().toISOString(), travelDate: search.date, status: 'confirmed',
    };

    addBooking(booking);
    toast.success('Booking confirmed!');
    await new Promise((r) => setTimeout(r, 1200));
    navigate('/bus/success', { state: { booking }, replace: true });
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FB' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto 16px', width: 96, height: 96, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={48} color="#10B981" />
          </div>
          <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24, color: '#111827' }}>Booking Confirmed!</p>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B7280', marginTop: 8 }}>Redirecting to your tickets...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 100 }}>
      <Toaster position="top-center" />
      <UserHeader title="Payment" subtitle="Complete your booking" showBack />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        
        {/* Fare Breakdown */}
        <div style={cardStyle}>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 16 }}>Fare Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#4B5563' }}>{selectedSeats.length} Seat(s) × ₹{selectedSeats[0]?.price}</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#111827' }}>₹{baseAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#4B5563' }}>Convenience Fee</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#10B981' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#4B5563' }}>Discount ({selectedOffer.code})</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#10B981' }}>-₹{discount}</span>
            </div>
            <div style={{ height: 1, background: '#E5E7EB', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>Total Payable</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: '#DC2626' }}>₹{finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Tag size={18} color="#DC2626" />
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>Apply Offer</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {offers.filter((o) => o.applicableTo === 'bus' || o.applicableTo === 'both').map((offer) => (
              <motion.div key={offer.id} whileTap={{ scale: 0.98 }} onClick={() => setSelectedOffer(offer)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, border: `2px solid ${selectedOffer.id === offer.id ? '#DC2626' : '#F3F4F6'}`, background: selectedOffer.id === offer.id ? '#FEF2F2' : '#fff', cursor: 'pointer' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedOffer.id === offer.id ? '#DC2626' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedOffer.id === offer.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>{offer.code}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>{offer.description}</p>
                </div>
                <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 14, color: '#DC2626' }}>{offer.type === 'flat' ? `₹${offer.discount}` : `${offer.discount}%`} OFF</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div style={cardStyle}>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 16 }}>Payment Method</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { id: 'upi', label: 'UPI', icon: Smartphone, color: '#9333EA' },
              { id: 'card', label: 'Card', icon: CreditCard, color: '#2563EB' },
              { id: 'wallet', label: 'Wallet', icon: Wallet, color: '#EA580C' },
            ].map((m) => (
              <motion.button key={m.id} whileTap={{ scale: 0.96 }} onClick={() => setPaymentMethod(m.id as any)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, border: `2px solid ${paymentMethod === m.id ? '#DC2626' : '#F3F4F6'}`, background: paymentMethod === m.id ? '#FEF2F2' : '#fff', cursor: 'pointer' }}>
                <m.icon size={24} color={m.color} />
                <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#374151' }}>{m.label}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {paymentMethod === 'upi' && (
              <motion.div key="upi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <input defaultValue="arjun@okaxis" placeholder="Enter UPI ID" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', boxSizing: 'border-box' }} />
              </motion.div>
            )}
            {paymentMethod === 'card' && (
              <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input defaultValue="4532 •••• •••• 7845" placeholder="Card Number" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', boxSizing: 'border-box' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input defaultValue="09/27" placeholder="MM/YY" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', boxSizing: 'border-box' }} />
                  <input defaultValue="123" placeholder="CVV" type="password" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', boxSizing: 'border-box' }} />
                </div>
              </motion.div>
            )}
            {paymentMethod === 'wallet' && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <select style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, fontFamily: 'Inter', background: '#fff', boxSizing: 'border-box' }}>
                  <option>Paytm Wallet — ₹1,248 balance</option>
                  <option>PhonePe Wallet — ₹320 balance</option>
                  <option>Amazon Pay — ₹750 balance</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <Shield size={16} color="#10B981" />
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#6B7280' }}>100% Secure Payment · SSL Encrypted</p>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.button id="pay-now-btn" whileTap={!processing ? { scale: 0.98 } : {}} onClick={handlePay} disabled={processing}
            style={{ width: '100%', padding: '16px', border: 'none', borderRadius: 14, background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {processing ? <Loader2 size={20} className="animate-spin" /> : `Pay ₹${finalAmount} Securely`}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
