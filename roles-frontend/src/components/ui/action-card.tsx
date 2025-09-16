import React, { useState } from "react";
import { MessageSquare, Mail, Phone, Clock, ChevronDown, ChevronUp, User, TrendingDown } from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Progress } from "./progress";
import { Checkbox } from "./checkbox";

interface ActionCardProps {
  action: {
    id: number;
    client: string;
    lastVisit: string;
    riskLevel: 'low' | 'medium' | 'high';
    reasons: string[];
    recommendation: string;
    effect: string;
    confidence: number;
    channel: 'telegram' | 'sms' | 'whatsapp' | 'email';
    deadline: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onApply?: () => void;
  onSkip?: () => void;
  onWrite?: () => void;
}

const riskStyles = {
  low: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    progress: 'bg-green-500'
  },
  medium: {
    bg: 'bg-orange-50',
    text: 'text-orange-700', 
    border: 'border-orange-200',
    progress: 'bg-orange-500'
  },
  high: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    progress: 'bg-red-500'
  }
};

const channelIcons = {
  telegram: MessageSquare,
  whatsapp: MessageSquare,
  sms: Phone,
  email: Mail
};

const channelColors = {
  telegram: 'text-blue-600 bg-blue-50',
  whatsapp: 'text-green-600 bg-green-50',
  sms: 'text-purple-600 bg-purple-50',
  email: 'text-gray-600 bg-gray-50'
};

const getRiskPercentage = (riskLevel: 'low' | 'medium' | 'high') => {
  switch (riskLevel) {
    case 'low': return 25;
    case 'medium': return 60;
    case 'high': return 85;
  }
};

const getRiskLabel = (riskLevel: 'low' | 'medium' | 'high') => {
  switch (riskLevel) {
    case 'low': return 'Низкий риск';
    case 'medium': return 'Средний риск';
    case 'high': return 'Высокий риск';
  }
};

const getDeadlineUrgency = (deadline: string) => {
  const days = parseInt(deadline.split(' ')[0]);
  if (days <= 1) return 'urgent';
  if (days <= 3) return 'soon';
  return 'normal';
};

export function ActionCard({ 
  action, 
  isSelected = false, 
  onSelect,
  onApply,
  onSkip,
  onWrite
}: ActionCardProps) {
  const [showReasons, setShowReasons] = useState(false);
  const riskStyle = riskStyles[action.riskLevel];
  const ChannelIcon = channelIcons[action.channel];
  const channelStyle = channelColors[action.channel];
  const riskPercentage = getRiskPercentage(action.riskLevel);
  const deadlineUrgency = getDeadlineUrgency(action.deadline);

  return (
    <Card className={`
      glass-card hover:shadow-elegant transition-all duration-300 
      ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      ${riskStyle.border}
    `}>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header with Selection */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {onSelect && (
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={onSelect}
                  className="mt-1"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">{action.client}</h4>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {action.lastVisit}
                </div>
              </div>
            </div>

            {/* Channel Badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${channelStyle}`}>
              <ChannelIcon className="h-3 w-3" />
              <span className="text-xs font-medium capitalize">{action.channel}</span>
            </div>
          </div>

          {/* Risk Level with Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`${riskStyle.bg} ${riskStyle.text} ${riskStyle.border} border`}
              >
                {getRiskLabel(action.riskLevel)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {riskPercentage}% вероятность
              </span>
            </div>
            <Progress 
              value={riskPercentage} 
              className="h-2" 
              style={{ '--progress-bg': riskStyle.progress } as React.CSSProperties}
            />
          </div>

          {/* Recommendation */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm">{action.recommendation}</h5>
            <p className="text-sm text-muted-foreground">
              Персонализированное предложение для возврата клиента с учетом его предпочтений и истории покупок.
            </p>
          </div>

          {/* Reasons */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReasons(!showReasons)}
              className="h-auto p-0 text-xs text-primary hover:no-underline gap-1"
            >
              Показать причины
              {showReasons ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            
            {showReasons && (
              <div className="flex flex-wrap gap-1">
                {action.reasons.map((reason, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Effect & Confidence */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">{action.effect}</div>
              <div className="text-xs text-muted-foreground">Ожидаемый эффект</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${
                action.confidence >= 85 ? 'text-green-600' : 
                action.confidence >= 70 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {action.confidence}%
              </div>
              <div className="text-xs text-muted-foreground">Уверенность</div>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${
              deadlineUrgency === 'urgent' ? 'text-red-500' :
              deadlineUrgency === 'soon' ? 'text-orange-500' : 'text-green-500'
            }`} />
            <span className="text-sm">
              Выполнить до: <strong>{action.deadline}</strong>
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={onApply}
              className="flex-1"
              size="sm"
            >
              Применить
            </Button>
            <Button 
              variant="outline" 
              onClick={onWrite}
              size="sm"
            >
              Написать
            </Button>
            <Button 
              variant="ghost" 
              onClick={onSkip}
              size="sm"
            >
              Пропустить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент для отображения группы карточек
interface ActionCardGridProps {
  actions: ActionCardProps['action'][];
  selectedActions?: number[];
  onSelectAction?: (actionId: number) => void;
  onApplyAction?: (actionId: number) => void;
  onSkipAction?: (actionId: number) => void;
  onWriteAction?: (actionId: number) => void;
  className?: string;
}

export function ActionCardGrid({
  actions,
  selectedActions = [],
  onSelectAction,
  onApplyAction,
  onSkipAction,
  onWriteAction,
  className = ''
}: ActionCardGridProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {actions.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          isSelected={selectedActions.includes(action.id)}
          onSelect={() => onSelectAction?.(action.id)}
          onApply={() => onApplyAction?.(action.id)}
          onSkip={() => onSkipAction?.(action.id)}
          onWrite={() => onWriteAction?.(action.id)}
        />
      ))}
    </div>
  );
}