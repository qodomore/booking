import React, { useContext, useState } from 'react';
import { Calendar, Clock, MapPin, Eye, RotateCcw, Settings } from 'lucide-react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function MyBookings() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, bookings, setCurrentScreen, setCurrentBooking, theme, setTheme } = context;
  const [activeTab, setActiveTab] = useState('upcoming');

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
      confirmed: 'Подтверждена',
      pending: 'Ожидание',
      completed: 'Завершена',
      cancelled: 'Отменена',
      settings: 'Настройки'
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
      confirmed: 'Confirmed',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      settings: 'Settings'
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
      status: 'confirmed' as const,
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
      status: 'completed' as const,
      price: 2000
    }
  ];

  const allBookings = [...bookings, ...mockBookings];
  
  const upcomingBookings = allBookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = allBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );

  const handleBookingDetails = (booking: any) => {
    setCurrentBooking(booking);
    setCurrentScreen('booking-details');
  };

  const handleRepeatBooking = (booking: any) => {
    // Set the service and go to time selection
    context.setSelectedService(booking.service);
    setCurrentScreen('time-selection');
  };

  const handleFindService = () => {
    setCurrentScreen('home');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
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
        <Badge className={`${getStatusColor(booking.status)} border-0 text-xs`}>
          {getStatusText(booking.status)}
        </Badge>
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
            className="h-8 text-xs px-3"
          >
            <Eye className="w-3 h-3 mr-1" />
            {t.details}
          </Button>
          {booking.status === 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRepeatBooking(booking)}
              className="h-8 text-xs px-3"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              {t.repeat}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 pt-16">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">{t.myBookings}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettings}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
            <TabsList className="w-full grid grid-cols-2 m-4 mb-0">
              <TabsTrigger value="upcoming">{t.upcoming}</TabsTrigger>
              <TabsTrigger value="past">{t.past}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="p-4 space-y-3 mt-4">
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

          <TabsContent value="past" className="p-4 space-y-3 mt-4">
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
  );
}