import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, Zap, Settings, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface LimitNotificationProps {
  type: 'warning' | 'error' | 'info';
  limitType: 'bookings' | 'notifications' | 'sms';
  current: number;
  max: number;
  onUpgrade?: () => void;
  onSettings?: () => void;
  onDismiss?: () => void;
  locale?: 'ru' | 'en';
  autoHide?: boolean;
}

const messages = {
  ru: {
    bookings: {
      warning: 'Вы близки к лимиту 100 записей за 7 дней. Обновите до Pro, чтобы не останавливать записи.',
      error: 'Лимит достигнут. Новые записи временно приостановлены.',
      reached: 'Лимит записей исчерпан'
    },
    notifications: {
      warning: 'Осталось 20% месячной квоты на уведомления в Telegram.',
      error: 'Лимит уведомлений в Telegram исчерпан. Новые сообщения не будут отправлены.',
      reached: 'Лимит уведомлений достигнут'
    },
    sms: {
      warning: 'Баланс для SMS низкий. Пополните кошелёк, чтобы не прерывать доставки.',
      error: 'Отправка SMS не удалась. Попробуйте снова или свяжитесь с поддержкой.',
      reached: 'Низкий баланс SMS'
    },
    actions: {
      upgrade: 'Обновить до Pro',
      topup: 'Пополнить',
      settings: 'Настройки',
      manage: 'Управлять уведомлениями',
      retry: 'Повторить',
      dismiss: 'Скрыть'
    }
  },
  en: {
    bookings: {
      warning: 'You\'re close to the 7-day limit (100 bookings). Upgrade to Pro to keep accepting bookings.',
      error: 'Limit reached. New bookings are temporarily paused.',
      reached: 'Booking limit reached'
    },
    notifications: {
      warning: '20% of your monthly Telegram notifications left.',
      error: 'Telegram notifications limit reached. New messages won\'t be sent.',
      reached: 'Notification limit reached'
    },
    sms: {
      warning: 'Low SMS wallet balance. Top up to avoid delivery stops.',
      error: 'SMS failed. Try again or contact support.',
      reached: 'Low SMS balance'
    },
    actions: {
      upgrade: 'Upgrade to Pro',
      topup: 'Top Up',
      settings: 'Settings',
      manage: 'Manage Notifications',
      retry: 'Retry',
      dismiss: 'Dismiss'
    }
  }
};

export function LimitNotification({
  type,
  limitType,
  current,
  max,
  onUpgrade,
  onSettings,
  onDismiss,
  locale = 'ru',
  autoHide = false
}: LimitNotificationProps) {
  const t = messages[locale];
  const progress = (current / max) * 100;
  
  const getIcon = () => {
    switch (type) {
      case 'error':
        return AlertTriangle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'error':
        return {
          container: 'border-destructive/50 bg-destructive/5',
          icon: 'text-destructive bg-destructive/10',
          progress: 'bg-destructive'
        };
      case 'warning':
        return {
          container: 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20',
          icon: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
          progress: 'bg-amber-500'
        };
      case 'info':
        return {
          container: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20',
          icon: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
          progress: 'bg-blue-500'
        };
      default:
        return {
          container: 'border-border bg-muted/50',
          icon: 'text-muted-foreground bg-muted',
          progress: 'bg-primary'
        };
    }
  };

  const IconComponent = getIcon();
  const colors = getColorClasses();

  const renderActions = () => {
    switch (limitType) {
      case 'bookings':
        return (
          <div className="flex gap-2">
            {onDismiss && type === 'warning' && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                {t.actions.dismiss}
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={onUpgrade}
              className={type === 'error' ? 'bg-destructive hover:bg-destructive/90' : 'elegant-button'}
            >
              {t.actions.upgrade}
            </Button>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onSettings}>
              {t.actions.manage}
            </Button>
            <Button size="sm" onClick={onUpgrade} className="elegant-button">
              {t.actions.upgrade}
            </Button>
          </div>
        );
      
      case 'sms':
        return (
          <div className="flex gap-2">
            {type === 'error' && (
              <Button variant="outline" size="sm" onClick={onSettings}>
                {t.actions.retry}
              </Button>
            )}
            <Button size="sm" onClick={onSettings}>
              {t.actions.topup}
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  React.useEffect(() => {
    if (autoHide && type === 'error') {
      // Auto-show toast for critical errors
      toast.error(t[limitType].error, {
        action: {
          label: t.actions.upgrade,
          onClick: onUpgrade || (() => {})
        }
      });
    }
  }, [autoHide, type, limitType, locale, onUpgrade]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-lg border ${colors.container} space-y-3`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium">
            {t[limitType][type === 'error' ? 'reached' : type]}
          </p>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t[limitType][type]}
          </p>
          
          {/* Progress bar for warnings */}
          {type === 'warning' && limitType !== 'sms' && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{current} / {max}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${colors.progress}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss}
            className="w-8 h-8 p-0 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-end">
        {renderActions()}
      </div>
    </motion.div>
  );
}

// Banner component for persistent warnings
interface LimitBannerProps extends Omit<LimitNotificationProps, 'autoHide'> {
  isVisible: boolean;
}

export function LimitBanner({ isVisible, ...props }: LimitBannerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <LimitNotification {...props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for showing toast notifications
export function useLimitToasts(locale: 'ru' | 'en' = 'ru') {
  const t = messages[locale];
  
  const showBookingWarning = (current: number, max: number, onUpgrade: () => void) => {
    toast.warning(t.bookings.warning, {
      action: {
        label: t.actions.upgrade,
        onClick: onUpgrade
      },
      duration: 8000
    });
  };
  
  const showNotificationWarning = (current: number, max: number, onUpgrade: () => void, onSettings: () => void) => {
    toast.info(t.notifications.warning, {
      action: {
        label: t.actions.upgrade,
        onClick: onUpgrade
      },
      duration: 6000
    });
  };
  
  const showNotificationError = (onUpgrade: () => void, onSettings: () => void) => {
    toast.error(t.notifications.error, {
      action: {
        label: t.actions.upgrade,
        onClick: onUpgrade
      },
      duration: 10000
    });
  };
  
  const showSMSError = (errorCode: string, onRetry: () => void) => {
    toast.error(t.sms.error.replace('{code}', errorCode), {
      action: {
        label: t.actions.retry,
        onClick: onRetry
      },
      duration: 8000
    });
  };

  return {
    showBookingWarning,
    showNotificationWarning,
    showNotificationError,
    showSMSError
  };
}