import React, { useState } from 'react';
import { MoreVertical, CheckCircle, Calendar, XCircle, UserX, CheckCheck } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { BookingStatus } from './StatusChip';

export interface BookingAction {
  id: 'confirm' | 'reschedule' | 'cancel' | 'no-show' | 'mark-completed';
  label: string;
  icon: React.ReactNode;
  disabled: boolean;
  tooltip?: string;
}

interface BookingActionsMenuProps {
  bookingId: string;
  status: BookingStatus;
  language: 'ru' | 'en';
  onAction: (action: BookingAction['id'], bookingId: string) => void;
}

export function BookingActionsMenu({
  bookingId,
  status,
  language,
  onAction,
}: BookingActionsMenuProps) {
  const texts = {
    ru: {
      confirm: 'Подтвердить',
      reschedule: 'Перенести',
      cancel: 'Отменить',
      noShow: 'Клиент не пришёл',
      markCompleted: 'Отметить выполненной',
      tooltips: {
        alreadyConfirmed: 'Запись уже подтверждена',
        alreadyCompleted: 'Запись завершена',
        alreadyCancelled: 'Запись отменена',
        cannotReschedule: 'Нельзя перенести завершённую или отменённую запись',
        cannotCancel: 'Нельзя отменить завершённую запись',
        cannotMarkNoShow: 'Доступно только для подтверждённых записей',
        cannotComplete: 'Доступно только для подтверждённых записей',
      },
    },
    en: {
      confirm: 'Confirm',
      reschedule: 'Reschedule',
      cancel: 'Cancel',
      noShow: 'Client did not show',
      markCompleted: 'Mark as completed',
      tooltips: {
        alreadyConfirmed: 'Booking already confirmed',
        alreadyCompleted: 'Booking completed',
        alreadyCancelled: 'Booking cancelled',
        cannotReschedule: 'Cannot reschedule completed or cancelled booking',
        cannotCancel: 'Cannot cancel completed booking',
        cannotMarkNoShow: 'Available only for confirmed bookings',
        cannotComplete: 'Available only for confirmed bookings',
      },
    },
  };

  const t = texts[language];

  // Define action availability based on status
  const getActions = (): BookingAction[] => {
    return [
      {
        id: 'confirm',
        label: t.confirm,
        icon: <CheckCircle className="w-4 h-4" />,
        disabled: status !== 'pending',
        tooltip: status !== 'pending' ? t.tooltips.alreadyConfirmed : undefined,
      },
      {
        id: 'reschedule',
        label: t.reschedule,
        icon: <Calendar className="w-4 h-4" />,
        disabled: status === 'completed' || status === 'cancelled' || status === 'no-show',
        tooltip:
          status === 'completed' || status === 'cancelled' || status === 'no-show'
            ? t.tooltips.cannotReschedule
            : undefined,
      },
      {
        id: 'cancel',
        label: t.cancel,
        icon: <XCircle className="w-4 h-4" />,
        disabled: status === 'completed' || status === 'cancelled' || status === 'no-show',
        tooltip:
          status === 'completed' || status === 'cancelled' || status === 'no-show'
            ? t.tooltips.cannotCancel
            : undefined,
      },
      {
        id: 'no-show',
        label: t.noShow,
        icon: <UserX className="w-4 h-4" />,
        disabled: status !== 'confirmed',
        tooltip: status !== 'confirmed' ? t.tooltips.cannotMarkNoShow : undefined,
      },
      {
        id: 'mark-completed',
        label: t.markCompleted,
        icon: <CheckCheck className="w-4 h-4" />,
        disabled: status !== 'confirmed',
        tooltip: status !== 'confirmed' ? t.tooltips.cannotComplete : undefined,
      },
    ];
  };

  const actions = getActions();

  const handleActionClick = (actionId: BookingAction['id'], disabled: boolean) => {
    if (!disabled) {
      onAction(actionId, bookingId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <TooltipProvider>
          {actions.map((action, index) => (
            <React.Fragment key={action.id}>
              {index === 2 && <DropdownMenuSeparator />}
              {action.disabled && action.tooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DropdownMenuItem
                        disabled={action.disabled}
                        className="cursor-not-allowed opacity-50"
                      >
                        <span className="mr-2">{action.icon}</span>
                        {action.label}
                      </DropdownMenuItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[200px]">
                    <p className="text-xs">{action.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <DropdownMenuItem
                  disabled={action.disabled}
                  onClick={() => handleActionClick(action.id, action.disabled)}
                  className={action.disabled ? 'opacity-50' : ''}
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.label}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          ))}
        </TooltipProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
