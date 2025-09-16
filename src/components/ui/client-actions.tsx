import React from "react";
import { Calendar, MessageSquare, Phone, StickyNote, Plus } from "lucide-react";
import { Button } from "./button";

interface ClientActionsProps {
  onBook?: () => void;
  onMessage?: () => void;
  onCall?: () => void;
  onNote?: () => void;
  onCustomAction?: (action: string) => void;
  customActions?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  }>;
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
}

export function ClientActions({
  onBook,
  onMessage,
  onCall,
  onNote,
  onCustomAction,
  customActions = [],
  layout = 'horizontal',
  className = ''
}: ClientActionsProps) {
  const defaultActions = [
    {
      id: 'book',
      label: 'Записать',
      icon: Calendar,
      onClick: onBook,
      variant: 'default' as const
    },
    {
      id: 'message',
      label: 'Написать',
      icon: MessageSquare,
      onClick: onMessage,
      variant: 'outline' as const
    },
    {
      id: 'call',
      label: 'Позвонить',
      icon: Phone,
      onClick: onCall,
      variant: 'outline' as const
    },
    {
      id: 'note',
      label: 'Заметка',
      icon: StickyNote,
      onClick: onNote,
      variant: 'outline' as const
    }
  ];

  const allActions = [...defaultActions, ...customActions.map(action => ({
    ...action,
    onClick: () => onCustomAction?.(action.id),
    variant: action.variant || 'outline' as const
  }))];

  const getLayoutClass = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-2';
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-4 gap-2';
      case 'horizontal':
      default:
        return 'flex flex-wrap gap-2';
    }
  };

  return (
    <div className={`${getLayoutClass()} ${className}`}>
      {allActions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.onClick}
            className="gap-2"
            size={layout === 'grid' ? 'sm' : 'default'}
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

// Специализированный компонент для быстрых действий
export function QuickActions({ onBook, onMessage, onCall, onNote }: ClientActionsProps) {
  return (
    <ClientActions
      onBook={onBook}
      onMessage={onMessage}
      onCall={onCall}
      onNote={onNote}
      layout="horizontal"
      className="pt-4 border-t"
    />
  );
}

// Компонент для основных действий в sticky bar
export function PrimaryActions({ onBook, onMessage }: ClientActionsProps) {
  return (
    <div className="flex gap-3">
      <Button onClick={onBook} className="gap-2">
        <Calendar className="h-4 w-4" />
        Записать
      </Button>
      <Button variant="outline" onClick={onMessage} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        Написать
      </Button>
    </div>
  );
}

// Компонент для дополнительных действий
export function SecondaryActions({ 
  onNote, 
  onCustomAction,
  customActions = []
}: ClientActionsProps) {
  const actions = [
    {
      id: 'task',
      label: 'Создать задачу',
      icon: StickyNote,
      variant: 'outline' as const
    },
    ...customActions
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant={action.variant || 'outline'}
            onClick={() => onCustomAction?.(action.id)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}