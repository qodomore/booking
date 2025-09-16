import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Avatar, AvatarFallback } from './avatar';
import { TimeRangeChip } from './time-range-chip';
import { StartTimeChipGrid } from './start-time-chip';
import { Skeleton } from './skeleton';

interface TimeRange {
  start: string;
  end: string;
}

interface ResourceCardProps {
  id: string;
  name: string;
  rating: number;
  specialties: string[];
  bookingCount?: number;
  variant: 'availability' | 'start-times' | 'loading';
  
  // For availability variant
  availableRanges?: TimeRange[];
  nextAvailable?: string;
  availableHours?: number;
  emptyState?: 'none-today' | 'heavy-load';
  
  // For start-times variant  
  availableStartTimes?: string[];
  selectedTime?: string;
  serviceDuration?: number;
  bufferTime?: number;
  
  onTimeSelect?: (time: string) => void;
  className?: string;
}

export function ResourceCard({
  id,
  name,
  rating,
  specialties,
  bookingCount = 0,
  variant,
  availableRanges = [],
  nextAvailable,
  availableHours = 0,
  emptyState,
  availableStartTimes = [],
  selectedTime,
  serviceDuration,
  bufferTime = 10,
  onTimeSelect,
  className = ''
}: ResourceCardProps) {
  
  if (variant === 'loading') {
    return (
      <Card className={`clean-card ${className}`}>
        <CardContent className="p-4 space-y-4">
          {/* Master Header Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderAvailabilityContent = () => {
    if (emptyState === 'none-today') {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Доступность сегодня:</p>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Сегодня расписано, ближайшее завтра в {nextAvailable}
            </p>
          </div>
        </div>
      );
    }
    
    if (emptyState === 'heavy-load') {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Доступность сегодня:</p>
          <div className="text-center py-4">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              Осталось 1 окно сегодня
            </p>
            <div className="mt-2">
              {availableRanges.map((range, index) => (
                <TimeRangeChip
                  key={index}
                  startTime={range.start}
                  endTime={range.end}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Доступность сегодня:</p>
        
        {availableRanges.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {availableRanges.map((range, index) => (
                <TimeRangeChip
                  key={index}
                  startTime={range.start}
                  endTime={range.end}
                />
              ))}
            </div>
            
            {nextAvailable && availableHours && (
              <p className="text-xs text-muted-foreground">
                Ближайшее окно: {nextAvailable} • Свободно ≈{availableHours} ч
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              На выбранную дату свободных окон нет
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderStartTimesContent = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Доступное время:</p>
          {serviceDuration && (
            <p className="text-xs text-muted-foreground">
              Длительность {serviceDuration} мин • Буфер {bufferTime} мин
            </p>
          )}
        </div>
        
        {availableStartTimes.length > 0 ? (
          <StartTimeChipGrid
            times={availableStartTimes}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
          />
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Нет доступных временных слотов для выбранной услуги
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`clean-card ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Master Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{name}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-sm text-muted-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">
              {bookingCount} записей
            </p>
            <p className="text-xs text-muted-foreground">
              {variant === 'availability' && availableRanges.length > 0 
                ? `${availableRanges.length} окон` 
                : variant === 'start-times' && availableStartTimes.length > 0
                ? `${availableStartTimes.length} слотов`
                : 'занят'
              }
            </p>
          </div>
        </div>

        {/* Content based on variant */}
        {variant === 'availability' && renderAvailabilityContent()}
        {variant === 'start-times' && renderStartTimesContent()}
      </CardContent>
    </Card>
  );
}