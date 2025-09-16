import React from "react";
import { Badge } from "./badge";
import { Button } from "./button";

interface SegmentChipProps {
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const variantStyles = {
  default: {
    active: 'bg-primary text-primary-foreground border-primary',
    inactive: 'bg-background text-foreground border-border hover:bg-accent'
  },
  danger: {
    active: 'bg-red-500 text-white border-red-500',
    inactive: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
  },
  warning: {
    active: 'bg-orange-500 text-white border-orange-500', 
    inactive: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
  },
  success: {
    active: 'bg-green-500 text-white border-green-500',
    inactive: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
  },
  info: {
    active: 'bg-blue-500 text-white border-blue-500',
    inactive: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
  }
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export function SegmentChip({ 
  label, 
  count, 
  isActive = false, 
  onClick,
  variant = 'default',
  size = 'md',
  showCount = true
}: SegmentChipProps) {
  const styles = variantStyles[variant];
  const currentStyle = isActive ? styles.active : styles.inactive;
  const sizeStyle = sizeStyles[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (onClick) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className={`
          ${currentStyle} 
          ${sizeStyle}
          border 
          transition-all 
          duration-200 
          hover:scale-105 
          active:scale-95
          rounded-full
          gap-1.5
          min-h-8
        `}
      >
        <span>{label}</span>
        {showCount && count !== undefined && (
          <Badge 
            variant="secondary" 
            className={`
              ${isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'} 
              text-xs 
              px-1.5 
              py-0.5 
              min-w-5 
              h-5 
              flex 
              items-center 
              justify-center
              border-0
            `}
          >
            {count}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className={`
      ${currentStyle} 
      ${sizeStyle}
      border 
      rounded-full 
      inline-flex 
      items-center 
      gap-1.5
      min-h-8
    `}>
      <span>{label}</span>
      {showCount && count !== undefined && (
        <Badge 
          variant="secondary" 
          className={`
            ${isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'} 
            text-xs 
            px-1.5 
            py-0.5 
            min-w-5 
            h-5 
            flex 
            items-center 
            justify-center
            border-0
          `}
        >
          {count}
        </Badge>
      )}
    </div>
  );
}

// Компонент для группы сегментных чипов
interface SegmentChipGroupProps {
  segments: Array<{
    id: string;
    label: string;
    count?: number;
    variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  }>;
  activeSegment?: string;
  onSegmentChange?: (segmentId: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SegmentChipGroup({
  segments,
  activeSegment,
  onSegmentChange,
  size = 'md',
  className = ''
}: SegmentChipGroupProps) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {segments.map((segment) => (
        <SegmentChip
          key={segment.id}
          label={segment.label}
          count={segment.count}
          variant={segment.variant}
          isActive={activeSegment === segment.id}
          onClick={() => onSegmentChange?.(segment.id)}
          size={size}
        />
      ))}
    </div>
  );
}

// Утилитарные функции
export const getRiskVariant = (riskLevel: 'low' | 'medium' | 'high'): 'success' | 'warning' | 'danger' => {
  switch (riskLevel) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'danger';
  }
};

export const formatSegmentCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};