import React from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  } | React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <Card className={`clean-card ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm leading-relaxed">
          {description}
        </p>
        
        {action && (
          typeof action === 'object' && 'label' in action ? (
            <Button onClick={action.onClick} className="elegant-button">
              {action.label}
            </Button>
          ) : (
            action
          )
        )}
      </CardContent>
    </Card>
  );
}

// Specialized empty states
interface ServiceEmptyStateProps {
  onAddService?: () => void;
}

export function ServiceEmptyState({ onAddService }: ServiceEmptyStateProps) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
          <path d="M15 6.5V7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-.5" />
          <path d="M15 17.5V17a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v.5" />
        </svg>
      )}
      title="Нет услуг"
      description="Добавьте первую услугу, чтобы клиенты могли записаться к вам"
      action={onAddService ? {
        label: "Добавить услугу",
        onClick: onAddService
      } : undefined}
    />
  );
}

interface BookingEmptyStateProps {
  onCreateBooking?: () => void;
}

export function BookingEmptyState({ onCreateBooking }: BookingEmptyStateProps) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )}
      title="На выбранную дату записей нет"
      description="Создайте новую запись или выберите другую дату"
      action={onCreateBooking ? {
        label: "Создать запись",
        onClick: onCreateBooking
      } : undefined}
    />
  );
}

interface ClientEmptyStateProps {
  onAddClient?: () => void;
}

export function ClientEmptyState({ onAddClient }: ClientEmptyStateProps) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
      title="Клиенты не найдены"
      description="Попробуйте изменить критерии поиска или добавьте нового клиента"
      action={onAddClient ? {
        label: "Добавить клиента",
        onClick: onAddClient
      } : undefined}
    />
  );
}

interface MasterEmptyStateProps {
  onAddMaster?: () => void;
}

export function MasterEmptyState({ onAddMaster }: MasterEmptyStateProps) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )}
      title="Нет доступных мастеров"
      description="Добавьте специалистов в разделе управления ресурсами"
      action={onAddMaster ? {
        label: "Добавить мастера",
        onClick: onAddMaster
      } : undefined}
    />
  );
}

interface SearchEmptyStateProps {
  query: string;
  onClearSearch?: () => void;
}

export function SearchEmptyState({ query, onClearSearch }: SearchEmptyStateProps) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      )}
      title="Ничего не найдено"
      description={`По запросу "${query}" результатов не найдено. Попробуйте изменить поисковый запрос.`}
      action={onClearSearch ? {
        label: "Очистить поиск",
        onClick: onClearSearch
      } : undefined}
    />
  );
}

interface TodayFullEmptyStateProps {
  nextAvailable?: string;
}

export function TodayFullEmptyState({ nextAvailable }: TodayFullEmptyStateProps) {
  return (
    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
          <svg className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-amber-800 dark:text-amber-200">Сегодня всё занято</p>
          {nextAvailable && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Ближайшее свободное время: {nextAvailable}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}