import React, { useContext } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Banknote, Info } from 'lucide-react';
import { AppContext, Service } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SafeArea, SafeAreaSection } from './SafeArea';
import { BottomActionBar } from './BottomActionBar';

interface ServiceDetailsProps {
  service: Service;
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, setCurrentScreen } = context;

  const texts = {
    ru: {
      details: 'Детали услуги',
      description: 'Описание',
      duration: 'Длительность',
      price: 'Стоимость',
      provider: 'Поставщик',
      location: 'Адрес',
      cancellation: 'Отмена записи',
      cancellationPolicy: 'Бесплатная отмена не позднее 2 часов до визита',
      freeCancellation: 'Бесплатная отмена не позднее 2 часов до',
      selectTime: 'Выбрать время',
      minutes: 'мин',
      from: 'от',
      fixed: 'фиксированная'
    },
    en: {
      details: 'Service Details',
      description: 'Description',
      duration: 'Duration',
      price: 'Price',
      provider: 'Provider',
      location: 'Location',
      cancellation: 'Cancellation',
      cancellationPolicy: 'Free cancellation no later than 2 hours before visit',
      freeCancellation: 'Free cancellation no later than 2 hours before',
      selectTime: 'Select Time',
      minutes: 'min',
      from: 'from',
      fixed: 'fixed'
    }
  };

  const t = texts[language];

  const handleBack = () => {
    setCurrentScreen('search');
  };

  const handleSelectTime = () => {
    setCurrentScreen('time-selection');
  };

  return (
    <>
    <SafeArea noPadding className="relative pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4 pt-16">
        <div className="flex items-center gap-3 max-w-sm mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-medium">{t.details}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 pb-32">
        {/* Service Card */}
        <Card className="w-full bg-card/80 backdrop-blur-sm border-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-medium mb-2">{service.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{service.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} {t.minutes}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-medium">
                  {service.price.fixed ? `${service.price.fixed}₽` : `${t.from} ${service.price.from}₽`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {service.price.fixed ? t.fixed : ''}
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t.description}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Provider Information */}
        <Card className="w-full bg-card/80 backdrop-blur-sm border-0 overflow-hidden">
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{service.provider}</p>
                  {service.location && (
                    <p className="text-sm text-muted-foreground">{service.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Service Details */}
        <Card className="w-full bg-card/80 backdrop-blur-sm border-0 overflow-hidden">
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{t.duration}</span>
                </div>
                <span className="text-sm text-muted-foreground">{service.duration} {t.minutes}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{t.price}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {service.price.fixed ? `${service.price.fixed}₽` : `${t.from} ${service.price.from}₽`}
                </span>
              </div>

              <div className="border-t border-border/50 pt-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium block mb-1">{t.cancellation}</span>
                    <span className="text-sm text-muted-foreground">{t.cancellationPolicy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Time Slots (Mock) */}
        <Card className="w-full bg-card/80 backdrop-blur-sm border-0 overflow-hidden">
          <div className="p-4">
            <h3 className="font-medium mb-3">Ближайшие окна</h3>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Badge 
                variant="outline" 
                className="justify-center py-2 cursor-pointer border-border/60 bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                onClick={handleSelectTime}
              >
                Сегодня 16:30
              </Badge>
              <Badge 
                variant="outline" 
                className="justify-center py-2 cursor-pointer border-border/60 bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                onClick={handleSelectTime}
              >
                Завтра 11:00
              </Badge>
              <Badge 
                variant="outline" 
                className="justify-center py-2 cursor-pointer border-border/60 bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                onClick={handleSelectTime}
              >
                Завтра 14:30
              </Badge>
              <Badge 
                variant="outline" 
                className="justify-center py-2 cursor-pointer border-border/60 bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                onClick={handleSelectTime}
              >
                Ещё...
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      </SafeArea>

      {/* Bottom Action Bar */}
      <BottomActionBar
        currentStep={1}
        onContinue={handleSelectTime}
        continueText={t.selectTime}
      />
    </>
  );
}