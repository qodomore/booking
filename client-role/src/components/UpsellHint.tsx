import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';

interface UpsellHintProps {
  language: 'ru' | 'en';
  discountPct?: number;
  hasNearbySlot?: boolean;
  hasAddOns?: boolean;
  onClick: () => void;
}

export function UpsellHint({ 
  language, 
  discountPct = 10, 
  hasNearbySlot = false, 
  hasAddOns = false,
  onClick 
}: UpsellHintProps) {
  const texts = {
    ru: {
      nearbySlot: `Рядом есть +15 минут со скидкой −${discountPct}%`,
      addOns: 'Добавьте уход/сыворотку — всего +15 минут'
    },
    en: {
      nearbySlot: `Nearby +15 min at −${discountPct}%`,
      addOns: 'Add care/serum — just +15 min'
    }
  };

  const t = texts[language];

  // Show only if there are relevant options
  if (!hasNearbySlot && !hasAddOns) {
    return null;
  }

  const displayText = hasNearbySlot ? t.nearbySlot : t.addOns;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle border border-border/50 transition-all duration-200 hover:shadow-sm group"
    >
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-warning-500" />
        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
          {displayText}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-text-primary transition-colors" />
    </button>
  );
}