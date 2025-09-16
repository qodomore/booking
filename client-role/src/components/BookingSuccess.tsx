import React, { useContext, useEffect, useState } from 'react';
import { CheckCircle, Calendar, Share, Eye, Home } from 'lucide-react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function BookingSuccess() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    language, 
    setCurrentScreen,
    currentBooking,
    selectedService,
    selectedDate,
    selectedTime
  } = context;

  const [showConfetti, setShowConfetti] = useState(true);

  const texts = {
    ru: {
      success: 'Готово!',
      bookingConfirmed: 'Запись подтверждена',
      reminderText: 'Напомним за 24 ч и за 2 ч',
      addToCalendar: 'Добавить в календарь',
      share: 'Поделиться',
      viewDetails: 'Открыть детали',
      backToHome: 'На главную',
      bookingDetails: 'Детали записи',
      service: 'Услуга',
      datetime: 'Дата и время',
      location: 'Адрес'
    },
    en: {
      success: 'Success!',
      bookingConfirmed: 'Booking Confirmed',
      reminderText: 'We\'ll remind you 24h and 2h before',
      addToCalendar: 'Add to Calendar',
      share: 'Share',
      viewDetails: 'View Details',
      backToHome: 'Back to Home',
      bookingDetails: 'Booking Details',
      service: 'Service',
      datetime: 'Date & Time',
      location: 'Location'
    }
  };

  const t = texts[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCalendar = () => {
    // Mock calendar integration
    if (navigator.share) {
      navigator.share({
        title: `Запись: ${selectedService?.name}`,
        text: `${selectedService?.name} в ${selectedTime}`,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && selectedService) {
      navigator.share({
        title: 'Моя запись',
        text: `Записался на ${selectedService.name} на ${selectedTime}`,
        url: window.location.href
      });
    }
  };

  const handleViewDetails = () => {
    setCurrentScreen('booking-details');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const getDateLabel = () => {
    if (selectedDate === 'today') return 'Сегодня';
    if (selectedDate === 'tomorrow') return 'Завтра';
    return selectedDate;
  };

  const calculateEndTime = (startTime: string) => {
    if (!selectedService || !startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + selectedService.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}

      {/* Success Icon & Message */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-medium mb-2">{t.success}</h1>
          <p className="text-lg text-muted-foreground mb-2">{t.bookingConfirmed}</p>
          <p className="text-sm text-muted-foreground">{t.reminderText}</p>
        </div>

        {/* Booking Summary */}
        {selectedService && (
          <Card className="w-full max-w-sm p-6 bg-card/80 backdrop-blur-sm border-0 mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t.service}</p>
                <p className="font-medium">{selectedService.name}</p>
                <p className="text-sm text-muted-foreground">{selectedService.provider}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t.datetime}</p>
                <p className="font-medium">
                  {getDateLabel()}, {selectedTime} - {calculateEndTime(selectedTime || '')}
                </p>
              </div>

              {selectedService.location && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t.location}</p>
                  <p className="font-medium">{selectedService.location}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <Button 
            onClick={handleAddToCalendar}
            className="w-full h-12"
            variant="default"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {t.addToCalendar}
          </Button>

          <div className="flex gap-3">
            <Button 
              onClick={handleShare}
              className="flex-1 h-12"
              variant="outline"
            >
              <Share className="w-5 h-5 mr-2" />
              {t.share}
            </Button>

            <Button 
              onClick={handleViewDetails}
              className="flex-1 h-12"
              variant="outline"
            >
              <Eye className="w-5 h-5 mr-2" />
              {t.viewDetails}
            </Button>
          </div>

          <Button 
            onClick={handleBackToHome}
            className="w-full h-12"
            variant="ghost"
          >
            <Home className="w-5 h-5 mr-2" />
            {t.backToHome}
          </Button>
        </div>
      </div>

      {/* Progress Indicator - Complete */}
      <div className="sticky bottom-0 bg-card/70 backdrop-blur-sm border-t border-border/50 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-primary">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              ✓
            </div>
            <span>Услуга</span>
          </div>
          <div className="w-4 h-px bg-primary"></div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              ✓
            </div>
            <span>Время</span>
          </div>
          <div className="w-4 h-px bg-primary"></div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              ✓
            </div>
            <span>Готово</span>
          </div>
        </div>
      </div>
    </div>
  );
}