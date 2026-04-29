import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, ChevronLeft, IdCard } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { UserHeader } from '../../../components/layout/UserHeader';
import { Flight, FlightSearch, PassengerDetail } from '../../../types';
import { useAuthStore } from '../../../store/authStore';

const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
  borderRadius: 12, fontSize: 14, fontFamily: 'Inter', background: '#fff',
  color: '#111827', outline: 'none', boxSizing: 'border-box',
};
const errInp: React.CSSProperties = { ...inp, borderColor: '#EF4444' };
const lbl: React.CSSProperties = { fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 6, display: 'block' };

export default function TravellerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const { flight, search } = location.state as { flight: Flight; search: FlightSearch };

  const travellersCount = search.travellers || 1;
  const [travellers, setTravellers] = useState<PassengerDetail[]>(
    Array.from({ length: travellersCount }, (_, i) => ({
      name: i === 0 ? authUser?.name || '' : '',
      age: i === 0 ? 28 : 0,
      gender: 'male' as const,
      email: i === 0 ? authUser?.email || '' : '',
      phone: i === 0 ? authUser?.phone || '' : '',
      ...(flight.isInternational && {
        passportNo: '',
        passportIssueDate: '',
        passportExpiryDate: '',
        nationality: 'India'
      })
    }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [editingTravellerIndex, setEditingTravellerIndex] = useState<number | null>(null);

  const update = (idx: number, field: keyof PassengerDetail, value: string | number) => {
    setTravellers((prev) => { const a = [...prev]; a[idx] = { ...a[idx], [field]: value }; return a; });
    setErrors((prev) => { const c = { ...prev }; delete c[`${idx}-${field}`]; return c; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    travellers.forEach((t, i) => {
      if (!t.email.trim() || !/^\S+@\S+\.\S+$/.test(t.email)) e[`${i}-email`] = 'Valid email required';
      if (!t.phone.trim() || t.phone.replace(/\D/g, '').length < 10) e[`${i}-phone`] = 'Valid phone required';
      
      if (flight.isInternational) {
        if (!t.firstName?.trim()) e[`${i}-firstName`] = 'Please edit to provide first name';
        if (!t.lastName?.trim()) e[`${i}-lastName`] = 'Please edit to provide last name';
        if (!t.dob) e[`${i}-dob`] = 'Please edit to provide DOB';
        if (!t.passportNo?.trim()) e[`${i}-passportNo`] = 'Please edit to provide Passport No';
      } else {
        if (!t.name.trim()) e[`${i}-name`] = 'Name required';
        if (!t.age || t.age < 1) e[`${i}-age`] = 'Valid age required';
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const totalAmount = flight.price * travellersCount;

  const handleContinue = () => {
    if (!validate()) { toast.error('Please fill all details correctly'); return; }
    navigate('/flight/payment', { state: { flight, search, travellers } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: 90 }}>
      <Toaster position="top-center" />
      <UserHeader title="Traveller Details" subtitle={`${travellersCount} traveller(s) · ${search.cabinClass}`} showBack />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {travellers.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            {/* Card header */}
            <div style={{ background: i === 0 ? '#EFF6FF' : '#F9FAFB', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: i === 0 ? '#3B82F6' : '#E5E7EB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#fff' : '#6B7280', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14 }}>{i + 1}</div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#111827' }}>Traveller {i + 1}</p>
                </div>
              </div>
              {i === 0 && <span style={{ background: '#DBEAFE', color: '#1D4ED8', fontSize: 11, fontFamily: 'Inter', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>Primary</span>}
            </div>

            {/* Fields */}
            <div style={{ padding: 20 }}>
              {flight.isInternational ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB', padding: 16, borderRadius: 12, border: `1px solid ${errors[`${i}-firstName`] ? '#EF4444' : '#E5E7EB'}`, marginBottom: 16 }}>
                  <div>
                    {t.firstName ? (
                      <>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, color: '#111827' }}>{t.title} {t.firstName} {t.lastName}</p>
                        <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B7280', marginTop: 2 }}>Passport: {t.passportNo}</p>
                      </>
                    ) : (
                      <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#EF4444', fontWeight: 500 }}>Passport Details Pending</p>
                    )}
                  </div>
                  <button onClick={() => setEditingTravellerIndex(i)} style={{ padding: '8px 16px', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', border: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    {t.firstName ? 'Edit' : 'Add Details'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                  <div style={{ flex: '1 1 100%' }}>
                    <label style={lbl}>Full Name</label>
                    <input id={`t${i}-name`} placeholder="As on government ID / Passport" value={t.name}
                      onChange={(e) => update(i, 'name', e.target.value)} style={errors[`${i}-name`] ? errInp : inp} />
                    {errors[`${i}-name`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-name`]}</p>}
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <label style={lbl}>Age</label>
                    <input id={`t${i}-age`} type="number" placeholder="Your age" value={t.age || ''}
                      onChange={(e) => update(i, 'age', Number(e.target.value))} style={errors[`${i}-age`] ? errInp : inp} />
                    {errors[`${i}-age`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-age`]}</p>}
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <label style={lbl}>Gender</label>
                    <select id={`t${i}-gender`} value={t.gender} onChange={(e) => update(i, 'gender', e.target.value as any)} style={inp}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={lbl}>Email Address</label>
                  <input id={`t${i}-email`} type="email" placeholder="ticket@email.com" value={t.email}
                    onChange={(e) => update(i, 'email', e.target.value)} style={errors[`${i}-email`] ? errInp : inp} />
                  {errors[`${i}-email`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-email`]}</p>}
                </div>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={lbl}>Mobile Number</label>
                  <input id={`t${i}-phone`} type="tel" placeholder="+91 9XXXXXXXXX" value={t.phone}
                    onChange={(e) => update(i, 'phone', e.target.value)} style={errors[`${i}-phone`] ? errInp : inp} />
                  {errors[`${i}-phone`] && <p style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter', marginTop: 4 }}>{errors[`${i}-phone`]}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Fare summary */}
        <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 18, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#166534' }}>{travellersCount} Traveller(s) × ₹{flight.price.toLocaleString()}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#15803D', marginTop: 3 }}>Taxes & fees included</p>
          </div>
          <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#166534' }}>₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.button id="traveller-continue-btn" whileTap={{ scale: 0.98 }} onClick={handleContinue}
            style={{ width: '100%', padding: '15px', border: 'none', borderRadius: 14, background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
            Proceed to Payment · ₹{totalAmount.toLocaleString()}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {editingTravellerIndex !== null && (
          <InternationalTravellerModal
            traveller={travellers[editingTravellerIndex]}
            onSave={(t) => {
              setTravellers((prev) => { const a = [...prev]; a[editingTravellerIndex] = t; return a; });
              setEditingTravellerIndex(null);
            }}
            onClose={() => setEditingTravellerIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InternationalTravellerModal({ traveller, onSave, onClose }: { traveller: PassengerDetail; onSave: (t: PassengerDetail) => void; onClose: () => void; }) {
  const [t, setT] = useState<PassengerDetail>(traveller);
  const [e, setE] = useState<Record<string, string>>({});
  const [showSample, setShowSample] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!t.title) err.title = 'Title is required';
    if (!t.firstName?.trim()) err.firstName = 'Please enter your first & middle name';
    if (!t.lastName?.trim()) err.lastName = 'Please enter your last name';
    if (!t.dob) err.dob = 'Please enter a valid date of birth for the adult';
    if (!t.passportNo?.trim()) err.passportNo = 'Please enter a valid passport and no special characters or spaces';
    if (!t.passportIssueDate) err.passportIssueDate = 'Passport issuing date is mandatory.';
    if (!t.passportExpiryDate) err.passportExpiryDate = 'Passport expiry date is mandatory.';
    if (!t.nationality?.trim()) err.nationality = 'Nationality is required';
    setE(err);
    return Object.keys(err).length === 0;
  };

  const update = (field: keyof PassengerDetail, value: any) => {
    setT((prev) => ({ ...prev, [field]: value }));
    setE((prev) => { const c = { ...prev }; delete c[field]; return c; });
  };

  const handleSave = () => {
    if (validate()) onSave(t);
  };

  const modalInp: React.CSSProperties = { width: '100%', padding: '16px 14px', borderRadius: 12, border: '1px solid #9CA3AF', fontSize: 16, fontFamily: 'Inter', outline: 'none', background: '#fff' };
  const modalErrInp: React.CSSProperties = { ...modalInp, border: '1px solid #EF4444' };
  const lblFloat: React.CSSProperties = { position: 'absolute', top: -8, left: 12, background: '#fff', padding: '0 4px', fontSize: 12, color: '#6B7280', fontFamily: 'Inter' };

  return (
    <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ position: 'fixed', inset: 0, background: '#F8F9FB', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
        <button onClick={onClose} style={{ position: 'absolute', left: 20, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color="#111827" />
        </button>
        <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#111827' }}>Edit Traveller</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Banner */}
        <div style={{ background: '#FEF3C7', padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <IdCard size={20} color="#92400E" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#92400E', lineHeight: 1.5 }}>
            Please enter your full name as it appears on your Passport. <span onClick={() => setShowSample(true)} style={{ textDecoration: 'underline', fontWeight: 600, cursor: 'pointer' }}>View Sample</span>
          </p>
        </div>

        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24, background: '#fff', minHeight: '100%' }}>
          {/* Title Radios */}
          <div style={{ display: 'flex', gap: 32 }}>
            {['Mr', 'Ms', 'Mrs'].map((title) => (
              <label key={title} onClick={(e) => { e.preventDefault(); update('title', title); }} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${t.title === title ? '#EF4444' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.title === title && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />}
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: 16, color: '#374151' }}>{title}</span>
              </label>
            ))}
          </div>
          {e.title && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: -16 }}>{e.title}</p>}

          {/* First Name */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={lblFloat}>First & Middle Name</span>
              <input value={t.firstName || ''} onChange={(e) => update('firstName', e.target.value)} style={e.firstName ? modalErrInp : modalInp} />
            </div>
            {e.firstName && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: 4 }}>{e.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={lblFloat}>Last Name</span>
              <input value={t.lastName || ''} onChange={(e) => update('lastName', e.target.value)} style={e.lastName ? modalErrInp : modalInp} />
            </div>
            {e.lastName && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: 4 }}>{e.lastName}</p>}
          </div>

          {/* DOB */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={e.dob ? { ...lblFloat, color: '#EF4444' } : lblFloat}>Date of Birth (DD/MM/YYYY)</span>
              <input type="date" value={t.dob || ''} onChange={(e) => update('dob', e.target.value)} style={e.dob ? modalErrInp : modalInp} />
            </div>
            {e.dob && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: 4 }}>{e.dob}</p>}
          </div>

          {/* Passport No */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={e.passportNo ? { ...lblFloat, color: '#EF4444' } : lblFloat}>Passport No.</span>
              <input value={t.passportNo || ''} onChange={(e) => update('passportNo', e.target.value.toUpperCase())} style={e.passportNo ? modalErrInp : modalInp} />
            </div>
            {e.passportNo && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: 4 }}>{e.passportNo}</p>}
          </div>

          {/* Passport Issue */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={e.passportIssueDate ? { ...lblFloat, color: '#EF4444' } : lblFloat}>Passport Issue Date (DD/MM/YYYY)</span>
              <input type="date" value={t.passportIssueDate || ''} onChange={(e) => update('passportIssueDate', e.target.value)} style={e.passportIssueDate ? modalErrInp : modalInp} />
            </div>
            {e.passportIssueDate && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: 4 }}>{e.passportIssueDate}</p>}
          </div>

          {/* Passport Expiry */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={e.passportExpiryDate ? { ...lblFloat, color: '#EF4444' } : lblFloat}>Passport Expiry Date (DD/MM/YYYY)</span>
              <input type="date" value={t.passportExpiryDate || ''} onChange={(e) => update('passportExpiryDate', e.target.value)} style={e.passportExpiryDate ? modalErrInp : modalInp} />
            </div>
            {e.passportExpiryDate && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: 4 }}>{e.passportExpiryDate}</p>}
          </div>

          {/* Nationality */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={e.nationality ? { ...lblFloat, color: '#EF4444' } : lblFloat}>Nationality</span>
              <input value={t.nationality || ''} onChange={(e) => update('nationality', e.target.value)} style={e.nationality ? modalErrInp : modalInp} />
            </div>
            {e.nationality && <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter', marginTop: 4 }}>{e.nationality}</p>}
          </div>
          
          <div style={{ height: 80 }} />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #F3F4F6', padding: '16px 20px', display: 'flex', gap: 16 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 16, borderRadius: 12, background: '#fff', border: '1.5px solid #EF4444', color: '#EF4444', fontFamily: 'Poppins', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
          Delete
        </button>
        <button onClick={handleSave} style={{ flex: 1, padding: 16, borderRadius: 12, background: '#EF4444', border: 'none', color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
          Save
        </button>
      </div>

      <AnimatePresence>
        {showSample && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', width: '100%', maxWidth: 400 }}>
              <div style={{ padding: 16, borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#111827' }}>Passport Sample</p>
                <button onClick={() => setShowSample(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} /></button>
              </div>
              <div style={{ padding: 24, background: '#F8F9FB' }}>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, display: 'flex', gap: 16 }}>
                  <div style={{ width: 80, height: 100, background: '#E5E7EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={32} color="#9CA3AF" /></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, color: '#6B7280', textTransform: 'uppercase', fontFamily: 'Inter', fontWeight: 600 }}>Surname</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Poppins' }}>SHARMA</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: '#6B7280', textTransform: 'uppercase', fontFamily: 'Inter', fontWeight: 600 }}>Given Name</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Poppins' }}>ROHIT KUMAR</p>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, fontFamily: 'Inter' }}>Enter <span style={{ fontWeight: 700, color: '#111827' }}>ROHIT KUMAR</span> in First & Middle Name, and <span style={{ fontWeight: 700, color: '#111827' }}>SHARMA</span> in Last Name.</p>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <button onClick={() => setShowSample(false)} style={{ width: '100%', padding: 14, borderRadius: 12, background: '#EF4444', color: '#fff', border: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Got it</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
