import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTelegram } from '../hooks/useTelegram';
import { CreateBookingDrawer } from './CreateBookingDrawer';

interface DemoBooking {
  id: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  client: string;
  service: string;
  state: 'confirmed' | 'pending' | 'blocked' | 'overdue';
  color?: string;
}

interface CalendarGridDemoProps {
  onAddBooking?: (masterId: string, timeSlot: string) => void;
  onNavigateToClient?: (clientId: string) => void;
}

export function CalendarGridDemo({ onAddBooking, onNavigateToClient }: CalendarGridDemoProps) {
  const { hapticFeedback } = useTelegram();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    resourceId: string;
    resourceName: string;
    timeSlot: string;
  } | null>(null);

  // Demo resources
  const resources = [
    { id: 'anna', name: 'Анна' },
    { id: 'maria', name: 'Мария' }
  ];

  // Generate time slots (every 30 minutes from 9:00 to 20:00)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  // Demo bookings data
  const demoBookings: DemoBooking[] = [
    // Resource A (Анна)
    {
      id: '1',
      resourceId: 'anna',
      startTime: '09:00',
      endTime: '10:00',
      client: 'Алексей',
      service: 'Стрижка',
      state: 'confirmed'
    },
    {
      id: '2',
      resourceId: 'anna',
      startTime: '10:30',
      endTime: '11:30',
      client: 'Дарья',
      service: 'Маникюр',
      state: 'confirmed'
    },
    {
      id: '3',
      resourceId: 'anna',
      startTime: '12:00',
      endTime: '12:30',
      client: '',
      service: 'Перерыв',
      state: 'blocked'
    },
    // Resource B (Мария)
    {
      id: '4',
      resourceId: 'maria',
      startTime: '10:00',
      endTime: '11:30',
      client: 'Ирина',
      service: 'Окрашивание',
      state: 'pending'
    },
    {
      id: '5',
      resourceId: 'maria',
      startTime: '13:00',
      endTime: '13:30',
      client: 'Пётр',
      service: 'Консультация',
      state: 'confirmed'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
    hapticFeedback.light();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Get booking for a specific resource and time slot
  const getBookingForSlot = (resourceId: string, timeSlot: string): DemoBooking | null => {
    return demoBookings.find(booking => {
      if (booking.resourceId !== resourceId) return false;
      
      // Check if time slot is within booking range
      return timeSlot >= booking.startTime && timeSlot < booking.endTime;
    }) || null;
  };

  // Check if this is the start of a booking
  const isBookingStart = (resourceId: string, timeSlot: string): boolean => {
    return demoBookings.some(booking => 
      booking.resourceId === resourceId && booking.startTime === timeSlot
    );
  };

  // Get booking span (how many slots it covers)
  const getBookingSpan = (booking: DemoBooking): number => {
    const startIndex = timeSlots.indexOf(booking.startTime);
    const endIndex = timeSlots.findIndex(slot => slot >= booking.endTime);
    return Math.max(1, endIndex - startIndex);
  };

  const handleAddBookingClick = (resourceId: string, timeSlot: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedSlot({
        resourceId,
        resourceName: resource.name,
        timeSlot
      });
      setIsCreateBookingOpen(true);
      hapticFeedback.light();
    }
  };

  const handleBookingClick = (booking: DemoBooking) => {
    console.log('Booking clicked:', booking);
    hapticFeedback.medium();
  };

  const getStateStyles = (state: DemoBooking['state']) => {
    switch (state) {
      case 'confirmed':
        return 'bg-primary text-white border-primary shadow-sm';
      case 'pending':
        return 'bg-yellow-500 text-white border-yellow-600 shadow-sm';
      case 'blocked':
        return 'bg-muted text-muted-foreground border-border';
      case 'overdue':
        return 'bg-red-500 text-white border-red-600 shadow-sm';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStateText = (state: DemoBooking['state']) => {
    switch (state) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'blocked': return 'Заблокировано';
      case 'overdue': return 'Просрочено';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Календарь</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {formatDate(selectedDate)}
            {isToday(selectedDate) && (
              <Badge variant="secondary" className="ml-2">
                Сегодня
              </Badge>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            Сегодня
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="clean-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div 
              className="grid gap-0 border-b border-border"
              style={{ 
                gridTemplateColumns: `120px repeat(${resources.length}, minmax(240px, 1fr))` 
              }}
            >
              <div className="p-4 font-medium text-sm text-muted-foreground bg-muted/30">
                Время
              </div>
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 border-l border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Специалист
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div 
              className="grid gap-0"
              style={{ 
                gridTemplateColumns: `120px repeat(${resources.length}, minmax(240px, 1fr))` 
              }}
            >
              {timeSlots.map((timeSlot) => (
                <React.Fragment key={timeSlot}>
                  {/* Time Label */}
                  <div className="border-b border-border bg-muted/20 flex items-center justify-center" style={{ height: '56px' }}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{timeSlot}</span>
                    </div>
                  </div>

                  {/* Resource Columns */}
                  {resources.map((resource) => {
                    const booking = getBookingForSlot(resource.id, timeSlot);
                    const isStart = isBookingStart(resource.id, timeSlot);
                    
                    return (
                      <div
                        key={`${resource.id}-${timeSlot}`}
                        className={`
                          border-b border-l border-border relative cursor-pointer
                          hover:bg-muted/30 transition-colors
                          ${booking ? 'bg-muted/10' : 'bg-background'}
                        `}
                        style={{ height: '56px' }}
                        onClick={() => !booking && handleAddBookingClick(resource.id, timeSlot)}
                      >
                        {booking && isStart && (
                          <div 
                            className={`
                              absolute inset-x-2 top-1 rounded-xl p-3 z-10 cursor-pointer
                              hover:shadow-md transition-all duration-200 select-none
                              ${getStateStyles(booking.state)}
                            `}
                            style={{
                              height: `${getBookingSpan(booking) * 56 - 8}px`,
                              minHeight: '48px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookingClick(booking);
                            }}
                          >
                            <div className="space-y-1 h-full flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm leading-tight">
                                    {booking.client || booking.service}
                                  </p>
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-0"
                                  >
                                    {getStateText(booking.state)}
                                  </Badge>
                                </div>
                                {booking.client && (
                                  <p className="text-xs opacity-90 line-clamp-1 mt-1">
                                    {booking.service}
                                  </p>
                                )}
                              </div>
                              <div className="text-xs opacity-80">
                                {booking.startTime}–{booking.endTime}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!booking && (
                          <div className="absolute inset-0 flex items-center justify-center group">
                            <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <Plus className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="clean-card">
        <CardHeader className="pb-3">
          <h3 className="font-medium">Легенда</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary"></div>
              <span className="text-sm">Подтверждено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-sm">Ожидает подтверждения</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <span className="text-sm">Заблокировано</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm">Просрочено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-dashed border-primary rounded flex items-center justify-center">
                <Plus className="h-2 w-2 text-primary" />
              </div>
              <span className="text-sm">Добавить запись</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Booking Drawer */}
      <CreateBookingDrawer
        isOpen={isCreateBookingOpen}
        onClose={() => setIsCreateBookingOpen(false)}
        selectedSlot={selectedSlot}
        onBookingCreated={() => {
          setIsCreateBookingOpen(false);
          hapticFeedback.success();
        }}
      />
    </div>
  );
}