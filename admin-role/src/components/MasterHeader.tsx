import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MasterHeaderProps {
  name: string;
  avatar?: string;
  specializations: string[];
  bio: string;
  rating?: number;
  reviewCount?: number;
  onBookClick: () => void;
}

export function MasterHeader({
  name,
  avatar,
  specializations,
  bio,
  rating,
  reviewCount,
  onBookClick,
}: MasterHeaderProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Avatar and Name */}
      <div className="flex items-start gap-4">
        <Avatar className="h-18 w-18">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl mb-1">{name}</h1>
          {rating && reviewCount && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviewCount} {reviewCount === 1 ? 'отзыв' : reviewCount < 5 ? 'отзыва' : 'отзывов'})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Specializations */}
      {specializations && specializations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specializations.map((spec, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      )}

      {/* Bio */}
      {bio && (
        <p className="text-sm text-muted-foreground">{bio}</p>
      )}

      {/* Book Button */}
      <Button 
        className="w-full elegant-button" 
        size="lg"
        onClick={onBookClick}
      >
        Записаться к мастеру
      </Button>
    </div>
  );
}
