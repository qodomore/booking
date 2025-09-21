import { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, User, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';

interface AvailabilityStepProps {
  locale?: 'RU' | 'EN';
}

type LoadingState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

const translations = {
  RU: {
    title: 'Выберите дату и время',
    subtitle: 'Выберите удобную дату и время. Видны только свободные окна',
    masterFilter: 'Мастер',
    durationFilter: 'Длительность',
    allMasters: 'Любой мастер',
    master1: 'Анна Иванова',
    master2: 'Елена Петрова',
    duration30: '30 минут',
    duration60: '60 минут',
    duration90: '90 минут',
    showOtherDays: 'Показать другие дни',
    noSlotsAvailable: 'В этот день нет свободных окон',
    tryAnotherDate: 'Попробуйте выбрать другую дату или мастера',
    selectedSlot: 'Выбранное время',
    loadingSlots: 'Загружаем доступное время...',
    errorLoading: 'Ошибка загрузки. Попробуйте еще раз',
    retry: 'Повторить'
  },
  EN: {
    title: 'Choose Date and Time',
    subtitle: 'Choose convenient date and time. Only available slots are shown',
    masterFilter: 'Master',
    durationFilter: 'Duration',
    allMasters: 'Any master',
    master1: 'Anna Ivanova',
    master2: 'Elena Petrova',
    duration30: '30 minutes',
    duration60: '60 minutes',
    duration90: '90 minutes',
    showOtherDays: 'Show other days',
    noSlotsAvailable: 'No available slots for this day',
    tryAnotherDate: 'Try selecting another date or master',
    selectedSlot: 'Selected time',
    loadingSlots: 'Loading available times...',
    errorLoading: 'Loading error. Please try again',
    retry: 'Retry'
  }
};

export function Step05Availability({ locale = 'RU' }: AvailabilityStepProps) {
  const t = translations[locale];
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedMaster, setSelectedMaster] = useState<string>('any');
  const [selectedDuration, setSelectedDuration] = useState<string>('60');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  // Mock dates for the week ahead
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        id: date.toISOString().split('T')[0],
        day: date.toLocaleDateString(locale === 'RU' ? 'ru-RU' : 'en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString(locale === 'RU' ? 'ru-RU' : 'en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Mock time slots
  const mockSlots = {
    'available': ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'],
    'empty': [],
    'few': ['14:00', '17:00']
  };

  const handleDateSelect = (dateId: string) => {
    setSelectedDate(dateId);
    setSelectedSlot('');
    setLoadingState('loading');
    
    // Simulate API call
    setTimeout(() => {
      const scenarios = ['available', 'empty', 'few'];
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      if (randomScenario === 'empty') {
        setLoadingState('empty');
      } else {
        setLoadingState('success');
      }
    }, 1000);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const getCurrentSlots = () => {
    if (loadingState === 'empty') return mockSlots.empty;
    if (loadingState === 'success') return mockSlots.available;
    return [];
  };

  return (
    <div className="space-y-7">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto mb-1">
          {t.subtitle}
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-muted-foreground" />
          <Select value={selectedMaster} onValueChange={setSelectedMaster}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.masterFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t.allMasters}</SelectItem>
              <SelectItem value="master1">{t.master1}</SelectItem>
              <SelectItem value="master2">{t.master2}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t.durationFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">{t.duration30}</SelectItem>
              <SelectItem value="60">{t.duration60}</SelectItem>
              <SelectItem value="90">{t.duration90}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Picker */}
      <Card className="p-6 shadow-sm rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium">
              {locale === 'RU' ? 'Январь 2024' : 'January 2024'}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date) => (
            <Button
              key={date.id}
              variant={selectedDate === date.id ? "default" : "ghost"}
              className={`flex flex-col p-3 h-auto ${
                selectedDate === date.id 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary/10 text-foreground"
              }`}
              onClick={() => handleDateSelect(date.id)}
            >
              <span className="text-xs opacity-70">{date.day}</span>
              <span className="text-lg font-medium">{date.date}</span>
              <span className="text-xs opacity-70">{date.month}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <Card className="p-6 shadow-sm rounded-2xl border border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-medium">
                {locale === 'RU' ? 'Доступное время' : 'Available Times'}
              </h3>
            </div>

            {loadingState === 'loading' && (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">{t.loadingSlots}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-11 rounded-lg" />
                  ))}
                </div>
              </div>
            )}

            {loadingState === 'empty' && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-amber-800">
                  <div className="space-y-2">
                    <p className="font-medium">{t.noSlotsAvailable}</p>
                    <p className="text-sm">{t.tryAnotherDate}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {loadingState === 'success' && (
              <div className="grid grid-cols-3 gap-3">
                {getCurrentSlots().map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? "default" : "outline"}
                    className={`h-11 ${
                      selectedSlot === slot 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            )}

            {selectedSlot && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.selectedSlot}: {selectedSlot}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Show Other Days Button */}
      {loadingState === 'empty' && (
        <div className="text-center">
          <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/10">
            {t.showOtherDays}
          </Button>
        </div>
      )}

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: Получать слоты через GET /v1/availability?service_id&date (кэш 10 мин, Redis). 
        Показаны только free. Идемпотентный hold на шаге 6</p>
      </div>
    </div>
  );
}