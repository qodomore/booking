import React, { useState } from "react";
import { MessageSquare, Mail, Phone, MoreHorizontal, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Checkbox } from "./checkbox";

interface ActionTableRowProps {
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
  onSchedule?: () => void;
  onWrite?: () => void;
}

const riskStyles = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-orange-50 text-orange-700 border-orange-200', 
  high: 'bg-red-50 text-red-700 border-red-200'
};

const channelIcons = {
  telegram: MessageSquare,
  whatsapp: MessageSquare,
  sms: Phone,
  email: Mail
};

const channelColors = {
  telegram: 'text-blue-600',
  whatsapp: 'text-green-600',
  sms: 'text-purple-600',
  email: 'text-gray-600'
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 85) return 'text-green-600';
  if (confidence >= 70) return 'text-orange-600';
  return 'text-red-600';
};

const getDeadlineIcon = (deadline: string) => {
  const days = parseInt(deadline.split(' ')[0]);
  if (days <= 1) return AlertTriangle;
  if (days <= 3) return Clock;
  return CheckCircle;
};

const getDeadlineColor = (deadline: string) => {
  const days = parseInt(deadline.split(' ')[0]);
  if (days <= 1) return 'text-red-500';
  if (days <= 3) return 'text-orange-500';
  return 'text-green-500';
};

export function ActionTableRow({ 
  action, 
  isSelected = false, 
  onSelect,
  onApply,
  onSkip,
  onSchedule,
  onWrite
}: ActionTableRowProps) {
  const [showReasons, setShowReasons] = useState(false);
  const ChannelIcon = channelIcons[action.channel];
  const channelColor = channelColors[action.channel];
  const DeadlineIcon = getDeadlineIcon(action.deadline);
  const deadlineColor = getDeadlineColor(action.deadline);

  return (
    <tr 
      className={`border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
      onClick={() => onSelect?.()}
    >
      {/* Checkbox */}
      <td className="p-3">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </td>

      {/* Client */}
      <td className="p-3">
        <div>
          <div className="font-medium text-sm">{action.client}</div>
          <div className="text-xs text-muted-foreground">{action.lastVisit}</div>
        </div>
      </td>

      {/* Risk Reasons */}
      <td className="p-3">
        <div className="space-y-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${riskStyles[action.riskLevel]} border`}
          >
            {action.riskLevel === 'high' ? 'Высокий риск' : 
             action.riskLevel === 'medium' ? 'Средний риск' : 'Низкий риск'}
          </Badge>
          
          <div className="space-y-1">
            {(showReasons ? action.reasons : action.reasons.slice(0, 2)).map((reason, index) => (
              <Badge key={index} variant="secondary" className="text-xs mr-1">
                {reason}
              </Badge>
            ))}
            {action.reasons.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReasons(!showReasons)}
                className="h-auto p-0 text-xs text-primary hover:no-underline"
              >
                {showReasons ? 'Скрыть' : `+${action.reasons.length - 2} ещё`}
              </Button>
            )}
          </div>
        </div>
      </td>

      {/* Recommendation */}
      <td className="p-3">
        <div className="font-medium text-sm">{action.recommendation}</div>
      </td>

      {/* Effect */}
      <td className="p-3">
        <div className="font-medium text-sm text-primary">{action.effect}</div>
      </td>

      {/* Confidence */}
      <td className="p-3">
        <div className={`font-medium text-sm ${getConfidenceColor(action.confidence)}`}>
          {action.confidence}%
        </div>
      </td>

      {/* Channel */}
      <td className="p-3">
        <div className="flex items-center gap-1">
          <ChannelIcon className={`h-4 w-4 ${channelColor}`} />
          <span className="text-xs capitalize">{action.channel}</span>
        </div>
      </td>

      {/* Deadline */}
      <td className="p-3">
        <div className="flex items-center gap-1">
          <DeadlineIcon className={`h-4 w-4 ${deadlineColor}`} />
          <span className="text-xs">{action.deadline}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="p-3">
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
            className="h-8 px-3 text-xs"
          >
            Применить
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSchedule}>
                <Clock className="h-4 w-4 mr-2" />
                Запланировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onWrite}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Написать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSkip}>
                Пропустить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

// Компонент заголовка таблицы
export function ActionTableHeader({ 
  selectedCount = 0,
  totalCount = 0,
  onSelectAll,
  isAllSelected = false,
  isPartiallySelected = false
}: {
  selectedCount?: number;
  totalCount?: number;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  isPartiallySelected?: boolean;
}) {
  return (
    <thead className="border-b bg-muted/30">
      <tr className="text-left">
        <th className="p-3 text-xs font-medium text-muted-foreground">
          <Checkbox 
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isPartiallySelected;
            }}
            onCheckedChange={onSelectAll}
          />
        </th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Клиент</th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Причина риска</th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Рекомендация</th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Эффект</th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Уверенность</th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Канал</th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Дедлайн</th>
        <th className="p-3 text-xs font-medium text-muted-foreground">Действия</th>
      </tr>
      {selectedCount > 0 && (
        <tr>
          <td colSpan={9} className="p-2 bg-primary/5 border-b">
            <div className="text-xs text-primary">
              Выбрано: {selectedCount} из {totalCount}
            </div>
          </td>
        </tr>
      )}
    </thead>
  );
}