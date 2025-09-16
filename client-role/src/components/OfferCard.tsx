import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface OfferCardProps {
  offer: {
    id: string;
    type: string;
    title: string;
    description: string;
    discount?: string | null;
    validUntil: string;
    isAI?: boolean;
    isLimited?: boolean;
  };
  onUse: (offer: any) => void;
  getOfferIcon: (type: string) => React.ReactNode;
  getOfferColor: (type: string) => string;
  texts: {
    aiRecommendation: string;
    limited: string;
    aiDescription: string;
    validUntil: string;
    use: string;
  };
  variant?: 'stacked' | 'inline';
  className?: string;
}

export function OfferCard({ 
  offer, 
  onUse, 
  getOfferIcon, 
  getOfferColor, 
  texts, 
  variant = 'stacked',
  className = ''
}: OfferCardProps) {
  return (
    <div className={`relative w-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-elevation-1 ${className}`}>
      {/* Decorative Background - Back Layer with Proper Clipping */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main decorative circle - Always visible */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-[0.06]">
          <div className="w-full h-full bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Additional decorative blur for depth */}
        <div className="absolute top-2 right-2 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.04]">
          <div className="w-full h-full bg-primary rounded-full blur-xl transform translate-x-1/3 -translate-y-1/3"></div>
        </div>
        
        {/* Secondary decorative pattern - only for offers with discount */}
        {offer.discount && (
          <div className="absolute bottom-0 left-0 w-20 h-20 opacity-[0.03]">
            <div className="w-full h-full bg-secondary-foreground rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Left Group */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className={`w-12 h-12 ${getOfferColor(offer.type)} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
              {getOfferIcon(offer.type)}
            </div>
            
            {/* Title and Badges */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-2 line-clamp-2 break-words">{offer.title}</h3>
              
              {/* Badges Row with Better Spacing */}
              <div className="flex flex-wrap gap-2">
                {offer.isAI && (
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 whitespace-nowrap">
                    {texts.aiRecommendation}
                  </Badge>
                )}
                {offer.isLimited && (
                  <Badge variant="outline" className="text-xs px-2 py-1 text-orange-600 border-orange-600 bg-orange-50 dark:bg-orange-950/20 whitespace-nowrap">
                    {texts.limited}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Group - Discount Display */}
          {offer.discount && (
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-primary">−{offer.discount}</div>
            </div>
          )}
        </div>

        {/* Subtitle Row */}
        {offer.isAI && (
          <p className="text-xs text-muted-foreground mb-3">{texts.aiDescription}</p>
        )}

        {/* Body Row */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {offer.description}
        </p>

        {/* Meta Block - Conditional Layout Based on Variant */}
        {variant === 'stacked' ? (
          // Stacked Layout (Mobile-first, safer for narrow screens)
          <div className="space-y-3">
            {/* Valid Until Row - Full Width, No Truncation */}
            <div className="w-full">
              <span className="text-sm text-muted-foreground break-words">
                {texts.validUntil}: {offer.validUntil}
              </span>
            </div>
            
            {/* Actions Block - Right Aligned */}
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => onUse(offer)}
                className="h-10 px-4"
              >
                {texts.use}
              </Button>
            </div>
          </div>
        ) : (
          // Inline Layout (For wider screens, with smart wrapping)
          <div className="flex flex-wrap items-start justify-between gap-3">
            {/* Valid Until Row - Flexible Width with Smart Wrapping */}
            <div className="flex-1 min-w-0 max-w-full">
              <span className="text-sm text-muted-foreground break-words hyphens-auto">
                {texts.validUntil}: {offer.validUntil}
              </span>
            </div>
            
            {/* Actions Block - Hug Contents, Wraps Below if Needed */}
            <div className="flex-shrink-0">
              <Button
                size="sm"
                onClick={() => onUse(offer)}
                className="h-10 px-4"
              >
                {texts.use}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}