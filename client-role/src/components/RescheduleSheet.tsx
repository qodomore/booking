import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { SlotGrid, DateSlots, TimeSlot } from './SlotGrid';

interface RescheduleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newDate: string, newTime: string) => void;
  language: 'ru' | 'en';
  bookingData: {
    serviceName: string;
    provider: string;
    currentDate: string;
    currentTime: string;
    duration: number;
    price: number;
  } | null;
}

export function RescheduleSheet({
  open,
  onOpenChange,
  onConfirm,
  language,
  bookingData,
}: RescheduleSheetProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showMoreTimes, setShowMoreTimes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    ru: {
      title: 'Перенести запись',
      description: 'Выберите новую дату и время',
      currentBooking: 'Текущая запись',
      newBooking: 'Новое время',
      duration: 'Длительность',
      minutes: 'мин',
      cancel: 'Отменить',
      confirm: 'Подтвердить',
      today: 'Сегодня',
      tomorrow: 'Завтра',
    },
    en: {
      title: 'Reschedule Booking',
      description: 'Select new date and time',
      currentBooking: 'Current Booking',
      newBooking: 'New Time',
      duration: 'Duration',
      minutes: 'min',
      cancel: 'Cancel',
      confirm: 'Confirm',
      today: 'Today',
      tomorrow: 'Tomorrow',
    },
  };

  const t = texts[language];

  // Reset selection when sheet opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedDate(null);
      setSelectedTime(null);
      setShowMoreTimes(false);
    }
  }, [open]);

  // Mock function to generate available time slots
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '14:00', '14:30', '15:00',
      '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
    ];
    
    // Simulate some slots being unavailable
    const unavailableSlots = date === 'today' 
      ? ['10:30', '11:00', '14:00', '15:30'] 
      : ['09:30', '12:30'];
    
    return baseSlots
      .filter(slot => !unavailableSlots.includes(slot))
      .map(time => ({
        time,
        available: true,
      }));
  };

  const todaySlots = generateTimeSlots('today');
  const tomorrowSlots = generateTimeSlots('tomorrow');

  const dates: DateSlots[] = [
    { 
      id: 'today', 
      label: t.today, 
      date: new Date().toLocaleDateString('ru-RU'), 
      slots: todaySlots
    },
    { 
      id: 'tomorrow', 
      label: t.tomorrow, 
      date: new Date(Date.now() + 86400000).toLocaleDateString('ru-RU'), 
      slots: tomorrowSlots
    },
  ];

  const handleTimeSelect = (time: string, date: string) => {
    setSelectedTime(time);
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      onOpenChange(false);
    }
  };

  const calculateEndTime = (startTime: string) => {
    if (!bookingData) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + bookingData.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  if (!bookingData) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>{t.title}</SheetTitle>
                <SheetDescription>{t.description}</SheetDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Current Booking Info */}
            <div className="p-4 bg-muted/50">
              <p className="text-xs text-muted-foreground mb-2">{t.currentBooking}</p>
              <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{bookingData.serviceName}</h3>
                    <p className="text-sm text-muted-foreground">{bookingData.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{bookingData.price}₽</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{bookingData.currentDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{bookingData.currentTime}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Slot Selection */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">{t.newBooking}</p>
              <SlotGrid
                dates={dates}
                selectedTime={selectedTime}
                selectedDate={selectedDate}
                onTimeSelect={handleTimeSelect}
                showMoreTimes={showMoreTimes}
                onShowMore={() => setShowMoreTimes(true)}
                language={language}
                isLoading={isLoading}
              />
            </div>

            {/* Selected Time Summary */}
            {selectedTime && selectedDate && (
              <div className="px-4 pb-4">
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {dates.find(d => d.id === selectedDate)?.label}, {selectedTime} - {calculateEndTime(selectedTime)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bookingData.serviceName}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 bg-background">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                {t.cancel}
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
              >
                {t.confirm}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
