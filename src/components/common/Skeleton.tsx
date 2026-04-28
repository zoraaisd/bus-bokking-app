import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  rounded = 'md',
}) => {
  const roundedMap = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`shimmer ${roundedMap[rounded]} ${className}`}
    />
  );
};

export const BusCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-20 ml-auto" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-5 w-20" rounded="full" />
      <Skeleton className="h-5 w-16" rounded="full" />
      <Skeleton className="h-5 w-24" rounded="full" />
    </div>
    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-28" rounded="lg" />
    </div>
  </div>
);

export const FlightCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" rounded="lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-16" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-5 w-20" rounded="full" />
      <Skeleton className="h-5 w-24" rounded="full" />
    </div>
  </div>
);
