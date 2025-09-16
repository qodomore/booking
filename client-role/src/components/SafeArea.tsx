import React from 'react';

interface SafeAreaProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function SafeArea({ children, className = '', noPadding = false }: SafeAreaProps) {
  return (
    <div className={`w-full max-w-sm mx-auto min-h-screen ${noPadding ? '' : 'px-4'} ${className}`}>
      <div className="flex flex-col gap-4 pt-4 pb-6">
        {children}
      </div>
    </div>
  );
}

interface SafeAreaSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function SafeAreaSection({ children, className = '' }: SafeAreaSectionProps) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}