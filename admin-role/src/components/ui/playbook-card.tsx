import React from "react";
import { Play, TrendingUp, Target, Clock, Users, AlertCircle } from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Progress } from "./progress";

interface PlaybookCardProps {
  playbook: {
    id: number;
    title: string;
    trigger: string;
    effectiveness: string;
    description?: string;
    usageCount?: number;
    lastUsed?: string;
    category?: string;
    isActive?: boolean;
  };
  onUse?: (playbookId: number) => void;
  onEdit?: (playbookId: number) => void;
  onClick?: (playbookId: number) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
}

const getEffectivenessColor = (effectiveness: string) => {
  const percent = parseInt(effectiveness.replace('%', ''));
  if (percent >= 85) return 'text-green-600 bg-green-50';
  if (percent >= 70) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

const getEffectivenessValue = (effectiveness: string) => {
  return parseInt(effectiveness.replace('%', ''));
};

export function PlaybookCard({ 
  playbook, 
  onUse,
  onEdit,
  onClick,
  variant = 'default',
  showActions = true
}: PlaybookCardProps) {
  const effectivenessColor = getEffectivenessColor(playbook.effectiveness);
  const effectivenessValue = getEffectivenessValue(playbook.effectiveness);

  if (variant === 'compact') {
    return (
      <Card className="glass-card hover:shadow-elegant transition-all duration-300 cursor-pointer group">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h6 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {playbook.title}
              </h6>
              <p className="text-xs text-muted-foreground truncate">
                {playbook.trigger}
              </p>
            </div>
            <Badge variant="outline" className={`text-xs ml-2 ${effectivenessColor} border-0`}>
              {playbook.effectiveness}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="glass-card hover:shadow-elegant transition-all duration-300">
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <h5 className="font-medium">{playbook.title}</h5>
              </div>
              {playbook.category && (
                <Badge variant="secondary" className="text-xs mb-2">
                  {playbook.category}
                </Badge>
              )}
            </div>
            {playbook.isActive !== false && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Активен" />
            )}
          </div>

          {/* Description */}
          {playbook.description && (
            <p className="text-sm text-muted-foreground">
              {playbook.description}
            </p>
          )}

          {/* Trigger */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Триггер:</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {playbook.trigger}
            </Badge>
          </div>

          {/* Effectiveness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Эффективность</span>
              <span className={`text-sm font-semibold ${effectivenessColor.split(' ')[0]}`}>
                {playbook.effectiveness}
              </span>
            </div>
            <Progress value={effectivenessValue} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            {playbook.usageCount && (
              <div>
                <div className="text-sm font-semibold">{playbook.usageCount}</div>
                <div className="text-xs text-muted-foreground">Использований</div>
              </div>
            )}
            {playbook.lastUsed && (
              <div>
                <div className="text-sm font-semibold">{playbook.lastUsed}</div>
                <div className="text-xs text-muted-foreground">Последний раз</div>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                onClick={() => onUse?.(playbook.id)}
                className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90"
              >
                <Play className="h-3 w-3" />
                Использовать
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit?.(playbook.id)}
              >
                Настроить
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="glass-card hover:shadow-elegant transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h6 
                className="font-medium text-sm group-hover:text-primary transition-colors cursor-pointer"
                onClick={() => onClick?.(playbook.id)}
              >
                {playbook.title}
              </h6>
              <p className="text-xs text-muted-foreground mt-1">
                {playbook.trigger}
              </p>
            </div>
            <Badge variant="outline" className={`text-xs ${effectivenessColor} border-0 flex-shrink-0 ml-2`}>
              {playbook.effectiveness}
            </Badge>
          </div>

          {/* Effectiveness Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Эффективность</span>
            </div>
            <Progress value={effectivenessValue} className="h-1.5" />
          </div>

          {/* Usage Stats */}
          {playbook.usageCount && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{playbook.usageCount} использований</span>
              </div>
              {playbook.lastUsed && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{playbook.lastUsed}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {showActions && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onUse?.(playbook.id)}
              className="w-full gap-2 playbook-use-button"
              style={{
                '--hover-bg': 'var(--primary)',
                '--hover-color': '#ffffff'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'var(--primary)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  (icon as HTMLElement).style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground)';
                e.currentTarget.style.borderColor = 'var(--border)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  (icon as HTMLElement).style.color = 'var(--foreground)';
                }
              }}
            >
              <Play className="h-3 w-3" />
              Использовать
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент для списка плейбуков
interface PlaybookListProps {
  playbooks: PlaybookCardProps['playbook'][];
  onUsePlaybook?: (playbookId: number) => void;
  onEditPlaybook?: (playbookId: number) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function PlaybookList({
  playbooks,
  onUsePlaybook,
  onEditPlaybook,
  variant = 'default',
  className = ''
}: PlaybookListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {playbooks.map((playbook) => (
        <PlaybookCard
          key={playbook.id}
          playbook={playbook}
          onUse={onUsePlaybook}
          onEdit={onEditPlaybook}
          variant={variant}
        />
      ))}
    </div>
  );
}

// Утилитарные функции
export const categorizePlaybooks = (playbooks: PlaybookCardProps['playbook'][]) => {
  const categories = playbooks.reduce((acc, playbook) => {
    const category = playbook.category || 'Общие';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(playbook);
    return acc;
  }, {} as Record<string, PlaybookCardProps['playbook'][]>);

  return categories;
};

export const sortPlaybooksByEffectiveness = (playbooks: PlaybookCardProps['playbook'][]) => {
  return [...playbooks].sort((a, b) => {
    const aEff = parseInt(a.effectiveness.replace('%', ''));
    const bEff = parseInt(b.effectiveness.replace('%', ''));
    return bEff - aEff;
  });
};