import React from 'react';
import { Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

export interface TimeSlot {
  time: string;
  available: boolean;
  masterId?: string;
}

export interface DateSlots {
  id: string;
  label: string;
  date: string;
  slots: TimeSlot[];
}

interface SlotGridProps {
  dates: DateSlots[];
  selectedTime: string | null;
  selectedDate: string | null;
  onTimeSelect: (time: string, date: string) => void;
  showMoreTimes: boolean;
  onShowMore: () => void;
  language: 'ru' | 'en';
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function SlotGrid({
  dates,
  selectedTime,
  selectedDate,
  onTimeSelect,
  showMoreTimes,
  onShowMore,
  language,
  isLoading = false,
  error = null,
  onRetry,
}: SlotGridProps) {
  const texts = {
    ru: {
      more: 'Ещё',
      selectDate: 'Выбрать дату',
      noSlots: 'Нет доступных слотов',
      noSlotsDesc: 'К сожалению, на выбранную дату нет свободных временных окон. Попробуйте другую дату или мастера.',
      loading: 'Загрузка слотов...',
      errorTitle: 'Ошибка загрузки',
      retry: 'Попробовать снова',
    },
    en: {
      more: 'More',
      selectDate: 'Select Date',
      noSlots: 'No available slots',
      noSlotsDesc: 'Unfortunately, there are no free time slots for the selected date. Try another date or master.',
      loading: 'Loading slots...',
      errorTitle: 'Loading error',
      retry: 'Try again',
    },
  };

  const t = texts[language];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 px-4 py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{error}</span>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="flex-shrink-0"
              >
                {t.retry}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if all dates have no slots
  const hasAnySlots = dates.some((dateInfo) => dateInfo.slots.length > 0);

  if (!hasAnySlots) {
    return (
      <div className="flex-1 px-4 py-8">
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium mb-1">{t.noSlots}</h3>
              <p className="text-sm text-muted-foreground">{t.noSlotsDesc}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 space-y-6">
      {dates.map((dateInfo) => {
        if (dateInfo.slots.length === 0) return null;

        const displayedSlots = showMoreTimes
          ? dateInfo.slots
          : dateInfo.slots.slice(0, 6);

        return (
          <div key={dateInfo.id}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">{dateInfo.label}</h3>
              <span className="text-sm text-muted-foreground">• {dateInfo.date}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {displayedSlots.map((slot) => {
                const isSelected =
                  selectedTime === slot.time && selectedDate === dateInfo.id;
                return (
                  <Badge
                    key={slot.time}
                    variant={isSelected ? 'default' : 'secondary'}
                    className={`justify-center py-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                    onClick={() => onTimeSelect(slot.time, dateInfo.id)}
                  >
                    {slot.time}
                  </Badge>
                );
              })}
            </div>

            {dateInfo.slots.length > 6 && !showMoreTimes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowMore}
                className="w-full mt-2 text-primary"
              >
                {t.more}
              </Button>
            )}
          </div>
        );
      })}

      {/* Custom Date Picker */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-0 cursor-pointer hover:bg-card/90 transition-colors">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span>{t.selectDate}</span>
        </div>
      </Card>
    </div>
  );
}
