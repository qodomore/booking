import React, { useContext } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AppContext } from '../App';

export interface SlotMiniData {
  id: string;
  date: string;
  time: string;
  service: {
    name: string;
    duration: number;
  };
  resource: string;
  provider: string;
  price: number;
}

interface SlotMiniProps {
  slot: SlotMiniData;
  onTap: (slot: SlotMiniData) => void;
}

export function SlotMini({ slot, onTap }: SlotMiniProps) {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { language } = context;

  const texts = {
    ru: {
      duration: 'мин',
    },
    en: {
      duration: 'min',
    }
  };

  const t = texts[language];

  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-md transition-shadow bg-card/80 backdrop-blur-sm border-0 overflow-hidden min-w-0"
      onClick={() => onTap(slot)}
    >
      <div className="p-3">
        {/* Date & Time */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-sm text-primary">
            <Calendar className="w-3 h-3" />
            <span className="font-medium">{slot.date}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-3 h-3 text-text-secondary" />
            <span>{slot.time}</span>
          </div>
        </div>

        {/* Service */}
        <h4 className="mb-2 line-clamp-1">{slot.service.name}</h4>

        {/* Provider & Resource */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{slot.provider}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <User className="w-3 h-3" />
            <span className="truncate">{slot.resource}</span>
          </div>
        </div>

        {/* Price & Duration */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs px-2">
            {slot.service.duration} {t.duration}
          </Badge>
          <div className="font-mono-label-sm text-text-primary">
            {slot.price} ₽
          </div>
        </div>
      </div>
    </Card>
  );
}