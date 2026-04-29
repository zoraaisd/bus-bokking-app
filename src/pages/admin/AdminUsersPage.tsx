import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Mail, Phone, MapPin, ShieldCheck, Crown, MoreHorizontal, User as UserIcon } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { buildAdminUsers, ADMIN_BOOKING_SEED } from '../../data/adminSeed';

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export default function AdminUsersPage() {
  const users = useMemo(() => buildAdminUsers(ADMIN_BOOKING_SEED), []);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'Elite' | 'Gold' | 'Silver'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter(u => {
      if (tierFilter !== 'all' && u.loyaltyTier !== tierFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (!q) return true;
      return [u.name, u.email, u.phone, u.city, u.company || ''].some(v => v.toLowerCase().includes(q));
    });
  }, [users, search, tierFilter, statusFilter]);

  const stats = [
    { label: 'Total Users', value: users.length, icon: UserIcon, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: ShieldCheck, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Elite Members', value: users.filter(u => u.loyaltyTier === 'Elite').length, icon: Crown, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Tracked Spend', value: currencyFormatter.format(users.reduce((acc, u) => acc + u.totalSpent, 0)), icon: UserIcon, color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  return (
    <AdminLayout title="User Management" subtitle={`Managing ${users.length} registered customers.`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* KPI Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 16, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <stat.icon size={24} />
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</p>
              <p style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: 900, color: '#0F172A', marginTop: 4, letterSpacing: '-0.5px' }}>{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Filters Area */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between' }}>
          
          <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : 400 }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..." 
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: 12, outline: 'none', fontFamily: 'Inter', fontSize: 14, color: '#0F172A', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
              {['all', 'Elite', 'Gold', 'Silver'].map(f => (
                <button key={f} onClick={() => setTierFilter(f as any)} style={{ padding: '8px 16px', background: tierFilter === f ? '#fff' : 'transparent', color: tierFilter === f ? '#0F172A' : '#64748B', border: 'none', borderRadius: 8, fontFamily: 'Inter', fontWeight: 700, fontSize: 13, textTransform: 'capitalize', cursor: 'pointer', boxShadow: tierFilter === f ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
              {['all', 'active', 'inactive'].map(f => (
                <button key={f} onClick={() => setStatusFilter(f as any)} style={{ padding: '8px 16px', background: statusFilter === f ? '#fff' : 'transparent', color: statusFilter === f ? '#0F172A' : '#64748B', border: 'none', borderRadius: 8, fontFamily: 'Inter', fontWeight: 700, fontSize: 13, textTransform: 'capitalize', cursor: 'pointer', boxShadow: statusFilter === f ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        {filteredUsers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: '#fff', borderRadius: 24, border: '1px dashed #CBD5E1' }}>
            <Filter size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>No users found</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#64748B', margin: '8px 0 0 0' }}>Try adjusting your filters or search terms.</p>
          </div>
        ) : isMobile ? (
          // Mobile Cards
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredUsers.map((u, i) => <UserCard key={u.id} user={u} index={i} />)}
          </div>
        ) : (
          // Desktop Table
          <div style={{ background: '#fff', borderRadius: 24, padding: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  {['User', 'Contact Info', 'Loyalty', 'Activity', 'Spend', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '16px 24px', fontFamily: 'Inter', fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <UserTableRow key={u.id} user={u} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

function UserTableRow({ user, index }: { user: any; index: number }) {
  return (
    <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 > 1 ? 0 : index * 0.05 }} style={{ borderBottom: '1px solid #F1F5F9' }}>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 800, fontSize: 16, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 15, color: '#0F172A' }}>{user.name}</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, color: '#64748B', marginTop: 2 }}>{user.company || 'Individual'}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#334155' }}><Mail size={14} color="#94A3B8" /> {user.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#334155' }}><Phone size={14} color="#94A3B8" /> {user.phone}</div>
        </div>
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 8, background: user.loyaltyTier === 'Elite' ? '#FEF3C7' : user.loyaltyTier === 'Gold' ? '#FEF9C3' : '#F1F5F9', color: user.loyaltyTier === 'Elite' ? '#D97706' : user.loyaltyTier === 'Gold' ? '#CA8A04' : '#475569', fontFamily: 'Inter', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {user.loyaltyTier}
          </div>
          <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 8, background: user.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: user.status === 'active' ? '#059669' : '#DC2626', fontFamily: 'Inter', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {user.status}
          </div>
        </div>
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{user.totalBookings} Bookings</div>
          <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: '#64748B' }}>Last: {user.lastBookingDate ? new Date(user.lastBookingDate).toLocaleDateString() : 'N/A'}</div>
        </div>
      </td>
      <td style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{currencyFormatter.format(user.totalSpent)}</div>
      </td>
      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
        <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 8 }}>
          <MoreHorizontal size={20} />
        </button>
      </td>
    </motion.tr>
  );
}

function UserCard({ user, index }: { user: any; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 > 1 ? 0 : index * 0.05 }}
      style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 800, fontSize: 18, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{user.name}</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, color: '#64748B', marginTop: 2 }}>{user.company || 'Individual'}</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#334155' }}><Mail size={16} color="#64748B" /> {user.email}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#334155' }}><Phone size={16} color="#64748B" /> {user.phone}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#334155' }}><MapPin size={16} color="#64748B" /> {user.city}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 8, background: user.loyaltyTier === 'Elite' ? '#FEF3C7' : user.loyaltyTier === 'Gold' ? '#FEF9C3' : '#F1F5F9', color: user.loyaltyTier === 'Elite' ? '#D97706' : user.loyaltyTier === 'Gold' ? '#CA8A04' : '#475569', fontFamily: 'Inter', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {user.loyaltyTier}
          </div>
          <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 8, background: user.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: user.status === 'active' ? '#059669' : '#DC2626', fontFamily: 'Inter', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {user.status}
          </div>
        </div>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{user.totalBookings} Bookings</div>
      </div>

      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Spent</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 20, color: '#0F172A', fontWeight: 800 }}>{currencyFormatter.format(user.totalSpent)}</div>
        </div>
        <button style={{ padding: '8px 16px', background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: 10, fontFamily: 'Inter', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          Profile
        </button>
      </div>
    </motion.div>
  );
}
