import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ModernStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function ModernStatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'primary' 
}: ModernStatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-600',
    warning: 'bg-yellow-500/10 text-yellow-600',
    danger: 'bg-red-500/10 text-red-600',
  };

  const colorBorder = {
    primary: 'border-primary/20',
    success: 'border-green-500/20',
    warning: 'border-yellow-500/20',
    danger: 'border-red-500/20',
  };

  return (
    <Card className={`professional-card hover:shadow-modern transition-all duration-200 border ${colorBorder[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {change.value}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-sm text-muted-foreground">{title}</div>
          {change && (
            <div className="text-xs text-muted-foreground">
              за {change.period}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}