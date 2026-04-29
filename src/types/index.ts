// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  username: string;
  role: 'admin' | 'client';
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// ─── Bus ──────────────────────────────────────────────────────────────────────
export type BusSeatType = 'Seater' | 'Sleeper' | 'Semi-Sleeper';
export type BusAmenity = 'AC' | 'Non-AC' | 'Wifi' | 'USB Charging' | 'Blanket' | 'Water Bottle' | 'Live Tracking';

export interface Bus {
  id: string;
  operatorName: string;
  busName: string;
  busType: BusSeatType;
  isAC: boolean;
  departure: string;
  arrival: string;
  duration: string;
  from: string;
  to: string;
  price: number;
  rating: number;
  totalRatings: number;
  seatsAvailable: number;
  totalSeats: number;
  amenities: BusAmenity[];
  tags: string[];
  policies: string[];
}

export type SeatStatus = 'available' | 'booked' | 'selected' | 'ladies' | 'disabled';
export type DeckType = 'lower' | 'upper';

export interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  deck: DeckType;
  isWindow: boolean;
  price: number;
}

// ─── Flight ───────────────────────────────────────────────────────────────────
export type CabinClass = 'Economy' | 'Business' | 'First Class';

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice: number;
  cabinClass: CabinClass;
  seatsLeft: number;
  tags: string[];
  baggageIncluded: number; // kg
  handBaggage: number; // kg
  terminal: { departure: string; arrival: string };
  stops: number;
  meal: boolean;
  refundable: boolean;
  isInternational?: boolean;
}

// ─── Boarding Points ───────────────────────────────────────────────────────────
export interface BoardingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  landmark: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export type BookingType = 'bus' | 'flight';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface PassengerDetail {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  title?: 'Mr' | 'Ms' | 'Mrs';
  firstName?: string;
  lastName?: string;
  dob?: string;
  passportNo?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  nationality?: string;
}

export interface BusBooking {
  type: 'bus';
  bookingId: string;
  bus: Bus;
  seats: string[];
  boardingPoint: BoardingPoint;
  droppingPoint: BoardingPoint;
  passengers: PassengerDetail[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  bookingDate: string;
  travelDate: string;
  status: BookingStatus;
  pnr: string;
}

export interface FlightBooking {
  type: 'flight';
  bookingId: string;
  flight: Flight;
  cabinClass: CabinClass;
  travellers: PassengerDetail[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  bookingDate: string;
  travelDate: string;
  status: BookingStatus;
  pnr: string;
  fareType?: 'Handbag Only Fare' | 'Regular Fare';
}

export type Booking = BusBooking | FlightBooking;

// ─── Offer ────────────────────────────────────────────────────────────────────
export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  type: 'flat' | 'percent';
  minAmount: number;
  maxDiscount: number;
  color: string;
  icon: string;
  applicableTo: 'bus' | 'flight' | 'both';
}

// ─── Search ───────────────────────────────────────────────────────────────────
export interface BusSearch {
  from: string;
  to: string;
  date: string;
}

export interface FlightSearch {
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;
  travellers: number;
  cabinClass: CabinClass;
  fareType?: 'Handbag Only Fare' | 'Regular Fare';
}
