import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => 'admin' | 'client' | 'invalid';
  logout: () => void;
}

const mockUsers: Record<string, { password: string; user: AuthUser }> = {
  admin: {
    password: 'admin@123',
    user: {
      username: 'admin',
      role: 'admin',
      name: 'Admin User',
      email: 'admin@busflight.com',
      phone: '+91 98765 43210',
    },
  },
  client: {
    password: 'client@123',
    user: {
      username: 'client',
      role: 'client',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@gmail.com',
      phone: '+91 99887 76655',
    },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username: string, password: string) => {
        const record = mockUsers[username];
        if (!record || record.password !== password) return 'invalid';
        set({ user: record.user, isAuthenticated: true });
        return record.user.role;
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
