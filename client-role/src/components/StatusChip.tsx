import React from 'react';
import { Badge } from './ui/badge';

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';

interface StatusChipProps {
  status: BookingStatus;
  language: 'ru' | 'en';
}

// Static colors that don't depend on theme
const statusColors = {
  confirmed: 'bg-[#10B981] text-white border-0',
  pending: 'bg-[#F59E0B] text-white border-0',
  completed: 'bg-[#3B82F6] text-white border-0',
  cancelled: 'bg-[#EF4444] text-white border-0',
  'no-show': 'bg-[#6B7280] text-white border-0',
};

const statusTexts = {
  ru: {
    confirmed: 'Подтверждена',
    pending: 'Ожидание',
    completed: 'Завершена',
    cancelled: 'Отменена',
    'no-show': 'Не пришёл',
  },
  en: {
    confirmed: 'Confirmed',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'no-show': 'No-show',
  },
};

export function StatusChip({ status, language }: StatusChipProps) {
  return (
    <Badge className={`${statusColors[status]} text-xs`}>
      {statusTexts[language][status]}
    </Badge>
  );
}
