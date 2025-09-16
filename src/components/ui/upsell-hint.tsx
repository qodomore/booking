import React from 'react';
import { Clock, Percent } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';

interface UpsellHintProps {
  /**
   * Доступен ли соседний слот для продления
   */
  nearbySlotExists: boolean;
  /**
   * Количество дополнительных минут
   */
  additionalMinutes: number;
  /**
   * Процент скидки
   */
  discountPercent: number;
  /**
   * Обработчик клика
   */
  onClick: () => void;
  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

export function UpsellHint({
  nearbySlotExists,
  additionalMinutes = 15,
  discountPercent = 10,
  onClick,
  className = ''
}: UpsellHintProps) {
  if (!nearbySlotExists) return null;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`h-auto p-0 hover:bg-transparent ${className}`}
    >
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-primary" />
          <span className="text-sm font-medium text-primary">
            Рядом +{additionalMinutes} мин
          </span>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5">
          <Percent className="h-2.5 w-2.5 mr-0.5" />
          {discountPercent}%
        </Badge>
      </div>
    </Button>
  );
}