import React from 'react';
import { Clock, Star, TrendingUp, Zap } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { SlotGrid } from './slot-chip';
import { useTelegram } from '../../hooks/useTelegram';
import { Service } from '../../contexts/ResourceContext';

interface ServiceCardProps {
  service: Service & {
    rating?: number;
    isHit?: boolean;
    discount?: number;
    nextSlots?: Array<{
      id: string;
      time: string;
      available: boolean;
    }>;
  };
  onBook?: (serviceId: string, slotId?: string) => void;
  onSlotSelect?: (serviceId: string, slotId: string) => void;
  selectedSlot?: string;
}

export function ServiceCard({ service, onBook, onSlotSelect, selectedSlot }: ServiceCardProps) {
  const { hapticFeedback } = useTelegram();

  const handleBookClick = () => {
    hapticFeedback.medium();
    onBook?.(service.id, selectedSlot);
  };

  const handleSlotSelect = (slotId: string) => {
    onSlotSelect?.(service.id, slotId);
  };

  const formatPrice = (price: number, discount?: number) => {
    if (discount) {
      const discountedPrice = price * (1 - discount / 100);
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">₽{discountedPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground line-through">₽{price.toLocaleString()}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            -{discount}%
          </Badge>
        </div>
      );
    }
    return <span className="font-semibold">₽{price.toLocaleString()}</span>;
  };

  return (
    <Card className="clean-card hover:scale-[1.02] transition-all duration-300 shadow-elegant">
      <CardContent className="p-4">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1 line-clamp-2">{service.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{service.description}</p>
          </div>
          
          <div className="flex flex-col gap-1 ml-3">
            {service.isHit && (
              <Badge variant="default" className="text-xs bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                Хит
              </Badge>
            )}
            {service.discount && (
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                <Zap className="h-3 w-3 mr-1" />
                -{service.discount}%
              </Badge>
            )}
          </div>
        </div>

        {/* Service details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {service.duration} мин
            </div>
            
            {service.rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                {service.rating}
              </div>
            )}
          </div>
          
          <div className="text-right">
            {formatPrice(service.price, service.discount)}
          </div>
        </div>

        {/* Available slots */}
        {service.nextSlots && service.nextSlots.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Ближайшие свободные:</p>
            <SlotGrid
              slots={service.nextSlots.slice(0, 6)}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
              compact
            />
          </div>
        )}

        {/* Empty state for no slots */}
        {service.nextSlots && service.nextSlots.length === 0 && (
          <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-dashed border-border">
            <p className="text-xs text-muted-foreground text-center">
              Сегодня всё занято — ближайшее завтра в 12:30
            </p>
          </div>
        )}

        {/* Book button */}
        <Button 
          onClick={handleBookClick}
          className="w-full h-12 elegant-button font-semibold"
          size="lg"
        >
          {selectedSlot ? 'Подтвердить запись' : 'Записаться'}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ServiceListProps {
  services: Array<Service & {
    rating?: number;
    isHit?: boolean;
    discount?: number;
    nextSlots?: Array<{
      id: string;
      time: string;
      available: boolean;
    }>;
  }>;
  onBook?: (serviceId: string, slotId?: string) => void;
  onSlotSelect?: (serviceId: string, slotId: string) => void;
  selectedSlots?: Record<string, string>;
}

export function ServiceList({ services, onBook, onSlotSelect, selectedSlots = {} }: ServiceListProps) {
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onBook={onBook}
          onSlotSelect={onSlotSelect}
          selectedSlot={selectedSlots[service.id]}
        />
      ))}
    </div>
  );
}