import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bus, Plane, ArrowUpDown } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/common/Badge';
import { useBookingStore } from '../../store/bookingStore';
import { Booking } from '../../types';

export default function AdminBookingsPage() {
  const bookings = useBookingStore((s) => s.bookings);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'bus' | 'flight'>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = bookings
    .filter((b) => {
      const from = b.type === 'bus' ? b.bus.from : b.flight.from;
      const to = b.type === 'bus' ? b.bus.to : b.flight.to;
      const q = search.toLowerCase();
      if (typeFilter !== 'all' && b.type !== typeFilter) return false;
      return (
        !search ||
        from.toLowerCase().includes(q) ||
        to.toLowerCase().includes(q) ||
        b.pnr.toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        const diff = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
        return sortDir === 'asc' ? diff : -diff;
      } else {
        return sortDir === 'asc' ? a.finalAmount - b.finalAmount : b.finalAmount - a.finalAmount;
      }
    });

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <AdminLayout 
      title="All Bookings" 
      subtitle={`${bookings.length} recorded transactions`}
    >
      <div className="flex flex-col gap-8">
        {/* Modern Toolbar */}
        <div className="card-premium p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-6 shadow-sm">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input
              id="admin-bookings-search"
              type="text"
              placeholder="Search by PNR, route or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-0 bg-gray-50 text-sm font-bold font-inter focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-1 bg-gray-50 rounded-2xl">
              {(['all', 'bus', 'flight'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black font-inter tracking-wide transition-all
                    ${typeFilter === t ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            
            <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowUpDown size={20} />
            </button>
          </div>
        </div>

        {/* Spacious Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest font-inter">Transport</th>
                  <th className="text-left px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest font-inter">Passenger Info</th>
                  <th className="text-left px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest font-inter">Route & Operator</th>
                  <th className="text-left px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest font-inter cursor-pointer group" onClick={() => toggleSort('date')}>
                    <div className="flex items-center gap-2">Travel Date <ArrowUpDown size={14} className="group-hover:text-red-600 transition-colors" /></div>
                  </th>
                  <th className="text-left px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest font-inter cursor-pointer group" onClick={() => toggleSort('amount')}>
                    <div className="flex items-center gap-2">Fare <ArrowUpDown size={14} className="group-hover:text-red-600 transition-colors" /></div>
                  </th>
                  <th className="text-left px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest font-inter">Status</th>
                  <th className="text-left px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest font-inter">PNR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-24">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Search size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-inter font-bold">No transactions match your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((booking, i) => (
                    <BookingRow key={booking.bookingId} booking={booking} index={i} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-8 py-6 bg-gray-50/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="text-gray-500 font-inter text-sm font-bold">Displaying {filtered.length} results</p>
              <div className="flex items-center gap-6">
                <span className="text-gray-400 font-inter text-xs font-black uppercase tracking-widest">Total Volume</span>
                <p className="font-poppins font-black text-2xl text-red-600 tracking-tight">
                  ₹{filtered.reduce((s, b) => s + b.finalAmount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}

function BookingRow({ booking, index }: { booking: Booking; index: number }) {
  const isBus = booking.type === 'bus';
  const from = isBus ? booking.bus.from : booking.flight.from;
  const to = isBus ? booking.bus.to : booking.flight.to;
  const operator = isBus ? booking.bus.operatorName : booking.flight.airline;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50/80 transition-colors group"
    >
      <td className="px-8 py-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
          ${isBus ? 'bg-red-50 text-red-600 shadow-sm shadow-red-100' : 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'}`}>
          {isBus ? <Bus size={12} strokeWidth={3} /> : <Plane size={12} strokeWidth={3} />}
          {isBus ? 'Bus' : 'Flight'}
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-poppins font-black text-sm">A</div>
          <div>
            <p className="text-sm font-black text-gray-900 font-poppins">Arjun Sharma</p>
            <p className="text-[10px] text-gray-400 font-inter font-bold uppercase tracking-wider">Premium Client</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <p className="text-sm font-bold text-gray-900 font-inter truncate">{from} → {to}</p>
        <p className="text-xs text-gray-400 font-inter font-medium mt-0.5">{operator}</p>
      </td>
      <td className="px-8 py-6 whitespace-nowrap">
        <p className="text-sm font-black text-gray-900 font-poppins">
          {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
        <p className="text-[10px] text-gray-400 font-inter font-bold uppercase tracking-wider mt-1">
          Booked at {new Date(booking.bookingDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </td>
      <td className="px-8 py-6 whitespace-nowrap">
        <p className="text-base font-black text-gray-900 font-poppins tracking-tight">₹{booking.finalAmount.toLocaleString()}</p>
        {booking.discount > 0 && (
          <div className="flex items-center gap-1 mt-1 text-emerald-600">
            <span className="text-[10px] font-black uppercase tracking-wider">Saved ₹{booking.discount}</span>
          </div>
        )}
      </td>
      <td className="px-8 py-6">
        <StatusBadge status={booking.status} />
      </td>
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-black text-gray-700 font-mono tracking-widest uppercase">{booking.pnr}</p>
        </div>
      </td>
    </motion.tr>
  );
}
