import React, { useContext } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, QrCode, Edit, X } from 'lucide-react';
import { AppContext, Booking } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface BookingDetailsProps {
  booking: Booking;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, setCurrentScreen, setCurrentBooking } = context;

  const texts = {
    ru: {
      bookingDetails: 'Детали записи',
      status: 'Статус',
      service: 'Услуга',
      datetime: 'Дата и время',
      duration: 'Длительность',
      provider: 'Поставщик',
      location: 'Адрес',
      price: 'Стоимость',
      bookingCode: 'Код записи',
      showQR: 'Показать QR-код',
      reschedule: 'Перенести',
      cancel: 'Отменить',
      confirmed: 'Подтверждена',
      pending: 'Ожидание',
      completed: 'Завершена',
      cancelled: 'Отменена',
      minutes: 'мин',
      myBookings: 'Мои записи'
    },
    en: {
      bookingDetails: 'Booking Details',
      status: 'Status',
      service: 'Service',
      datetime: 'Date & Time',
      duration: 'Duration',
      provider: 'Provider',
      location: 'Location',
      price: 'Price',
      bookingCode: 'Booking Code',
      showQR: 'Show QR Code',
      reschedule: 'Reschedule',
      cancel: 'Cancel',
      confirmed: 'Confirmed',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      minutes: 'min',
      myBookings: 'My Bookings'
    }
  };

  const t = texts[language];

  const handleBack = () => {
    setCurrentScreen('my-bookings');
  };

  const handleReschedule = () => {
    setCurrentBooking(booking);
    setCurrentScreen('reschedule-cancel');
  };

  const handleCancel = () => {
    setCurrentBooking(booking);
    setCurrentScreen('reschedule-cancel');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t.confirmed;
      case 'pending':
        return t.pending;
      case 'completed':
        return t.completed;
      case 'cancelled':
        return t.cancelled;
      default:
        return status;
    }
  };

  const canModify = booking.status === 'confirmed' || booking.status === 'pending';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 pt-16">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-medium">{t.bookingDetails}</h1>
            <p className="text-sm text-muted-foreground">{t.myBookings}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Status */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.status}</p>
              <Badge className={`${getStatusColor(booking.status)} border-0`}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t.bookingCode}</p>
              <p className="font-mono text-sm">{booking.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </Card>

        {/* Service Details */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-0">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.service}</p>
              <h2 className="text-xl font-medium">{booking.service.name}</h2>
              <p className="text-sm text-muted-foreground">
                {booking.service.duration} {t.minutes}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{booking.date}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.time} - {booking.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{booking.service.provider}</p>
                {booking.service.location && (
                  <p className="text-sm text-muted-foreground">{booking.service.location}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t.price}</span>
              </div>
              <span className="text-xl font-medium">{booking.price}₽</span>
            </div>
          </div>
        </Card>

        {/* QR Code */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={() => {/* Show QR code modal */}}
          >
            <QrCode className="w-5 h-5" />
            {t.showQR}
          </Button>
        </Card>

        {/* Location Map Placeholder */}
        {booking.service.location && (
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-center mt-2 text-muted-foreground">
              {booking.service.location}
            </p>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      {canModify && (
        <div className="sticky bottom-0 bg-card/70 backdrop-blur-sm border-t border-border/50 p-4">
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12"
              onClick={handleReschedule}
            >
              <Edit className="w-5 h-5 mr-2" />
              {t.reschedule}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-12 text-destructive hover:text-destructive"
              onClick={handleCancel}
            >
              <X className="w-5 h-5 mr-2" />
              {t.cancel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}