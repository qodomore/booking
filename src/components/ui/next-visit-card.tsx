import React from 'react';
import { motion } from 'motion/react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Calendar, Clock, User, MapPin, Lock } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'master' | 'room' | 'equipment';
  icon?: React.ReactNode;
}

interface NextVisitCardProps {
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro' | 'premium';
  suggestedDate?: string;
  suggestedTime?: string;
  resources?: Resource[];
  onBookOneClick?: () => void;
  onChooseTime?: () => void;
  className?: string;
}

const translations = {
  ru: {
    title: 'Записать на следующий раз',
    subtitle: 'Рекомендуем {date}, {time} по вашей привычке',
    defaultSubtitle: 'Рекомендуем время по вашей привычке',
    bookOneClick: 'Записать в 1 тап',
    chooseTime: 'Выбрать другое время',
    proRequired: 'Доступно в Pro'
  },
  en: {
    title: 'Book next visit',
    subtitle: 'Suggested {date}, {time} based on your pattern',
    defaultSubtitle: 'Suggested time based on your pattern',
    bookOneClick: 'Book in 1 tap',
    chooseTime: 'Choose different time',
    proRequired: 'Available in Pro'
  }
};

const resourceIcons = {
  master: <User className="w-3 h-3" />,
  room: <MapPin className="w-3 h-3" />,
  equipment: <Calendar className="w-3 h-3" />
};

export function NextVisitCard({
  locale = 'ru',
  plan = 'free',
  suggestedDate = 'завтра',
  suggestedTime = '14:00',
  resources = [
    { id: '1', name: 'Анна Иванова', type: 'master' },
    { id: '2', name: 'Кабинет 3', type: 'room' }
  ],
  onBookOneClick,
  onChooseTime,
  className = ''
}: NextVisitCardProps) {
  const t = translations[locale];
  const isLocked = plan !== 'pro' && plan !== 'premium';

  const subtitle = suggestedDate && suggestedTime 
    ? t.subtitle.replace('{date}', suggestedDate).replace('{time}', suggestedTime)
    : t.defaultSubtitle;

  return (
    <div className={`space-y-3 ${className}`}>
      <Card className="p-4 space-y-4 glass-card">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-medium">{t.title}</h3>
            {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Resource Chips */}
        {resources.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onBookOneClick}
            disabled={isLocked}
            className="flex-1 elegant-button"
            size="sm"
          >
            <Clock className="w-3 h-3 mr-1.5" />
            {t.bookOneClick}
          </Button>
          <Button
            variant="outline"
            onClick={onChooseTime}
            disabled={isLocked}
            size="sm"
            className="px-4"
          >
            {t.chooseTime}
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