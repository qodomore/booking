import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTelegram } from '../hooks/useTelegram';
import { CreateBookingDrawer } from './CreateBookingDrawer';
import { BookingDetailsDrawer } from './BookingDetailsDrawer';
import { toast } from 'sonner@2.0.3';

interface BookingBlock {
  id: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  client: string;
  service: string;
  state: 'confirmed' | 'pending' | 'blocked' | 'overdue' | 'completed' | 'cancelled';
  color?: string;
}

interface CalendarGridFinalProps {
  onAddBooking?: (masterId: string, timeSlot: string) => void;
  onNavigateToClient?: (clientId: string) => void;
}

export function CalendarGridFinal({ onAddBooking, onNavigateToClient }: CalendarGridFinalProps) {
  const { hapticFeedback } = useTelegram();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    resourceId: string;
    resourceName: string;
    timeSlot: string;
  } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingBlock | null>(null);

  // Ресурсы точно как в техзадании
  const resources = [
    { id: 'anna', name: 'Анна' },
    { id: 'maria', name: 'Мария' }
  ];

  // Временные слоты с 09:00 до 20:00, шаг 30 минут
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

  // Демо записи как состояние для возможности добавления новых
  const [bookings, setBookings] = useState<BookingBlock[]>([
    // Resource A (Анна)
    {
      id: 'booking-1',
      resourceId: 'anna',
      startTime: '09:00',
      endTime: '10:00',
      client: 'Алексей',
      service: 'Стрижка',
      state: 'confirmed'
    },
    {
      id: 'booking-2',
      resourceId: 'anna',
      startTime: '10:30',
      endTime: '11:30',
      client: 'Дарья',
      service: 'Маникюр',
      state: 'confirmed'
    },
    {
      id: 'booking-3',
      resourceId: 'anna',
      startTime: '12:00',
      endTime: '12:30',
      client: '',
      service: 'Перерыв',
      state: 'blocked'
    },
    // Resource B (Мария)
    {
      id: 'booking-4',
      resourceId: 'maria',
      startTime: '10:00',
      endTime: '11:30',
      client: 'Ирина',
      service: 'Окрашивание',
      state: 'pending'
    },
    {
      id: 'booking-5',
      resourceId: 'maria',
      startTime: '13:00',
      endTime: '13:30',
      client: 'Пётр',
      service: 'Консультация',
      state: 'confirmed'
    },
    {
      id: 'booking-6',
      resourceId: 'anna',
      startTime: '14:00',
      endTime: '15:00',
      client: 'Светлана',
      service: 'Педикюр',
      state: 'completed'
    }
  ]);

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

  // Получить запись для конкретного ресурса и временного слота
  const getBookingForSlot = (resourceId: string, timeSlot: string): BookingBlock | null => {
    return bookings.find(booking => {
      if (booking.resourceId !== resourceId) return false;
      // Отмененные записи не блокируют слоты
      if (booking.state === 'cancelled') return false;
      return timeSlot >= booking.startTime && timeSlot < booking.endTime;
    }) || null;
  };

  // Получить отмененную запись для слота (для отображения с возможностью перебронирования)
  const getCancelledBookingForSlot = (resourceId: string, timeSlot: string): BookingBlock | null => {
    return bookings.find(booking => {
      if (booking.resourceId !== resourceId) return false;
      if (booking.state !== 'cancelled') return false;
      return timeSlot >= booking.startTime && timeSlot < booking.endTime;
    }) || null;
  };

  // Проверить, является ли это началом записи
  const isBookingStart = (resourceId: string, timeSlot: string): boolean => {
    return bookings.some(booking => 
      booking.resourceId === resourceId && booking.startTime === timeSlot
    );
  };

  // Получить количество слотов, которые занимает запись
  const getBookingSpan = (booking: BookingBlock): number => {
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

  const handleBookingClick = (booking: BookingBlock) => {
    setSelectedBooking(booking);
    setIsBookingDetailsOpen(true);
    hapticFeedback.medium();
  };

  const handleCancelBooking = async (bookingId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Удаляем запись из состояния
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    
    setIsBookingDetailsOpen(false);
    toast.success('Запись отменена');
  };

  const handleEditBooking = (booking: BookingBlock) => {
    setIsBookingDetailsOpen(false);
    toast.info('Редактирование записи (в разработке)');
  };

  const handleRescheduleBooking = (booking: BookingBlock) => {
    setIsBookingDetailsOpen(false);
    toast.info('Перенос записи (в разработке)');
  };

  const handleStatusChange = (bookingId: string, newStatus: string, notes?: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, state: newStatus as BookingBlock['state'] }
        : booking
    ));
    
    setIsBookingDetailsOpen(false);
    toast.success('Статус записи изменен');
  };

  // Стили состояний как в техзадании
  const getStateStyles = (state: BookingBlock['state']) => {
    switch (state) {
      case 'confirmed':
        return 'bg-primary text-primary-foreground border-primary shadow-sm'; // акцентный фон 8%, бордер brand
      case 'pending':
        return 'bg-yellow-500 text-white border-yellow-600 shadow-sm'; // жёлтый бордер
      case 'blocked':
        return 'bg-muted text-muted-foreground border-border'; // серый
      case 'overdue':
        return 'bg-red-500 text-white border-red-600 shadow-sm'; // красный бордер
      case 'completed':
        return 'bg-green-500 text-white border-green-600 shadow-sm'; // зеленый для выполненных
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300 shadow-sm opacity-60'; // красный полупрозрачный для отмененных
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStateText = (state: BookingBlock['state']) => {
    switch (state) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'blocked': return 'Заблокировано';
      case 'overdue': return 'Просрочено';
      case 'completed': return 'Выполнено';
      case 'cancelled': return 'Отменено';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-6">
      {/* Заголовок с чипами навигации по дням */}
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

      {/* Компонент Calendar/DayGrid */}
      <Card className="clean-card overflow-hidden" style={{ borderRadius: '20px', border: '1px solid #E6ECF2' }}>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Заголовки колонок: Time | Resource A | Resource B */}
            <div className="grid grid-cols-[120px_1fr_1fr] gap-0 border-b" style={{ borderColor: '#E6ECF2' }}>
              <div className="p-4 font-medium text-sm text-muted-foreground bg-muted/30">
                Time
              </div>
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 border-l" style={{ borderColor: '#E6ECF2' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Resource {resource.id === 'anna' ? 'A' : 'B'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Сетка временных слотов - высота 56px для 30 минут */}
            <div className="grid grid-cols-[120px_1fr_1fr] gap-0">
              {timeSlots.map((timeSlot) => (
                <React.Fragment key={timeSlot}>
                  {/* Временная метка */}
                  <div 
                    className="border-b bg-muted/20 flex items-center justify-center" 
                    style={{ height: '56px', borderColor: '#E6ECF2' }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{timeSlot}</span>
                    </div>
                  </div>

                  {/* Колонки ресурсов */}
                  {resources.map((resource) => {
                    const booking = getBookingForSlot(resource.id, timeSlot);
                    const cancelledBooking = getCancelledBookingForSlot(resource.id, timeSlot);
                    const isStart = isBookingStart(resource.id, timeSlot);
                    const displayBooking = booking || cancelledBooking;
                    const canBook = !booking; // Можно бронировать если нет активной записи
                    
                    return (
                      <div
                        key={`${resource.id}-${timeSlot}`}
                        className={`
                          border-b border-l relative cursor-pointer
                          hover:bg-muted/30 transition-colors
                          ${displayBooking ? 'bg-muted/10' : 'bg-background'}
                        `}
                        style={{ 
                          height: '56px',
                          borderColor: '#E6ECF2'
                        }}
                        onClick={() => canBook && handleAddBookingClick(resource.id, timeSlot)}
                      >
                        {/* Блок записи Booking/Block */}
                        {displayBooking && isStart && (
                          <div 
                            className={`
                              absolute inset-x-2 top-1 z-10 cursor-pointer
                              hover:shadow-md transition-all duration-200 select-none
                              ${getStateStyles(displayBooking.state)}
                              rounded-xl p-3
                              ${displayBooking.state === 'cancelled' ? 'relative' : ''}
                            `}
                            style={{
                              height: `${getBookingSpan(displayBooking) * 56 - 8}px`, // высота = 56px × (duration/30)
                              minHeight: '48px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookingClick(displayBooking);
                            }}
                          >
                            <div className="space-y-1 h-full flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm leading-tight">
                                    {booking.startTime}–{booking.endTime} • {booking.service} • {booking.client || 'Блокировка'}
                                  </p>
                                  {booking.state !== 'blocked' && (
                                    <Badge 
                                      variant="secondary" 
                                      className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-0"
                                    >
                                      {getStateText(booking.state)}
                                    </Badge>
                                  )}
                                </div>
                                {booking.client && (
                                  <p className="text-xs opacity-90 line-clamp-1 mt-1">
                                    {booking.service} / {booking.client}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Компонент AddPlus - opacity 0% → hover 100% */}
                        {!booking && (
                          <div className="absolute inset-0 flex items-center justify-center group">
                            <div className="w-6 h-6 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
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

      {/* Легенда */}
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
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">Выполнено</span>
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

      {/* Drawer для создания записи */}
      <CreateBookingDrawer
        isOpen={isCreateBookingOpen}
        onClose={() => setIsCreateBookingOpen(false)}
        selectedSlot={selectedSlot}
        onBookingCreated={(newBooking) => {
          // Вычисляем время окончания на основе длительности
          const calculateEndTime = (startTime: string, duration: number): string => {
            const [hours, minutes] = startTime.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes + duration;
            const endHours = Math.floor(totalMinutes / 60);
            const endMinutes = totalMinutes % 60;
            return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
          };

          // Создаем объект записи в формате BookingBlock
          const bookingBlock: BookingBlock = {
            id: newBooking.id,
            resourceId: newBooking.resourceId,
            startTime: newBooking.startTime,
            endTime: calculateEndTime(newBooking.startTime, newBooking.duration),
            client: newBooking.client,
            service: newBooking.service,
            state: 'confirmed'
          };

          // Добавляем новую запись в состояние
          setBookings(prev => [...prev, bookingBlock]);
          
          setIsCreateBookingOpen(false);
          hapticFeedback.success();
        }}
      />

      {/* Drawer деталей записи */}
      <BookingDetailsDrawer
        isOpen={isBookingDetailsOpen}
        onClose={() => setIsBookingDetailsOpen(false)}
        booking={selectedBooking ? {
          ...selectedBooking,
          resourceName: resources.find(r => r.id === selectedBooking.resourceId)?.name || 'Ресурс',
          phone: '+7 (999) 123-45-67',
          price: 2500,
          notes: 'Демонстрационная запись',
          createdAt: new Date().toISOString()
        } : null}
        onCancel={handleCancelBooking}
        onEdit={handleEditBooking}
        onReschedule={handleRescheduleBooking}
      />
    </div>
  );
}