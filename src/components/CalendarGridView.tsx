import React, { useState, useMemo, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useResources } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';
import { AppointmentDrawer } from './AppointmentDrawer';
import { ClientDetailsDrawer } from './ClientDetailsDrawer';
import { CreateBookingDrawer } from './CreateBookingDrawer';
import { Appointment } from '../types/appointment';
import { useAppointments } from '../hooks/useAppointments';
import { toast } from 'sonner@2.0.3';

interface DragState {
  isDragging: boolean;
  appointmentId: string | null;
  startX: number;
  startY: number;
  originalResourceId: string | null;
  originalTimeSlot: string | null;
  currentResourceId: string | null;
  currentTimeSlot: string | null;
}

interface CalendarGridViewProps {
  onAddBooking?: (masterId: string, timeSlot: string) => void;
  onNavigateToClient?: (clientId: string) => void;
}

export function CalendarGridView({ onAddBooking, onNavigateToClient }: CalendarGridViewProps) {
  const { getResourcesByType } = useResources();
  const { hapticFeedback } = useTelegram();
  const { appointments, updateAppointment, validateMove, cancelAppointment, createAppointment, isLoading } = useAppointments();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentDrawerOpen, setIsAppointmentDrawerOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    resourceId: string;
    resourceName: string;
    timeSlot: string;
  } | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    appointmentId: null,
    startX: 0,
    startY: 0,
    originalResourceId: null,
    originalTimeSlot: null,
    currentResourceId: null,
    currentTimeSlot: null
  });
  
  const gridRef = useRef<HTMLDivElement>(null);
  const dragPreviewRef = useRef<HTMLDivElement>(null);

  const specialists = getResourcesByType('specialist');

  // Generate time slots (every 30 minutes from 9:00 to 18:00)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  // Конвертируем appointments в нужный формат для календаря
  const dayAppointments = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.start).toISOString().split('T')[0];
      return aptDate === dateStr;
    });
  }, [appointments, selectedDate]);

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

  // Конвертировать ISO время в время слота (HH:mm)
  const timeToSlot = useCallback((isoTime: string): string => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Конвертировать время слота в ISO для выбранной даты
  const slotToISOTime = useCallback((timeSlot: string): string => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const date = new Date(selectedDate);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  }, [selectedDate]);

  // Get appointment for a specific resource and time slot
  const getAppointmentForSlot = (resourceId: string, timeSlot: string): Appointment | null => {
    return dayAppointments.find(appointment => {
      if (appointment.resourceId !== resourceId) return false;
      
      const appointmentStart = timeToSlot(appointment.start);
      const appointmentEnd = timeToSlot(appointment.end);
      
      // Check if time slot is within appointment range
      return timeSlot >= appointmentStart && timeSlot < appointmentEnd;
    }) || null;
  };

  // Check if this is the start of an appointment
  const isAppointmentStart = (resourceId: string, timeSlot: string): boolean => {
    const appointment = dayAppointments.find(apt => 
      apt.resourceId === resourceId && timeToSlot(apt.start) === timeSlot
    );
    return !!appointment;
  };

  // Get appointment span (how many slots it covers)
  const getAppointmentSpan = (appointment: Appointment): number => {
    const startSlot = timeToSlot(appointment.start);
    const endSlot = timeToSlot(appointment.end);
    const startIndex = timeSlots.indexOf(startSlot);
    const endIndex = timeSlots.findIndex(slot => slot >= endSlot);
    return Math.max(1, endIndex - startIndex);
  };

  const handleTimeSlotClick = (resourceId: string, timeSlot: string) => {
    const appointment = getAppointmentForSlot(resourceId, timeSlot);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsAppointmentDrawerOpen(true);
      hapticFeedback.medium();
    } else {
      // Открываем drawer для создания записи
      const resource = specialists.find(s => s.id === resourceId);
      if (resource) {
        setSelectedSlot({
          resourceId,
          resourceName: resource.name,
          timeSlot
        });
        setIsCreateBookingOpen(true);
        hapticFeedback.light();
      }
      
      // Также вызываем коллбек если есть
      if (onAddBooking) {
        onAddBooking(resourceId, timeSlot);
      }
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDrawerOpen(true);
    hapticFeedback.medium();
  };

  const handleOpenClient = (clientId: string) => {
    if (onNavigateToClient) {
      // Используем навигацию на отдельную страницу
      onNavigateToClient(clientId);
    } else {
      // Fallback к drawer
      setSelectedClientId(clientId);
      setIsClientDrawerOpen(true);
      setIsAppointmentDrawerOpen(false);
    }
  };

  const handleBackToAppointment = () => {
    setIsClientDrawerOpen(false);
    setIsAppointmentDrawerOpen(true);
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    try {
      await cancelAppointment(appointment.id);
      toast.success('Запись отменена');
      setIsAppointmentDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка при отмене записи');
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-primary/90 text-white';
      case 'PENDING': return 'bg-yellow-500/90 text-white';
      case 'CANCELLED': return 'bg-red-500/90 text-white';
      default: return 'bg-muted/90 text-muted-foreground';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'Подтверждено';
      case 'PENDING': return 'Ожидает';
      case 'CANCELLED': return 'Отменено';
      default: return '';
    }
  };

  // Drag and Drop handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, appointment: Appointment) => {
    if (appointment.status === 'CANCELLED') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const startSlot = timeToSlot(appointment.start);
    setDragState({
      isDragging: true,
      appointmentId: appointment.id,
      startX: e.clientX,
      startY: e.clientY,
      originalResourceId: appointment.resourceId,
      originalTimeSlot: startSlot,
      currentResourceId: appointment.resourceId,
      currentTimeSlot: startSlot
    });
    
    hapticFeedback.light();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [hapticFeedback]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !gridRef.current) return;

    // Найти элемент под курсором
    const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
    const timeSlotElement = elementUnderMouse?.closest('[data-time-slot]');
    
    if (timeSlotElement) {
      const resourceId = timeSlotElement.getAttribute('data-resource-id');
      const timeSlot = timeSlotElement.getAttribute('data-time-slot');
      
      if (resourceId && timeSlot) {
        setDragState(prev => ({
          ...prev,
          currentResourceId: resourceId,
          currentTimeSlot: timeSlot
        }));
      }
    }
  }, [dragState.isDragging]);

  const handleMouseUp = useCallback(async () => {
    if (!dragState.isDragging || !dragState.appointmentId) {
      setDragState({
        isDragging: false,
        appointmentId: null,
        startX: 0,
        startY: 0,
        originalResourceId: null,
        originalTimeSlot: null,
        currentResourceId: null,
        currentTimeSlot: null
      });
      return;
    }

    const { 
      appointmentId, 
      originalResourceId, 
      originalTimeSlot, 
      currentResourceId, 
      currentTimeSlot 
    } = dragState;

    // Проверяем, изменилось ли что-то
    const hasChanged = originalResourceId !== currentResourceId || originalTimeSlot !== currentTimeSlot;
    
    if (hasChanged && currentResourceId && currentTimeSlot) {
      try {
        const appointment = appointments.find(apt => apt.id === appointmentId);
        if (!appointment) throw new Error('Запись не найдена');

        // Вычисляем новое время
        const originalStart = new Date(appointment.start);
        const originalEnd = new Date(appointment.end);
        const duration = originalEnd.getTime() - originalStart.getTime();
        
        const newStart = slotToISOTime(currentTimeSlot);
        const newEnd = new Date(new Date(newStart).getTime() + duration).toISOString();

        // Валидация
        const validation = validateMove(appointmentId, newStart, newEnd, currentResourceId);
        if (!validation.isValid) {
          toast.error(validation.error || 'Невозможно переместить запись');
          setDragState({
            isDragging: false,
            appointmentId: null,
            startX: 0,
            startY: 0,
            originalResourceId: null,
            originalTimeSlot: null,
            currentResourceId: null,
            currentTimeSlot: null
          });
          return;
        }

        // Обновляем запись
        await updateAppointment(appointmentId, {
          start: newStart,
          end: newEnd,
          resourceId: currentResourceId
        });

        toast.success('Запись перемещена');
        hapticFeedback.success();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ошибка при перемещении записи');
        hapticFeedback.error();
      }
    }

    // Очищаем состояние
    setDragState({
      isDragging: false,
      appointmentId: null,
      startX: 0,
      startY: 0,
      originalResourceId: null,
      originalTimeSlot: null,
      currentResourceId: null,
      currentTimeSlot: null
    });

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [dragState, appointments, validateMove, updateAppointment, slotToISOTime, hapticFeedback]);

  // Touch events для мобильных устройств
  const handleTouchStart = useCallback((e: React.TouchEvent, appointment: Appointment) => {
    if (appointment.status === 'CANCELLED') return;
    
    const touch = e.touches[0];
    handleMouseDown({
      preventDefault: () => e.preventDefault(),
      stopPropagation: () => e.stopPropagation(),
      clientX: touch.clientX,
      clientY: touch.clientY
    } as any, appointment);
  }, [handleMouseDown]);

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
          <div className={`min-w-[${Math.max(700, 300 + specialists.length * 200)}px]`}>
            {/* Header Row */}
            <div 
              className="grid gap-0 border-b border-border"
              style={{ 
                gridTemplateColumns: `100px repeat(${specialists.length}, minmax(200px, 1fr))` 
              }}
            >
              <div className="p-4 font-medium text-sm text-muted-foreground bg-muted/30">
                Время
              </div>
              {specialists.map((specialist) => (
                <div key={specialist.id} className="p-4 border-l border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{specialist.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {specialist.skills?.[0] || 'Специалист'}
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
                gridTemplateColumns: `100px repeat(${specialists.length}, minmax(200px, 1fr))` 
              }}
            >
              {timeSlots.map((timeSlot, timeIndex) => (
                <React.Fragment key={timeSlot}>
                  {/* Time Label */}
                  <div className="p-3 border-b border-border bg-muted/20 flex items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{timeSlot}</span>
                    </div>
                  </div>

                  {/* Resource Columns */}
                  {specialists.map((specialist) => {
                    const appointment = getAppointmentForSlot(specialist.id, timeSlot);
                    const isStart = isAppointmentStart(specialist.id, timeSlot);
                    const isDragTarget = dragState.isDragging && 
                      dragState.currentResourceId === specialist.id && 
                      dragState.currentTimeSlot === timeSlot;
                    
                    return (
                      <div
                        key={`${specialist.id}-${timeSlot}`}
                        data-resource-id={specialist.id}
                        data-time-slot={timeSlot}
                        className={`
                          min-h-[60px] border-b border-l border-border relative cursor-pointer
                          hover:bg-muted/30 transition-colors
                          ${appointment ? 'bg-muted/10' : 'bg-background'}
                          ${isDragTarget ? 'bg-primary/20 ring-2 ring-primary/50' : ''}
                        `}
                        onClick={() => handleTimeSlotClick(specialist.id, timeSlot)}
                      >
                        {appointment && isStart && (
                          <div 
                            className={`
                              absolute inset-x-1 top-1 rounded-lg p-2 z-10 shadow-sm cursor-move
                              hover:shadow-md transition-shadow select-none
                              ${getStatusColor(appointment.status)}
                              ${appointment.status === 'CANCELLED' ? 'cursor-pointer opacity-60' : ''}
                              ${dragState.isDragging && dragState.appointmentId === appointment.id ? 'opacity-50' : ''}
                            `}
                            style={{
                              height: `${getAppointmentSpan(appointment) * 60 - 8}px`,
                              backgroundColor: appointment.color,
                              minHeight: '52px'
                            }}
                            onMouseDown={(e) => appointment.status !== 'CANCELLED' && handleMouseDown(e, appointment)}
                            onTouchStart={(e) => appointment.status !== 'CANCELLED' && handleTouchStart(e, appointment)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAppointmentClick(appointment);
                            }}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-xs leading-tight text-white">
                                  {appointment.client.name}
                                </p>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs px-1 py-0 bg-white/20 text-white border-0"
                                >
                                  {getStatusText(appointment.status)}
                                </Badge>
                              </div>
                              <p className="text-xs opacity-90 text-white line-clamp-1">
                                {appointment.title}
                              </p>
                              <div className="flex items-center justify-between text-xs opacity-80 text-white">
                                <span>{timeToSlot(appointment.start)}-{timeToSlot(appointment.end)}</span>
                                {appointment.price && (
                                  <span>₽{appointment.price.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!appointment && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4 text-muted-foreground" />
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
              <div className="w-4 h-4 rounded bg-primary/90"></div>
              <span className="text-sm">Подтверждено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500/90"></div>
              <span className="text-sm">Ожидает подтверждения</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/90"></div>
              <span className="text-sm">Отменено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/90"></div>
              <span className="text-sm">Выполнено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-dashed border-muted-foreground rounded"></div>
              <span className="text-sm">Свободное время</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Drawer */}
      <AppointmentDrawer
        appointment={selectedAppointment}
        isOpen={isAppointmentDrawerOpen}
        onClose={() => setIsAppointmentDrawerOpen(false)}
        onOpenClient={handleOpenClient}
        onCancel={handleCancelAppointment}
      />

      {/* Client Details Drawer */}
      <ClientDetailsDrawer
        clientId={selectedClientId}
        isOpen={isClientDrawerOpen}
        onClose={() => setIsClientDrawerOpen(false)}
        onBack={handleBackToAppointment}
      />

      {/* Create Booking Drawer */}
      <CreateBookingDrawer
        isOpen={isCreateBookingOpen}
        onClose={() => setIsCreateBookingOpen(false)}
        selectedSlot={selectedSlot}
        onBookingCreated={async (newBooking) => {
          try {
            // Вычисляем время окончания
            const startDate = new Date(selectedDate);
            const [hours, minutes] = newBooking.startTime.split(':').map(Number);
            startDate.setHours(hours, minutes, 0, 0);
            
            const endDate = new Date(startDate.getTime() + (newBooking.duration * 60 * 1000));

            await createAppointment({
              clientName: newBooking.client,
              clientPhone: newBooking.phone || '',
              resourceId: newBooking.resourceId,
              title: newBooking.service,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              price: newBooking.price || 0,
              notes: newBooking.notes
            });

            setIsCreateBookingOpen(false);
            hapticFeedback.success();
            toast.success('Запись создана успешно!');
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Ошибка при создании записи');
          }
        }}
      />

      {/* Grid Reference for drag and drop */}
      <div ref={gridRef} className="hidden" />
    </div>
  );
}