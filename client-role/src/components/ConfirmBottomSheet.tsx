import React, { useContext, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, Calendar, Clock, MapPin, User } from 'lucide-react';
import { AppContext } from '../App';

interface BookingSlot {
  date: string;
  time: string;
  service: {
    name: string;
    duration: number;
  };
  resource: string;
  price: number;
}

interface ConfirmBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  bookingSlot: BookingSlot;
  onConfirm: () => void;
  onChangeTime: () => void;
}

export function ConfirmBottomSheet({
  isOpen,
  onClose,
  bookingSlot,
  onConfirm,
  onChangeTime
}: ConfirmBottomSheetProps) {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { language } = context;
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [isConflict, setIsConflict] = useState(false);

  const texts = {
    ru: {
      title: 'Подтверждение визита',
      date: 'Дата',
      time: 'Время',
      service: 'Услуга',
      resource: 'Мастер',
      duration: 'мин',
      total: 'Итого',
      reminders: 'Напоминания T-24/T-2 включены',
      confirm: 'Подтвердить запись',
      changeTime: 'Изменить время',
      conflictTitle: 'Упс, слот только что заняли',
      conflictDescription: 'Вот ближайшие варианты:',
      alternatives: [
        { date: 'Завтра', time: '14:00' },
        { date: 'Послезавтра', time: '10:30' },
        { date: 'Пятница', time: '16:15' }
      ]
    },
    en: {
      title: 'Visit Confirmation',
      date: 'Date',
      time: 'Time',
      service: 'Service',
      resource: 'Master',
      duration: 'min',
      total: 'Total',
      reminders: 'T-24/T-2 reminders enabled',
      confirm: 'Confirm Booking',
      changeTime: 'Change Time',
      conflictTitle: 'Oops, slot just got taken',
      conflictDescription: 'Here are the nearest alternatives:',
      alternatives: [
        { date: 'Tomorrow', time: '14:00' },
        { date: 'Day after', time: '10:30' },
        { date: 'Friday', time: '16:15' }
      ]
    }
  };

  const t = texts[language];

  const handleConfirm = () => {
    // Simulate 30% chance of conflict for demo
    if (Math.random() < 0.3) {
      setIsConflict(true);
      return;
    }
    onConfirm();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-panel pb-safe-action">
        <SheetHeader className="mb-6">
          <SheetTitle>{t.title}</SheetTitle>
        </SheetHeader>

        {/* Booking Details */}
        <div className="space-y-4 mb-6">
          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-text-secondary" />
            <div>
              <div className="text-text-secondary">{t.date}</div>
              <div>{bookingSlot.date}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-text-secondary" />
            <div>
              <div className="text-text-secondary">{t.time}</div>
              <div>{bookingSlot.time}</div>
            </div>
          </div>

          {/* Service */}
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-text-secondary" />
            <div>
              <div className="text-text-secondary">{t.service}</div>
              <div>{bookingSlot.service.name} ({bookingSlot.service.duration} {t.duration})</div>
            </div>
          </div>

          {/* Resource */}
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-text-secondary" />
            <div>
              <div className="text-text-secondary">{t.resource}</div>
              <div>{bookingSlot.resource}</div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-surface-subtle rounded-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4>{t.total}</h4>
            <div className="font-mono-label-sm">{bookingSlot.price} ₽</div>
          </div>

          {/* Reminders Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reminders" 
              checked={remindersEnabled}
              onCheckedChange={setRemindersEnabled}
            />
            <label 
              htmlFor="reminders" 
              className="text-text-secondary cursor-pointer"
            >
              {t.reminders}
            </label>
          </div>
        </div>

        {/* Conflict Alert */}
        {isConflict && (
          <Alert className="mb-6 border-warning-500 bg-warning-100">
            <AlertTriangle className="h-4 w-4 text-warning-500" />
            <AlertDescription>
              <div className="mb-3">
                <strong>{t.conflictTitle}.</strong> {t.conflictDescription}
              </div>
              <div className="space-y-2">
                {t.alternatives.map((alt, index) => (
                  <button
                    key={index}
                    className="block w-full text-left p-2 rounded border hover:bg-surface-subtle transition-colors"
                    onClick={() => {
                      setIsConflict(false);
                      onChangeTime();
                    }}
                  >
                    {alt.date}, {alt.time}
                  </button>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={handleConfirm}
            className="w-full rounded-card"
            size="lg"
            disabled={isConflict}
          >
            {t.confirm}
          </Button>
          
          <Button 
            onClick={onChangeTime}
            variant="outline"
            className="w-full rounded-card"
            size="lg"
          >
            {t.changeTime}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}