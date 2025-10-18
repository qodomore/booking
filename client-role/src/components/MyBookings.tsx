import React, { useContext, useState } from 'react';
import { Calendar, Clock, MapPin, Eye, RotateCcw, Settings } from 'lucide-react';
import { AppContext, Booking } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookingActionsMenu } from './BookingActionsMenu';
import { StatusChip, BookingStatus } from './StatusChip';
import { CancelBookingDialog } from './CancelBookingDialog';
import { RescheduleSheet } from './RescheduleSheet';
import { toast } from 'sonner@2.0.3';

export function MyBookings() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, bookings, setCurrentScreen, setCurrentBooking, setBookings, setSelectedService, setSelectedDate, setSelectedTime } = context;
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Dialog and sheet states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleSheetOpen, setRescheduleSheetOpen] = useState(false);
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<any>(null);

  const texts = {
    ru: {
      myBookings: 'Мои записи',
      upcoming: 'Будущие',
      past: 'Прошлые',
      noUpcomingBookings: 'Нет будущих записей',
      noPastBookings: 'Нет прошлых записей',
      bookingDescription: 'Запишитесь на услугу прямо сейчас',
      findService: 'Найти услугу',
      details: 'Детали',
      repeat: 'Повторить',
      settings: 'Настройки',
      // Toast messages
      bookingConfirmed: 'Запись подтверждена',
      bookingRescheduled: 'Запись перенесена',
      bookingCancelled: 'Запись отменена',
      bookingMarkedNoShow: 'Отмечено: клиент не пришёл',
      bookingCompleted: 'Запись отмечена как завершённая',
    },
    en: {
      myBookings: 'My Bookings',
      upcoming: 'Upcoming',
      past: 'Past',
      noUpcomingBookings: 'No upcoming bookings',
      noPastBookings: 'No past bookings',
      bookingDescription: 'Book a service right now',
      findService: 'Find Service',
      details: 'Details',
      repeat: 'Repeat',
      settings: 'Settings',
      // Toast messages
      bookingConfirmed: 'Booking confirmed',
      bookingRescheduled: 'Booking rescheduled',
      bookingCancelled: 'Booking cancelled',
      bookingMarkedNoShow: 'Marked as no-show',
      bookingCompleted: 'Booking marked as completed',
    }
  };

  const t = texts[language];

  // Mock data - in real app this would come from API
  const mockBookings = [
    {
      id: '1',
      service: {
        id: '1',
        name: 'Маникюр классический',
        description: 'Профессиональный уход за ногтями',
        price: { fixed: 1500 },
        duration: 90,
        category: 'beauty',
        provider: 'Салон красоты "Элит"',
        location: 'ул. Тверская, 15',
        rating: 4.8
      },
      date: new Date(Date.now() + 86400000).toLocaleDateString('ru-RU'),
      time: '14:00',
      endTime: '15:30',
      status: 'confirmed' as BookingStatus,
      price: 1500
    },
    {
      id: '2',
      service: {
        id: '2',
        name: 'Шиномонтаж R16-R18',
        description: 'Замена летних шин на зимние',
        price: { fixed: 2000 },
        duration: 60,
        category: 'auto',
        provider: 'АвтоСервис 24',
        location: 'ш. Энтузиастов, 42',
        rating: 4.5
      },
      date: new Date(Date.now() - 86400000).toLocaleDateString('ru-RU'),
      time: '10:00',
      endTime: '11:00',
      status: 'completed' as BookingStatus,
      price: 2000
    },
    {
      id: '3',
      service: {
        id: '3',
        name: 'Персональная тренировка',
        description: 'Индивидуальное занятие с тренером',
        price: { fixed: 3000 },
        duration: 60,
        category: 'fitness',
        provider: 'Фитнес-клуб "Титан"',
        location: 'пр. Мира, 100',
        rating: 4.9
      },
      date: new Date(Date.now() + 172800000).toLocaleDateString('ru-RU'),
      time: '18:00',
      endTime: '19:00',
      status: 'pending' as BookingStatus,
      price: 3000
    }
  ];

  const allBookings = [...bookings, ...mockBookings];
  
  const upcomingBookings = allBookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = allBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no-show'
  );

  const handleBookingDetails = (booking: any) => {
    setCurrentBooking(booking);
    setCurrentScreen('booking-details');
  };

  const handleRepeatBooking = (booking: any) => {
    // Set the service and go to time selection
    setSelectedService(booking.service);
    setCurrentScreen('time-selection');
  };

  const handleFindService = () => {
    setCurrentScreen('home');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  const handleAction = (actionId: string, bookingId: string) => {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setSelectedBookingForAction(booking);

    switch (actionId) {
      case 'confirm':
        handleConfirmBooking(booking);
        break;
      case 'reschedule':
        setRescheduleSheetOpen(true);
        break;
      case 'cancel':
        setCancelDialogOpen(true);
        break;
      case 'no-show':
        handleMarkNoShow(booking);
        break;
      case 'mark-completed':
        handleMarkCompleted(booking);
        break;
    }
  };

  const handleConfirmBooking = (booking: any) => {
    // Update booking status to confirmed
    const updatedBookings = allBookings.map(b =>
      b.id === booking.id ? { ...b, status: 'confirmed' as BookingStatus } : b
    );
    setBookings(updatedBookings.filter(b => !mockBookings.find(mb => mb.id === b.id)));
    
    toast.success(t.bookingConfirmed, {
      description: `${booking.service.name} - ${booking.date} ${booking.time}`,
    });
  };

  const handleRescheduleConfirm = (newDate: string, newTime: string) => {
    if (!selectedBookingForAction) return;

    // Calculate end time based on duration
    const [hours, minutes] = newTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + selectedBookingForAction.service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const newEndTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

    // Update booking
    const updatedBookings = allBookings.map(b =>
      b.id === selectedBookingForAction.id
        ? { ...b, date: newDate, time: newTime, endTime: newEndTime }
        : b
    );
    setBookings(updatedBookings.filter(b => !mockBookings.find(mb => mb.id === b.id)));

    toast.success(t.bookingRescheduled, {
      description: `${selectedBookingForAction.service.name} - ${newDate} ${newTime}`,
    });

    setSelectedBookingForAction(null);
  };

  const handleCancelConfirm = (reason: string, comment?: string) => {
    if (!selectedBookingForAction) return;

    // Update booking status to cancelled
    const updatedBookings = allBookings.map(b =>
      b.id === selectedBookingForAction.id ? { ...b, status: 'cancelled' as BookingStatus } : b
    );
    setBookings(updatedBookings.filter(b => !mockBookings.find(mb => mb.id === b.id)));

    toast.success(t.bookingCancelled, {
      description: `${selectedBookingForAction.service.name}`,
    });

    setCancelDialogOpen(false);
    setSelectedBookingForAction(null);
  };

  const handleMarkNoShow = (booking: any) => {
    // Update booking status to no-show
    const updatedBookings = allBookings.map(b =>
      b.id === booking.id ? { ...b, status: 'no-show' as BookingStatus } : b
    );
    setBookings(updatedBookings.filter(b => !mockBookings.find(mb => mb.id === b.id)));

    toast.success(t.bookingMarkedNoShow, {
      description: `${booking.service.name}`,
    });
  };

  const handleMarkCompleted = (booking: any) => {
    // Update booking status to completed
    const updatedBookings = allBookings.map(b =>
      b.id === booking.id ? { ...b, status: 'completed' as BookingStatus } : b
    );
    setBookings(updatedBookings.filter(b => !mockBookings.find(mb => mb.id === b.id)));

    toast.success(t.bookingCompleted, {
      description: `${booking.service.name}`,
    });
  };

  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <Button onClick={handleFindService}>{t.findService}</Button>
    </div>
  );

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium">{booking.service.name}</h3>
          <p className="text-sm text-muted-foreground">{booking.service.provider}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusChip status={booking.status} language={language} />
          <BookingActionsMenu
            bookingId={booking.id}
            status={booking.status}
            language={language}
            onAction={handleAction}
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{booking.time} - {booking.endTime}</span>
        </div>
        {booking.service.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{booking.service.location}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium">{booking.price}₽</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBookingDetails(booking)}
          >
            <Eye className="w-4 h-4 mr-1" />
            {t.details}
          </Button>
          {(booking.status === 'completed' || booking.status === 'cancelled') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRepeatBooking(booking)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {t.repeat}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <div className="flex flex-col min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 pt-16">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-medium">{t.myBookings}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettings}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="upcoming" className="flex-1">
                {t.upcoming}
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1">
                {t.past}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Tabs value={activeTab}>
            <TabsContent value="upcoming" className="p-4 space-y-4 m-0">
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  title={t.noUpcomingBookings}
                  description={t.bookingDescription}
                />
              ) : (
                upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="p-4 space-y-4 m-0">
              {pastBookings.length === 0 ? (
                <EmptyState
                  title={t.noPastBookings}
                  description={t.bookingDescription}
                />
              ) : (
                pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Cancel Dialog */}
      <CancelBookingDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
        language={language}
        bookingName={selectedBookingForAction?.service.name}
      />

      {/* Reschedule Sheet */}
      {selectedBookingForAction && (
        <RescheduleSheet
          open={rescheduleSheetOpen}
          onOpenChange={setRescheduleSheetOpen}
          onConfirm={handleRescheduleConfirm}
          language={language}
          bookingData={{
            serviceName: selectedBookingForAction.service.name,
            provider: selectedBookingForAction.service.provider,
            currentDate: selectedBookingForAction.date,
            currentTime: selectedBookingForAction.time,
            duration: selectedBookingForAction.service.duration,
            price: selectedBookingForAction.price,
          }}
        />
      )}
    </>
  );
}
