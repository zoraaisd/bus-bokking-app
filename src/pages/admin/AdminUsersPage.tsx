import { ReactNode, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Mail, MapPin, Phone, Search, ShieldCheck, Ticket } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { buildAdminUsers } from '../../data/adminSeed';
import { useBookingStore } from '../../store/bookingStore';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

type TierFilter = 'all' | 'Elite' | 'Gold' | 'Silver';
type StatusFilter = 'all' | 'active' | 'inactive';

export default function AdminUsersPage() {
  const bookings = useBookingStore((state) => state.bookings);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const users = useMemo(() => buildAdminUsers(bookings), [bookings]);
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      if (tierFilter !== 'all' && user.loyaltyTier !== tierFilter) {
        return false;
      }

      if (statusFilter !== 'all' && user.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [user.name, user.email, user.phone, user.city, user.company ?? '']
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [search, statusFilter, tierFilter, users]);

  return (
    <AdminLayout
      title="Users"
      subtitle={`${users.length} users available in the admin seed directory`}
    >
      <div className="flex flex-col gap-5">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <OverviewCard label="Total users" value={users.length.toString()} />
          <OverviewCard label="Active users" value={users.filter((user) => user.status === 'active').length.toString()} />
          <OverviewCard label="Elite members" value={users.filter((user) => user.loyaltyTier === 'Elite').length.toString()} />
          <OverviewCard
            label="Tracked spend"
            value={currencyFormatter.format(users.reduce((sum, user) => sum + user.totalSpent, 0))}
          />
        </section>

        <section className="card-premium p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative block flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, city or company"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-300 focus:bg-white"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ToggleFilter
                label="Tier"
                value={tierFilter}
                options={['all', 'Elite', 'Gold', 'Silver']}
                onChange={(value) => setTierFilter(value as TierFilter)}
              />
              <ToggleFilter
                label="Status"
                value={statusFilter}
                options={['all', 'active', 'inactive']}
                onChange={(value) => setStatusFilter(value as StatusFilter)}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredUsers.map((user, index) => (
            <motion.article
              key={user.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="card-premium overflow-hidden"
            >
              <div className="bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.18),_transparent_38%),linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 font-poppins text-lg font-black">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-poppins text-xl font-black tracking-tight">{user.name}</p>
                      <p className="mt-1 text-sm font-medium text-slate-300">{user.company ?? `${user.city} traveller`}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill light>{user.loyaltyTier}</Pill>
                    <Pill light>{user.status}</Pill>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoLine icon={<Mail size={15} />} text={user.email} />
                  <InfoLine icon={<Phone size={15} />} text={user.phone} />
                  <InfoLine icon={<MapPin size={15} />} text={user.city} />
                  <InfoLine
                    icon={<ShieldCheck size={15} />}
                    text={`Joined ${new Date(user.joinedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <MiniStat label="Bookings" value={user.totalBookings.toString()} />
                  <MiniStat label="Active" value={user.activeBookings.toString()} />
                  <MiniStat label="Completed" value={user.completedTrips.toString()} />
                  <MiniStat label="Spent" value={currencyFormatter.format(user.totalSpent)} />
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Preferred Transport</p>
                    <p className="mt-1 font-poppins text-lg font-black text-slate-950">{user.preferredTransport}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Last Booking</p>
                    <p className="mt-1 font-semibold text-slate-700">
                      {user.lastBookingDate
                        ? new Date(user.lastBookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'No booking yet'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}

          {filteredUsers.length === 0 && (
            <div className="card-premium col-span-full p-12 text-center">
              <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Ticket size={28} />
                </div>
                <p className="font-poppins text-xl font-black text-slate-950">No users matched your search</p>
                <p className="text-sm font-medium text-slate-500">Try a different name, city, or loyalty tier.</p>
              </div>
            </div>
          )}
        </section>

        <section className="card-premium p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Crown size={20} />
            </div>
            <div>
              <h2 className="admin-section-title font-poppins font-black text-slate-950">Elite Users</h2>
              <p className="text-sm font-medium text-slate-500">Top users by tracked spending</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {users.slice(0, 3).map((user, index) => (
              <div key={user.id} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                    Rank {index + 1}
                  </span>
                  <Pill>{user.loyaltyTier}</Pill>
                </div>
                <p className="mt-4 font-poppins text-xl font-black text-slate-950">{user.name}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{user.totalBookings} bookings completed or active</p>
                <p className="mt-4 font-poppins text-2xl font-black text-slate-950">{currencyFormatter.format(user.totalSpent)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-premium p-4 sm:p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="admin-kpi-value mt-3 font-poppins font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function ToggleFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-1">
      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition ${
              value === option ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 font-poppins text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function Pill({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${light ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'}`}>
      {children}
    </span>
  );
}
