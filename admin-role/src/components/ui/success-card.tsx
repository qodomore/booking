import React from 'react';
import { Calendar, Share2, RotateCcw, CheckCircle, MapPin, Clock, User } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { NextVisitCard } from './next-visit-card';
import { useTelegram } from '../../hooks/useTelegram';

interface BookingDetails {
  id: string;
  serviceName: string;
  masterName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  address?: string;
  clientName: string;
}

interface SuccessCardProps {
  booking: BookingDetails;
  onAddToCalendar?: (booking: BookingDetails) => void;
  onShare?: (booking: BookingDetails) => void;
  onRepeatBooking?: (booking: BookingDetails) => void;
  onClose?: () => void;
  onBookNextVisit?: () => void;
  onChooseNextTime?: () => void;
  plan?: 'free' | 'pro' | 'premium';
}

export function SuccessCard({ booking, onAddToCalendar, onShare, onRepeatBooking, onClose, onBookNextVisit, onChooseNextTime, plan = 'free' }: SuccessCardProps) {
  const { hapticFeedback } = useTelegram();

  const handleAddToCalendar = () => {
    hapticFeedback.success();
    onAddToCalendar?.(booking);
  };

  const handleShare = () => {
    hapticFeedback.light();
    onShare?.(booking);
  };

  const handleRepeatBooking = () => {
    hapticFeedback.medium();
    onRepeatBooking?.(booking);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md clean-card shadow-elegant animate-elegant-fade-in">
        <CardContent className="p-6 text-center space-y-6">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            {/* Confetti animation placeholder */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full animate-bounce opacity-60"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${10 + (i % 2) * 20}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Готово!</h2>
            <p className="text-sm text-muted-foreground">
              Запись успешно создана.<br />
              Напомним за 24ч и за 2ч
            </p>
          </div>

          {/* Booking Summary */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border text-left">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-sm">{booking.serviceName}</p>
                <p className="text-xs text-muted-foreground">с {booking.masterName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-sm">{booking.date} в {booking.time}</p>
                <p className="text-xs text-muted-foreground">{booking.duration} минут</p>
              </div>
            </div>
            
            {booking.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">{booking.address}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-medium">Стоимость:</span>
              <span className="font-semibold text-primary">₽{booking.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Отмена без штрафа за 12 часов до начала
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCalendar}
              className="flex flex-col gap-1 h-auto py-3 hover:scale-105 transition-transform"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">В календарь</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex flex-col gap-1 h-auto py-3 hover:scale-105 transition-transform"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Поделиться</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRepeatBooking}
              className="flex flex-col gap-1 h-auto py-3 hover:scale-105 transition-transform"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="text-xs">Повторить</span>
            </Button>
          </div>

          {/* Notification Badge */}
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Уведомления включены
          </Badge>

          {/* Next Visit Suggestion */}
          <NextVisitCard
            locale="ru"
            plan={plan}
            suggestedDate="завтра"
            suggestedTime="14:00"
            resources={[
              { id: 'master', name: booking.masterName, type: 'master' },
              { id: 'room', name: 'Кабинет 3', type: 'room' }
            ]}
            onBookOneClick={onBookNextVisit}
            onChooseTime={onChooseNextTime}
            className="mx-0" // Убираем отступы для центровки
          />

          {/* Continue Button */}
          <Button 
            onClick={onClose}
            className="w-full elegant-button font-semibold h-12"
            size="lg"
          >
            Продолжить
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for creating calendar events
export function useAddToCalendar() {
  return (booking: BookingDetails) => {
    const startDate = new Date(`${booking.date} ${booking.time}`);
    const endDate = new Date(startDate.getTime() + booking.duration * 60000);
    
    const event = {
      title: `${booking.serviceName} - ${booking.masterName}`,
      start: startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      end: endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      description: `Запись в салон красоты\nУслуга: ${booking.serviceName}\nМастер: ${booking.masterName}${booking.address ? `\nАдрес: ${booking.address}` : ''}`,
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${event.start}/${event.end}`,
      details: event.description,
    });
    
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  };
}

// Hook for sharing booking details
export function useShareBooking() {
  const { tg } = useTelegram();
  
  return (booking: BookingDetails) => {
    const text = `📅 Записан на ${booking.serviceName}\n👩‍💄 Мастер: ${booking.masterName}\n🕐 ${booking.date} в ${booking.time}\n💰 ₽${booking.price.toLocaleString()}`;
    
    if (tg && tg.switchInlineQuery) {
      tg.switchInlineQuery(text);
    } else if (navigator.share) {
      navigator.share({
        title: 'Запись в ��алон',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };
}