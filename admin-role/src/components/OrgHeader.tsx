import React from 'react';
import { Star, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrgHeaderProps {
  name: string;
  rating: number;
  reviewCount: number;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: string;
  };
  images: string[];
  onBookClick: () => void;
}

export function OrgHeader({
  name,
  rating,
  reviewCount,
  description,
  address,
  phone,
  email,
  hours,
  images,
  onBookClick,
}: OrgHeaderProps) {
  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      'mon': 'Пн',
      'tue': 'Вт',
      'wed': 'Ср',
      'thu': 'Чт',
      'fri': 'Пт',
      'sat': 'Сб',
      'sun': 'Вс',
    };
    return days[day] || day;
  };

  return (
    <div className="space-y-4">
      {/* Media Carousel 16:9 */}
      {images && images.length > 0 && (
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={image}
                      alt={`${name} - фото ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Organization Name and Rating */}
      <div className="space-y-2">
        <h1 className="text-2xl">{name}</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviewCount} {reviewCount === 1 ? 'отзыв' : reviewCount < 5 ? 'отзыва' : 'отзывов'})
          </span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}

      {/* Address */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm">{address}</p>
            <Button variant="link" className="h-auto p-0 text-sm text-primary">
              <ExternalLink className="h-3 w-3 mr-1" />
              Открыть на карте
            </Button>
          </div>
        </div>

        {/* Contacts */}
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <a href={`tel:${phone}`} className="text-sm text-primary hover:underline">
            {phone}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <a href={`mailto:${email}`} className="text-sm text-primary hover:underline">
            {email}
          </a>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            {Object.entries(hours).map(([day, time]) => (
              <div key={day} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{getDayName(day)}</span>
                <span>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Button */}
      <Button 
        className="w-full elegant-button" 
        size="lg"
        onClick={onBookClick}
      >
        Записаться
      </Button>
    </div>
  );
}
