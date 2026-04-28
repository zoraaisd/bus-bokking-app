import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'green' | 'orange' | 'blue' | 'gray' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

const variantClasses = {
  red: 'bg-red-100 text-red-700',
  green: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-orange-100 text-orange-700',
  blue: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-violet-100 text-violet-700',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  icon,
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium font-inter
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </span>
  );
};

// Tag Badge specifically for bus/flight cards
interface TagBadgeProps {
  tag: string;
}

const tagColorMap: Record<string, BadgeProps['variant']> = {
  'Top Rated': 'orange',
  'Safe': 'green',
  'Premium': 'purple',
  'New Bus': 'blue',
  'Almost Full': 'red',
  'Budget': 'gray',
  'Non-AC': 'gray',
  'AC Sleeper': 'blue',
  'AC Semi-Sleeper': 'blue',
  'Best Seller': 'orange',
  'Popular': 'orange',
  'Non-stop': 'green',
  'Free Meal': 'orange',
  'Refundable': 'blue',
  'Business': 'purple',
  'Budget Pick': 'gray',
  'New Airline': 'blue',
  'Fastest': 'green',
  'Shortest': 'green',
  'Early Bird': 'orange',
  'Beach Getaway': 'blue',
  'Day Bus': 'blue',
  'Govt. Operated': 'green',
  'Lounge Access': 'purple',
  'Premium Economy': 'purple',
  'Wifi': 'blue',
};

export const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  const variant = tagColorMap[tag] || 'gray';
  return <Badge variant={variant} size="sm">{tag}</Badge>;
};

// Rating badge
export const RatingBadge: React.FC<{ rating: number }> = ({ rating }) => {
  const color = rating >= 4.5 ? 'green' : rating >= 4.0 ? 'orange' : rating >= 3.5 ? 'blue' : 'gray';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${variantClasses[color]}`}>
      ★ {rating}
    </span>
  );
};

// Status badge for bookings
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};
