import { Booking, BookingStatus, BusBooking, FlightBooking, PassengerDetail } from '../types';
import { mockBuses } from './buses';
import { mockFlights } from './flights';

export interface AdminUserSeed {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  loyaltyTier: 'Elite' | 'Gold' | 'Silver';
  preferredTransport: 'bus' | 'flight' | 'balanced';
  status: 'active' | 'inactive';
  company?: string;
  avatarUrl?: string;
}

export interface AdminUserRecord extends AdminUserSeed {
  totalBookings: number;
  totalSpent: number;
  completedTrips: number;
  activeBookings: number;
  cancelledBookings: number;
  lastBookingDate?: string;
}

const firstNames = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Kiran', 'Meera', 'Amit', 'Pooja', 'Zoya', 'Dev', 'Aditi', 'Rohan', 'Vikram', 'Neha', 'Sanjay', 'Kavita', 'Ravi', 'Anjali', 'Sameer', 'Priyanka'];
const lastNames = ['Sharma', 'Nair', 'Mehta', 'Reddy', 'Joshi', 'Khan', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Desai', 'Iyer', 'Menon', 'Das'];
const cities = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Kochi', 'Jaipur'];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const ADMIN_USER_SEED: AdminUserSeed[] = Array.from({ length: 50 }).map((_, i) => {
  const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
  const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const joins = randomDate(new Date(2025, 0, 1), new Date(2026, 3, 20)).toISOString().split('T')[0];
  const r = Math.random();
  const tier = r > 0.8 ? 'Elite' : r > 0.4 ? 'Gold' : 'Silver';
  const tr = Math.random();
  const transport = tr > 0.6 ? 'flight' : tr > 0.3 ? 'bus' : 'balanced';

  return {
    id: `USR-${1000 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
    phone: `+91 9${Math.floor(Math.random() * 899999999 + 100000000)}`,
    city,
    joinedAt: joins,
    loyaltyTier: tier,
    preferredTransport: transport,
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${fn}%20${ln}&backgroundColor=0f172a,dc2626,4f46e5,059669&textColor=ffffff`,
    company: Math.random() > 0.8 ? 'Acme Corp' : undefined,
  };
});

function generateBookings(): Booking[] {
  const bookings: Booking[] = [];
  const now = new Date();
  
  for (let i = 0; i < 250; i++) {
    const isBus = Math.random() > 0.4;
    const user = ADMIN_USER_SEED[Math.floor(Math.random() * ADMIN_USER_SEED.length)];
    const bookingDate = randomDate(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), now); // Last 60 days
    const travelDate = new Date(bookingDate.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000);
    
    let status: BookingStatus = 'confirmed';
    if (travelDate < now) {
      status = Math.random() > 0.1 ? 'completed' : 'cancelled';
    } else {
      if (Math.random() > 0.9) status = 'cancelled';
    }

    const paxCount = Math.floor(Math.random() * 3) + 1;
    const pax: PassengerDetail[] = Array.from({ length: paxCount }).map((_, idx) => ({
      name: idx === 0 ? user.name : `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${user.name.split(' ')[1]}`,
      age: 20 + Math.floor(Math.random() * 40),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      email: user.email,
      phone: user.phone,
    }));

    if (isBus) {
      const bus = mockBuses[Math.floor(Math.random() * mockBuses.length)];
      const price = bus.price * paxCount;
      const discount = Math.random() > 0.7 ? 100 : 0;
      
      bookings.push({
        type: 'bus',
        bookingId: `BF-BUS-${10000 + i}`,
        pnr: `B${Math.floor(100000 + Math.random() * 900000)}`,
        bus,
        seats: Array.from({ length: paxCount }).map((_, idx) => `L${idx + 1}`),
        boardingPoint: { id: 'b1', name: 'Main Bus Stand', time: bus.departure, address: bus.from, landmark: 'Near station' },
        droppingPoint: { id: 'd1', name: 'Central Stop', time: bus.arrival, address: bus.to, landmark: 'City center' },
        passengers: pax,
        totalAmount: price,
        discount,
        finalAmount: price - discount,
        paymentMethod: 'upi',
        bookingDate: bookingDate.toISOString(),
        travelDate: travelDate.toISOString().split('T')[0],
        status,
      } as BusBooking);
    } else {
      const flight = mockFlights[Math.floor(Math.random() * mockFlights.length)];
      const price = flight.price * paxCount;
      const discount = Math.random() > 0.6 ? 500 : 0;
      
      bookings.push({
        type: 'flight',
        bookingId: `BF-FLT-${20000 + i}`,
        pnr: `F${Math.floor(100000 + Math.random() * 900000)}`,
        flight,
        cabinClass: 'Economy',
        travellers: pax,
        totalAmount: price,
        discount,
        finalAmount: price - discount,
        paymentMethod: 'card',
        bookingDate: bookingDate.toISOString(),
        travelDate: travelDate.toISOString().split('T')[0],
        status,
      } as FlightBooking);
    }
  }
  
  return bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
}

export const ADMIN_BOOKING_SEED: Booking[] = generateBookings();

export function getPrimaryTraveller(booking: Booking): PassengerDetail {
  return booking.type === 'bus' ? booking.passengers[0] : booking.travellers[0];
}

export function getTravellerCount(booking: Booking) {
  return booking.type === 'bus' ? booking.passengers.length : booking.travellers.length;
}

export function getTransportLabel(booking: Booking) {
  return booking.type === 'bus' ? 'Bus' : 'Flight';
}

export function getRouteLabel(booking: Booking) {
  return booking.type === 'bus'
    ? `${booking.bus.from} to ${booking.bus.to}`
    : `${booking.flight.from} to ${booking.flight.to}`;
}

export function getOperatorLabel(booking: Booking) {
  return booking.type === 'bus' ? booking.bus.operatorName : booking.flight.airline;
}

export function getActiveBookingCount(bookings: Booking[]) {
  return bookings.filter((booking) => booking.status === 'confirmed').length;
}

export function getStatusCount(bookings: Booking[], status: BookingStatus) {
  return bookings.filter((booking) => booking.status === status).length;
}

export function buildAdminUsers(bookings: Booking[]): AdminUserRecord[] {
  return ADMIN_USER_SEED.map((user) => {
    const relatedBookings = bookings.filter((booking) => {
      const travellers = booking.type === 'bus' ? booking.passengers : booking.travellers;
      return travellers.some((traveller) => traveller.email === user.email);
    });

    return {
      ...user,
      totalBookings: relatedBookings.length,
      totalSpent: relatedBookings.reduce((sum, booking) => sum + booking.finalAmount, 0),
      completedTrips: relatedBookings.filter((booking) => booking.status === 'completed').length,
      activeBookings: relatedBookings.filter((booking) => booking.status === 'confirmed').length,
      cancelledBookings: relatedBookings.filter((booking) => booking.status === 'cancelled').length,
      lastBookingDate: relatedBookings.length > 0 ? relatedBookings
        .map((booking) => booking.bookingDate)
        .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] : undefined,
    };
  }).sort((left, right) => right.totalSpent - left.totalSpent);
}
