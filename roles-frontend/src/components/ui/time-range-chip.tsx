import React from 'react';
import { Clock } from 'lucide-react';

interface TimeRangeChipProps {
  startTime: string;
  endTime: string;
  variant?: 'default' | 'disabled';
  className?: string;
}

export function TimeRangeChip({ 
  startTime, 
  endTime, 
  variant = 'default',
  className = '' 
}: TimeRangeChipProps) {
  const isDisabled = variant === 'disabled';
  
  const baseClasses = `
    inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
    transition-all duration-200 min-h-[44px] min-w-[44px]
  `;
  
  const variantClasses = {
    default: `
      bg-muted/50 text-foreground border border-border
      hover:bg-muted hover:border-primary/30 
      active:bg-muted/80
    `,
    disabled: `
      bg-muted/20 text-muted-foreground border border-muted 
      cursor-not-allowed opacity-60
    `
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <Clock className="h-4 w-4" />
      <span>
        {startTime}–{endTime}
      </span>
    </div>
  );
}