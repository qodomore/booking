import React, { useState } from 'react';
import { CheckCircle, Clock, Calendar, User, Phone, Edit3, ArrowLeft, RussianRuble } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { StickyProgressBar } from './ui/sticky-progress-bar';
import { UpsellHint } from './ui/upsell-hint';
import { UpsellBottomSheet } from './UpsellBottomSheet';
import { Separator } from './ui/separator';
import { useResources, Service } from '../contexts/ResourceContext';

interface BookingData {
  service: Service;
  masterId: string;
  masterName: string;
  selectedTime: string;
  selectedDate: string;
}

interface BookingConfirmationScreenProps {
  bookingData: BookingData;
  onConfirm: (clientData: ClientData, upsellData?: UpsellData) => void;
  onBack: () => void;
  onChangeService: () => void;
  onChangeTime: () => void;
}

interface ClientData {
  name: string;
  phone: string;
  notes?: string;
}

interface UpsellData {
  timeExtension: boolean;
  additionalServices: string[];
  totalPrice: number;
  totalDuration: number;
  discount: number;
}

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export function BookingConfirmationScreen({
  bookingData,
  onConfirm,
  onBack,
  onChangeService,
  onChangeTime
}: BookingConfirmationScreenProps) {
  const { clients } = useResources();
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    phone: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Partial<ClientData>>({});
  
  // Upsell состояние
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [upsellData, setUpsellData] = useState<UpsellData | null>(null);
  
  // Мок данные для демонстрации
  const nearbySlotExists = true;
  const userPlan: 'free' | 'pro' | 'premium' = 'free';
  const isAdmin = true;
  
  const additionalServices: AdditionalService[] = [
    {
      id: '1',
      name: 'Укладка',
      price: 800,
      duration: 20,
      description: 'Профессиональная укладка волос'
    },
    {
      id: '2',
      name: 'Массаж головы',
      price: 500,
      duration: 15,
      description: 'Расслабляющий массаж'
    },
    {
      id: '3',
      name: 'Уход для волос',
      price: 600,
      duration: 10,
      description: 'Питательная маска'
    }
  ];

  const steps = [
    { id: 1, label: 'Выбор услуги', completed: true },
    { id: 2, label: 'Выбор времени', completed: true },
    { id: 3, label: 'Подтверждение', completed: false }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientData> = {};

    if (!clientData.name.trim()) {
      newErrors.name = 'Укажите имя клиента';
    } else if (clientData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!clientData.phone.trim()) {
      newErrors.phone = 'Укажите номер телефона';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(clientData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Укажите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Имитация отправки данных
    setTimeout(() => {
      onConfirm(clientData, upsellData || undefined);
      setIsLoading(false);
    }, 1500);
  };

  const handleUpsellConfirm = (newUpsellData: UpsellData) => {
    setUpsellData(newUpsellData);
    setIsUpsellOpen(false);
  };

  const handleUpsellOpen = () => {
    setIsUpsellOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getDurationText = (duration: number): string => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) {
        return `${hours} ч`;
      }
      return `${hours} ч ${minutes} мин`;
    }
    return `${duration} мин`;
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  // Рассчитываем финальную цену и время с учетом upsell
  const getFinalPrice = () => {
    return upsellData ? upsellData.totalPrice : bookingData.service.price;
  };

  const getFinalDuration = () => {
    return upsellData ? upsellData.totalDuration : bookingData.service.duration;
  };

  const getFinalEndTime = () => {
    return calculateEndTime(bookingData.selectedTime, getFinalDuration());
  };

  // Проверяем, есть ли клиент с таким номером
  const existingClient = clients.find(client => 
    client.phone === clientData.phone && clientData.phone.trim() !== ''
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>
        <h1 className="font-semibold text-2xl">Подтверждение записи</h1>
        <p className="text-sm text-muted-foreground">
          Проверьте детали записи и укажите данные клиента
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === 3;
          const isCompleted = step.id < 3;
          
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
                  ${step.id < 3 ? 'bg-primary' : 'bg-muted'}
                `} />
              )}
            </div>
          );
        })}
      </div>

      {/* Booking Summary */}
      <Card className="clean-card border-primary/20 bg-primary/5">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-primary">Детали записи</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Услуга</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onChangeService}
                    className="text-primary hover:bg-primary/10 p-1"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="font-semibold">{bookingData.service.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {getDurationText(bookingData.service.duration)}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    ₽{bookingData.service.price.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Мастер</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium">{bookingData.masterName}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Время</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onChangeTime}
                  className="text-primary hover:bg-primary/10 p-1"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium capitalize">{formatDate(bookingData.selectedDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">
                  {bookingData.selectedTime} - {calculateEndTime(bookingData.selectedTime, bookingData.service.duration)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Data Form */}
      <Card className="clean-card">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-semibold">Данные клиента</h3>
          
          {existingClient && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Найден существующий клиент
                </p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                {existingClient.name} • {existingClient.totalVisits} визитов
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Имя клиента <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Введите имя"
                value={clientData.name}
                onChange={(e) => {
                  setClientData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Телефон <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="+7 (999) 123-45-67"
                value={clientData.phone}
                onChange={(e) => {
                  setClientData(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) {
                    setErrors(prev => ({ ...prev, phone: undefined }));
                  }
                }}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Комментарий</label>
            <Textarea
              placeholder="Дополнительные пожелания или комментарии..."
              value={clientData.notes}
              onChange={(e) => setClientData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Card with Upsell */}
      <Card className="clean-card">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold">Итого</h3>
          
          <div className="space-y-3">
            {/* Base Service */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{bookingData.service.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({getDurationText(bookingData.service.duration)})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <RussianRuble className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{bookingData.service.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Additional Services (if any) */}
            {upsellData && upsellData.additionalServices.length > 0 && (
              <>
                {upsellData.additionalServices.map(serviceId => {
                  const service = additionalServices.find(s => s.id === serviceId);
                  if (!service) return null;
                  return (
                    <div key={serviceId} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-primary">+ {service.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({getDurationText(service.duration)})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RussianRuble className="h-3 w-3 text-muted-foreground" />
                        <span>{service.price.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Time Extension */}
            {upsellData && upsellData.timeExtension && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary">+ Продление времени (15 мин)</span>
                <span className="text-green-600">−10%</span>
              </div>
            )}

            {/* Discount */}
            {upsellData && upsellData.discount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Скидка</span>
                <div className="flex items-center gap-1">
                  <span>−</span>
                  <RussianRuble className="h-3 w-3" />
                  <span>{upsellData.discount.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Upsell Hint */}
            {!upsellData && nearbySlotExists && (
              <div className="flex items-center justify-between">
                <UpsellHint
                  nearbySlotExists={nearbySlotExists}
                  additionalMinutes={15}
                  discountPercent={10}
                  onClick={handleUpsellOpen}
                />
              </div>
            )}

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between font-medium text-base">
              <div className="flex items-center gap-2">
                <span>Итого</span>
                <span className="text-sm text-muted-foreground">
                  ({getDurationText(getFinalDuration())})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <RussianRuble className="h-4 w-4" />
                <span className="text-lg">{getFinalPrice().toLocaleString()}</span>
              </div>
            </div>

            {/* Updated Time Display */}
            {upsellData && (
              <div className="flex items-center justify-between text-sm text-primary">
                <span>Новое время окончания</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">{getFinalEndTime()}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upsell Bottom Sheet */}
      <UpsellBottomSheet
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
        onConfirm={handleUpsellConfirm}
        basePrice={bookingData.service.price}
        baseDuration={bookingData.service.duration}
        baseServiceId={bookingData.service.id}
        nearbySlotExists={nearbySlotExists}
        additionalServices={additionalServices}
        userPlan={userPlan}
        isAdmin={isAdmin}
      />

      {/* Sticky Progress Bar */}
      <StickyProgressBar
        currentStep={3}
        steps={steps}
        ctaText={isLoading ? 'Создание записи...' : 'Подтвердить запись'}
        onCtaClick={handleConfirm}
        ctaDisabled={isLoading}
        price={getFinalPrice()}
        showPrice={true}
      />
    </div>
  );
}