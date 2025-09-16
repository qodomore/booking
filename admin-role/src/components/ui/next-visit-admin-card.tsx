import React from 'react';
import { motion } from 'motion/react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Calendar, Clock, User, MapPin, Edit3, Send, CreditCard, Lock } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'master' | 'room' | 'equipment';
  icon?: React.ReactNode;
}

interface Service {
  id: string;
  name: string;
  duration: number; // в минутах
  price: number;
  smartPrice?: number; // цена со smart-pricing, если есть
}

interface NextVisitAdminCardProps {
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro' | 'premium';
  suggestedDate?: string;
  suggestedTime?: string;
  service?: Service;
  resources?: Resource[];
  onBookOneClick?: () => void;
  onSuggestToClient?: () => void;
  onEdit?: () => void;
  className?: string;
}

const translations = {
  ru: {
    title: 'Рекомендованное время',
    subtitle: '{date}, {time} для {service} у {resources}',
    duration: '{duration} мин',
    price: '₽{price}',
    smartPrice: 'Smart: ₽{price}',
    bookOneClick: 'Записать в 1 тап',
    suggestToClient: 'Предложить клиенту',
    edit: 'Изменить',
    proRequired: 'Доступно в Pro'
  },
  en: {
    title: 'Suggested time',
    subtitle: '{date}, {time} for {service} with {resources}',
    duration: '{duration} min',
    price: '${price}',
    smartPrice: 'Smart: ${price}',
    bookOneClick: 'Book in 1 tap',
    suggestToClient: 'Suggest to client',
    edit: 'Edit',
    proRequired: 'Available in Pro'
  }
};

const resourceIcons = {
  master: <User className="w-3 h-3" />,
  room: <MapPin className="w-3 h-3" />,
  equipment: <Calendar className="w-3 h-3" />
};

export function NextVisitAdminCard({
  locale = 'ru',
  plan = 'pro',
  suggestedDate = 'Завтра',
  suggestedTime = '14:00',
  service = {
    id: '1',
    name: 'Стрижка',
    duration: 60,
    price: 2500,
    smartPrice: 2200
  },
  resources = [
    { id: '1', name: 'Анна Иванова', type: 'master' },
    { id: '2', name: 'Кабинет 3', type: 'room' }
  ],
  onBookOneClick,
  onSuggestToClient,
  onEdit,
  className = ''
}: NextVisitAdminCardProps) {
  const t = translations[locale];
  const isLocked = plan !== 'pro' && plan !== 'premium';

  const resourcesText = resources.map(r => r.name).join(', ');
  const subtitle = t.subtitle
    .replace('{date}', suggestedDate)
    .replace('{time}', suggestedTime)
    .replace('{service}', service.name)
    .replace('{resources}', resourcesText);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return t.duration.replace('{duration}', minutes.toString());
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} ч`;
      } else {
        return `${hours} ч ${remainingMinutes} мин`;
      }
    }
  };

  const displayPrice = service.smartPrice || service.price;
  const isSmartPricing = !!service.smartPrice;

  return (
    <div className={`space-y-3 ${className}`}>
      <Card className="p-4 space-y-4 glass-card">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-medium">{t.title}</h3>
            {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
        </div>

        {/* Service Tags */}
        <div className="flex flex-wrap gap-2">
          {/* Service Badge */}
          <Badge variant="secondary" className="text-xs gap-1.5">
            <Calendar className="w-3 h-3" />
            {service.name}
          </Badge>

          {/* Duration Badge */}
          <Badge variant="secondary" className="text-xs gap-1.5">
            <Clock className="w-3 h-3" />
            {formatDuration(service.duration)}
          </Badge>

          {/* Resources Badges */}
          {resources.map((resource) => (
            <Badge 
              key={resource.id} 
              variant="secondary" 
              className="text-xs gap-1.5"
            >
              {resource.icon || resourceIcons[resource.type]}
              {resource.name}
            </Badge>
          ))}

          {/* Price Badge */}
          <Badge 
            variant={isSmartPricing ? "default" : "secondary"} 
            className={`text-xs gap-1.5 ${
              isSmartPricing ? 'bg-primary text-primary-foreground' : ''
            }`}
          >
            <CreditCard className="w-3 h-3" />
            {locale === 'ru' 
              ? `₽${displayPrice.toLocaleString()}`
              : `$${displayPrice}`
            }
            {isSmartPricing && (
              <span className="text-xs opacity-80">Smart</span>
            )}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {/* Primary Button */}
          <Button
            onClick={onBookOneClick}
            disabled={isLocked}
            className="flex-1 elegant-button"
            size="sm"
          >
            <Clock className="w-3 h-3 mr-1.5" />
            {t.bookOneClick}
          </Button>

          {/* Secondary Button */}
          <Button
            variant="outline"
            onClick={onSuggestToClient}
            disabled={isLocked}
            size="sm"
            className="px-4"
          >
            <Send className="w-3 h-3 mr-1.5" />
            {t.suggestToClient}
          </Button>

          {/* Tertiary Button */}
          <Button
            variant="ghost"
            onClick={onEdit}
            disabled={isLocked}
            size="sm"
            className="px-3"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        </div>
      </Card>

      {/* Pro Required Notice */}
      {isLocked && (
        <motion.p 
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground text-center"
        >
          {t.proRequired}
        </motion.p>
      )}
    </div>
  );
}