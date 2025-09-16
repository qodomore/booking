import React, { useState, useMemo } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { StartTimeChipGrid } from './ui/start-time-chip';
import { StickyProgressBar } from './ui/sticky-progress-bar';
import { useResources } from '../contexts/ResourceContext';

interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

interface MasterStartTimes {
  masterId: string;
  masterName: string;
  rating: number;
  specialties: string[];
  bookingCount: number;
  availableStartTimes: string[];
}

type DateSelection = 'today' | 'tomorrow' | 'custom';

export function BookingCalendarAfterService() {
  const { getResourcesByType } = useResources();
  const [selectedDate, setSelectedDate] = useState<DateSelection>('today');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedMaster, setSelectedMaster] = useState<string>('');
  
  const specialists = getResourcesByType('specialist');

  // Mock selected service
  const selectedService: Service = {
    id: '1',
    name: 'Маникюр',
    duration: 60,
    price: 1500,
    category: 'Ногти'
  };

  const bufferTime = 10;

  // Generate valid start times for the selected service
  const masterStartTimes: MasterStartTimes[] = useMemo(() => {
    return specialists.slice(0, 3).map((specialist, index) => {
      // Mock different availability scenarios for start times
      const startTimeScenarios = [
        // Good availability
        ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30'],
        // Limited availability
        ['16:00', '17:00'],
        // Many slots available
        ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30']
      ];

      const startTimes = startTimeScenarios[index] || [];
      
      return {
        masterId: specialist.id,
        masterName: specialist.name,
        rating: 4.5 + Math.random() * 0.5,
        specialties: specialist.skills || ['Маникюр', 'Педикюр'],
        bookingCount: 3 + index * 2,
        availableStartTimes: startTimes
      };
    });
  }, [specialists, selectedDate, selectedService]);

  const steps = [
    { id: 1, label: 'Выбор услуги', completed: true },
    { id: 2, label: 'Выбор времени', completed: false },
    { id: 3, label: 'Подтверждение', completed: false }
  ];

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

  const handleDateSelect = (date: DateSelection) => {
    setSelectedDate(date);
    setSelectedTime('');
    setSelectedMaster('');
  };

  const handleTimeSelect = (masterId: string, time: string) => {
    setSelectedMaster(masterId);
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (selectedTime && selectedMaster) {
      console.log('Confirm booking:', { selectedService, selectedMaster, selectedTime });
    }
  };

  const handleChangeService = () => {
    console.log('Navigate back to service selection');
  };

  const renderDateChips = () => (
    <div className="flex gap-2">
      <Button
        variant={selectedDate === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleDateSelect('today')}
        className="min-h-[44px]"
      >
        Сегодня
      </Button>
      <Button
        variant={selectedDate === 'tomorrow' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleDateSelect('tomorrow')}
        className="min-h-[44px]"
      >
        Завтра
      </Button>
      <Button
        variant={selectedDate === 'custom' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleDateSelect('custom')}
        className="min-h-[44px] gap-2"
      >
        <Calendar className="h-4 w-4" />
        Дата
      </Button>
    </div>
  );

  const renderResourceCard = (masterData: MasterStartTimes) => {
    const hasStartTimes = masterData.availableStartTimes.length > 0;
    
    return (
      <Card key={masterData.masterId} className="clean-card">
        <CardContent className="p-6 space-y-4">
          {/* Master Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {masterData.masterName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{masterData.masterName}</h3>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 text-yellow-500">★</div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {masterData.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {masterData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs elegant-tag">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium">
                {masterData.bookingCount} записей
              </p>
              <p className="text-xs text-muted-foreground">
                {hasStartTimes ? `${masterData.availableStartTimes.length} слотов` : 'занят'}
              </p>
            </div>
          </div>

          {/* Start Times Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">Доступное время</p>
              <p className="text-xs text-muted-foreground">
                Длительность {selectedService.duration} мин • Буфер {bufferTime} мин
              </p>
            </div>
            
            {hasStartTimes ? (
              <StartTimeChipGrid
                times={masterData.availableStartTimes}
                selectedTime={selectedMaster === masterData.masterId ? selectedTime : undefined}
                onTimeSelect={(time) => handleTimeSelect(masterData.masterId, time)}
                maxVisible={6}
              />
            ) : (
              <div className="text-center py-6 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Нет доступных временных слотов для выбранной услуги
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const getCtaText = () => {
    if (selectedTime) {
      return `Подтвердить ${selectedTime}`;
    }
    return 'Выберите время';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="font-semibold text-2xl">
          Выберите время для: "{selectedService.name}, {selectedService.duration} мин"
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
      {renderDateChips()}

      {/* Selected Service Display */}
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
              onClick={handleChangeService}
              className="text-primary hover:bg-primary/10 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Изменить услугу
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Cards */}
      <div className="space-y-6">
        {masterStartTimes.map(renderResourceCard)}
      </div>

      {/* Sticky Progress Bar */}
      <StickyProgressBar
        currentStep={2}
        steps={steps}
        ctaText={getCtaText()}
        onCtaClick={handleConfirmBooking}
        ctaDisabled={!selectedTime}
      />
    </div>
  );
}