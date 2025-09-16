import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from './button';
import { useTelegram } from '../../hooks/useTelegram';

interface SlotChipProps {
  time: string;
  available: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function SlotChip({ time, available, isSelected = false, onClick, compact = false }: SlotChipProps) {
  const { hapticFeedback } = useTelegram();

  const handleClick = () => {
    if (available && onClick) {
      hapticFeedback.light();
      onClick();
    }
  };

  if (!available) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium opacity-50 ${
        compact ? 'px-2 py-1' : ''
      }`}>
        {!compact && <Clock className="h-3 w-3" />}
        {time}
      </div>
    );
  }

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 h-auto transition-all duration-200 font-medium ${
        compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      } ${
        isSelected 
          ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
          : 'border-border hover:border-primary/30 hover:bg-primary/5 hover:scale-102'
      }`}
    >
      {!compact && <Clock className="h-3 w-3" />}
      {time}
    </Button>
  );
}

interface SlotGridProps {
  slots: Array<{
    id: string;
    time: string;
    available: boolean;
  }>;
  selectedSlot?: string;
  onSlotSelect: (slotId: string) => void;
  compact?: boolean;
}

export function SlotGrid({ slots, selectedSlot, onSlotSelect, compact = false }: SlotGridProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'gap-1.5' : ''}`}>
      {slots.map((slot) => (
        <SlotChip
          key={slot.id}
          time={slot.time}
          available={slot.available}
          isSelected={selectedSlot === slot.id}
          onClick={() => onSlotSelect(slot.id)}
          compact={compact}
        />
      ))}
    </div>
  );
}