import React from "react";
import { Star, Calendar, Clock, CreditCard, MoreHorizontal, Copy, MessageSquare, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Separator } from "./separator";

interface VisitRowProps {
  visit: {
    id: string;
    date: string;
    service: string;
    resource: string;
    resourceAvatar?: string;
    duration: number;
    price: number;
    rating?: number;
    review?: string;
    status: 'completed' | 'cancelled' | 'no-show';
    tags?: string[];
    paymentStatus?: 'paid' | 'pending' | 'refunded';
  };
  onRepeat?: (visitId: string) => void;
  onViewReceipt?: (visitId: string) => void;
  onMessage?: (visitId: string) => void;
  onViewReview?: (visitId: string) => void;
  variant?: 'row' | 'card' | 'compact';
  showActions?: boolean;
  className?: string;
}

const statusStyles = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    dot: 'bg-green-500'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    dot: 'bg-red-500'
  },
  'no-show': {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    dot: 'bg-orange-500'
  }
};

const paymentStatusStyles = {
  paid: { color: 'text-green-600', label: 'Оплачено' },
  pending: { color: 'text-orange-600', label: 'Ожидает оплаты' },
  refunded: { color: 'text-blue-600', label: 'Возвращено' }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}ч ${mins}м`;
  } else if (hours > 0) {
    return `${hours}ч`;
  } else {
    return `${mins}м`;
  }
};

const getResourceInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

export function VisitRow({
  visit,
  onRepeat,
  onViewReceipt,
  onMessage,
  onViewReview,
  variant = 'card',
  showActions = true,
  className = ''
}: VisitRowProps) {
  const statusConfig = statusStyles[visit.status];
  const StatusIcon = statusConfig.icon;
  const paymentConfig = visit.paymentStatus ? paymentStatusStyles[visit.paymentStatus] : null;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between p-2 hover:bg-muted/20 rounded-lg transition-colors ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${statusConfig.dot}`} />
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{visit.service}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(visit.date)} • {visit.resource}
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0">
          <div className="font-semibold text-sm">₽ {visit.price.toLocaleString()}</div>
          {visit.rating && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{visit.rating}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <tr className={`border-b border-border/50 hover:bg-muted/10 ${className}`}>
        <td className="p-3">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
            <span className="text-sm">{formatDate(visit.date)}</span>
          </div>
        </td>
        <td className="p-3">
          <div>
            <div className="font-medium text-sm">{visit.service}</div>
            {visit.tags && visit.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {visit.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </td>
        <td className="p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={visit.resourceAvatar} />
              <AvatarFallback className="text-xs">
                {getResourceInitials(visit.resource)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{visit.resource}</span>
          </div>
        </td>
        <td className="p-3 text-sm">{formatDuration(visit.duration)}</td>
        <td className="p-3">
          <div className="font-semibold text-sm">₽ {visit.price.toLocaleString()}</div>
          {paymentConfig && (
            <div className={`text-xs ${paymentConfig.color}`}>
              {paymentConfig.label}
            </div>
          )}
        </td>
        <td className="p-3">
          {visit.rating ? (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{visit.rating}</span>
              {visit.review && onViewReview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewReview(visit.id)}
                  className="h-auto p-1 text-xs text-primary"
                >
                  Отзыв
                </Button>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Нет оценки</span>
          )}
        </td>
        <td className="p-3">
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onRepeat && (
                  <DropdownMenuItem onClick={() => onRepeat(visit.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Повторить
                  </DropdownMenuItem>
                )}
                {onViewReceipt && (
                  <DropdownMenuItem onClick={() => onViewReceipt(visit.id)}>
                    Квитанция
                  </DropdownMenuItem>
                )}
                {onMessage && (
                  <DropdownMenuItem onClick={() => onMessage(visit.id)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Написать
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </td>
      </tr>
    );
  }

  // Card variant (default)
  return (
    <div className={`p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-3 h-3 rounded-full ${statusConfig.dot} mt-2`} />
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h6 className="font-medium">{visit.service}</h6>
                <div className="text-sm text-muted-foreground">
                  {formatDate(visit.date)} • {formatDuration(visit.duration)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₽ {visit.price.toLocaleString()}</div>
                {paymentConfig && (
                  <div className={`text-xs ${paymentConfig.color}`}>
                    {paymentConfig.label}
                  </div>
                )}
              </div>
            </div>

            {/* Resource */}
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={visit.resourceAvatar} />
                <AvatarFallback className="text-xs">
                  {getResourceInitials(visit.resource)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{visit.resource}</span>
            </div>

            {/* Tags */}
            {visit.tags && visit.tags.length > 0 && (
              <div className="flex gap-1 mb-2">
                {visit.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Rating and Review */}
            {visit.rating && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{visit.rating}/5</span>
                </div>
                {visit.review && (
                  <span className="text-xs text-muted-foreground">• Есть отзыв</span>
                )}
              </div>
            )}

            {/* Review Text */}
            {visit.review && (
              <div className="text-sm text-muted-foreground italic mb-2 line-clamp-2">
                "{visit.review}"
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onRepeat && visit.status === 'completed' && (
                <DropdownMenuItem onClick={() => onRepeat(visit.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Повторить запись
                </DropdownMenuItem>
              )}
              {onViewReceipt && (
                <DropdownMenuItem onClick={() => onViewReceipt(visit.id)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Квитанция
                </DropdownMenuItem>
              )}
              {onViewReview && visit.review && (
                <DropdownMenuItem onClick={() => onViewReview(visit.id)}>
                  <Star className="h-4 w-4 mr-2" />
                  Показать отзыв
                </DropdownMenuItem>
              )}
              {onMessage && (
                <DropdownMenuItem onClick={() => onMessage(visit.id)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Написать клиенту
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

// Компонент таблицы визитов
interface VisitTableProps {
  visits: VisitRowProps['visit'][];
  onRepeat?: (visitId: string) => void;
  onViewReceipt?: (visitId: string) => void;
  onMessage?: (visitId: string) => void;
  onViewReview?: (visitId: string) => void;
  showActions?: boolean;
  className?: string;
}

export function VisitTable({
  visits,
  onRepeat,
  onViewReceipt,
  onMessage,
  onViewReview,
  showActions = true,
  className = ''
}: VisitTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="border-b bg-muted/30">
          <tr className="text-left">
            <th className="p-3 text-xs font-medium text-muted-foreground">Дата</th>
            <th className="p-3 text-xs font-medium text-muted-foreground">Услуга</th>
            <th className="p-3 text-xs font-medium text-muted-foreground">Ресурс</th>
            <th className="p-3 text-xs font-medium text-muted-foreground">Время</th>
            <th className="p-3 text-xs font-medium text-muted-foreground">Цена</th>
            <th className="p-3 text-xs font-medium text-muted-foreground">Рейтинг</th>
            {showActions && (
              <th className="p-3 text-xs font-medium text-muted-foreground">Действия</th>
            )}
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <VisitRow
              key={visit.id}
              visit={visit}
              onRepeat={onRepeat}
              onViewReceipt={onViewReceipt}
              onMessage={onMessage}
              onViewReview={onViewReview}
              variant="row"
              showActions={showActions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}