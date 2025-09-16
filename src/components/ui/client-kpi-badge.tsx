import React from "react";
import { TrendingUp, TrendingDown, Minus, Clock, Star, CreditCard, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";

interface ClientKPIBadgeProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    period?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  format?: 'currency' | 'number' | 'text' | 'date';
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  default: {
    card: 'glass-card',
    value: 'text-foreground',
    trend: 'text-muted-foreground'
  },
  success: {
    card: 'glass-card border-green-200',
    value: 'text-green-700',
    trend: 'text-green-600'
  },
  warning: {
    card: 'glass-card border-orange-200',
    value: 'text-orange-700',
    trend: 'text-orange-600'
  },
  danger: {
    card: 'glass-card border-red-200',
    value: 'text-red-700',
    trend: 'text-red-600'
  },
  neutral: {
    card: 'glass-card',
    value: 'text-muted-foreground',
    trend: 'text-muted-foreground'
  }
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
};

const formatValue = (value: string | number, format: ClientKPIBadgeProps['format']) => {
  switch (format) {
    case 'currency':
      return typeof value === 'number' ? `₽ ${value.toLocaleString()}` : value;
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    case 'date':
      return value;
    case 'text':
    default:
      return value;
  }
};

export function ClientKPIBadge({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  format = 'text',
  clickable = false,
  onClick,
  className = ''
}: ClientKPIBadgeProps) {
  const styles = variantStyles[variant];
  const TrendIcon = trend ? trendIcons[trend.direction] : null;
  const formattedValue = formatValue(value, format);

  const content = (
    <CardContent className="p-4">
      <div className="space-y-2">
        {/* Header with icon and trend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          {trend && TrendIcon && (
            <Badge variant="outline" className={`text-xs ${styles.trend} border-0 bg-transparent`}>
              <TrendIcon className="h-3 w-3 mr-1" />
              {trend.value}
            </Badge>
          )}
        </div>

        {/* Value */}
        <div className={`font-semibold text-lg ${styles.value}`}>
          {formattedValue}
        </div>

        {/* Trend period */}
        {trend?.period && (
          <div className="text-xs text-muted-foreground">
            за {trend.period}
          </div>
        )}
      </div>
    </CardContent>
  );

  if (clickable && onClick) {
    return (
      <Card 
        className={`${styles.card} cursor-pointer hover:shadow-elegant transition-all duration-300 ${className}`}
        onClick={onClick}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card className={`${styles.card} ${className}`}>
      {content}
    </Card>
  );
}

// Специализированные KPI компоненты
interface VisitKPIProps {
  lastVisit: string;
  totalVisits: number;
  businessType?: 'beauty' | 'fitness' | 'auto' | 'education';
}

export function VisitKPI({ lastVisit, totalVisits, businessType = 'beauty' }: VisitKPIProps) {
  const getLabels = () => {
    switch (businessType) {
      case 'fitness':
        return { lastVisit: 'Последняя тренировка', totalVisits: 'Посещений/мес' };
      case 'auto':
        return { lastVisit: 'Последнее ТО', totalVisits: 'Всего обращений' };
      case 'education':
        return { lastVisit: 'Последнее занятие', totalVisits: 'Посещаемость' };
      default:
        return { lastVisit: 'Последний визит', totalVisits: 'Всего визитов' };
    }
  };

  const labels = getLabels();

  return (
    <>
      <ClientKPIBadge
        label={labels.lastVisit}
        value={lastVisit}
        icon={Clock}
        format="date"
      />
      <ClientKPIBadge
        label={labels.totalVisits}
        value={totalVisits}
        icon={Star}
        format="number"
        variant="success"
      />
    </>
  );
}

interface RevenueKPIProps {
  averageCheck: number;
  totalRevenue?: number;
  businessType?: 'beauty' | 'fitness' | 'auto' | 'education';
}

export function RevenueKPI({ averageCheck, totalRevenue, businessType = 'beauty' }: RevenueKPIProps) {
  const getLabel = () => {
    switch (businessType) {
      case 'education':
        return 'Средний платеж';
      default:
        return 'Средний чек';
    }
  };

  return (
    <>
      <ClientKPIBadge
        label={getLabel()}
        value={averageCheck}
        icon={CreditCard}
        format="currency"
        variant="default"
      />
      {totalRevenue !== undefined && (
        <ClientKPIBadge
          label="Общая выручка"
          value={totalRevenue}
          icon={TrendingUp}
          format="currency"
          variant="success"
        />
      )}
    </>
  );
}

interface QualityKPIProps {
  noShowCount: number;
  rating?: number;
  businessType?: 'beauty' | 'fitness' | 'auto' | 'education';
}

export function QualityKPI({ noShowCount, rating, businessType = 'beauty' }: QualityKPIProps) {
  const getNoShowLabel = () => {
    switch (businessType) {
      case 'fitness':
      case 'education':
        return 'Пропуски';
      case 'auto':
        return 'Отмены';
      default:
        return 'No-show';
    }
  };

  return (
    <>
      <ClientKPIBadge
        label={getNoShowLabel()}
        value={noShowCount}
        icon={AlertTriangle}
        variant={noShowCount === 0 ? 'neutral' : 'danger'}
        format="number"
      />
      {rating !== undefined && (
        <ClientKPIBadge
          label="Рейтинг"
          value={`${rating}/5`}
          icon={Star}
          variant="success"
        />
      )}
    </>
  );
}

// Компонент для группы KPI
interface ClientKPIGroupProps {
  client: {
    lastVisit: string;
    totalVisits: number;
    averageCheck: number;
    noShowCount: number;
    totalRevenue?: number;
    rating?: number;
  };
  businessType?: 'beauty' | 'fitness' | 'auto' | 'education';
  layout?: 'grid' | 'row';
  className?: string;
}

export function ClientKPIGroup({ 
  client, 
  businessType = 'beauty', 
  layout = 'grid',
  className = ''
}: ClientKPIGroupProps) {
  const layoutClass = layout === 'grid' 
    ? 'grid grid-cols-2 md:grid-cols-4 gap-4'
    : 'flex flex-wrap gap-4';

  return (
    <div className={`${layoutClass} ${className}`}>
      <VisitKPI 
        lastVisit={client.lastVisit}
        totalVisits={client.totalVisits}
        businessType={businessType}
      />
      <RevenueKPI 
        averageCheck={client.averageCheck}
        totalRevenue={client.totalRevenue}
        businessType={businessType}
      />
      <QualityKPI 
        noShowCount={client.noShowCount}
        rating={client.rating}
        businessType={businessType}
      />
    </div>
  );
}