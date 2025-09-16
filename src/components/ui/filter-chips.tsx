import React from 'react';
import { Calendar, Clock, DollarSign, Filter } from 'lucide-react';
import { Button } from './button';
import { useTelegram } from '../../hooks/useTelegram';

interface FilterChip {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  count?: number;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onFilterToggle: (filterId: string) => void;
  showFilterButton?: boolean;
  onFilterMenuOpen?: () => void;
}

export function FilterChips({ filters, onFilterToggle, showFilterButton = false, onFilterMenuOpen }: FilterChipsProps) {
  const { hapticFeedback } = useTelegram();

  const handleFilterToggle = (filterId: string) => {
    hapticFeedback.light();
    onFilterToggle(filterId);
  };

  const handleFilterMenuOpen = () => {
    hapticFeedback.medium();
    onFilterMenuOpen?.();
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Quick filters */}
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <Button
            key={filter.id}
            variant={filter.active ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterToggle(filter.id)}
            className={`flex-shrink-0 h-9 px-3 transition-all duration-200 ${
              filter.active 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'border-border hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            {Icon && <Icon className="h-4 w-4 mr-1.5" />}
            {filter.label}
            {filter.count !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                filter.active 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {filter.count}
              </span>
            )}
          </Button>
        );
      })}
      
      {/* Advanced filters button */}
      {showFilterButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFilterMenuOpen}
          className="flex-shrink-0 h-9 px-3 border border-dashed border-border hover:border-primary/30"
        >
          <Filter className="h-4 w-4 mr-1.5" />
          Фильтры
        </Button>
      )}
    </div>
  );
}

// Predefined filter sets
export const timeFilters: FilterChip[] = [
  { id: 'today', label: 'Сегодня', icon: Calendar },
  { id: 'tomorrow', label: 'Завтра', icon: Calendar },
  { id: 'quick', label: '≤60 мин', icon: Clock },
];

export const priceFilters: FilterChip[] = [
  { id: 'budget', label: 'До ₽2000', icon: DollarSign },
  { id: 'medium', label: '₽2000-5000', icon: DollarSign },
  { id: 'premium', label: 'От ₽5000', icon: DollarSign },
];

interface DateChipsProps {
  selectedDate: 'today' | 'tomorrow' | 'custom';
  onDateSelect: (date: 'today' | 'tomorrow' | 'custom') => void;
  customDate?: string;
}

export function DateChips({ selectedDate, onDateSelect, customDate }: DateChipsProps) {
  const { hapticFeedback } = useTelegram();

  const handleDateSelect = (date: 'today' | 'tomorrow' | 'custom') => {
    hapticFeedback.light();
    onDateSelect(date);
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={selectedDate === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleDateSelect('today')}
        className={`h-10 px-4 transition-all duration-200 ${
          selectedDate === 'today' 
            ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
            : 'hover:scale-102'
        }`}
      >
        Сегодня
        <span className="ml-1 text-xs opacity-70">
          {formatDate(today)}
        </span>
      </Button>
      
      <Button
        variant={selectedDate === 'tomorrow' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleDateSelect('tomorrow')}
        className={`h-10 px-4 transition-all duration-200 ${
          selectedDate === 'tomorrow' 
            ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
            : 'hover:scale-102'
        }`}
      >
        Завтра
        <span className="ml-1 text-xs opacity-70">
          {formatDate(tomorrow)}
        </span>
      </Button>
      
      <Button
        variant={selectedDate === 'custom' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleDateSelect('custom')}
        className={`h-10 px-4 transition-all duration-200 ${
          selectedDate === 'custom' 
            ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
            : 'hover:scale-102'
        }`}
      >
        {customDate ? customDate : 'Дата'}
        <Calendar className="ml-1.5 h-3 w-3" />
      </Button>
    </div>
  );
}