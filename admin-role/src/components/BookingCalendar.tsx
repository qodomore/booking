import React, { useState, useMemo } from 'react';
import { User, Phone, MessageCircle, Plus, Edit, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DateChips } from './ui/filter-chips';
import { SlotGrid } from './ui/slot-chip';
import { BookingCalendarSkeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useResources } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  masterId: string;
  masterName: string;
  time: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  bookingId?: string;
}

interface MasterSchedule {
  masterId: string;
  masterName: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  slots: TimeSlot[];
  bookings: Booking[];
}

export function BookingCalendar() {
  const { getResourcesByType } = useResources();
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();
  
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedMaster, setSelectedMaster] = useState<string>('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const specialists = getResourcesByType('specialist');

  // Generate time slots for the day (9:00 - 20:00, 30min intervals)
  const generateTimeSlots = (): string[] => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: '1',
      clientName: 'Анна Смирнова',
      clientPhone: '+7 (999) 123-45-67',
      service: 'Маникюр классический',
      masterId: '1',
      masterName: 'Анна Иванова',
      time: '10:00',
      duration: 60,
      price: 1500,
      status: 'confirmed',
      notes: 'Первое посещение'
    },
    {
      id: '2',
      clientName: 'Мария Козлова',
      clientPhone: '+7 (999) 987-65-43',
      service: 'Стрижка женская',
      masterId: '2',
      masterName: 'Мария Петрова',
      time: '14:30',
      duration: 90,
      price: 2500,
      status: 'pending'
    },
    {
      id: '3',
      clientName: 'Елена Волкова',
      clientPhone: '+7 (999) 555-11-22',
      service: 'Окрашивание волос',
      masterId: '2',
      masterName: 'Мария Петрова',
      time: '16:30',
      duration: 180,
      price: 4500,
      status: 'confirmed'
    }
  ];

  // Generate master schedules with slots and bookings
  const masterSchedules: MasterSchedule[] = useMemo(() => {
    const timeSlots = generateTimeSlots();
    
    return specialists.map(specialist => {
      const masterBookings = mockBookings.filter(b => b.masterId === specialist.id);
      const bookedTimes = new Set(masterBookings.map(b => b.time));
      
      const slots: TimeSlot[] = timeSlots.map(time => {
        const booking = masterBookings.find(b => b.time === time);
        return {
          id: `${specialist.id}-${time}`,
          time,
          available: !bookedTimes.has(time),
          bookingId: booking?.id
        };
      });

      return {
        masterId: specialist.id,
        masterName: specialist.name,
        avatar: undefined,
        specialties: specialist.skills || [],
        rating: 4.5 + Math.random() * 0.5,
        slots,
        bookings: masterBookings
      };
    });
  }, [specialists, selectedDate]);

  const handleDateSelect = (date: 'today' | 'tomorrow' | 'custom') => {
    hapticFeedback.light();
    setSelectedDate(date);
  };

  const handleSlotSelect = (slotId: string) => {
    hapticFeedback.medium();
    const [masterId, time] = slotId.split('-');
    setSelectedSlot(slotId);
    setSelectedMaster(masterId);
    
    // Show main button for booking confirmation
    showMainButton('Записать клиента', () => {
      setIsBookingDialogOpen(true);
    });
  };

  const handleBookingCreate = () => {
    hapticFeedback.success();
    // Here would be booking creation logic
    setIsBookingDialogOpen(false);
    setSelectedSlot('');
    hideMainButton();
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const formatDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (selectedDate) {
      case 'today':
        return today.toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' });
      case 'tomorrow':
        return tomorrow.toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' });
      case 'custom':
        return customDate || 'Выберите дату';
    }
  };

  if (isLoading) {
    return <BookingCalendarSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="space-y-3">
        <h2 className="font-semibold">Календарь записей</h2>
        <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
        
        <DateChips
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          customDate={customDate}
        />
      </div>

      {/* Master Schedules */}
      <div className="space-y-6">
        {masterSchedules.map((schedule) => (
          <Card key={schedule.masterId} className="clean-card">
            <CardContent className="p-4 space-y-4">
              {/* Master Header */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {schedule.masterName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{schedule.masterName}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">
                        {schedule.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {schedule.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {schedule.bookings.length} записей
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {schedule.slots.filter(s => s.available).length} свободно
                  </p>
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Свободные слоты:</h4>
                
                <SlotGrid
                  slots={schedule.slots}
                  selectedSlot={selectedSlot}
                  onSlotSelect={handleSlotSelect}
                />
                
                {schedule.slots.filter(s => s.available).length === 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    На выбранную дату свободных слотов нет
                  </div>
                )}
              </div>

              {/* Current Bookings */}
              {schedule.bookings.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Записи:</h4>
                  
                  <div className="space-y-2">
                    {schedule.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{booking.time}</span>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm font-medium truncate">
                            {booking.clientName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {booking.service} • {booking.duration} мин • ₽{booking.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-3">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <a href={`tel:${booking.clientPhone}`}>
                              <Phone className="h-3 w-3" />
                            </a>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                          >
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {masterSchedules.length === 0 && (
        <Card className="clean-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Нет доступных мастеров</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Добавьте специалистов в разделе "Мастера"
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Добавить мастера
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Новая запись</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedSlot && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Выбранное время:</p>
                <p className="font-semibold">
                  {selectedSlot.split('-')[1]} • {
                    masterSchedules.find(m => m.masterId === selectedMaster)?.masterName
                  }
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Для создания записи перейдите в каталог услуг или заполните форму вручную.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 elegant-button"
                  onClick={() => {
                    // Navigate to service catalog
                    setIsBookingDialogOpen(false);
                  }}
                >
                  Выбрать услугу
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleBookingCreate}
                >
                  Ручной ввод
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}