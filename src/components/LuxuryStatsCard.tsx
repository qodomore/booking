import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface LuxuryStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  variant?: 'cream' | 'glass' | 'premium';
}

export function LuxuryStatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'glass' 
}: LuxuryStatsCardProps) {
  const getCardClass = () => {
    switch (variant) {
      case 'cream':
        return 'cream-card';
      case 'premium':
        return 'premium-card';
      default:
        return 'glass-card';
    }
  };

  const getTextColor = () => {
    return variant === 'cream' ? 'text-gray-800' : 'text-foreground';
  };

  const getSecondaryTextColor = () => {
    return variant === 'cream' ? 'text-gray-600' : 'text-muted-foreground';
  };

  return (
    <Card className={`${getCardClass()} hover:scale-[1.02] transition-all duration-300 animate-luxury-fade-in border-0`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            variant === 'cream' 
              ? 'bg-white/50 border border-primary/20' 
              : 'bg-primary/10 border border-primary/20'
          }`}>
            <Icon className={`h-6 w-6 ${
              variant === 'cream' ? 'text-gray-700' : 'text-primary'
            }`} />
          </div>
          {change && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium modern-tag ${
              change.type === 'increase' ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10'
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
        
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${getTextColor()} gradient-text-luxury`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className={`text-sm font-medium ${getSecondaryTextColor()}`}>{title}</div>
          {change && (
            <div className={`text-xs ${getSecondaryTextColor()}`}>
              за {change.period}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}