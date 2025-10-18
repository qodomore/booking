import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface MasterAvailabilityProps {
  slots: AvailableSlot[];
  onSlotClick: (slotId: string) => void;
  selectedSlot?: string;
}

export function MasterAvailability({ slots, onSlotClick, selectedSlot }: MasterAvailabilityProps) {
  const availableSlots = slots.filter(slot => slot.available);

  if (availableSlots.length === 0) {
    return (
      <Card className="clean-card">
        <CardContent className="p-4 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Нет доступных окон на ближайшее время
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
      return date.toLocaleDateString('ru-RU', options);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg">Ближайшие окна</h2>
      <div className="space-y-4">
        {Object.entries(slotsByDate).map(([date, dateSlots]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatDate(date)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {dateSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedSlot === slot.id ? "default" : "outline"}
                  size="sm"
                  className={selectedSlot === slot.id ? "elegant-button" : ""}
                  onClick={() => onSlotClick(slot.id)}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
