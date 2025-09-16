import React from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Mail, 
  Phone, 
  Eye, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  User
} from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";

interface AutopilotLogItemProps {
  log: {
    id: number;
    client: string;
    action: string;
    timestamp: string;
    status: 'delivered' | 'failed' | 'pending' | 'scheduled';
    result?: {
      read?: boolean;
      reply?: boolean;
      booked?: boolean;
      clicked?: boolean;
    };
    channel?: 'telegram' | 'sms' | 'whatsapp' | 'email';
    message?: string;
    nextAction?: string;
    effectiveness?: string;
  };
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
}

const statusStyles = {
  delivered: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Доставлено'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Ошибка'
  },
  pending: {
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: 'В обработке'
  },
  scheduled: {
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Запланировано'
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

const getClientInitials = (clientName: string) => {
  return clientName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function AutopilotLogItem({ 
  log, 
  variant = 'default',
  showActions = true
}: AutopilotLogItemProps) {
  const statusConfig = statusStyles[log.status];
  const StatusIcon = statusConfig.icon;
  const ChannelIcon = log.channel ? channelIcons[log.channel] : MessageSquare;
  const channelStyle = log.channel ? channelColors[log.channel] : 'text-gray-600 bg-gray-50';

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
        <div className={`w-8 h-8 rounded-full ${statusConfig.bg} flex items-center justify-center`}>
          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{log.client}</span>
            {log.channel && (
              <div className={`p-1 rounded ${channelStyle}`}>
                <ChannelIcon className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{log.action}</div>
        </div>
        <div className="text-xs text-muted-foreground">{log.timestamp}</div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="glass-card">
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getClientInitials(log.client)}</AvatarFallback>
              </Avatar>
              <div>
                <h6 className="font-medium">{log.client}</h6>
                <div className="text-sm text-muted-foreground">{log.action}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {log.channel && (
                <Badge variant="outline" className={`text-xs ${channelStyle} border-0`}>
                  <ChannelIcon className="h-3 w-3 mr-1" />
                  {log.channel}
                </Badge>
              )}
              <Badge variant="outline" className={`text-xs ${statusConfig.bg} ${statusConfig.color} border-0`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Message Preview */}
          {log.message && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm line-clamp-2">{log.message}</p>
            </div>
          )}

          {/* Results */}
          {log.result && log.status === 'delivered' && (
            <div className="grid grid-cols-3 gap-4 p-3 bg-muted/20 rounded-lg">
              <div className="text-center">
                <div className={`text-lg font-semibold ${log.result.read ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {log.result.read ? <Eye className="h-5 w-5 mx-auto" /> : <Eye className="h-5 w-5 mx-auto opacity-50" />}
                </div>
                <div className="text-xs text-muted-foreground">Прочитано</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${log.result.reply ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {log.result.reply ? <MessageCircle className="h-5 w-5 mx-auto" /> : <MessageCircle className="h-5 w-5 mx-auto opacity-50" />}
                </div>
                <div className="text-xs text-muted-foreground">Ответил</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${log.result.booked ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {log.result.booked ? <Calendar className="h-5 w-5 mx-auto" /> : <Calendar className="h-5 w-5 mx-auto opacity-50" />}
                </div>
                <div className="text-xs text-muted-foreground">Записался</div>
              </div>
            </div>
          )}

          {/* Next Action */}
          {log.nextAction && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">Следующее действие: {log.nextAction}</span>
            </div>
          )}

          {/* Effectiveness */}
          {log.effectiveness && (
            <div className="text-center">
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                Эффективность: {log.effectiveness}
              </Badge>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground text-center border-t pt-2">
            {log.timestamp}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Повторить
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Написать
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="glass-card hover:shadow-elegant transition-all duration-300">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h6 className="font-medium text-sm">{log.client}</h6>
                </div>
                <div className="text-sm text-muted-foreground">{log.action}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {log.channel && (
                <div className={`p-1 rounded ${channelStyle}`}>
                  <ChannelIcon className="h-3 w-3" />
                </div>
              )}
              <Badge variant="outline" className={`text-xs ${statusConfig.bg} ${statusConfig.color} border-0 ml-1`}>
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Results (if delivered) */}
          {log.result && log.status === 'delivered' && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Eye className={`h-3 w-3 ${log.result.read ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span className={log.result.read ? 'text-green-600' : 'text-muted-foreground'}>
                  {log.result.read ? 'Прочтено' : 'Не прочтено'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className={`h-3 w-3 ${log.result.reply ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span className={log.result.reply ? 'text-green-600' : 'text-muted-foreground'}>
                  {log.result.reply ? 'Ответил' : 'Не ответил'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className={`h-3 w-3 ${log.result.booked ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span className={log.result.booked ? 'text-green-600' : 'text-muted-foreground'}>
                  {log.result.booked ? 'Записался' : 'Не записался'}
                </span>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">{log.timestamp}</span>
            {log.effectiveness && (
              <Badge variant="outline" className="text-xs text-green-600">
                {log.effectiveness}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент для списка логов автопилота
interface AutopilotLogListProps {
  logs: AutopilotLogItemProps['log'][];
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  className?: string;
}

export function AutopilotLogList({
  logs,
  variant = 'default',
  showActions = true,
  className = ''
}: AutopilotLogListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {logs.map((log) => (
        <AutopilotLogItem
          key={log.id}
          log={log}
          variant={variant}
          showActions={showActions}
        />
      ))}
    </div>
  );
}

// Утилитарные функции
export const groupLogsByDate = (logs: AutopilotLogItemProps['log'][]) => {
  return logs.reduce((acc, log) => {
    const date = log.timestamp.includes('час') || log.timestamp.includes('мин') ? 'Сегодня' : 
                 log.timestamp.includes('день') ? 'Вчера' : 'Ранее';
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, AutopilotLogItemProps['log'][]>);
};

export const getLogSuccess = (log: AutopilotLogItemProps['log']) => {
  if (log.status !== 'delivered' || !log.result) return null;
  
  const { read, reply, booked } = log.result;
  if (booked) return 'excellent';
  if (reply) return 'good';
  if (read) return 'fair';
  return 'poor';
};