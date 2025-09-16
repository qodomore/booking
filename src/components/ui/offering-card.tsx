import React from "react";
import { MoreHorizontal, Edit3, Copy, Archive, Trash2 } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Switch } from "./switch";
import { Card, CardContent } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./dropdown-menu";

// Типы предложений с нейтральными иконками
const offeringTypes = [
  { id: 'service', label: 'Услуга', emoji: '🧩' },
  { id: 'rental', label: 'Аренда', emoji: '📦' },
  { id: 'class', label: 'Класс', emoji: '👥' },
  { id: 'subscription', label: 'Подписка', emoji: '🔁' },
  { id: 'addon', label: 'Доп. опция', emoji: '➕' }
];

export interface Offering {
  id: number | string;
  name: string;
  description: string;
  type: 'service' | 'rental' | 'class' | 'subscription' | 'addon';
  price: number;
  duration?: number;
  currency: string;
  unit?: string;
  capacity?: number;
  status: 'active' | 'draft' | 'archived';
  category?: string;
  updatedAt: string;
  ordersCount: number;
  hasImage?: boolean;
  prepayment?: boolean;
  prepaymentPercent?: number;
}

interface OfferingCardProps {
  offering: Offering;
  variant?: 'list' | 'grid';
  showActions?: boolean;
  onEdit?: (offering: Offering) => void;
  onDuplicate?: (offering: Offering) => void;
  onArchive?: (offering: Offering) => void;
  onDelete?: (offering: Offering) => void;
  onStatusChange?: (offering: Offering, newStatus: boolean) => void;
}

export function OfferingCard({ 
  offering, 
  variant = 'list',
  showActions = true,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  onStatusChange
}: OfferingCardProps) {
  const getTypeConfig = (typeId: string) => {
    return offeringTypes.find(t => t.id === typeId) || offeringTypes[0];
  };

  const typeConfig = getTypeConfig(offering.type);

  if (variant === 'grid') {
    return (
      <Card className="glass-card group hover:shadow-elegant transition-all duration-300 w-full max-w-[272px] h-[220px]">
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center flex-shrink-0">
                {offering.hasImage ? (
                  <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
                ) : (
                  <span className="text-lg">{typeConfig.emoji}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate text-sm">{offering.name}</h4>
                <Badge variant="secondary" className="text-xs mt-1">
                  {typeConfig.label}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-semibold text-primary text-sm">
                {offering.currency} {offering.price.toLocaleString()}
              </span>
              {showActions && (
                <Switch 
                  checked={offering.status === 'active'} 
                  size="sm"
                  onCheckedChange={(checked) => onStatusChange?.(offering, checked)}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-3">
            {offering.description}
          </p>

          {/* Attributes */}
          <div className="flex flex-wrap gap-1 mb-3">
            {offering.duration && (
              <Badge variant="outline" className="text-xs">
                {offering.duration} мин
              </Badge>
            )}
            {offering.capacity && (
              <Badge variant="outline" className="text-xs">
                до {offering.capacity}
              </Badge>
            )}
            {offering.unit && (
              <Badge variant="outline" className="text-xs">
                /{offering.unit}
              </Badge>
            )}
            {offering.prepayment && (
              <Badge variant="outline" className="text-xs">
                предоплата {offering.prepaymentPercent}%
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Обновлено {offering.updatedAt}</span>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(offering)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate?.(offering)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Дублировать
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onArchive?.(offering)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Архивировать
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => onDelete?.(offering)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card group hover:shadow-elegant transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon/Image */}
          <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center flex-shrink-0">
            {offering.hasImage ? (
              <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
            ) : (
              <span className="text-lg">{typeConfig.emoji}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 mr-4">
                <h4 className="font-medium truncate mb-1">{offering.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {offering.description}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-semibold text-primary">
                  {offering.currency} {offering.price.toLocaleString()}
                </span>
                {showActions && (
                  <Switch 
                    checked={offering.status === 'active'} 
                    size="sm"
                    onCheckedChange={(checked) => onStatusChange?.(offering, checked)}
                  />
                )}
              </div>
            </div>

            {/* Attributes */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {typeConfig.label}
              </Badge>
              {offering.duration && (
                <Badge variant="outline" className="text-xs">
                  {offering.duration} мин
                </Badge>
              )}
              {offering.capacity && (
                <Badge variant="outline" className="text-xs">
                  до {offering.capacity}
                </Badge>
              )}
              {offering.unit && (
                <Badge variant="outline" className="text-xs">
                  /{offering.unit}
                </Badge>
              )}
              {offering.prepayment && (
                <Badge variant="outline" className="text-xs">
                  предоплата {offering.prepaymentPercent}%
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Обновлено {offering.updatedAt} • В заказах: {offering.ordersCount}
              </span>
              {showActions && (
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit?.(offering)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onDuplicate?.(offering)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onArchive?.(offering)}>
                        <Archive className="h-4 w-4 mr-2" />
                        Архивировать
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => onDelete?.(offering)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Утилитарные функции для работы с предложениями
export const getOfferingTypeConfig = (typeId: string) => {
  return offeringTypes.find(t => t.id === typeId) || offeringTypes[0];
};

export const formatOfferingPrice = (offering: Offering) => {
  let price = `${offering.currency} ${offering.price.toLocaleString()}`;
  if (offering.unit) {
    price += `/${offering.unit}`;
  }
  return price;
};

export const getOfferingStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'draft': return 'secondary'; 
    case 'archived': return 'outline';
    default: return 'secondary';
  }
};