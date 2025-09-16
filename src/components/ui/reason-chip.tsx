import React from "react";
import { Badge } from "./badge";
import { 
  Clock, 
  TrendingDown, 
  Heart, 
  DollarSign, 
  Star, 
  AlertTriangle,
  Calendar,
  MessageSquare,
  User,
  Target
} from "lucide-react";

interface ReasonChipProps {
  reason: string;
  type?: 'risk' | 'preference' | 'behavior' | 'financial' | 'temporal' | 'engagement';
  variant?: 'default' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

// Mapping reasons to types and icons
const reasonTypeMapping: Record<string, { 
  type: ReasonChipProps['type']; 
  icon: React.ComponentType<{ className?: string }>;
}> = {
  // Temporal reasons
  'дней без визита': { type: 'temporal', icon: Clock },
  'дня без активности': { type: 'temporal', icon: Clock },
  'дней неактивен': { type: 'temporal', icon: Clock },
  'просрочен ТО': { type: 'temporal', icon: AlertTriangle },
  'скоро срок': { type: 'temporal', icon: Calendar },
  'истекает абонемент': { type: 'temporal', icon: Calendar },
  
  // Preference reasons
  'любит утро': { type: 'preference', icon: Heart },
  'любит вечер': { type: 'preference', icon: Heart },
  'предпочитает выходные': { type: 'preference', icon: Heart },
  'любит мастера': { type: 'preference', icon: User },
  
  // Financial reasons
  'ARPU': { type: 'financial', icon: DollarSign },
  'средний чек': { type: 'financial', icon: DollarSign },
  'высокие траты': { type: 'financial', icon: DollarSign },
  'экономит': { type: 'financial', icon: DollarSign },
  
  // Behavior reasons
  'пропустил записи': { type: 'behavior', icon: TrendingDown },
  'отменил запись': { type: 'behavior', icon: TrendingDown },
  'опаздывает': { type: 'behavior', icon: Clock },
  'приходит рано': { type: 'behavior', icon: Clock },
  
  // Engagement reasons
  'VIP статус': { type: 'engagement', icon: Star },
  'лояльный клиент': { type: 'engagement', icon: Heart },
  'новый клиент': { type: 'engagement', icon: User },
  'активный': { type: 'engagement', icon: Target },
  
  // Risk reasons
  'высокий риск': { type: 'risk', icon: AlertTriangle },
  'средний риск': { type: 'risk', icon: AlertTriangle },
  'низкий риск': { type: 'risk', icon: AlertTriangle },
  'в зоне риска': { type: 'risk', icon: AlertTriangle }
};

const typeStyles = {
  risk: {
    default: 'bg-red-100 text-red-800 border-red-200',
    outline: 'border-red-200 text-red-700 hover:bg-red-50',
    subtle: 'bg-red-50 text-red-600 border-red-100'
  },
  preference: {
    default: 'bg-purple-100 text-purple-800 border-purple-200',
    outline: 'border-purple-200 text-purple-700 hover:bg-purple-50',
    subtle: 'bg-purple-50 text-purple-600 border-purple-100'
  },
  behavior: {
    default: 'bg-orange-100 text-orange-800 border-orange-200',
    outline: 'border-orange-200 text-orange-700 hover:bg-orange-50',
    subtle: 'bg-orange-50 text-orange-600 border-orange-100'
  },
  financial: {
    default: 'bg-green-100 text-green-800 border-green-200',
    outline: 'border-green-200 text-green-700 hover:bg-green-50',
    subtle: 'bg-green-50 text-green-600 border-green-100'
  },
  temporal: {
    default: 'bg-blue-100 text-blue-800 border-blue-200',
    outline: 'border-blue-200 text-blue-700 hover:bg-blue-50',
    subtle: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  engagement: {
    default: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    outline: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50',
    subtle: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  }
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1'
};

const detectReasonType = (reason: string): { 
  type: ReasonChipProps['type']; 
  icon: React.ComponentType<{ className?: string }>;
} => {
  const lowerReason = reason.toLowerCase();
  
  // Direct mapping
  for (const [key, config] of Object.entries(reasonTypeMapping)) {
    if (lowerReason.includes(key.toLowerCase())) {
      return config;
    }
  }
  
  // Pattern matching
  if (/\d+\s*(день|дней|дня)\s*(без|неактивен)/i.test(reason)) {
    return { type: 'temporal', icon: Clock };
  }
  
  if (/ARPU|₽\s*\d+/i.test(reason)) {
    return { type: 'financial', icon: DollarSign };
  }
  
  if (/VIP|лояльн|важн/i.test(reason)) {
    return { type: 'engagement', icon: Star };
  }
  
  if (/риск/i.test(reason)) {
    return { type: 'risk', icon: AlertTriangle };
  }
  
  // Default
  return { type: 'behavior', icon: MessageSquare };
};

export function ReasonChip({ 
  reason, 
  type, 
  variant = 'default',
  size = 'sm',
  showIcon = true,
  className = ''
}: ReasonChipProps) {
  const detected = detectReasonType(reason);
  const finalType = type || detected.type || 'behavior';
  const IconComponent = detected.icon;
  
  const styles = typeStyles[finalType];
  const styleClass = styles[variant];
  const sizeClass = sizeStyles[size];
  
  return (
    <Badge 
      variant="outline" 
      className={`
        ${styleClass} 
        ${sizeClass} 
        border 
        inline-flex 
        items-center 
        gap-1 
        font-medium 
        transition-colors
        ${className}
      `}
    >
      {showIcon && (
        <IconComponent className={`${size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} flex-shrink-0`} />
      )}
      <span>{reason}</span>
    </Badge>
  );
}

// Компонент для группы чипов причин
interface ReasonChipGroupProps {
  reasons: string[];
  maxVisible?: number;
  showMoreText?: string;
  showLessText?: string;
  variant?: 'default' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  showIcons?: boolean;
  className?: string;
}

export function ReasonChipGroup({
  reasons,
  maxVisible = 3,
  showMoreText = "ещё",
  showLessText = "скрыть",
  variant = 'default',
  size = 'sm',
  showIcons = true,
  className = ''
}: ReasonChipGroupProps) {
  const [showAll, setShowAll] = React.useState(false);
  
  const visibleReasons = showAll ? reasons : reasons.slice(0, maxVisible);
  const hasMore = reasons.length > maxVisible;
  
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {visibleReasons.map((reason, index) => (
        <ReasonChip
          key={`${reason}-${index}`}
          reason={reason}
          variant={variant}
          size={size}
          showIcon={showIcons}
        />
      ))}
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors ml-1"
        >
          {showAll ? showLessText : `+${reasons.length - maxVisible} ${showMoreText}`}
        </button>
      )}
    </div>
  );
}

// Утилитарные функции
export const groupReasonsByType = (reasons: string[]) => {
  return reasons.reduce((acc, reason) => {
    const { type } = detectReasonType(reason);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(reason);
    return acc;
  }, {} as Record<string, string[]>);
};

export const sortReasonsByPriority = (reasons: string[]) => {
  const priorityOrder: ReasonChipProps['type'][] = ['risk', 'temporal', 'financial', 'behavior', 'engagement', 'preference'];
  
  return [...reasons].sort((a, b) => {
    const typeA = detectReasonType(a).type;
    const typeB = detectReasonType(b).type;
    
    const priorityA = priorityOrder.indexOf(typeA);
    const priorityB = priorityOrder.indexOf(typeB);
    
    return priorityA - priorityB;
  });
};

export const getReasonTypeLabel = (type: ReasonChipProps['type']): string => {
  switch (type) {
    case 'risk': return 'Риски';
    case 'temporal': return 'Временные';
    case 'financial': return 'Финансовые';
    case 'behavior': return 'Поведенческие';
    case 'engagement': return 'Лояльность';
    case 'preference': return 'Предпочтения';
    default: return 'Прочие';
  }
};