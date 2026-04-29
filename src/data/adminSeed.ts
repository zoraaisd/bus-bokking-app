import { Booking, BookingStatus, BusBooking, FlightBooking, PassengerDetail } from '../types';

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
}

export interface AdminUserRecord extends AdminUserSeed {
  totalBookings: number;
  totalSpent: number;
  completedTrips: number;
  activeBookings: number;
  cancelledBookings: number;
  lastBookingDate?: string;
}

export const ADMIN_USER_SEED: AdminUserSeed[] = [
  {
    id: 'USR-1001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@gmail.com',
    phone: '+91 99887 76655',
    city: 'Chennai',
    joinedAt: '2026-01-12',
    loyaltyTier: 'Elite',
    preferredTransport: 'balanced',
    status: 'active',
  },
  {
    id: 'USR-1002',
    name: 'Priya Nair',
    email: 'priya.nair@gmail.com',
    phone: '+91 98765 43210',
    city: 'Coimbatore',
    joinedAt: '2026-02-03',
    loyaltyTier: 'Silver',
    preferredTransport: 'bus',
    status: 'active',
  },
  {
    id: 'USR-1003',
    name: 'Rahul Mehta',
    email: 'rahul@corp.com',
    phone: '+91 91234 56789',
    city: 'Delhi',
    joinedAt: '2025-11-28',
    loyaltyTier: 'Gold',
    preferredTransport: 'flight',
    status: 'active',
    company: 'NorthStar Logistics',
  },
  {
    id: 'USR-1004',
    name: 'Sneha Reddy',
    email: 'sneha@gmail.com',
    phone: '+91 97123 45678',
    city: 'Hyderabad',
    joinedAt: '2026-03-08',
    loyaltyTier: 'Silver',
    preferredTransport: 'bus',
    status: 'active',
  },
  {
    id: 'USR-1005',
    name: 'Kiran Reddy',
    email: 'kiran@gmail.com',
    phone: '+91 96123 45678',
    city: 'Hyderabad',
    joinedAt: '2026-03-08',
    loyaltyTier: 'Silver',
    preferredTransport: 'bus',
    status: 'active',
  },
  {
    id: 'USR-1006',
    name: 'Meera Reddy',
    email: 'meera@gmail.com',
    phone: '+91 95123 45678',
    city: 'Hyderabad',
    joinedAt: '2026-03-11',
    loyaltyTier: 'Silver',
    preferredTransport: 'bus',
    status: 'active',
  },
  {
    id: 'USR-1007',
    name: 'Amit Joshi',
    email: 'amit@gmail.com',
    phone: '+91 98451 23456',
    city: 'Mumbai',
    joinedAt: '2026-01-24',
    loyaltyTier: 'Gold',
    preferredTransport: 'flight',
    status: 'active',
  },
  {
    id: 'USR-1008',
    name: 'Pooja Joshi',
    email: 'pooja@gmail.com',
    phone: '+91 98456 54321',
    city: 'Mumbai',
    joinedAt: '2026-01-24',
    loyaltyTier: 'Gold',
    preferredTransport: 'flight',
    status: 'active',
  },
  {
    id: 'USR-1009',
    name: 'Zoya Khan',
    email: 'zoya.khan@gmail.com',
    phone: '+91 93450 12098',
    city: 'Bengaluru',
    joinedAt: '2026-02-18',
    loyaltyTier: 'Elite',
    preferredTransport: 'flight',
    status: 'active',
  },
  {
    id: 'USR-1010',
    name: 'Dev Patel',
    email: 'dev.patel@gmail.com',
    phone: '+91 90011 22447',
    city: 'Ahmedabad',
    joinedAt: '2026-04-02',
    loyaltyTier: 'Silver',
    preferredTransport: 'bus',
    status: 'inactive',
  },
];

const createBusBooking = (booking: BusBooking): Booking => booking;
const createFlightBooking = (booking: FlightBooking): Booking => booking;

