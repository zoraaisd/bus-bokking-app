import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Bus, Plane, IndianRupee, Ticket, ArrowUpRight, Menu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useBookingStore } from '../../store/bookingStore';

const COLORS = ['#DC2626','#3B82F6','#F97316','#10B981'];

export default function AdminDashboardPage() {
  const bookings = useBookingStore((s) => s.bookings);
  const revenue = useBookingStore((s) => s.getTotalRevenue());
  const busB = bookings.filter((b) => b.type === 'bus');
  const flyB = bookings.filter((b) => b.type === 'flight');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayBookings = bookings.filter((b) => new Date(b.bookingDate).toDateString() === d.toDateString());
    const rev = dayBookings.reduce((s, b) => s + b.finalAmount, 0);
    return { day: label, bookings: dayBookings.length + (i === 6 ? confirmed.length : 0), revenue: rev + (i === 6 ? revenue * 0.3 : 0) };
  });

  const monthData = [
    { month: 'Jan', bus: 42, flight: 28, revenue: 182000 },
    { month: 'Feb', bus: 38, flight: 31, revenue: 210000 },
    { month: 'Mar', bus: 55, flight: 40, revenue: 295000 },
    { month: 'Apr', bus: 61, flight: 45 + flyB.length, revenue: 340000 + revenue },
  ];

  const pieData = [
    { name: 'Bus', value: busB.length || 1 },
    { name: 'Flight', value: flyB.length || 1 },
  ];

  const stats = [
    { id:'s1', label:'Total Bookings', value: bookings.length, sub: `${confirmed.length} active`, icon: Ticket, bg: '#FEF2F2', ic: '#DC2626', delta: '+14%' },
    { id:'s2', label:'Total Revenue', value: `₹${(revenue/1000).toFixed(0)}K`, sub: 'This month', icon: IndianRupee, bg: '#ECFDF5', ic: '#10B981', delta: '+8%' },
    { id:'s3', label:'Bus Bookings', value: busB.length, sub: `₹${busB.reduce((s,b)=>s+b.finalAmount,0).toLocaleString()} earned`, icon: Bus, bg: '#FFF7ED', ic: '#F97316', delta: '' },
    { id:'s4', label:'Flight Bookings', value: flyB.length, sub: `₹${flyB.reduce((s,b)=>s+b.finalAmount,0).toLocaleString()} earned`, icon: Plane, bg: '#EFF6FF', ic: '#3B82F6', delta: '' },
  ];

  const userSet = new Map([
    ['Arjun Sharma', { email:'arjun@gmail.com', trips: bookings.filter(b => (b as any).passengers?.[0]?.name === 'Arjun Sharma' || (b as any).travellers?.[0]?.name === 'Arjun Sharma').length || 2, spend: '₹5,197' }],
    ['Priya Nair',   { email:'priya@gmail.com',   trips: 1, spend: '₹499' }],
    ['Rahul Mehta',  { email:'rahul@corp.com',    trips: 1, spend: '₹6,599' }],
    ['Sneha Reddy',  { email:'sneha@gmail.com',   trips: 1, spend: '₹866' }],
    ['Amit Joshi',   { email:'amit@gmail.com',    trips: 1, spend: '₹2,799' }],
  ]);

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
    >
      <div className="flex flex-col gap-10">
        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <motion.div 
              key={s.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="card-premium p-6 sm:p-8 relative overflow-hidden group shadow-hover"
            >
              {/* Background Accent */}
              <div 
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500"
                style={{ background: s.ic }}
              />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: s.bg }}>
                  <s.icon size={24} color={s.ic} strokeWidth={2.5} />
                </div>
                {s.delta && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black tracking-wide">
                    <ArrowUpRight size={12} strokeWidth={3} /> {s.delta}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <h4 className="text-gray-400 font-inter text-xs font-black uppercase tracking-[0.1em]">{s.label}</h4>
                <p className="font-poppins font-black text-3xl text-gray-900 tracking-tight">{s.value}</p>
                <div className="pt-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="font-inter text-xs text-gray-500 font-bold">{s.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 card-premium p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="font-poppins font-black text-xl text-gray-900">Booking Analytics</h3>
                <p className="font-inter text-sm text-gray-500 font-medium">Daily booking volume & performance</p>
              </div>
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                {['7D', '1M', '3M'].map(t => (
                  <button key={t} className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${t === '7D' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11, fontFamily: 'Inter', fontWeight: 700, fill: '#94A3B8' }} 
                    axisLine={false} 
                    tickLine={false}
                    dy={15}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fontFamily: 'Inter', fontWeight: 700, fill: '#94A3B8' }} 
                    axisLine={false} 
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px 16px' }} 
                    itemStyle={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 12 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#DC2626" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#DC2626', stroke: '#fff', strokeWidth: 3 }} 
                    activeDot={{ r: 8, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Type Distribution */}
          <div className="card-premium p-6 sm:p-10 flex flex-col shadow-sm">
            <h3 className="font-poppins font-black text-xl text-gray-900 mb-2">Transport Split</h3>
            <p className="font-inter text-sm text-gray-500 font-medium mb-10">Bus vs Flight preference</p>
            
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={95} 
                    dataKey="value" 
                    paddingAngle={8}
                    cornerRadius={10}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4 pt-6">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="font-inter text-sm font-bold text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-poppins font-black text-sm text-gray-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity & Performance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Monthly Bar Chart */}
          <div className="lg:col-span-3 card-premium p-6 sm:p-10 shadow-sm">
            <h3 className="font-poppins font-black text-xl text-gray-900 mb-10">Revenue Streams</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11, fontFamily: 'Inter', fontWeight: 700, fill: '#94A3B8' }} 
                    axisLine={false} 
                    tickLine={false}
                    dy={15}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fontFamily: 'Inter', fontWeight: 700, fill: '#94A3B8' }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="bus" fill="#DC2626" radius={[6,6,0,0]} barSize={20} />
                  <Bar dataKey="flight" fill="#3B82F6" radius={[6,6,0,0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Activity */}
          <div className="lg:col-span-2 card-premium p-6 sm:p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-poppins font-black text-xl text-gray-900">Elite Users</h3>
              <button className="text-red-600 font-inter text-xs font-black uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {Array.from(userSet.entries()).slice(0, 5).map(([name, info], i) => (
                <div key={name} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-poppins font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: `hsl(${i * 60},70%,50%)` }}>
                    {name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-black text-sm text-gray-900 truncate">{name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="font-inter text-[10px] font-black text-gray-400 uppercase tracking-wider">{info.trips} Total Bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins font-black text-sm text-gray-900">{info.spend}</p>
                    <p className="font-inter text-[10px] font-bold text-gray-400">Total Spent</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
