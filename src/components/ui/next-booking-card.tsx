import React, { useState } from "react";
import { Calendar, Clock, User, CreditCard, MapPin, Phone, MessageSquare, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Separator } from "./separator";

interface NextBookingCardProps {
  booking: {
    id: string;
    service: string;
    date: string;
    time: string;
    resource: string;
    resourceAvatar?: string;
    price: number;
    duration: number;
    location?: string;
    status?: 'confirmed' | 'pending' | 'cancelled';
    notes?: string;
  };
  onReschedule?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onCall?: (bookingId: string) => void;
  onMessage?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
  compact?: boolean;
  showActions?: boolean;
  className?: string;
}

const statusStyles = {
  confirmed: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Подтверждена'
  },
  pending: {
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    label: 'Ожидает подтверждения'
  },
  cancelled: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Отменена'
  }
};

const getResourceInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Завтра';
  } else {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      weekday: 'short'
    });
  }
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours} ч ${mins} мин`;
  } else if (hours > 0) {
    return `${hours} ч`;
  } else {
    return `${mins} мин`;
  }
};

export function NextBookingCard({
  booking,
  onReschedule,
  onCancel,
  onCall,
  onMessage,
  onViewDetails,
  compact = false,
  showActions = true,
  className = ''
}: NextBookingCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const status = booking.status || 'confirmed';
  const statusConfig = statusStyles[status];

  if (compact) {
    return (
      <Card className={`glass-card ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h6 className="font-medium">{booking.service}</h6>
                <div className="text-sm text-muted-foreground">
                  {formatDate(booking.date)} в {booking.time}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold">₽ {booking.price.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{formatDuration(booking.duration)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Ближайшая запись
          </CardTitle>
          {showActions && (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails(booking.id)}>
                    Подробности
                  </DropdownMenuItem>
                )}
                {onCall && (
                  <DropdownMenuItem onClick={() => onCall(booking.id)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Позвонить клиенту
                  </DropdownMenuItem>
                )}
                {onMessage && (
                  <DropdownMenuItem onClick={() => onMessage(booking.id)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Написать клиенту
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Badge */}
        {booking.status && booking.status !== 'confirmed' && (
          <Badge className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
            {statusConfig.label}
          </Badge>
        )}

        {/* Service and Time */}
        <div className="space-y-2">
          <h5>{booking.service}</h5>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{booking.time}</span>
            </div>
          </div>
        </div>

        {/* Resource */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={booking.resourceAvatar} />
            <AvatarFallback className="text-xs">
              {getResourceInitials(booking.resource)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{booking.resource}</div>
            <div className="text-xs text-muted-foreground">Мастер</div>
          </div>
        </div>

        <Separator />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-semibold">₽ {booking.price.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Стоимость</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-semibold">{formatDuration(booking.duration)}</div>
              <div className="text-xs text-muted-foreground">Длительность</div>
            </div>
          </div>
        </div>

        {/* Location */}
        {booking.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{booking.location}</span>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Заметки:</div>
            <div className="text-sm">{booking.notes}</div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReschedule?.(booking.id)}
              className="flex-1"
            >
              Перенести
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel?.(booking.id)}
              className="flex-1 text-red-600 hover:text-red-600 hover:bg-red-50"
            >
              Отменить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Компонент для списка предстоящих записей
interface UpcomingBookingsProps {
  bookings: NextBookingCardProps['booking'][];
  onReschedule?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onCall?: (bookingId: string) => void;
  onMessage?: (bookingId: string) => void;
  maxVisible?: number;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function UpcomingBookings({
  bookings,
  onReschedule,
  onCancel,
  onCall,
  onMessage,
  maxVisible = 3,
  showActions = true,
  compact = false,
  className = ''
}: UpcomingBookingsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedBookings = showAll ? bookings : bookings.slice(0, maxVisible);

  if (bookings.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h6>Нет предстоящих записей</h6>
          <p className="text-sm text-muted-foreground">Запишите клиента на услугу</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {displayedBookings.map((booking) => (
        <NextBookingCard
          key={booking.id}
          booking={booking}
          onReschedule={onReschedule}
          onCancel={onCancel}
          onCall={onCall}
          onMessage={onMessage}
          compact={compact}
          showActions={showActions}
        />
      ))}
      
      {!showAll && bookings.length > maxVisible && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(true)}
          className="w-full"
        >
          Показать ещё {bookings.length - maxVisible} записей
        </Button>
      )}
    </div>
  );
}