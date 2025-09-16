import React, { useContext, useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Banknote, Info } from 'lucide-react';
import { AppContext, Booking } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { BottomActionBar } from './BottomActionBar';
import { UpsellHint } from './UpsellHint';
import { UpsellBottomSheet } from './UpsellBottomSheet';
import { toast } from 'sonner@2.0.3';

// Mock add-on services data
const mockAddOns = [
  {
    id: 'addon-1',
    name: 'Уход для кутикулы',
    nameEn: 'Cuticle care',
    price: 300,
    duration: 10
  },
  {
    id: 'addon-2', 
    name: 'Укрепляющая сыворотка',
    nameEn: 'Strengthening serum',
    price: 500,
    duration: 5
  },
  {
    id: 'addon-3',
    name: 'Парафиновая ванночка',
    nameEn: 'Paraffin bath',
    price: 400,
    duration: 15
  }
];

export function BookingConfirmation() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    language, 
    setCurrentScreen, 
    selectedService,
    selectedDate,
    selectedTime,
    setCurrentBooking,
    bookings,
    setBookings
  } = context;

  const [acceptPolicy, setAcceptPolicy] = useState(false);
  
  // Upsell states
  const [showUpsellSheet, setShowUpsellSheet] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [add15Min, setAdd15Min] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [finalEndTime, setFinalEndTime] = useState('');

  const texts = {
    ru: {
      confirmation: 'Подтверждение',
      bookingSummary: 'Детали записи',
      service: 'Услуга',
      provider: 'Поставщик',
      datetime: 'Дата и время',
      location: 'Адрес',
      price: 'Стоимость',
      cancellationPolicy: 'Я согласен с политикой отмены',
      policyDetails: 'Бесплатная отмена не позднее 2 часов до визита',
      changeService: 'Изменить услугу',
      changeTime: 'Изменить время',
      confirm: 'Подтвердить запись',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      minutes: 'мин'
    },
    en: {
      confirmation: 'Confirmation',
      bookingSummary: 'Booking Details',
      service: 'Service',
      provider: 'Provider',
      datetime: 'Date and Time',
      location: 'Location',
      price: 'Price',
      cancellationPolicy: 'I agree with cancellation policy',
      policyDetails: 'Free cancellation no later than 2 hours before visit',
      changeService: 'Change Service',
      changeTime: 'Change Time',
      confirm: 'Confirm Booking',
      today: 'Today',
      tomorrow: 'Tomorrow',
      minutes: 'min'
    }
  };

  const t = texts[language];

  if (!selectedService || !selectedDate || !selectedTime) {
    return null;
  }

  const handleBack = () => {
    setCurrentScreen('time-selection');
  };

  const handleChangeService = () => {
    setCurrentScreen('service-details');
  };

  const handleChangeTime = () => {
    setCurrentScreen('time-selection');
  };

  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + selectedService.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getDateLabel = () => {
    if (selectedDate === 'today') return t.today;
    if (selectedDate === 'tomorrow') return t.tomorrow;
    return selectedDate;
  };

  const handleConfirm = () => {
    if (!acceptPolicy) return;

    const newBooking: Booking = {
      id: Date.now().toString(),
      service: selectedService,
      date: selectedDate === 'today' 
        ? new Date().toLocaleDateString('ru-RU')
        : selectedDate === 'tomorrow' 
        ? new Date(Date.now() + 86400000).toLocaleDateString('ru-RU')
        : selectedDate,
      time: selectedTime,
      endTime: finalEndTime || calculateEndTime(selectedTime),
      status: 'confirmed',
      price: finalPrice || selectedService.price.fixed || selectedService.price.from || 0
    };

    setCurrentBooking(newBooking);
    setBookings([...bookings, newBooking]);
    setCurrentScreen('success');
  };

  const handleUpsell = () => {
    setShowUpsellSheet(true);
  };

  const handleUpsellConfirm = (selectedAddOnIds: string[], add15MinSelected: boolean, newPrice: number, newEndTime: string) => {
    setSelectedAddOns(selectedAddOnIds);
    setAdd15Min(add15MinSelected);
    setFinalPrice(newPrice);
    setFinalEndTime(newEndTime);
    setShowUpsellSheet(false);
    
    const successText = language === 'ru' ? 'Добавлено к визиту' : 'Added to visit';
    toast.success(successText);
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
            <h1 className="font-medium">{t.confirmation}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6">
        {/* Booking Summary */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-0">
          <h2 className="font-medium mb-4">{t.bookingSummary}</h2>
          
          <div className="space-y-4">
            {/* Service */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">{t.service}</span>
                </div>
                <p className="font-medium ml-4">{selectedService.name}</p>
                <p className="text-sm text-muted-foreground ml-4">
                  {selectedService.duration} {t.minutes}
                </p>
                
                {/* Selected Add-ons */}
                {selectedAddOns.length > 0 && (
                  <div className="ml-4 mt-2 space-y-1">
                    {selectedAddOns.map(addOnId => {
                      const addOn = mockAddOns.find(a => a.id === addOnId);
                      return addOn ? (
                        <div key={addOn.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">+ {language === 'ru' ? addOn.name : addOn.nameEn}</span>
                          <span className="text-muted-foreground">{addOn.price}₽</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                {/* +15 min addon */}
                {add15Min && (
                  <div className="ml-4 mt-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        + {language === 'ru' ? '15 минут (скидка -10%)' : '15 min (discount -10%)'}
                      </span>
                      <span className="text-success-500">-{Math.round((selectedService.price.fixed || selectedService.price.from || 0) * 0.1)}₽</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangeService}
                className="text-primary"
              >
                {t.changeService}
              </Button>
            </div>

            {/* Provider */}
            <div className="flex items-center gap-3 ml-4">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedService.provider}</p>
                {selectedService.location && (
                  <p className="text-sm text-muted-foreground">{selectedService.location}</p>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">{t.datetime}</span>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {getDateLabel()}, {selectedTime} - {finalEndTime || calculateEndTime(selectedTime)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate === 'today' 
                        ? new Date().toLocaleDateString('ru-RU')
                        : selectedDate === 'tomorrow' 
                        ? new Date(Date.now() + 86400000).toLocaleDateString('ru-RU')
                        : selectedDate}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangeTime}
                className="text-primary"
              >
                {t.changeTime}
              </Button>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{t.price}</span>
              </div>
              <span className="text-xl font-medium">
                {finalPrice > 0 ? `${finalPrice}₽` : selectedService.price.fixed ? `${selectedService.price.fixed}₽` : `${selectedService.price.from}₽`}
              </span>
            </div>
            
            {/* Upsell Hint - Between services and total */}
            <div className="pt-3">
              <UpsellHint
                language={language}
                discountPct={10}
                hasNearbySlot={true}
                hasAddOns={mockAddOns.length > 0}
                onClick={() => setShowUpsellSheet(true)}
              />
            </div>
          </div>
        </Card>

        {/* Cancellation Policy */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium mb-1">{t.policyDetails}</p>
              <div className="flex items-center gap-2 mt-3">
                <Checkbox
                  id="policy"
                  checked={acceptPolicy}
                  onCheckedChange={(checked) => setAcceptPolicy(checked as boolean)}
                />
                <label 
                  htmlFor="policy"
                  className="text-sm cursor-pointer"
                >
                  {t.cancellationPolicy}
                </label>
              </div>
            </div>
          </div>
        </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <BottomActionBar
        currentStep={3}
        onContinue={handleConfirm}
        isDisabled={!acceptPolicy}
        continueText={t.confirm}
      />

      {/* Upsell Bottom Sheet */}
      <UpsellBottomSheet
        isOpen={showUpsellSheet}
        onClose={() => setShowUpsellSheet(false)}
        language={language}
        originalPrice={selectedService.price.fixed || selectedService.price.from || 0}
        originalEndTime={calculateEndTime(selectedTime)}
        discountPct={10}
        nearbySlotExists={true}
        addOns={mockAddOns.map(addon => ({
          id: addon.id,
          name: language === 'ru' ? addon.name : addon.nameEn,
          price: addon.price,
          duration: addon.duration
        }))}
        onConfirm={handleUpsellConfirm}
      />
    </>
  );
}