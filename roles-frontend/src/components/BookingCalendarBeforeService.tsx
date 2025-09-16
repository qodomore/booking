import React, { useState, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { TimeRangeChip } from './ui/time-range-chip';
import { StickyProgressBar } from './ui/sticky-progress-bar';
import { useResources } from '../contexts/ResourceContext';

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
}

type DateSelection = 'today' | 'tomorrow' | 'custom';

export function BookingCalendarBeforeService() {
  const { getResourcesByType } = useResources();
  const [selectedDate, setSelectedDate] = useState<DateSelection>('today');
  
  const specialists = getResourcesByType('specialist');

  // Mock availability data for different scenarios
  const masterAvailabilities: MasterAvailability[] = useMemo(() => {
    return specialists.slice(0, 3).map((specialist, index) => {
      const scenarios = [
        // Normal availability
        {
          availableRanges: [
            { start: '10:00', end: '12:00' },
            { start: '14:30', end: '17:00' }
          ],
          nextAvailable: '14:30',
          availableHours: 4.5,
          bookingCount: 3
        },
        // Limited availability
        {
          availableRanges: [
            { start: '16:00', end: '17:00' }
          ],
          nextAvailable: '16:00',
          availableHours: 1,
          bookingCount: 7
        },
        // No availability today
        {
          availableRanges: [],
          nextAvailable: 'завтра в 12:30',
          availableHours: 0,
          bookingCount: 8
        }
      ];

      const scenario = scenarios[index];
      
      return {
        masterId: specialist.id,
        masterName: specialist.name,
        rating: 4.5 + Math.random() * 0.5,
        specialties: specialist.skills || ['Маникюр', 'Педикюр'],
        ...scenario
      };
    });
  }, [specialists, selectedDate]);

  const steps = [
    { id: 1, label: 'Выбор услуги', completed: false },
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
  };

  const handleServiceSelect = () => {
    // Mock service selection action
    console.log('Navigate to service selection');
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

  const renderResourceCard = (availability: MasterAvailability) => {
    const hasAvailability = availability.availableRanges.length > 0;
    
    return (
      <Card key={availability.masterId} className="clean-card">
        <CardContent className="p-6 space-y-4">
          {/* Master Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {availability.masterName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{availability.masterName}</h3>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 text-yellow-500">★</div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {availability.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availability.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs elegant-tag">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium">
                {availability.bookingCount} записей
              </p>
              <p className="text-xs text-muted-foreground">
                {hasAvailability ? `${availability.availableRanges.length} окон` : 'занят'}
              </p>
            </div>
          </div>

          {/* Availability Content */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">Доступность сегодня</p>
            
            {hasAvailability ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {availability.availableRanges.map((range, index) => (
                    <TimeRangeChip
                      key={index}
                      startTime={range.start}
                      endTime={range.end}
                    />
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Ближайшее окно: {availability.nextAvailable} • Свободно ≈{availability.availableHours} ч
                </p>
              </>
            ) : (
              <div className="text-center py-6 bg-muted/30 rounded-lg">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Сегодня расписано. Ближайшее {availability.nextAvailable}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="font-semibold text-2xl">Календарь записей</h1>
        <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
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
      {renderDateChips()}

      {/* Resource Cards */}
      <div className="space-y-6">
        {masterAvailabilities.map(renderResourceCard)}
      </div>

      {/* Sticky Progress Bar */}
      <StickyProgressBar
        currentStep={1}
        steps={steps}
        ctaText="Выбрать услугу"
        onCtaClick={handleServiceSelect}
        ctaDisabled={false}
      />
    </div>
  );
}