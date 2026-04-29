import { Offer } from '../types';

export const offers: Offer[] = [
  {
    id: 'offer-001',
    code: 'FIRST100',
    title: 'First Booking Offer',
    description: 'Flat ₹100 off on your first bus booking',
    discount: 100,
    type: 'flat',
    minAmount: 300,
    maxDiscount: 100,
    color: 'from-red-500 to-rose-600',
    icon: '🎉',
    applicableTo: 'bus',
  },
  {
    id: 'offer-002',
    code: 'FLYLOW20',
    title: 'Flight Discount',
    description: '20% off on flights — limited time offer!',
    discount: 20,
    type: 'percent',
    minAmount: 3000,
    maxDiscount: 1500,
    color: 'from-orange-500 to-amber-500',
    icon: '✈️',
    applicableTo: 'flight',
  },
  {
    id: 'offer-003',
    code: 'WEEKEND50',
    title: 'Weekend Special',
    description: 'Flat ₹50 off on all weekend bus bookings',
    discount: 50,
    type: 'flat',
    minAmount: 200,
    maxDiscount: 50,
    color: 'from-violet-500 to-purple-600',
    icon: '🌟',
    applicableTo: 'both',
  },
  {
    id: 'offer-004',
    code: 'NEWUSER15',
    title: 'New User Bonus',
    description: '15% off for new users on all bookings',
    discount: 15,
    type: 'percent',
    minAmount: 500,
    maxDiscount: 800,
    color: 'from-emerald-500 to-teal-600',
    icon: '🚀',
    applicableTo: 'both',
  },
];

export const popularRoutes = [
  { from: 'Chennai', to: 'Bangalore', icon: '🚌', price: 349 },
  { from: 'Chennai', to: 'Mumbai', icon: '✈️', price: 3299 },
  { from: 'Chennai', to: 'Hyderabad', icon: '✈️', price: 2499 },
  { from: 'Chennai', to: 'Coimbatore', icon: '🚌', price: 299 },
];

export const cities = [
  'Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 
  'Coimbatore', 'Madurai', 'Pune', 'Kolkata', 'Goa',
  'Kochi', 'Trichy', 'Salem', 'Vellore', 'Pondicherry'
];

export const flightCities = [
  { city: 'Mumbai', code: 'BOM' },
  { city: 'Delhi', code: 'DEL' },
  { city: 'Hyderabad', code: 'HYD' },
  { city: 'Kolkata', code: 'CCU' },
  { city: 'Goa', code: 'GOI' },
  { city: 'Bangalore', code: 'BLR' },
  { city: 'Chennai', code: 'MAA' },
  { city: 'Pune', code: 'PNQ' },
  { city: 'Ahmedabad', code: 'AMD' },
  { city: 'Kochi', code: 'COK' },
  { city: 'Trivandrum', code: 'TRV' },
  { city: 'Madurai', code: 'IXM' },
  { city: 'Coimbatore', code: 'CJB' },
  { city: 'Kuala Lumpur', code: 'KUL' },
  { city: 'Dubai', code: 'DXB' },
  { city: 'Singapore', code: 'SIN' },
  { city: 'Bangkok', code: 'BKK' },
  { city: 'London', code: 'LHR' },
  { city: 'New York', code: 'JFK' },
  { city: 'Paris', code: 'CDG' },
];