export const ADMIN_BOOKING_SEED: Booking[] = [
  createBusBooking({
    type: 'bus',
    bookingId: 'BF-BUS-001',
    pnr: 'BUS7841',
    bus: {
      id: 'bus-1',
      operatorName: 'RedBus Express',
      busName: 'Volvo 9400',
      busType: 'Sleeper',
      isAC: true,
      departure: '22:00',
      arrival: '06:00',
      from: 'Chennai',
      to: 'Bengaluru',
      duration: '8h',
      price: 749,
      rating: 4.5,
      totalRatings: 1200,
      seatsAvailable: 8,
      totalSeats: 40,
      amenities: ['AC', 'Blanket', 'Water Bottle'],
      tags: ['AC', 'Sleeper'],
      policies: ['ID required', 'Reporting 20 mins early'],
    },
    seats: ['L3', 'L4'],
    boardingPoint: {
      id: 'bp1',
      name: 'Koyambedu Bus Terminus',
      time: '22:00',
      address: 'Chennai',
      landmark: 'Opposite Metro Gate 2',
    },
    droppingPoint: {
      id: 'dp1',
      name: 'Majestic Bus Stand',
      time: '06:00',
      address: 'Bengaluru',
      landmark: 'Platform 11',
    },
    passengers: [
      {
        name: 'Arjun Sharma',
        age: 28,
        gender: 'male',
        email: 'arjun.sharma@gmail.com',
        phone: '+91 99887 76655',
      },
    ],
    totalAmount: 1498,
    discount: 100,
    finalAmount: 1398,
    paymentMethod: 'upi',
    bookingDate: '2026-04-23T10:15:00.000Z',
    travelDate: '2026-05-05',
    status: 'confirmed',
  }),
  createFlightBooking({
    type: 'flight',
    bookingId: 'BF-FLT-002',
    pnr: 'FLT9234',
    flight: {
      id: 'f1',
      airline: 'IndiGo',
      flightNumber: '6E-204',
      aircraft: 'A320',
      from: 'Chennai',
      to: 'Mumbai',
      fromCode: 'MAA',
      toCode: 'BOM',
      departure: '07:30',
      arrival: '09:45',
      duration: '2h 15m',
      price: 4299,
      originalPrice: 5500,
      stops: 0,
      meal: false,
      refundable: false,
      baggageIncluded: 15,
      handBaggage: 7,
      seatsLeft: 12,
      cabinClass: 'Economy',
      terminal: { departure: '1', arrival: '2' },
      tags: ['Non-stop'],
    },
    cabinClass: 'Economy',
    travellers: [
      {
        name: 'Arjun Sharma',
        age: 28,
        gender: 'male',
        email: 'arjun.sharma@gmail.com',
        phone: '+91 99887 76655',
      },
    ],
    totalAmount: 4299,
    discount: 500,
    finalAmount: 3799,
    paymentMethod: 'card',
    bookingDate: '2026-04-18T07:00:00.000Z',
    travelDate: '2026-05-10',
    status: 'confirmed',
  }),
  createBusBooking({
    type: 'bus',
    bookingId: 'BF-BUS-003',
    pnr: 'BUS2256',
    bus: {
      id: 'bus-3',
      operatorName: 'SRS Travels',
      busName: 'Scania Metrolink',
      busType: 'Semi-Sleeper',
      isAC: true,
      departure: '21:00',
      arrival: '05:30',
      from: 'Chennai',
      to: 'Coimbatore',
      duration: '7h 30m',
      price: 549,
      rating: 4.2,
      totalRatings: 870,
      seatsAvailable: 14,
      totalSeats: 42,
      amenities: ['AC', 'USB Charging'],
      tags: ['AC'],
      policies: ['No smoking', 'Carry valid ID'],
    },
    seats: ['U5'],
    boardingPoint: {
      id: 'bp2',
      name: 'CMBT',
      time: '21:00',
      address: 'Chennai',
      landmark: 'Bay 7',
    },
    droppingPoint: {
      id: 'dp2',
      name: 'Gandhipuram',
      time: '05:30',
      address: 'Coimbatore',
      landmark: 'Central Bus Stop',
    },
    passengers: [
      {
        name: 'Priya Nair',
        age: 25,
        gender: 'female',
        email: 'priya.nair@gmail.com',
        phone: '+91 98765 43210',
      },
    ],
    totalAmount: 549,
    discount: 50,
    finalAmount: 499,
    paymentMethod: 'wallet',
    bookingDate: '2026-04-16T13:20:00.000Z',
    travelDate: '2026-04-20',
    status: 'completed',
  }),
  createFlightBooking({
    type: 'flight',
    bookingId: 'BF-FLT-004',
    pnr: 'FLT3381',
    flight: {
      id: 'f2',
      airline: 'Air India',
      flightNumber: 'AI-544',
      aircraft: 'B737',
      from: 'Chennai',
      to: 'Delhi',
      fromCode: 'MAA',
      toCode: 'DEL',
      departure: '06:00',
      arrival: '09:00',
      duration: '3h',
      price: 6599,
      originalPrice: 7800,
      stops: 0,
      meal: true,
      refundable: true,
      baggageIncluded: 20,
      handBaggage: 7,
      seatsLeft: 4,
      cabinClass: 'Business',
      terminal: { departure: '4', arrival: '3' },
      tags: ['Meal', 'Refundable'],
    },
    cabinClass: 'Business',
    travellers: [
      {
        name: 'Rahul Mehta',
        age: 34,
        gender: 'male',
        email: 'rahul@corp.com',
        phone: '+91 91234 56789',
      },
    ],
    totalAmount: 6599,
    discount: 0,
    finalAmount: 6599,
    paymentMethod: 'card',
    bookingDate: '2026-04-12T09:10:00.000Z',
    travelDate: '2026-04-15',
    status: 'completed',
  }),
  createBusBooking({
    type: 'bus',
    bookingId: 'BF-BUS-005',
    pnr: 'BUS5512',
    bus: {
      id: 'bus-5',
      operatorName: 'VRL Travels',
      busName: 'Volvo Multi-Axle',
      busType: 'Sleeper',
      isAC: true,
      departure: '23:00',
      arrival: '07:00',
      from: 'Bengaluru',
      to: 'Hyderabad',
      duration: '8h',
      price: 899,
      rating: 4.4,
      totalRatings: 1560,
      seatsAvailable: 6,
      totalSeats: 44,
      amenities: ['AC', 'Blanket', 'Live Tracking'],
      tags: ['AC', 'Sleeper'],
      policies: ['Carry ticket copy'],
    },
    seats: ['L1', 'L2', 'L3'],
    boardingPoint: {
      id: 'bp3',
      name: 'Majestic',
      time: '23:00',
      address: 'Bengaluru',
      landmark: 'Platform 6',
    },
    droppingPoint: {
      id: 'dp3',
      name: 'MGBS',
      time: '07:00',
      address: 'Hyderabad',
      landmark: 'Gate 4',
    },
    passengers: [
      {
        name: 'Sneha Reddy',
        age: 22,
        gender: 'female',
        email: 'sneha@gmail.com',
        phone: '+91 97123 45678',
      },
      {
        name: 'Kiran Reddy',
        age: 24,
        gender: 'male',
        email: 'kiran@gmail.com',
        phone: '+91 96123 45678',
      },
      {
        name: 'Meera Reddy',
        age: 19,
        gender: 'female',
        email: 'meera@gmail.com',
        phone: '+91 95123 45678',
      },
    ],
    totalAmount: 2697,
    discount: 100,
    finalAmount: 2597,
    paymentMethod: 'upi',
    bookingDate: '2026-04-26T06:30:00.000Z',
    travelDate: '2026-05-02',
    status: 'confirmed',
  }),
  createFlightBooking({
    type: 'flight',
    bookingId: 'BF-FLT-006',
    pnr: 'FLT7720',
    flight: {
      id: 'f3',
      airline: 'Vistara',
      flightNumber: 'UK-820',
      aircraft: 'A321',
      from: 'Mumbai',
      to: 'Goa',
      fromCode: 'BOM',
      toCode: 'GOI',
      departure: '10:00',
      arrival: '11:10',
      duration: '1h 10m',
      price: 3199,
      originalPrice: 4000,
      stops: 0,
      meal: true,
      refundable: false,
      baggageIncluded: 15,
      handBaggage: 7,
      seatsLeft: 20,
      cabinClass: 'Economy',
      terminal: { departure: '2', arrival: '1' },
      tags: ['Meal', 'Non-stop'],
    },
    cabinClass: 'Economy',
    travellers: [
      {
        name: 'Amit Joshi',
        age: 30,
        gender: 'male',
        email: 'amit@gmail.com',
        phone: '+91 98451 23456',
      },
      {
        name: 'Pooja Joshi',
        age: 28,
        gender: 'female',
        email: 'pooja@gmail.com',
        phone: '+91 98456 54321',
      },
    ],
    totalAmount: 6398,
    discount: 800,
    finalAmount: 5598,
    paymentMethod: 'wallet',
    bookingDate: '2026-04-21T14:00:00.000Z',
    travelDate: '2026-05-15',
    status: 'confirmed',
  }),
  createFlightBooking({
    type: 'flight',
    bookingId: 'BF-FLT-007',
    pnr: 'FLT4819',
    flight: {
      id: 'f4',
      airline: 'Akasa Air',
      flightNumber: 'QP-1432',
      aircraft: 'B737 MAX',
      from: 'Bengaluru',
      to: 'Pune',
      fromCode: 'BLR',
      toCode: 'PNQ',
      departure: '18:15',
      arrival: '19:40',
      duration: '1h 25m',
      price: 3899,
      originalPrice: 4600,
      stops: 0,
      meal: false,
      refundable: false,
      baggageIncluded: 15,
      handBaggage: 7,
      seatsLeft: 9,
      cabinClass: 'Economy',
      terminal: { departure: '1', arrival: '1' },
      tags: ['Non-stop'],
    },
    cabinClass: 'Economy',
    travellers: [
      {
        name: 'Zoya Khan',
        age: 31,
        gender: 'female',
        email: 'zoya.khan@gmail.com',
        phone: '+91 93450 12098',
      },
    ],
    totalAmount: 3899,
    discount: 300,
    finalAmount: 3599,
    paymentMethod: 'card',
    bookingDate: '2026-04-27T16:45:00.000Z',
    travelDate: '2026-05-08',
    status: 'confirmed',
  }),
  createBusBooking({
    type: 'bus',
    bookingId: 'BF-BUS-008',
    pnr: 'BUS1138',
    bus: {
      id: 'bus-8',
      operatorName: 'Orange Tours',
      busName: 'Mercedes Benz',
      busType: 'Sleeper',
      isAC: true,
      departure: '20:30',
      arrival: '05:45',
      from: 'Ahmedabad',
      to: 'Udaipur',
      duration: '9h 15m',
      price: 1099,
      rating: 4.1,
      totalRatings: 710,
      seatsAvailable: 11,
      totalSeats: 36,
      amenities: ['AC', 'Wifi', 'Water Bottle'],
      tags: ['Night Ride'],
      policies: ['Boarding closes 10 mins early'],
    },
    seats: ['U2'],
    boardingPoint: {
      id: 'bp8',
      name: 'Paldi Cross Road',
      time: '20:30',
      address: 'Ahmedabad',
      landmark: 'Near BRTS stop',
    },
    droppingPoint: {
      id: 'dp8',
      name: 'Udaipur Central',
      time: '05:45',
      address: 'Udaipur',
      landmark: 'Platform 2',
    },
    passengers: [
      {
        name: 'Dev Patel',
        age: 27,
        gender: 'male',
        email: 'dev.patel@gmail.com',
        phone: '+91 90011 22447',
      },
    ],
    totalAmount: 1099,
    discount: 99,
    finalAmount: 1000,
    paymentMethod: 'upi',
    bookingDate: '2026-04-09T11:30:00.000Z',
    travelDate: '2026-04-12',
    status: 'cancelled',
  }),
];

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
      lastBookingDate: relatedBookings
        .map((booking) => booking.bookingDate)
        .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0],
    };
  }).sort((left, right) => right.totalSpent - left.totalSpent);
}
