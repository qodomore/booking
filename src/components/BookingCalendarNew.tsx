import React, { useState, useMemo } from 'react';
import { User, Plus, CheckCircle, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { DateChips } from './ui/filter-chips';
import { ResourceCard } from './ui/resource-card';
import { StickyProgressBar } from './ui/sticky-progress-bar';
import { EmptyState } from './ui/empty-state';
import { BookingBreadcrumb } from './ui/booking-breadcrumb';
import { BookingCalendarDemo } from './BookingCalendarDemo';
import { ServiceSelectionScreen } from './ServiceSelectionScreen';
import { BookingCalendarBeforeService } from './BookingCalendarBeforeService';
import { BookingCalendarAfterService } from './BookingCalendarAfterService';
import { BookingConfirmationScreen } from './BookingConfirmationScreen';
import { BookingSuccessScreen } from './BookingSuccessScreen';
import { CalendarGridView } from './CalendarGridView';
import { CalendarGridDemo } from './CalendarGridDemo';
import { CalendarGridEnhanced } from './CalendarGridEnhanced';
import { CalendarGridFinal } from './CalendarGridFinal';
import { useResources, Service } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';

interface ClientData {
  name: string;
  phone: string;
  notes?: string;
}

interface BookingData {
  service: Service;
  masterId: string;
  masterName: string;
  selectedTime: string;
  selectedDate: string;
}

interface TimeRange {
  start: string;
  end: string;
}

interface MasterAvailability {
  masterId: string;
  masterName: string;
  rating: number;
  specialties: string[];
  bookingCount: number;
  availableRanges: TimeRange[];
  nextAvailable?: string;
  availableHours: number;
  availableStartTimes?: string[]; // For after service selection
}

type BookingStep = 'service-selection' | 'master-selection' | 'time-selection' | 'confirmation' | 'success';

interface BookingCalendarNewProps {
  onNavigateToClient?: (clientId: string) => void;
}

export function BookingCalendarNew({ onNavigateToClient }: BookingCalendarNewProps) {
  const { getResourcesByType, services } = useResources();
  const { hapticFeedback } = useTelegram();
  
  // State management
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [currentStep, setCurrentStep] = useState<BookingStep>('service-selection');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMasters, setLoadingMasters] = useState<string[]>([]);
  const [showDemo, setShowDemo] = useState(false);
  const [viewMode, setViewMode] = useState<'legacy' | 'new' | 'grid'>('grid');

  const specialists = getResourcesByType('specialist');

  // Generate time slots and availability
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

  // Mock availability data
  const masterAvailabilities: MasterAvailability[] = useMemo(() => {
    return specialists.map((specialist, index) => {
      // Mock different availability scenarios
      const scenarios = [
        // Default availability
        {
          availableRanges: [
            { start: '10:00', end: '12:00' },
            { start: '14:30', end: '17:00' }
          ],
          nextAvailable: '14:30',
          availableHours: 4.5,
          bookingCount: 3
        },
        // Heavy load
        {
          availableRanges: [
            { start: '16:00', end: '17:00' }
          ],
          nextAvailable: '16:00',
          availableHours: 1,
          bookingCount: 7
        },
        // Empty today
        {
          availableRanges: [],
          nextAvailable: '12:30',
          availableHours: 0,
          bookingCount: 8
        }
      ];

      const scenario = scenarios[index % scenarios.length];

      let availableStartTimes: string[] = [];
      if (selectedService && scenario.availableRanges.length > 0) {
        // Calculate valid start times based on service duration
        const allSlots = generateTimeSlots();
        const serviceDuration = selectedService.duration;
        const bufferTime = 10; // buffer in minutes

        availableStartTimes = allSlots.filter(slot => {
          const [slotHour, slotMinute] = slot.split(':').map(Number);
          const slotTime = slotHour * 60 + slotMinute;
          const endTime = slotTime + serviceDuration + bufferTime;

          // Check if this slot fits within available ranges
          return scenario.availableRanges.some(range => {
            const [startHour, startMinute] = range.start.split(':').map(Number);
            const [endHour, endMinute] = range.end.split(':').map(Number);
            const rangeStart = startHour * 60 + startMinute;
            const rangeEnd = endHour * 60 + endMinute;

            return slotTime >= rangeStart && endTime <= rangeEnd;
          });
        });
      }

      return {
        masterId: specialist.id,
        masterName: specialist.name,
        rating: 4.5 + Math.random() * 0.5,
        specialties: specialist.skills || [],
        availableStartTimes,
        ...scenario
      };
    });
  }, [specialists, selectedService, selectedDate]);

  // Progress steps
  const steps = [
    { id: 1, label: 'Услуга', completed: !!selectedService },
    { id: 2, label: 'Время', completed: !!selectedTime && !!selectedMaster },
    { id: 3, label: 'Подтверждение', completed: !!bookingData }
  ];

  const handleDateSelect = (date: 'today' | 'tomorrow' | 'custom') => {
    hapticFeedback.light();
    setSelectedDate(date);
  };

  const handleServiceSelect = (service: Service) => {
    console.log('BookingCalendarNew: Service selected:', service.name);
    setSelectedService(service);
    setCurrentStep('master-selection');
    hapticFeedback.medium();
    console.log('BookingCalendarNew: Switched to master-selection');
  };

  const handleMasterSelect = () => {
    if (selectedService) {
      setCurrentStep('time-selection');
      hapticFeedback.medium();
    }
  };

  const handleTimeSelect = (masterId: string, time: string) => {
    setLoadingMasters(prev => [...prev, masterId]);
    
    setTimeout(() => {
      setSelectedMaster(masterId);
      setSelectedTime(time);
      
      const masterData = specialists.find(s => s.id === masterId);
      if (selectedService && masterData) {
        const booking: BookingData = {
          service: selectedService,
          masterId,
          masterName: masterData.name,
          selectedTime: time,
          selectedDate: formatDateString(selectedDate)
        };
        setBookingData(booking);
        setCurrentStep('confirmation');
      }
      
      setLoadingMasters(prev => prev.filter(id => id !== masterId));
      hapticFeedback.medium();
    }, 500);
  };

  const handleConfirmBooking = (client: ClientData) => {
    setClientData(client);
    setCurrentStep('success');
    hapticFeedback.success();
  };

  const handleCreateNewBooking = () => {
    // Reset all state
    setCurrentStep('service-selection');
    setSelectedService(null);
    setSelectedMaster('');
    setSelectedTime('');
    setBookingData(null);
    setClientData(null);
    setSelectedDate('today');
  };

  const handleAddBookingFromGrid = (masterId: string, timeSlot: string) => {
    setCurrentStep('service-selection');
    setSelectedMaster(masterId);
    setSelectedTime(timeSlot);
    hapticFeedback.light();
  };

  const handleBookingClick = (appointment: any) => {
    // Handle appointment click - could open appointment details
    console.log('Appointment clicked:', appointment);
    hapticFeedback.medium();
  };

  const handleBackToCalendar = () => {
    handleCreateNewBooking();
  };

  const formatDateString = (date: 'today' | 'tomorrow' | 'custom'): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (date) {
      case 'today':
        return today.toISOString().split('T')[0];
      case 'tomorrow':
        return tomorrow.toISOString().split('T')[0];
      case 'custom':
        return today.toISOString().split('T')[0]; // Default to today for now
    }
  };

  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case 'service-selection': return 1;
      case 'master-selection': return 1;
      case 'time-selection': return 2;
      case 'confirmation': return 3;
      case 'success': return 3;
      default: return 1;
    }
  };

  const getCtaText = () => {
    switch (currentStep) {
      case 'service-selection': return 'Выбрать услугу';
      case 'master-selection': return 'Продолжить';
      case 'time-selection': return selectedTime ? `Подтвердить ${selectedTime}` : 'Выберите время';
      case 'confirmation': return 'Подтвердить запись';
      default: return 'Далее';
    }
  };

  const handleCtaClick = () => {
    switch (currentStep) {
      case 'service-selection':
        // Handled by ServiceSelectionScreen
        break;
      case 'master-selection':
        handleMasterSelect();
        break;
      case 'time-selection':
        // Time selection is handled by individual cards
        break;
      case 'confirmation':
        // Handled by BookingConfirmationScreen
        break;
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
        return 'Выберите дату';
    }
  };

  const getResourceCardVariant = (availability: MasterAvailability) => {
    if (isLoading || loadingMasters.includes(availability.masterId)) return 'loading';
    if (currentStep === 'service-selection') return 'availability';
    return 'start-times';
  };

  const getEmptyState = (availability: MasterAvailability) => {
    if (availability.availableRanges.length === 0) return 'none-today';
    if (availability.bookingCount >= 7) return 'heavy-load';
    return undefined;
  };

  const renderHeader = () => {
    if (selectedService) {
      return (
        <div className="space-y-3">
          <h2 className="font-semibold">
            Выберите время для "{selectedService.name}, {selectedService.duration} мин"
          </h2>
          <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h2 className="font-semibold">Календарь записей</h2>
        <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
      </div>
    );
  };

  // Show grid view mode
  if (viewMode === 'grid') {
    if (showDemo) {
      return (
        <CalendarGridFinal
          onAddBooking={handleAddBookingFromGrid}
          onNavigateToClient={onNavigateToClient}
        />
      );
    }
    
    return (
      <CalendarGridView
        onAddBooking={handleAddBookingFromGrid}
        onNavigateToClient={onNavigateToClient}
      />
    );
  }

  // Render new calendar screens based on step
  console.log('BookingCalendarNew: Current step:', currentStep, 'Selected service:', selectedService?.name);
  
  if (viewMode === 'new') {
    switch (currentStep) {
      case 'service-selection':
        return (
          <ServiceSelectionScreen
            onServiceSelect={handleServiceSelect}
          />
        );
      
      case 'master-selection':
        return (
          <div className="max-w-4xl mx-auto space-y-6 pb-32">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="font-semibold text-2xl">Выберите мастера</h1>
              <p className="text-sm text-muted-foreground">
                Выбранная услуга: {selectedService?.name} ({selectedService?.duration} мин)
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2">
              {steps.map((step, index) => {
                const isActive = step.id === 1;
                const isCompleted = false;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {step.id}
                      </div>
                      <span className={`
                        text-sm font-medium transition-colors
                        ${isActive ? 'text-primary' : 'text-muted-foreground'}
                      `}>
                        {step.label}
                      </span>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className="w-16 h-0.5 mx-4 mt-[-24px] bg-muted" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Date Selection */}
            <DateChips
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            {/* Selected Service Display */}
            {selectedService && (
              <Card className="clean-card border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-primary">{selectedService.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedService.duration} мин • ₽{selectedService.price.toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentStep('service-selection')}
                      className="text-primary hover:bg-primary/10"
                    >
                      Изменить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Master Cards */}
            <div className="space-y-6">
              {masterAvailabilities.map((availability) => (
                <ResourceCard
                  key={availability.masterId}
                  id={availability.masterId}
                  name={availability.masterName}
                  rating={availability.rating}
                  specialties={availability.specialties}
                  bookingCount={availability.bookingCount}
                  variant="availability"
                  availableRanges={availability.availableRanges}
                  nextAvailable={availability.nextAvailable}
                  availableHours={availability.availableHours}
                  emptyState={getEmptyState(availability)}
                />
              ))}
            </div>

            {/* Sticky Progress Bar */}
            <StickyProgressBar
              currentStep={1}
              steps={steps}
              ctaText="Продолжить"
              onCtaClick={handleMasterSelect}
              ctaDisabled={false}
            />
          </div>
        );
      
      case 'time-selection':
        return (
          <div className="max-w-4xl mx-auto space-y-6 pb-32">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="font-semibold text-2xl">
                Выберите время для: "{selectedService?.name}, {selectedService?.duration} мин"
              </h1>
              <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2">
              {steps.map((step, index) => {
                const isActive = step.id === 2;
                const isCompleted = step.id === 1;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                        transition-all duration-200
                        ${isCompleted 
                          ? 'bg-primary text-primary-foreground' 
                          : isActive 
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                            : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {step.id}
                      </div>
                      <span className={`
                        text-sm font-medium transition-colors
                        ${isActive 
                          ? 'text-primary' 
                          : isCompleted 
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }
                      `}>
                        {step.label}
                      </span>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`
                        w-16 h-0.5 mx-4 mt-[-24px] transition-colors
                        ${step.id < 2 ? 'bg-primary' : 'bg-muted'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Date Selection */}
            <DateChips
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            {/* Selected Service Display */}
            {selectedService && (
              <Card className="clean-card border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-primary">{selectedService.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedService.duration} мин • ₽{selectedService.price.toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentStep('service-selection')}
                      className="text-primary hover:bg-primary/10"
                    >
                      Изменить услугу
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Master Cards */}
            <div className="space-y-6">
              {masterAvailabilities.map((availability) => (
                <ResourceCard
                  key={availability.masterId}
                  id={availability.masterId}
                  name={availability.masterName}
                  rating={availability.rating}
                  specialties={availability.specialties}
                  bookingCount={availability.bookingCount}
                  variant="start-times"
                  availableStartTimes={availability.availableStartTimes}
                  selectedTime={selectedMaster === availability.masterId ? selectedTime : undefined}
                  serviceDuration={selectedService?.duration}
                  onTimeSelect={(time) => handleTimeSelect(availability.masterId, time)}
                />
              ))}
            </div>

            {/* Sticky Progress Bar */}
            <StickyProgressBar
              currentStep={2}
              steps={steps}
              ctaText={selectedTime ? `Подтвердить ${selectedTime}` : 'Выберите время'}
              onCtaClick={() => {}}
              ctaDisabled={!selectedTime}
            />
          </div>
        );
      
      case 'confirmation':
        if (!bookingData) return null;
        return (
          <BookingConfirmationScreen
            bookingData={bookingData}
            onConfirm={handleConfirmBooking}
            onBack={() => setCurrentStep('time-selection')}
            onChangeService={() => setCurrentStep('service-selection')}
            onChangeTime={() => setCurrentStep('time-selection')}
          />
        );
      
      case 'success':
        if (!bookingData || !clientData) return null;
        return (
          <BookingSuccessScreen
            bookingData={bookingData}
            clientData={clientData}
            onCreateNewBooking={handleCreateNewBooking}
            onBackToCalendar={handleBackToCalendar}
          />
        );
    }
  }

  // Show demo view
  if (showDemo) {
    return <BookingCalendarDemo />;
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Mode Toggle */}
      <Card className="clean-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Режим календаря</h4>
              <p className="text-sm text-muted-foreground">
                Календарь - просмотр расписания, Демо - календарь с примерами записей, Запись - создание новой записи
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setViewMode('grid');
                  setShowDemo(false);
                }}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Календарь
              </Button>
              <Button
                variant={showDemo && viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setViewMode('grid');
                  setShowDemo(true);
                }}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Демо
              </Button>
              <Button
                variant={viewMode === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setViewMode('new');
                  setShowDemo(false);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Запись
              </Button>
              <Button
                variant={viewMode === 'legacy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setViewMode('legacy');
                  setShowDemo(false);
                }}
              >
                Текущий
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      {renderHeader()}
      
      {/* Booking Progress */}
      <BookingBreadcrumb 
        currentStep={currentStep}
        selectedService={selectedService?.name}
        selectedTime={selectedTime}
      />
      
      {/* Date Selection */}
      <DateChips
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {/* Selected Service Display */}
      {selectedService && (
        <Card className="clean-card border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-primary">{selectedService.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedService.duration} мин • ₽{selectedService.price.toLocaleString()}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedService(null);
                  setSelectedTime('');
                  setSelectedMaster('');
                  setCurrentStep('service-selection');
                }}
                className="text-primary hover:bg-primary/10"
              >
                Изменить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Summary */}
      {currentStep === 'confirmation' && selectedService && selectedTime && selectedMaster && (
        <Card className="clean-card border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Подтверждение записи</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Услуга</p>
                  <p className="font-medium">{selectedService.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedService.duration} мин • ₽{selectedService.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Время</p>
                  <p className="font-medium">{selectedTime}</p>
                  <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Мастер</p>
                <p className="font-medium">
                  {masterAvailabilities.find(m => m.masterId === selectedMaster)?.masterName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Master Cards */}
      {currentStep !== 'confirmation' && (
        <div className="space-y-6">
          {masterAvailabilities.map((availability) => (
            <ResourceCard
              key={availability.masterId}
              id={availability.masterId}
              name={availability.masterName}
              rating={availability.rating}
              specialties={availability.specialties}
              bookingCount={availability.bookingCount}
              variant={getResourceCardVariant(availability)}
              // Availability variant props
              availableRanges={availability.availableRanges}
              nextAvailable={availability.nextAvailable}
              availableHours={availability.availableHours}
              emptyState={getEmptyState(availability)}
              // Start times variant props
              availableStartTimes={availability.availableStartTimes}
              selectedTime={selectedMaster === availability.masterId ? selectedTime : undefined}
              serviceDuration={selectedService?.duration}
              onTimeSelect={(time) => handleTimeSelect(availability.masterId, time)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {masterAvailabilities.length === 0 && (
        <EmptyState
          icon={User}
          title="Нет доступных мастеров"
          description="Добавьте специалистов в разделе 'Мастера'"
          action={{
            label: "Добавить мастера",
            onClick: () => console.log('Navigate to add master')
          }}
        />
      )}

      {/* Sticky Progress Bar */}
      <StickyProgressBar
        currentStep={getCurrentStepNumber()}
        steps={steps}
        ctaText={getCtaText()}
        onCtaClick={handleCtaClick}
        ctaDisabled={currentStep === 'time-selection' && !selectedTime}
      />
    </div>
  );
}