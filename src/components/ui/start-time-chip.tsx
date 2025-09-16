import React from 'react';

interface StartTimeChipProps {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StartTimeChip({ 
  time, 
  selected = false,
  disabled = false,
  onClick,
  className = '' 
}: StartTimeChipProps) {
  const baseClasses = `
    inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium
    transition-all duration-200 min-h-[44px] min-w-[44px] cursor-pointer
  `;
  
  const getVariantClasses = () => {
    if (disabled) {
      return `
        bg-muted/20 text-muted-foreground border border-muted 
        cursor-not-allowed opacity-60
      `;
    }
    
    if (selected) {
      return `
        bg-primary text-primary-foreground border border-primary
        shadow-lg shadow-primary/25
      `;
    }
    
    return `
      bg-accent text-accent-foreground border border-border
      hover:bg-primary/10 hover:border-primary/50 hover:text-primary
      active:bg-primary/20 active:scale-98
    `;
  };

  return (
    <button 
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {time}
    </button>
  );
}

interface StartTimeChipGridProps {
  times: string[];
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  maxVisible?: number;
  className?: string;
}

export function StartTimeChipGrid({
  times,
  selectedTime,
  onTimeSelect,
  maxVisible = 6,
  className = ''
}: StartTimeChipGridProps) {
  const [showAll, setShowAll] = React.useState(false);
  const visibleTimes = showAll ? times : times.slice(0, maxVisible);
  const hasMore = times.length > maxVisible;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {visibleTimes.map((time) => (
          <StartTimeChip
            key={time}
            time={time}
            selected={selectedTime === time}
            onClick={() => onTimeSelect?.(time)}
          />
        ))}
        
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="
              inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium
              min-h-[44px] min-w-[44px] cursor-pointer transition-all duration-200
              bg-muted text-muted-foreground border border-border
              hover:bg-accent hover:text-accent-foreground
            "
          >
            Ещё +{times.length - maxVisible}
          </button>
        )}
      </div>
    </div>
  );
}