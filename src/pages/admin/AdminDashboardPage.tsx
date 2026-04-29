import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BadgeIndianRupee,
  Bus,
  CalendarDays,
  CircleEllipsis,
  Crown,
  Plane,
  Ticket,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  buildAdminUsers,
  getActiveBookingCount,
  getPrimaryTraveller,
} from '../../data/adminSeed';
import { useBookingStore } from '../../store/bookingStore';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const chartData = [
  { day: 'Thu', revenue: 2200, bookings: 0.1 },
  { day: 'Fri', revenue: 3800, bookings: 0.6 },
  { day: 'Sat', revenue: 5300, bookings: 0.7 },
  { day: 'Sun', revenue: 4400, bookings: 0.3 },
  { day: 'Mon', revenue: 7200, bookings: 0.6 },
  { day: 'Tue', revenue: 8200, bookings: 0.3 },
  { day: 'Wed', revenue: 9600, bookings: 0.4 },
];

const transportColors = ['#ff4d5a', '#3164f4'];

export default function AdminDashboardPage() {
  const bookings = useBookingStore((state) => state.bookings);
  const totalRevenue = useBookingStore((state) => state.getTotalRevenue());

  const busBookings = bookings.filter((booking) => booking.type === 'bus');
  const flightBookings = bookings.filter((booking) => booking.type === 'flight');
  const activeBookings = getActiveBookingCount(bookings);
  const users = buildAdminUsers(bookings);

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      note: `${activeBookings} active right now`,
      icon: Ticket,
      iconWrap: 'bg-rose-50 text-rose-500',
    },
    {
      label: 'Total Revenue',
      value: currencyFormatter.format(totalRevenue),
      note: 'Across all seeded admin bookings',
      icon: BadgeIndianRupee,
      iconWrap: 'bg-emerald-50 text-emerald-500',
    },
    {
      label: 'Bus Bookings',
      value: busBookings.length,
      note: `${currencyFormatter.format(busBookings.reduce((sum, booking) => sum + booking.finalAmount, 0))} earned`,
      icon: Bus,
      iconWrap: 'bg-orange-50 text-orange-500',
    },
    {
      label: 'Flight Bookings',
      value: flightBookings.length,
      note: `${currencyFormatter.format(flightBookings.reduce((sum, booking) => sum + booking.finalAmount, 0))} earned`,
      icon: Plane,
      iconWrap: 'bg-blue-50 text-blue-500',
    },
  ];

  const transportSplit = [
    { name: 'Bus', value: busBookings.length },
    { name: 'Flight', value: flightBookings.length },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      <div className="flex flex-col gap-4 lg:gap-5">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-3xl ${stat.iconWrap}`}>
                  <stat.icon size={34} strokeWidth={2.2} />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-600">
                  <ArrowUpRight size={12} strokeWidth={3} />
                  Live
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">{stat.label}</p>
                <p className="mt-2 font-poppins text-[2.2rem] leading-none font-black tracking-tight text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-500">{stat.note}</p>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
          <div className="card-premium p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[2rem] leading-none font-poppins font-black tracking-tight text-slate-950">Booking Analysis</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">Daily booking volume and revenue momentum</p>
              </div>

              <div className="inline-flex gap-1 rounded-xl bg-slate-100 p-1">
                {['7D', '30D', '90D'].map((item, index) => (
                  <span
                    key={item}
                    className={`rounded-lg px-4 py-2 text-sm font-black ${index === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18a36f" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#18a36f" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d5a" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#ff4d5a" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#dbe7f4" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(value: number) => (value === 0 ? '0' : `${value / 1000}K`)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#ff4d5a', fontSize: 12, fontWeight: 700 }}
                    domain={[0, 8]}
                  />
                  <Tooltip
                    formatter={(value: unknown, name: unknown) => [
                      name === 'revenue' ? currencyFormatter.format(Number(value ?? 0)) : Number(value ?? 0),
                      name === 'revenue' ? 'Revenue (₹)' : 'Bookings',
                    ]}
                    contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="left"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: 20, fontWeight: 700 }}
                    formatter={(value) => (value === 'revenue' ? 'Revenue (₹)' : 'Bookings')}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#18a36f"
                    strokeWidth={3}
                    fill="url(#revenueFill)"
                    dot={{ r: 6, fill: '#18a36f', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#ff4d5a"
                    strokeWidth={3}
                    fill="url(#bookingsFill)"
                    dot={{ r: 5, fill: '#ff4d5a', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-premium p-5 sm:p-6">
            <h2 className="text-[2rem] leading-none font-poppins font-black tracking-tight text-slate-950">Transport Split</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">How your customers are choosing to travel</p>

            <div className="mt-8 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transportSplit}
                    dataKey="value"
                    startAngle={180}
                    endAngle={-180}
                    innerRadius={76}
                    outerRadius={112}
                    paddingAngle={2}
                    cornerRadius={6}
                  >
                    {transportSplit.map((item, index) => (
                      <Cell key={item.name} fill={transportColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {transportSplit.map((item, index) => {
                const percentage = Math.round((item.value / bookings.length) * 100);

                return (
                  <div key={item.name} className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-3">
                      <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: transportColors[index] }} />
                      <span className="font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-700">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
          <div className="card-premium p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h2 className="text-[1.8rem] leading-none font-poppins font-black tracking-tight text-slate-950">Recent Bookings</h2>
                </div>
              </div>

              <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">
                View All Bookings
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead className="bg-slate-50">
                  <tr>
                    {['PNR', 'Customer', 'Route', 'Type', 'Travel Date', 'Amount', 'Status', ''].map((heading) => (
                      <th key={heading} className="px-4 py-4 text-left text-[12px] font-black text-slate-400">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 4).map((booking) => {
                    const traveller = getPrimaryTraveller(booking);
                    const route = booking.type === 'bus'
                      ? `${booking.bus.from} → ${booking.bus.to}`
                      : `${booking.flight.from} → ${booking.flight.to}`;

                    return (
                      <tr key={booking.bookingId} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-4 py-4 text-sm font-bold text-slate-700">{booking.pnr}</td>
                        <td className="px-4 py-4 text-sm font-bold text-slate-900">{traveller.name}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-600">{route}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${booking.type === 'bus' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                            {booking.type === 'bus' ? 'Bus' : 'Flight'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                          {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-slate-900">{currencyFormatter.format(booking.finalAmount)}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-600'
                              : booking.status === 'completed'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-red-50 text-red-500'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-slate-400">
                          <CircleEllipsis size={18} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-premium p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Crown size={18} />
              </div>
              <h2 className="text-[1.8rem] leading-none font-poppins font-black tracking-tight text-slate-950">Admin Snapshot</h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <SnapshotCard
                icon={<Users size={20} className="text-sky-500" />}
                iconWrap="bg-sky-50"
                value={users.length.toString()}
                label="Total Users"
              />
              <SnapshotCard
                icon={<Ticket size={20} className="text-rose-500" />}
                iconWrap="bg-rose-50"
                value={bookings.length.toString()}
                label="Total Bookings"
              />
              <SnapshotCard
                icon={<BadgeIndianRupee size={20} className="text-emerald-500" />}
                iconWrap="bg-emerald-50"
                value={currencyFormatter.format(totalRevenue)}
                label="Total Revenue"
              />
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function SnapshotCard({
  icon,
  iconWrap,
  value,
  label,
}: {
  icon: ReactNode;
  iconWrap: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrap}`}>
          {icon}
        </div>
        <div>
          <p className="text-[2rem] leading-none font-poppins font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
