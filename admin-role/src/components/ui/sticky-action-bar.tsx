import React from "react";
import { Calendar, MessageSquare, StickyNote, Save, X } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

interface StickyActionBarProps {
  onBook?: () => void;
  onMessage?: () => void;
  onCreateTask?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  hasUnsavedChanges?: boolean;
  unsavedMessage?: string;
  primaryActions?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  secondaryActions?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  className?: string;
}

export function StickyActionBar({
  onBook,
  onMessage,
  onCreateTask,
  onSave,
  onCancel,
  hasUnsavedChanges = false,
  unsavedMessage = "Изменения не сохранены",
  primaryActions,
  secondaryActions,
  className = ''
}: StickyActionBarProps) {
  const defaultPrimaryActions = [
    {
      id: 'book',
      label: 'Записать',
      icon: Calendar,
      onClick: onBook || (() => {}),
      variant: 'default' as const
    },
    {
      id: 'message',
      label: 'Написать',
      icon: MessageSquare,
      onClick: onMessage || (() => {}),
      variant: 'outline' as const
    },
    {
      id: 'task',
      label: 'Создать задачу',
      icon: StickyNote,
      onClick: onCreateTask || (() => {}),
      variant: 'outline' as const
    }
  ];

  const actionsToShow = primaryActions || defaultPrimaryActions.filter(action => action.onClick !== (() => {}));

  return (
    <div className={`glass-sticky-bar ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Primary Actions */}
          <div className="flex gap-3">
            {actionsToShow.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
            
            {/* Secondary Actions */}
            {secondaryActions && secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
          
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">{unsavedMessage}</span>
              </div>
              
              <div className="flex gap-2">
                {onCancel && (
                  <Button variant="outline" size="sm" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Отмена
                  </Button>
                )}
                {onSave && (
                  <Button size="sm" onClick={onSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Специализированные варианты sticky bar
interface ClientActionBarProps {
  onBook?: () => void;
  onMessage?: () => void;
  onCall?: () => void;
  onNote?: () => void;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export function ClientActionBar({
  onBook,
  onMessage,
  onCall,
  onNote,
  hasUnsavedChanges,
  onSave,
  onCancel
}: ClientActionBarProps) {
  return (
    <StickyActionBar
      onBook={onBook}
      onMessage={onMessage}
      onCreateTask={onNote}
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}

// Floating Action Button вариант для мобильных
interface FloatingActionBarProps {
  mainAction: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  };
  secondaryActions?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }>;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function FloatingActionBar({
  mainAction,
  secondaryActions = [],
  isOpen = false,
  onToggle
}: FloatingActionBarProps) {
  const MainIcon = mainAction.icon;
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Secondary Actions */}
      {isOpen && secondaryActions.length > 0 && (
        <div className="mb-4 space-y-2">
          {secondaryActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center gap-3 animate-in slide-in-from-right duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Badge variant="secondary" className="px-3 py-1">
                  {action.label}
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={action.onClick}
                  className="h-12 w-12 rounded-full shadow-lg"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Main Action Button */}
      <Button
        onClick={secondaryActions.length > 0 ? onToggle : mainAction.onClick}
        className="h-14 w-14 rounded-full shadow-lg gap-0"
        size="icon"
      >
        <MainIcon className="h-6 w-6" />
      </Button>
    </div>
  );
}

// Компонент для отображения статуса изменений
interface UnsavedChangesIndicatorProps {
  hasChanges: boolean;
  message?: string;
  onSave?: () => void;
  onCancel?: () => void;
  variant?: 'banner' | 'badge' | 'toast';
}

export function UnsavedChangesIndicator({
  hasChanges,
  message = "Есть несохранённые изменения",
  onSave,
  onCancel,
  variant = 'banner'
}: UnsavedChangesIndicatorProps) {
  if (!hasChanges) return null;

  if (variant === 'badge') {
    return (
      <Badge variant="outline" className="gap-2 bg-orange-50 text-orange-700 border-orange-200">
        <div className="w-2 h-2 bg-orange-500 rounded-full" />
        {message}
      </Badge>
    );
  }

  if (variant === 'toast') {
    return (
      <div className="fixed top-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm">{message}</span>
          <div className="flex gap-2 ml-auto">
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                Отмена
              </Button>
            )}
            {onSave && (
              <Button size="sm" onClick={onSave}>
                Сохранить
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm text-orange-800">{message}</span>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Отмена
            </Button>
          )}
          {onSave && (
            <Button size="sm" onClick={onSave}>
              Сохранить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}