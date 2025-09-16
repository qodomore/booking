import React from 'react';
import { CheckCircle, Calendar, Clock, User, Phone, MessageCircle, Plus } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { NextVisitCard } from './ui/next-visit-card';
import { Service } from '../contexts/ResourceContext';

interface BookingData {
  service: Service;
  masterId: string;
  masterName: string;
  selectedTime: string;
  selectedDate: string;
}

interface ClientData {
  name: string;
  phone: string;
  notes?: string;
}

interface BookingSuccessScreenProps {
  bookingData: BookingData;
  clientData: ClientData;
  onCreateNewBooking: () => void;
  onBackToCalendar: () => void;
  onBookNextVisit?: () => void;
  onChooseNextTime?: () => void;
  plan?: 'free' | 'pro' | 'premium';
}

export function BookingSuccessScreen({
  bookingData,
  clientData,
  onCreateNewBooking,
  onBackToCalendar,
  onBookNextVisit,
  onChooseNextTime,
  plan = 'free'
}: BookingSuccessScreenProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getDurationText = (duration: number): string => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) {
        return `${hours} ч`;
      }
      return `${hours} ч ${minutes} мин`;
    }
    return `${duration} мин`;
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const generateBookingId = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const bookingId = generateBookingId();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl text-green-800 dark:text-green-200">
            Запись успешно создана!
          </h1>
          <p className="text-sm text-muted-foreground">
            Номер записи: <span className="font-mono font-semibold">{bookingId}</span>
          </p>
        </div>
        
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
          Запись подтверждена
        </Badge>
      </div>

      {/* Booking Details */}
      <Card className="clean-card border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
        <CardContent className="p-6 space-y-6">
          <h2 className="font-semibold text-lg">Детали записи</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Услуга</p>
                <div className="space-y-2">
                  <h3 className="font-semibold">{bookingData.service.name}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {getDurationText(bookingData.service.duration)}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ₽{bookingData.service.price.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Мастер</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{bookingData.masterName}</p>
                    <p className="text-sm text-muted-foreground">Специалист</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Дата и время</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium capitalize">{formatDate(bookingData.selectedDate)}</p>
                      <p className="text-sm text-muted-foreground">Дата записи</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {bookingData.selectedTime} - {calculateEndTime(bookingData.selectedTime, bookingData.service.duration)}
                      </p>
                      <p className="text-sm text-muted-foreground">Время сеанса</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card className="clean-card">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Клиент</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{clientData.name}</p>
                <p className="text-sm text-muted-foreground">Имя клиента</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{clientData.phone}</p>
                <p className="text-sm text-muted-foreground">Телефон</p>
              </div>
            </div>
            
            {clientData.notes && (
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{clientData.notes}</p>
                  <p className="text-sm text-muted-foreground">Комментарий</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Card className="clean-card">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Что дальше?</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Уведомления отправлены</p>
                <p className="text-sm text-muted-foreground">
                  Клиент получит SMS с подтверждением записи
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Запись добавлена в календарь</p>
                <p className="text-sm text-muted-foreground">
                  Проверьте расписание в разделе "Календарь"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Visit Suggestion */}
      <NextVisitCard
        locale="ru"
        plan={plan}
        suggestedDate="завтра"
        suggestedTime="14:00"
        resources={[
          { id: bookingData.masterId, name: bookingData.masterName, type: 'master' },
          { id: 'room1', name: 'Кабинет 3', type: 'room' }
        ]}
        onBookOneClick={onBookNextVisit}
        onChooseTime={onChooseNextTime}
      />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button 
          onClick={onCreateNewBooking}
          className="w-full elegant-button gap-2"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          Создать новую запись
        </Button>
        
        <Button 
          variant="outline"
          onClick={onBackToCalendar}
          className="w-full"
          size="lg"
        >
          Вернуться к календарю
        </Button>
      </div>
    </div>
  );
}