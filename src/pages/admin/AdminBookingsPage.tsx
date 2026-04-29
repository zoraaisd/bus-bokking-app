import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Bus,
  CalendarDays,
  Filter,
  Plane,
  Search,
  Users,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/common/Badge';
import {
  getOperatorLabel,
  getPrimaryTraveller,
  getRouteLabel,
  getTravellerCount,
} from '../../data/adminSeed';
import { useBookingStore } from '../../store/bookingStore';
import { Booking, BookingStatus } from '../../types';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

type TransportFilter = 'all' | 'bus' | 'flight';
type SortField = 'bookingDate' | 'travelDate' | 'amount';

export default function AdminBookingsPage() {
  const bookings = useBookingStore((state) => state.bookings);
  const [search, setSearch] = useState('');
  const [transportFilter, setTransportFilter] = useState<TransportFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [sortField, setSortField] = useState<SortField>('bookingDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...bookings]
      .filter((booking) => {
        const traveller = getPrimaryTraveller(booking);
        const route = getRouteLabel(booking).toLowerCase();
        const operator = getOperatorLabel(booking).toLowerCase();

        if (transportFilter !== 'all' && booking.type !== transportFilter) {
          return false;
        }

        if (statusFilter !== 'all' && booking.status !== statusFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        return [
          traveller.name,
          traveller.email,
          booking.bookingId,
          booking.pnr,
          route,
          operator,
        ].some((value) => value.toLowerCase().includes(query));
      })
      .sort((left, right) => {
        const direction = sortDirection === 'asc' ? 1 : -1;

        if (sortField === 'amount') {
          return (left.finalAmount - right.finalAmount) * direction;
        }

        return (
          (new Date(left[sortField]).getTime() - new Date(right[sortField]).getTime()) * direction
        );
      });
  }, [bookings, search, sortDirection, sortField, statusFilter, transportFilter]);

  const activeFilters = [
    transportFilter !== 'all' ? transportFilter : null,
    statusFilter !== 'all' ? statusFilter : null,
    search ? `"${search}"` : null,
  ].filter(Boolean);

  return (
    <AdminLayout
      title="All Bookings"
      subtitle={`${bookings.length} booking records in the admin seed`}
    >
      <div className="flex flex-col gap-5">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <SummaryCard label="Visible bookings" value={filteredBookings.length.toString()} />
          <SummaryCard
            label="Visible revenue"
            value={currencyFormatter.format(filteredBookings.reduce((sum, booking) => sum + booking.finalAmount, 0))}
          />
          <SummaryCard
            label="Bus share"
            value={filteredBookings.filter((booking) => booking.type === 'bus').length.toString()}
          />
          <SummaryCard
            label="Flight share"
            value={filteredBookings.filter((booking) => booking.type === 'flight').length.toString()}
          />
        </section>

        <section className="card-premium p-4 sm:p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <label className="relative block flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by traveller, route, PNR or booking ID"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-300 focus:bg-white"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <FilterGroup
                  label="Transport"
                  value={transportFilter}
                  options={['all', 'bus', 'flight']}
                  onSelect={(value) => setTransportFilter(value as TransportFilter)}
                />
                <FilterGroup
                  label="Status"
                  value={statusFilter}
                  options={['all', 'confirmed', 'completed', 'cancelled']}
                  onSelect={(value) => setStatusFilter(value as 'all' | BookingStatus)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {activeFilters.length > 0 ? (
                  activeFilters.map((filter) => (
                    <span key={filter} className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
                      {filter}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                    All bookings visible
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <SortButton
                  active={sortField === 'bookingDate'}
                  onClick={() => toggleSort('bookingDate', sortField, sortDirection, setSortField, setSortDirection)}
                >
                  Booked On
                </SortButton>
                <SortButton
                  active={sortField === 'travelDate'}
                  onClick={() => toggleSort('travelDate', sortField, sortDirection, setSortField, setSortDirection)}
                >
                  Travel Date
                </SortButton>
                <SortButton
                  active={sortField === 'amount'}
                  onClick={() => toggleSort('amount', sortField, sortDirection, setSortField, setSortDirection)}
                >
                  Amount
                </SortButton>
              </div>
            </div>
          </div>
        </section>

        <section className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px]">
              <thead className="bg-slate-50">
                <tr>
                  {['Booking', 'Traveller', 'Route', 'Dates', 'Fare', 'Status', 'PNR'].map((heading) => (
                    <th key={heading} className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Search size={30} />
                        </div>
                        <p className="font-poppins text-xl font-black text-slate-950">No bookings matched these filters</p>
                        <p className="text-sm font-medium text-slate-500">Try another route, traveller name, or reset the status filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <BookingRow key={booking.bookingId} booking={booking} index={index} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function BookingRow({ booking, index }: { booking: Booking; index: number }) {
  const traveller = getPrimaryTraveller(booking);
  const travellerCount = getTravellerCount(booking);
  const route = getRouteLabel(booking);
  const operator = getOperatorLabel(booking);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="align-top transition hover:bg-slate-50/70"
    >
      <td className="px-5 py-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${booking.type === 'bus' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
            {booking.type === 'bus' ? <Bus size={18} /> : <Plane size={18} />}
          </div>
          <div>
            <p className="font-poppins text-sm font-black text-slate-950">{booking.bookingId}</p>
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{booking.type}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="font-poppins text-sm font-black text-slate-950">{traveller.name}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{traveller.email}</p>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
          <Users size={12} />
          {travellerCount} traveller{travellerCount > 1 ? 's' : ''}
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="font-poppins text-sm font-black text-slate-950">{route}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{operator}</p>
      </td>
      <td className="px-5 py-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarDays size={14} className="text-slate-400" />
            Travel {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
            Booked {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </p>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="font-poppins text-lg font-black text-slate-950">{currencyFormatter.format(booking.finalAmount)}</p>
        {booking.discount > 0 && (
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-600">
            Saved {currencyFormatter.format(booking.discount)}
          </p>
        )}
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={booking.status} />
      </td>
      <td className="px-5 py-4">
        <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs font-bold tracking-[0.12em] text-slate-700">
          {booking.pnr}
        </span>
      </td>
    </motion.tr>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-1">
      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
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

function SortButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] transition ${
        active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      <ArrowUpDown size={14} />
      {children}
    </button>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-premium p-4 sm:p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="admin-kpi-value mt-3 font-poppins font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function toggleSort(
  nextField: SortField,
  currentField: SortField,
  currentDirection: 'asc' | 'desc',
  setSortField: (field: SortField) => void,
  setSortDirection: (direction: 'asc' | 'desc') => void,
) {
  if (currentField === nextField) {
    setSortDirection(currentDirection === 'asc' ? 'desc' : 'asc');
    return;
  }

  setSortField(nextField);
  setSortDirection('desc');
}
