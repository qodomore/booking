import React, { useContext, useState } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { AppContext, Service } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { BottomActionBar } from './BottomActionBar';

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
    setSelectedTime 
  } = context;
  
  const [showMoreTimes, setShowMoreTimes] = useState(false);

  const texts = {
    ru: {
      selectTime: 'Выбор времени',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      duration: 'Длительность',
      buffer: 'Буфер',
      minutes: 'мин',
      continue: 'Продолжить',
      more: 'Ещё',
      selectDate: 'Выбрать дату'
    },
    en: {
      selectTime: 'Select Time',
      today: 'Today',
      tomorrow: 'Tomorrow',
      duration: 'Duration',
      buffer: 'Buffer',
      minutes: 'min',
      continue: 'Continue',
      more: 'More',
      selectDate: 'Select Date'
    }
  };

  const t = texts[language];

  // Mock available time slots
  const generateTimeSlots = (date: string) => {
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '14:00', '14:30', '15:00',
      '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
    ];
    
    // Simulate some slots being unavailable
    const unavailableSlots = date === 'today' ? ['10:30', '11:00', '14:00', '15:30'] : ['09:30', '12:30'];
    
    return baseSlots.filter(slot => !unavailableSlots.includes(slot));
  };

  const todaySlots = generateTimeSlots('today').slice(0, showMoreTimes ? undefined : 6);
  const tomorrowSlots = generateTimeSlots('tomorrow').slice(0, showMoreTimes ? undefined : 8);

  const dates = [
    { id: 'today', label: t.today, date: new Date().toLocaleDateString('ru-RU'), slots: todaySlots },
    { id: 'tomorrow', label: t.tomorrow, date: new Date(Date.now() + 86400000).toLocaleDateString('ru-RU'), slots: tomorrowSlots },
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

      {/* Date Selection */}
      <div className="flex-1 px-4 space-y-6">
        {dates.map((dateInfo) => (
          <div key={dateInfo.id}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">{dateInfo.label}</h3>
              <span className="text-sm text-muted-foreground">• {dateInfo.date}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {dateInfo.slots.map((time) => {
                const isSelected = selectedTime === time && selectedDate === dateInfo.id;
                return (
                  <Badge
                    key={time}
                    variant={isSelected ? "default" : "secondary"}
                    className={`justify-center py-2 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                    onClick={() => handleTimeSelect(time, dateInfo.id)}
                  >
                    {time}
                  </Badge>
                );
              })}
            </div>
            
            {dateInfo.slots.length >= 6 && !showMoreTimes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreTimes(true)}
                className="w-full mt-2 text-primary"
              >
                {t.more}
              </Button>
            )}
          </div>
        ))}

        {/* Custom Date Picker */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0 cursor-pointer hover:bg-card/90 transition-colors">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span>{t.selectDate}</span>
          </div>
        </Card>

        {/* Selected Time Summary */}
        {selectedTime && selectedDate && (
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
                  {service.name} • {service.duration} {t.minutes}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

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