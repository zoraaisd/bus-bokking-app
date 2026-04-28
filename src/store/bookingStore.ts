import { create } from 'zustand';
import { Booking } from '../types';

// Pre-loaded mock bookings for admin panel demo
const MOCK_BOOKINGS: Booking[] = [
  {
    type: 'bus', bookingId: 'BF-BUS-001', pnr: 'BUS7841',
    bus: { id: 'bus-1', operatorName: 'RedBus Express', busName: 'Volvo 9400', busType: 'Sleeper', isAC: true, departure: '22:00', arrival: '06:00', from: 'Chennai', to: 'Bangalore', duration: '8h', price: 749, originalPrice: 900, rating: 4.5, totalRatings: 1200, seatsAvailable: 8, tags: ['AC', 'Sleeper'], amenities: [] },
    seats: ['L3','L4'], boardingPoint: { id: 'bp1', name: 'Koyambedu Bus Terminus', time: '22:00', address: 'Chennai' },
    droppingPoint: { id: 'dp1', name: 'Majestic Bus Stand', time: '06:00', address: 'Bangalore' },
    passengers: [{ name: 'Arjun Sharma', age: 28, gender: 'male', email: 'arjun@gmail.com', phone: '9988776655' }],
    totalAmount: 1498, discount: 100, finalAmount: 1398, paymentMethod: 'upi',
    bookingDate: new Date(Date.now() - 2*86400000).toISOString(), travelDate: '2026-05-05', status: 'confirmed',
  } as any,
  {
    type: 'flight', bookingId: 'BF-FLT-002', pnr: 'FLT9234',
    flight: { id: 'f1', airline: 'IndiGo', flightNumber: '6E-204', aircraft: 'A320', from: 'Chennai', to: 'Mumbai', fromCode: 'MAA', toCode: 'BOM', departure: '07:30', arrival: '09:45', duration: '2h 15m', price: 4299, originalPrice: 5500, stops: 0, meal: false, refundable: false, baggageIncluded: 15, handBaggage: 7, seatsLeft: 12, cabinClass: 'Economy', terminal: { departure: '1', arrival: '2' }, tags: ['Non-stop'], rating: 4.3, totalRatings: 980 },
    cabinClass: 'Economy',
    travellers: [{ name: 'Arjun Sharma', age: 28, gender: 'male', email: 'arjun@gmail.com', phone: '9988776655' }],
    totalAmount: 4299, discount: 500, finalAmount: 3799, paymentMethod: 'card',
    bookingDate: new Date(Date.now() - 5*86400000).toISOString(), travelDate: '2026-05-10', status: 'confirmed',
  } as any,
  {
    type: 'bus', bookingId: 'BF-BUS-003', pnr: 'BUS2256',
    bus: { id: 'bus-3', operatorName: 'SRS Travels', busName: 'Scania Metrolink', busType: 'Semi-Sleeper', isAC: true, departure: '21:00', arrival: '05:30', from: 'Chennai', to: 'Coimbatore', duration: '7.5h', price: 549, originalPrice: 650, rating: 4.2, totalRatings: 870, seatsAvailable: 14, tags: ['AC'], amenities: [] },
    seats: ['U5'], boardingPoint: { id: 'bp2', name: 'CMBT', time: '21:00', address: 'Chennai' },
    droppingPoint: { id: 'dp2', name: 'Gandhipuram', time: '05:30', address: 'Coimbatore' },
    passengers: [{ name: 'Priya Nair', age: 25, gender: 'female', email: 'priya@gmail.com', phone: '9876543210' }],
    totalAmount: 549, discount: 50, finalAmount: 499, paymentMethod: 'wallet',
    bookingDate: new Date(Date.now() - 8*86400000).toISOString(), travelDate: '2026-04-20', status: 'completed',
  } as any,
  {
    type: 'flight', bookingId: 'BF-FLT-004', pnr: 'FLT3381',
    flight: { id: 'f2', airline: 'Air India', flightNumber: 'AI-544', aircraft: 'B737', from: 'Chennai', to: 'Delhi', fromCode: 'MAA', toCode: 'DEL', departure: '06:00', arrival: '09:00', duration: '3h', price: 6599, originalPrice: 7800, stops: 0, meal: true, refundable: true, baggageIncluded: 20, handBaggage: 7, seatsLeft: 4, cabinClass: 'Business', terminal: { departure: '4', arrival: '3' }, tags: ['Meal', 'Refundable'], rating: 4.6, totalRatings: 2100 },
    cabinClass: 'Business',
    travellers: [{ name: 'Rahul Mehta', age: 34, gender: 'male', email: 'rahul@corp.com', phone: '9123456789' }],
    totalAmount: 6599, discount: 0, finalAmount: 6599, paymentMethod: 'card',
    bookingDate: new Date(Date.now() - 10*86400000).toISOString(), travelDate: '2026-04-15', status: 'completed',
  } as any,
  {
    type: 'bus', bookingId: 'BF-BUS-005', pnr: 'BUS5512',
    bus: { id: 'bus-5', operatorName: 'VRL Travels', busName: 'Volvo Multi-Axle', busType: 'Sleeper', isAC: true, departure: '23:00', arrival: '07:00', from: 'Bangalore', to: 'Hyderabad', duration: '8h', price: 899, originalPrice: 1100, rating: 4.4, totalRatings: 1560, seatsAvailable: 6, tags: ['AC', 'Sleeper'], amenities: [] },
    seats: ['L1','L2','L3'], boardingPoint: { id: 'bp3', name: 'Majestic', time: '23:00', address: 'Bangalore' },
    droppingPoint: { id: 'dp3', name: 'MGBS', time: '07:00', address: 'Hyderabad' },
    passengers: [
      { name: 'Sneha Reddy', age: 22, gender: 'female', email: 'sneha@gmail.com', phone: '9712345678' },
      { name: 'Kiran Reddy', age: 24, gender: 'male', email: 'kiran@gmail.com', phone: '9612345678' },
      { name: 'Meera Reddy', age: 19, gender: 'female', email: 'meera@gmail.com', phone: '9512345678' },
    ],
    totalAmount: 2697, discount: 100, finalAmount: 2597, paymentMethod: 'upi',
    bookingDate: new Date(Date.now() - 1*86400000).toISOString(), travelDate: '2026-05-02', status: 'confirmed',
  } as any,
  {
    type: 'flight', bookingId: 'BF-FLT-006', pnr: 'FLT7720',
    flight: { id: 'f3', airline: 'Vistara', flightNumber: 'UK-820', aircraft: 'A321', from: 'Mumbai', to: 'Goa', fromCode: 'BOM', toCode: 'GOI', departure: '10:00', arrival: '11:10', duration: '1h 10m', price: 3199, originalPrice: 4000, stops: 0, meal: true, refundable: false, baggageIncluded: 15, handBaggage: 7, seatsLeft: 20, cabinClass: 'Economy', terminal: { departure: '2', arrival: '1' }, tags: ['Meal', 'Non-stop'], rating: 4.7, totalRatings: 3400 },
    cabinClass: 'Economy',
    travellers: [
      { name: 'Amit Joshi', age: 30, gender: 'male', email: 'amit@gmail.com', phone: '9845123456' },
      { name: 'Pooja Joshi', age: 28, gender: 'female', email: 'pooja@gmail.com', phone: '9845654321' },
    ],
    totalAmount: 6398, discount: 800, finalAmount: 5598, paymentMethod: 'wallet',
    bookingDate: new Date(Date.now() - 3*86400000).toISOString(), travelDate: '2026-05-15', status: 'confirmed',
  } as any,
];

interface BookingStore {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  getTotalRevenue: () => number;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: MOCK_BOOKINGS,
  addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
  getTotalRevenue: () => get().bookings.reduce((sum, b) => sum + b.finalAmount, 0),
}));

export function generateBookingId() {
  return 'BF-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
export function generatePNR() {
  return (Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4)).toUpperCase();
}
