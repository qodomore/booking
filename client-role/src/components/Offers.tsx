import React, { useContext } from 'react';
import { ArrowLeft, Percent, Clock, Star, Sparkles } from 'lucide-react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SafeArea, SafeAreaSection } from './SafeArea';
import { OfferCard } from './OfferCard';

export function Offers() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, setCurrentScreen, setSelectedService } = context;

  const texts = {
    ru: {
      offers: 'Предложения',
      personalOffers: 'Персональные предложения',
      discountOffer: '−15% в непиковые часы',
      discountDescription: 'Скидка на услуги красоты с 10:00 до 14:00 в будние дни',
      aiRecommendation: 'Рекомендация ИИ',
      aiDescription: 'На основе ваших предпочтений',
      validUntil: 'Действует до',
      use: 'Использовать',
      newClient: 'Новый клиент',
      newClientOffer: '−20% на первое посещение',
      newClientDescription: 'Скидка для новых клиентов на любую услугу',
      popularNow: 'Популярно сейчас',
      quickBooking: 'Быстрая запись',
      quickBookingDescription: 'Свободные окна на сегодня и завтра',
      expires: 'Истекает',
      limited: 'Ограниченное предложение'
    },
    en: {
      offers: 'Offers',
      personalOffers: 'Personal Offers',
      discountOffer: '−15% off-peak hours',
      discountDescription: 'Discount on beauty services from 10:00 to 14:00 on weekdays',
      aiRecommendation: 'AI Recommendation',
      aiDescription: 'Based on your preferences',
      validUntil: 'Valid until',
      use: 'Use',
      newClient: 'New Client',
      newClientOffer: '−20% first visit',
      newClientDescription: 'Discount for new clients on any service',
      popularNow: 'Popular Now',
      quickBooking: 'Quick Booking',
      quickBookingDescription: 'Available slots today and tomorrow',
      expires: 'Expires',
      limited: 'Limited offer'
    }
  };

  const t = texts[language];

  const mockOffers = [
    {
      id: '1',
      type: 'discount',
      title: t.discountOffer,
      description: t.discountDescription,
      discount: '15%',
      category: 'beauty',
      validUntil: '31.12.2024',
      isAI: true,
      isLimited: false
    },
    {
      id: '2',
      type: 'new-client',
      title: t.newClientOffer,
      description: t.newClientDescription,
      discount: '20%',
      category: 'all',
      validUntil: '15.01.2025',
      isAI: false,
      isLimited: true
    },
    {
      id: '3',
      type: 'quick-booking',
      title: t.quickBooking,
      description: t.quickBookingDescription,
      discount: null,
      category: 'all',
      validUntil: 'Завтра',
      isAI: false,
      isLimited: true
    }
  ];

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleUseOffer = (offer: any) => {
    // Mock: Navigate to service selection or specific service
    if (offer.category === 'beauty') {
      // Set a beauty service and go to time selection
      const beautyService = {
        id: '1',
        name: 'Маникюр классический',
        description: 'Профессиональный уход за ногтями с покрытием гель-лак',
        price: { from: 1500 },
        duration: 90,
        category: 'beauty',
        provider: 'Салон красоты "Элит"',
        location: 'ул. Тверская, 15',
        rating: 4.8
      };
      setSelectedService(beautyService);
      setCurrentScreen('service-details');
    } else {
      setCurrentScreen('search');
    }
  };

  const getOfferIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <Percent className="w-5 h-5" />;
      case 'new-client':
        return <Star className="w-5 h-5" />;
      case 'quick-booking':
        return <Clock className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getOfferColor = (type: string) => {
    switch (type) {
      case 'discount':
        return 'bg-blue-500';
      case 'new-client':
        return 'bg-yellow-500';
      case 'quick-booking':
        return 'bg-green-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <SafeArea noPadding className="pt-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3 max-w-sm mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-medium">{t.offers}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 pb-6">
        <SafeAreaSection>
          <h2 className="text-lg font-medium mb-4">{t.personalOffers}</h2>
          <div className="space-y-4">
            {mockOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onUse={handleUseOffer}
                getOfferIcon={getOfferIcon}
                getOfferColor={getOfferColor}
                texts={{
                  aiRecommendation: t.aiRecommendation,
                  limited: t.limited,
                  aiDescription: t.aiDescription,
                  validUntil: t.validUntil,
                  use: t.use
                }}
                variant="stacked"
                className="hover:shadow-elevation-2 transition-all duration-200"
              />
            ))}
          </div>
        </SafeAreaSection>

        {/* Popular Categories */}
        <SafeAreaSection>
          <h2 className="text-lg font-medium mb-4">{t.popularNow}</h2>
          <div className="grid grid-cols-2 gap-3 w-full">
            {['Маникюр', 'Массаж', 'Стрижка', 'Фитнес'].map((category, index) => (
              <Card 
                key={category}
                className="w-full bg-card/80 backdrop-blur-sm border-0 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentScreen('search')}
              >
                <div className="p-4 text-center">
                  <div className={`w-12 h-12 ${getOfferColor('discount')} rounded-full flex items-center justify-center text-white mx-auto mb-2`}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="font-medium truncate">{category}</p>
                  <p className="text-xs text-muted-foreground">до −25%</p>
                </div>
              </Card>
            ))}
          </div>
        </SafeAreaSection>
      </div>
    </SafeArea>
  );
}