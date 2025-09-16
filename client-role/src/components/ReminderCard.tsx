import React, { useContext } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AppContext } from '../App';

interface ReminderCardProps {
  suggestedDate: string;
  suggestedTime: string;
  service: {
    name: string;
    duration: number;
  };
  resource: string;
  onAgree: () => void;
  onPickAnother: () => void;
  onOptOut: () => void;
}

export function ReminderCard({
  suggestedDate,
  suggestedTime,
  service,
  resource,
  onAgree,
  onPickAnother,
  onOptOut
}: ReminderCardProps) {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { language } = context;

  const texts = {
    ru: {
      title: 'Пора записаться снова?',
      suggestion: `Мы подобрали время: ${suggestedDate}, ${suggestedTime}, ${service.name} у ${resource}`,
      duration: `${service.duration} мин`,
      agree: 'Согласен',
      pickAnother: 'Выбрать другое',
      optOut: 'Не предлагать 30 дней'
    },
    en: {
      title: 'Time to book again?',
      suggestion: `We picked a time: ${suggestedDate}, ${suggestedTime}, ${service.name} with ${resource}`,
      duration: `${service.duration} min`,
      agree: 'Agree',
      pickAnother: 'Pick another',
      optOut: "Don't suggest for 30 days"
    }
  };

  const t = texts[language];

  return (
    <div className="bg-card rounded-card p-4 border border-border-hairline shadow-elevation-1 mx-4 mb-4">
      {/* Header */}
      <h3 className="mb-3">{t.title}</h3>
      
      {/* Suggestion Text */}
      <p className="text-text-secondary mb-4">
        {t.suggestion}
      </p>
      
      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="secondary" className="rounded-chip">
          {service.name}
        </Badge>
        <Badge variant="secondary" className="rounded-chip">
          {t.duration}
        </Badge>
        <Badge variant="secondary" className="rounded-chip">
          {resource}
        </Badge>
      </div>
      
      {/* Actions */}
      <div className="space-y-3">
        {/* Primary Action */}
        <Button 
          onClick={onAgree}
          className="w-full rounded-card"
          size="lg"
        >
          {t.agree}
        </Button>
        
        {/* Secondary Action */}
        <Button 
          onClick={onPickAnother}
          variant="outline"
          className="w-full rounded-card"
          size="lg"
        >
          {t.pickAnother}
        </Button>
        
        {/* Tertiary Action */}
        <button 
          onClick={onOptOut}
          className="w-full text-text-secondary text-center py-2 hover:text-text-primary transition-colors"
        >
          {t.optOut}
        </button>
      </div>
    </div>
  );
}