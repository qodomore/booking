import React, { useContext, useState } from 'react';
import { ArrowLeft, Calendar, Clock, X, Edit } from 'lucide-react';
import { AppContext, Booking } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';

interface RescheduleCancelProps {
  booking: Booking;
}

export function RescheduleCancel({ booking }: RescheduleCancelProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    language, 
    setCurrentScreen,
    selectedService,
    setSelectedService,
    bookings,
    setBookings,
    setCurrentBooking
  } = context;

  const [activeTab, setActiveTab] = useState('reschedule');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelComment, setCancelComment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const texts = {
    ru: {
      rescheduleCancel: 'Перенос и отмена',
      reschedule: 'Перенести',
      cancel: 'Отменить',
      selectNewTime: 'Выберите новое время',
      currentBooking: 'Текущая запись',
      newTime: 'Новое время',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      confirmReschedule: 'Подтвердить перенос',
      cancelReason: 'Причина отмены',
      reasonSchedule: 'Не подходит время',
      reasonPersonal: 'Личные обстоятельства',
      reasonService: 'Не нужна услуга',
      reasonOther: 'Другое',
      additionalComment: 'Дополнительный комментарий',
      commentPlaceholder: 'Расскажите подробнее...',
      confirmCancel: 'Отменить запись',
      processing: 'Обработка...',
      rescheduleSuccess: 'Запись успешно перенесена',
      cancelSuccess: 'Запись отменена',
      service: 'Услуга',
      provider: 'Поставщик',
      datetime: 'Дата и время'
    },
    en: {
      rescheduleCancel: 'Reschedule & Cancel',
      reschedule: 'Reschedule',
      cancel: 'Cancel',
      selectNewTime: 'Select new time',
      currentBooking: 'Current booking',
      newTime: 'New time',
      today: 'Today',
      tomorrow: 'Tomorrow',
      confirmReschedule: 'Confirm Reschedule',
      cancelReason: 'Cancellation reason',
      reasonSchedule: 'Time doesn\'t work',
      reasonPersonal: 'Personal circumstances',
      reasonService: 'Don\'t need service',
      reasonOther: 'Other',
      additionalComment: 'Additional comment',
      commentPlaceholder: 'Tell us more...',
      confirmCancel: 'Cancel Booking',
      processing: 'Processing...',
      rescheduleSuccess: 'Booking successfully rescheduled',
      cancelSuccess: 'Booking cancelled',
      service: 'Service',
      provider: 'Provider',
      datetime: 'Date & Time'
    }
  };

  const t = texts[language];

  // Mock available time slots for rescheduling
  const generateTimeSlots = (date: string) => {
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '14:00', '14:30', '15:00',
      '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
    ];
    
    // Simulate some slots being unavailable
    const unavailableSlots = date === 'today' ? ['10:30', '11:00', '14:00'] : ['09:30', '12:30'];
    
    return baseSlots.filter(slot => !unavailableSlots.includes(slot));
  };

  const todaySlots = generateTimeSlots('today').slice(0, 8);
  const tomorrowSlots = generateTimeSlots('tomorrow').slice(0, 8);

  const dates = [
    { id: 'today', label: t.today, date: new Date().toLocaleDateString('ru-RU'), slots: todaySlots },
    { id: 'tomorrow', label: t.tomorrow, date: new Date(Date.now() + 86400000).toLocaleDateString('ru-RU'), slots: tomorrowSlots },
  ];

  const cancelReasons = [
    { value: 'schedule', label: t.reasonSchedule },
    { value: 'personal', label: t.reasonPersonal },
    { value: 'service', label: t.reasonService },
    { value: 'other', label: t.reasonOther }
  ];

  const handleBack = () => {
    setCurrentScreen('booking-details');
  };

  const handleTimeSelect = (time: string, date: string) => {
    setSelectedTime(time);
    setSelectedDate(date);
  };

  const handleReschedule = async () => {
    if (!selectedTime || !selectedDate) return;

    setIsProcessing(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update booking in the list
    const updatedBookings = bookings.map(b => 
      b.id === booking.id 
        ? { 
            ...b, 
            date: selectedDate === 'today' 
              ? new Date().toLocaleDateString('ru-RU')
              : selectedDate === 'tomorrow' 
              ? new Date(Date.now() + 86400000).toLocaleDateString('ru-RU')
              : selectedDate,
            time: selectedTime
          }
        : b
    );
    
    setBookings(updatedBookings);
    setIsProcessing(false);
    
    toast.success(t.rescheduleSuccess);
    
    setTimeout(() => {
      setCurrentScreen('my-bookings');
    }, 1500);
  };

  const handleCancel = async () => {
    if (!cancelReason) return;

    setIsProcessing(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update booking status
    const updatedBookings = bookings.map(b => 
      b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
    );
    
    setBookings(updatedBookings);
    setIsProcessing(false);
    
    toast.success(t.cancelSuccess);
    
    setTimeout(() => {
      setCurrentScreen('my-bookings');
    }, 1500);
  };

  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + booking.service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
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
          <h1 className="font-medium">{t.rescheduleCancel}</h1>
        </div>
      </div>

      {/* Current Booking */}
      <div className="p-4">
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <p className="text-sm text-muted-foreground mb-2">{t.currentBooking}</p>
          <div className="space-y-2">
            <p className="font-medium">{booking.service.name}</p>
            <p className="text-sm text-muted-foreground">{booking.service.provider}</p>
            <p className="text-sm">{booking.date}, {booking.time} - {booking.endTime}</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
            <TabsList className="w-full grid grid-cols-2 m-4 mb-0">
              <TabsTrigger value="reschedule">{t.reschedule}</TabsTrigger>
              <TabsTrigger value="cancel">{t.cancel}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="reschedule" className="p-4 space-y-6 mt-4 pb-24">
            <div>
              <h3 className="font-medium mb-4">{t.selectNewTime}</h3>
              
              {dates.map((dateInfo) => (
                <div key={dateInfo.id} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <h4 className="font-medium">{dateInfo.label}</h4>
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
                </div>
              ))}

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
                      <p className="text-sm text-muted-foreground">{t.newTime}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancel" className="p-4 space-y-6 mt-4 pb-24">
            <div>
              <h3 className="font-medium mb-4">{t.cancelReason}</h3>
              
              <RadioGroup value={cancelReason} onValueChange={setCancelReason}>
                <div className="space-y-3">
                  {cancelReasons.map((reason) => (
                    <div key={reason.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason.value} id={reason.value} />
                      <Label htmlFor={reason.value} className="flex-1 cursor-pointer">
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {cancelReason && (
              <div>
                <Label htmlFor="comment" className="block mb-2">{t.additionalComment}</Label>
                <Textarea
                  id="comment"
                  placeholder={t.commentPlaceholder}
                  value={cancelComment}
                  onChange={(e) => setCancelComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-50">
        <div className="glass-panel p-4 pb-safe-action">
          {activeTab === 'reschedule' ? (
            <Button 
              className="w-full h-12" 
              onClick={handleReschedule}
              disabled={!selectedTime || !selectedDate || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  <span>{t.processing}</span>
                </div>
              ) : (
                <>
                  <Edit className="w-5 h-5 mr-2" />
                  {t.confirmReschedule}
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="destructive"
              className="w-full h-12" 
              onClick={handleCancel}
              disabled={!cancelReason || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin"></div>
                  <span>{t.processing}</span>
                </div>
              ) : (
                <>
                  <X className="w-5 h-5 mr-2" />
                  {t.confirmCancel}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}