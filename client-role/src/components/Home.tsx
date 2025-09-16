import React, { useContext, useState } from 'react';
import { Search, Calendar, MapPin, Banknote, Star } from 'lucide-react';
import { AppContext, Service } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { SafeArea, SafeAreaSection } from './SafeArea';
import { HotSlots } from './HotSlots';

// Get mock hot slots with localized data
const getMockHotSlots = (language: 'ru' | 'en') => {
  const commonSlots = [
    {
      id: 'slot-1',
      service: { duration: 90 },
      time: '14:30',
      price: 1500
    },
    {
      id: 'slot-2', 
      service: { duration: 60 },
      time: '16:00',
      price: 2000
    },
    {
      id: 'slot-3',
      service: { duration: 60 },
      time: '10:00', 
      price: 3000
    },
    {
      id: 'slot-4',
      service: { duration: 90 },
      time: '11:30',
      price: 1500
    }
  ];

  if (language === 'ru') {
    return [
      {
        ...commonSlots[0],
        date: '15 сентября',
        service: { name: 'Маникюр классический', duration: 90 },
        resource: 'Анна Петрова',
        provider: 'Салон красоты "Элит"'
      },
      {
        ...commonSlots[1], 
        date: '15 сентября',
        service: { name: 'Шиномонтаж R16-R18', duration: 60 },
        resource: 'Автомеханик Сергей',
        provider: 'АвтоСервис 24'
      },
      {
        ...commonSlots[2],
        date: '16 сентября',
        service: { name: 'Персональная тренировка', duration: 60 },
        resource: 'Тренер Михаил',
        provider: 'Фитнес-клуб "Титан"'
      },
      {
        ...commonSlots[3],
        date: '16 сентября', 
        service: { name: 'Маникюр классический', duration: 90 },
        resource: 'Анна Петрова',
        provider: 'Салон красоты "Элит"'
      }
    ];
  } else {
    return [
      {
        ...commonSlots[0],
        date: 'Sep 15',
        service: { name: 'Classic Manicure', duration: 90 },
        resource: 'Anna Petrova',
        provider: 'Elite Beauty Salon'
      },
      {
        ...commonSlots[1],
        date: 'Sep 15', 
        service: { name: 'Tire Change R16-R18', duration: 60 },
        resource: 'Mechanic Sergey',
        provider: 'AutoService 24'
      },
      {
        ...commonSlots[2],
        date: 'Sep 16',
        service: { name: 'Personal Training', duration: 60 },
        resource: 'Trainer Michael',
        provider: 'Titan Fitness Club'
      },
      {
        ...commonSlots[3],
        date: 'Sep 16',
        service: { name: 'Classic Manicure', duration: 90 },
        resource: 'Anna Petrova', 
        provider: 'Elite Beauty Salon'
      }
    ];
  }
};

interface HomeProps {
  services: Service[];
}

export function Home({ services }: HomeProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, setCurrentScreen, setSelectedService } = context;
  const [searchQuery, setSearchQuery] = useState('');

  const texts = {
    ru: {
      subtitle: 'Запишитесь в 3 шага',
      searchPlaceholder: 'Найти услугу...',
      findService: 'Найти услугу',
      quickFilters: {
        today: 'Сегодня',
        tomorrow: 'Завтра',
        nearby: 'Рядом',
        price: 'Цена'
      },
      popular: 'Часто посещаемые',
      from: 'от',
      quickly: 'быстро',
      recommended: 'рекомендуем'
    },
    en: {
      subtitle: 'Book in 3 steps',
      searchPlaceholder: 'Find service...',
      findService: 'Find Service',
      quickFilters: {
        today: 'Today',
        tomorrow: 'Tomorrow',
        nearby: 'Nearby',
        price: 'Price'
      },
      popular: 'Frequently Visited',
      from: 'from',
      quickly: 'quick',
      recommended: 'recommended'
    }
  };

  const t = texts[language];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentScreen('service-details');
  };

  const handleSearch = () => {
    setCurrentScreen('search');
  };

  const handleBusinessClick = (service: Service) => {
    // Find business by service provider
    // In real app this would be done by businessId
    setCurrentScreen('business-profile');
  };

  const filteredServices = services.slice(0, 3); // Show first 3 services

  return (
    <SafeArea className="pt-12">
      {/* Header Section */}
      <SafeAreaSection>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-card border-0 shadow-sm w-full"
            onFocus={handleSearch}
          />
        </div>

        {/* Quick Filters with proper wrapping and scroll */}
        <div className="w-full">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-2 min-w-max">
              {Object.values(t.quickFilters).map((filter, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex-shrink-0 px-4 py-2 cursor-pointer border-2 border-border/80 bg-card/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors whitespace-nowrap"
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SafeAreaSection>

      {/* Hot Slots Section */}
      <SafeAreaSection>
        <HotSlots slots={getMockHotSlots(language)} />
      </SafeAreaSection>

      {/* Popular Services Section */}
      <SafeAreaSection>
        <h2 className="mb-4">{t.popular}</h2>
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="w-full cursor-pointer hover:shadow-md transition-shadow bg-card/80 backdrop-blur-sm border-0 overflow-hidden"
              onClick={() => handleServiceSelect(service)}
            >
              <div className="p-4">
                {/* Header Row with Auto Layout */}
                <div className="flex items-start justify-between mb-2 gap-3">
                  <h3 className="flex-1 font-medium line-clamp-2 min-w-0">{service.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{service.rating}</span>
                  </div>
                </div>
                
                {/* Description with proper text wrapping */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 w-full">
                  {service.description}
                </p>
                
                {/* Provider and Price Row */}
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div 
                    className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex-1 min-w-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBusinessClick(service);
                    }}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{service.provider}</span>
                  </div>
                  
                  <span className="flex-shrink-0">
                    {service.price.fixed ? `${service.price.fixed}₽` : `${t.from} ${service.price.from}₽`}
                  </span>
                </div>

                {/* Tags with proper wrapping */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs px-2 border-border/60 bg-card/60">
                    {t.quickly}
                  </Badge>
                  {service.rating && service.rating > 4.7 && (
                    <Badge variant="outline" className="text-xs px-2 border-border/60 bg-card/60">
                      {t.recommended}
                    </Badge>
                  )}
                </div>

                {/* Quick time slots with proper wrapping */}
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs px-3 py-1 cursor-pointer border-border/60 bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    сегодня 16:30
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs px-3 py-1 cursor-pointer border-border/60 bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    завтра 11:00
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SafeAreaSection>
    </SafeArea>
  );
}