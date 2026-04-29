import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking } from '../types';
import { ADMIN_BOOKING_SEED } from '../data/adminSeed';

interface BookingStore {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  getTotalRevenue: () => number;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: ADMIN_BOOKING_SEED,
  addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
  getTotalRevenue: () => get().bookings.reduce((sum, b) => sum + b.finalAmount, 0),
}));

export function generateBookingId() {
  return 'BF-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
export function generatePNR() {
  return (Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4)).toUpperCase();
}
