import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, DollarSign } from 'lucide-react';
import { Card } from './card';
import { Badge } from './badge';

interface SlotMiniCardProps {
  time: string;
  duration: number;
  price?: number;
  discount?: number;
  resources: string[];
  onClick?: () => void;
  isSelected?: boolean;
}

export function SlotMiniCard({
  time,
  duration,
  price,
  discount,
  resources,
  onClick,
  isSelected = false
}: SlotMiniCardProps) {
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Card clicked:', time);
    if (onClick) {
      onClick();
    }
  };
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
    }
    return `${mins}м`;
  };

  const formatPrice = (price: number, discount?: number) => {
    if (discount) {
      return (
        <div className="flex items-center gap-1">
          <span className="text-xs line-through text-muted-foreground">
            {price.toLocaleString()}₽
          </span>
          <span className="text-sm font-medium text-green-600">
            {(price * (1 - discount / 100)).toLocaleString()}₽
          </span>
        </div>
      );
    }
    return (
      <span className="text-sm font-medium">
        {price.toLocaleString()}₽
      </span>
    );
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02, zIndex: 30 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex-shrink-0 relative"
    >
      <Card 
        className={`p-3 min-w-[160px] cursor-pointer transition-all duration-200 active:scale-95 select-none border-2 ${
          isSelected 
            ? 'ring-2 ring-primary border-primary bg-primary/15 shadow-lg z-30' 
            : 'hover:bg-primary/5 hover:shadow-2xl border-border hover:border-primary/60 hover:scale-[1.02]'
        }`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {/* Time */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
            <Clock className="w-3 h-3 text-primary" />
          </div>
          <span className="font-medium text-sm">{time}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs text-muted-foreground">
            {formatDuration(duration)}
          </span>
          {discount && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto bg-green-50 text-green-700 border-green-200">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Price */}
        {price && (
          <div className="flex items-center gap-1 mb-2">
            <DollarSign className="w-3 h-3 text-muted-foreground" />
            {formatPrice(price, discount)}
          </div>
        )}

        {/* Resources */}
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            {resources.length > 2 
              ? `${resources.slice(0, 2).join(', ')} +${resources.length - 2}`
              : resources.join(', ')
            }
          </span>
        </div>
      </Card>
    </motion.div>
  );
}