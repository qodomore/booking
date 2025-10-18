import React, { useContext, useState, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { AppContext, Service, Resource } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BottomActionBar } from './BottomActionBar';
import { MasterPicker, Master } from './MasterPicker';
import { SlotGrid, DateSlots, TimeSlot } from './SlotGrid';

interface TimeSelectionProps {
  service: Service;
}

export function TimeSelection({ service }: TimeSelectionProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    language, 
    setCurrentScreen, 
    selectedDate, 
    setSelectedDate, 
    selectedTime, 
    setSelectedTime,
    selectedMaster,
    setSelectedMaster,
    businessResources
  } = context;
  
  const [showMoreTimes, setShowMoreTimes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = {
    ru: {
      selectTime: 'Выбор времени',
      duration: 'Длительность',
      buffer: 'Буфер',
      minutes: 'мин',
      continue: 'Продолжить',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      errorLoading: 'Ошибка загрузки слотов'
    },
    en: {
      selectTime: 'Select Time',
      duration: 'Duration',
      buffer: 'Buffer',
      minutes: 'min',
      continue: 'Continue',
      today: 'Today',
      tomorrow: 'Tomorrow',
      errorLoading: 'Error loading slots'
    }
  };

  const t = texts[language];

  // Get available masters for this service (only person type resources)
  const availableMasters: Master[] = businessResources
    .filter(resource => 
      resource.type === 'person' && 
      service.resourceIds?.includes(resource.id)
    )
    .map(resource => ({
      id: resource.id,
      name: resource.name,
      avatar: resource.avatar,
      skillBadge: resource.skillBadge || (language === 'ru' ? 'Мастер' : 'Master'),
      availableSlots: undefined // Will be calculated based on slots
    }));

  // Mock function to generate time slots based on selected master
  const generateTimeSlots = (date: string, masterId: string | null): TimeSlot[] => {
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '14:00', '14:30', '15:00',
      '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
    ];
    
    // Simulate different availability for different masters
    let unavailableSlots: string[] = [];
    
    if (masterId === null) {
      // "Any master" - show combined availability (more slots available)
      unavailableSlots = date === 'today' ? ['10:30', '14:00'] : ['09:30'];
    } else if (masterId === 'resource-1') {
      // Анна Петрова - Top master, fewer slots
      unavailableSlots = date === 'today' 
        ? ['09:00', '09:30', '10:30', '11:00', '14:00', '15:30', '17:00'] 
        : ['09:30', '10:00', '12:30', '15:00'];
    } else if (masterId === 'resource-2') {
      // Мария Иванова - Medium availability
      unavailableSlots = date === 'today' 
        ? ['10:00', '11:30', '13:00', '16:00'] 
        : ['09:00', '11:00', '14:30', '17:30'];
    } else if (masterId === 'resource-3') {
      // Елена Смирнова - Most availability
      unavailableSlots = date === 'today' 
        ? ['12:00', '15:00'] 
        : ['13:00'];
    }
    
    return baseSlots
      .filter(slot => !unavailableSlots.includes(slot))
      .map(time => ({
        time,
        available: true,
        masterId: masterId || undefined
      }));
  };

  // Simulate loading slots when master changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        setError(t.errorLoading);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedMaster]);

  // Reset selected time when master changes
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedMaster]);

  const todaySlots = generateTimeSlots('today', selectedMaster?.id || null);
  const tomorrowSlots = generateTimeSlots('tomorrow', selectedMaster?.id || null);

  // Update masters with available slot counts
  const mastersWithSlots = availableMasters.map(master => ({
    ...master,
    availableSlots: 
      generateTimeSlots('today', master.id).length + 
      generateTimeSlots('tomorrow', master.id).length
  }));

  const dates: DateSlots[] = [
    { 
      id: 'today', 
      label: t.today, 
      date: new Date().toLocaleDateString('ru-RU'), 
      slots: todaySlots
    },
    { 
      id: 'tomorrow', 
      label: t.tomorrow, 
      date: new Date(Date.now() + 86400000).toLocaleDateString('ru-RU'), 
      slots: tomorrowSlots
    },
  ];

  const handleBack = () => {
    setCurrentScreen('service-details');
  };

  const handleTimeSelect = (time: string, date: string) => {
    setSelectedTime(time);
    setSelectedDate(date);
  };

  const handleContinue = () => {
    if (selectedTime && selectedDate) {
      setCurrentScreen('confirmation');
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="flex flex-col min-h-screen pb-32">
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
            <h1 className="font-medium">{t.selectTime}</h1>
          </div>
        </div>

        {/* Service Info */}
        <div className="p-4">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium">{service.name}</h2>
                <p className="text-sm text-muted-foreground">{service.provider}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {service.price.fixed ? `${service.price.fixed}₽` : `от ${service.price.from}₽`}
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              {t.duration} {service.duration} {t.minutes} • {t.buffer} 10 {t.minutes}
            </div>
          </Card>
        </div>

        {/* Master Picker */}
        <MasterPicker
          masters={mastersWithSlots}
          selectedMaster={selectedMaster ? {
            id: selectedMaster.id,
            name: selectedMaster.name,
            avatar: selectedMaster.avatar,
            skillBadge: selectedMaster.skillBadge
          } : null}
          onSelectMaster={(master) => {
            if (master) {
              const resource = businessResources.find(r => r.id === master.id);
              setSelectedMaster(resource ?? null);
            } else {
              setSelectedMaster(null);
            }
          }}
          language={language}
          isLoading={isLoading}
        />

        {/* Slot Grid */}
        <SlotGrid
          dates={dates}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          onTimeSelect={handleTimeSelect}
          showMoreTimes={showMoreTimes}
          onShowMore={() => setShowMoreTimes(true)}
          language={language}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />

        {/* Selected Time Summary */}
        {selectedTime && selectedDate && !isLoading && !error && (
          <div className="px-4 mt-6">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {dates.find(d => d.id === selectedDate)?.label}, {selectedTime} - {calculateEndTime(selectedTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.name} • {selectedMaster ? selectedMaster.name : (language === 'ru' ? 'Любой мастер' : 'Any master')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <BottomActionBar
        currentStep={2}
        onContinue={handleContinue}
        isDisabled={!selectedTime || !selectedDate}
      />
    </>
  );
}
