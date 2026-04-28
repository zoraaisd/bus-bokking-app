import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Ticket, IndianRupee, Bus, Plane, Star } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useBookingStore } from '../../store/bookingStore';

export default function AdminUsersPage() {
  const bookings = useBookingStore((s) => s.bookings);
  const totalRevenue = useBookingStore((s) => s.getTotalRevenue());
  const busCount = bookings.filter((b) => b.type === 'bus').length;
  const flightCount = bookings.filter((b) => b.type === 'flight').length;

  const statItems = [
    { label: 'Total Bookings', value: bookings.length, icon: <Ticket size={18} className="text-red-500" />, bg: 'bg-red-50' },
    { label: 'Total Spent', value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee size={18} className="text-emerald-500" />, bg: 'bg-emerald-50' },
    { label: 'Bus Trips', value: busCount, icon: <Bus size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
    { label: 'Flight Trips', value: flightCount, icon: <Plane size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
  ];

  return (
    <AdminLayout 
      title="User Management" 
      subtitle="1 active member in your directory"
    >
      <div className="flex flex-col gap-10">
        {/* Premium Profile Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-premium overflow-hidden shadow-premium"
        >
          {/* High-Contrast Gradient Header */}
          <div className="bg-linear-to-br from-gray-900 via-gray-800 to-red-900 p-8 sm:p-12 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 text-center sm:text-left">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-xl rounded-[32px] flex items-center justify-center text-4xl sm:text-5xl font-black font-poppins border border-white/20 shadow-2xl">
                A
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-3xl sm:text-4xl font-black font-poppins tracking-tight">Arjun Sharma</h2>
                  <div className="flex items-center gap-2 bg-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/50">
                    <Star size={10} className="fill-white text-white" /> Premium
                  </div>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-gray-300 font-inter text-sm font-bold">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-red-400" /> arjun.sharma@gmail.com</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-red-400" /> +91 99887 76655</p>
                </div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest bg-white/5 w-fit px-3 py-1.5 rounded-lg">Member since April 2026</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <h3 className="font-poppins font-black text-xl text-gray-900 uppercase tracking-tight">Booking Overview</h3>
              <div className="h-px flex-1 bg-gray-100 hidden sm:block mx-8" />
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">LIFETIME STATS</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statItems.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${s.bg} rounded-[24px] p-6 sm:p-8 flex flex-col justify-between group hover:scale-[1.02] transition-transform shadow-sm`}
                >
                  <div className="mb-6">{s.icon}</div>
                  <div>
                    <p className="text-3xl font-black font-poppins text-gray-900 mb-1 tracking-tight">{s.value}</p>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-[0.1em]">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed Logs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* User Timeline / Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 card-premium p-8 sm:p-12 shadow-sm"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-poppins font-black text-xl text-gray-900">Purchase History</h3>
              <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"><Star size={20} /></button>
            </div>
            
            <div className="space-y-4">
              {bookings.slice(0, 5).map((b, i) => {
                const isBus = b.type === 'bus';
                const from = isBus ? b.bus.from : b.flight.from;
                const to = isBus ? b.bus.to : b.flight.to;
                return (
                  <div key={b.bookingId} className="flex items-center gap-6 p-6 bg-gray-50 rounded-[20px] hover:bg-gray-100/80 transition-all group">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isBus ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {isBus ? <Bus size={20} strokeWidth={2.5} /> : <Plane size={20} strokeWidth={2.5} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins font-black text-sm sm:text-base text-gray-900 truncate tracking-tight">{from} to {to}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(b.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{b.type} booking</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-poppins font-black text-lg text-red-600">₹{b.finalAmount.toLocaleString()}</p>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">Success</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Role & Permissions Sidebar */}
          <div className="space-y-10">
            <div className="card-premium p-8 sm:p-10 bg-linear-to-br from-gray-50 to-white shadow-sm">
              <h4 className="font-poppins font-black text-sm text-gray-900 uppercase tracking-widest mb-6">User Access</h4>
              <div className="space-y-4">
                <InfoRow icon={<User size={16} className="text-gray-400" />} label="Current Role" value="Elite Traveller" />
                <div className="h-px bg-gray-100" />
                <InfoRow icon={<Star size={16} className="text-gray-400" />} label="Status" value="Verified Customer" />
              </div>
            </div>
            
            <div className="card-premium p-8 sm:p-10 border-dashed border-2 border-red-100 bg-red-50/20 text-center">
              <p className="font-poppins font-black text-sm text-red-900 mb-2">Premium Member</p>
              <p className="font-inter text-xs text-red-600 font-bold mb-4 leading-relaxed">This user has access to exclusive priority boarding and lounge access.</p>
              <button className="w-full py-3 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-transform">Edit Permissions</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">{icon}</div>
      <div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-800 font-inter">{value}</p>
      </div>
    </div>
  );
}
