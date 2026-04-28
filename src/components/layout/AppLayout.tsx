import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

interface BottomActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className = '' }: PageShellProps) {
  return <div className={`min-h-screen bg-gray-50 ${className}`}>{children}</div>;
}

export function PageContent({ children, className = '' }: PageContentProps) {
  return (
    <div className={`mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 sm:py-6 ${className}`}>
      {children}
    </div>
  );
}

export function BottomActionBar({ children, className = '' }: BottomActionBarProps) {
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}>
      <div className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6">
        {children}
      </div>
      <div className="bottom-nav-safe bg-white/95" />
    </div>
  );
}
