import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  period?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: {
    border: 'border-border',
    accent: 'text-foreground',
    badge: 'bg-muted text-muted-foreground'
  },
  success: {
    border: 'border-green-200',
    accent: 'text-green-600',
    badge: 'bg-green-50 text-green-700'
  },
  warning: {
    border: 'border-orange-200', 
    accent: 'text-orange-600',
    badge: 'bg-orange-50 text-orange-700'
  },
  danger: {
    border: 'border-red-200',
    accent: 'text-red-600', 
    badge: 'bg-red-50 text-red-700'
  },
  info: {
    border: 'border-blue-200',
    accent: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700'
  }
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
};

const trendColors = {
  up: 'text-green-500',
  down: 'text-red-500', 
  neutral: 'text-muted-foreground'
};

export function KPICard({ 
  title, 
  value, 
  change, 
  period, 
  trend = 'neutral',
  variant = 'default',
  className = '' 
}: KPICardProps) {
  const styles = variantStyles[variant];
  const TrendIcon = trendIcons[trend];
  const trendColor = trendColors[trend];

  return (
    <Card className={`glass-card hover:shadow-elegant transition-all duration-300 ${styles.border} ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h6 className="font-medium text-muted-foreground">{title}</h6>
            {change && (
              <Badge variant="outline" className={`text-xs ${styles.badge} border-0`}>
                <TrendIcon className={`h-3 w-3 mr-1 ${trendColor}`} />
                {change}
              </Badge>
            )}
          </div>

          {/* Value */}
          <div>
            <div className={`text-2xl font-semibold ${styles.accent}`}>
              {value}
            </div>
            {period && (
              <div className="text-xs text-muted-foreground mt-1">
                за {period}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Утилитарные функции
export const formatKPIValue = (value: number, type: 'currency' | 'percentage' | 'number'): string => {
  switch (type) {
    case 'currency':
      return `₽ ${value.toLocaleString()}`;
    case 'percentage':
      return `${value}%`;
    case 'number':
      return value.toLocaleString();
    default:
      return value.toString();
  }
};

export const determineKPITrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'neutral';
};

export const calculateKPIChange = (current: number, previous: number): string => {
  const diff = current - previous;
  const percentage = previous !== 0 ? (diff / previous) * 100 : 0;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
};