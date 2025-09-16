import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, AlertTriangle, Lock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Badge } from './ui/badge';

type PaywallType = 'booking_limit' | 'notification_limit' | 'pro_feature' | 'general';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  type: PaywallType;
  locale?: 'ru' | 'en';
  customTitle?: string;
  customMessage?: string;
}

const paywallContent = {
  ru: {
    booking_limit: {
      title: 'Лимит достигнут',
      message: 'Новые записи временно приостановлены. Подключите Pro, чтобы продолжить без ограничений. Текущие записи сохранятся.',
      subtitle: 'Лимит считается по скользящему окну 7 дней.',
      icon: AlertTriangle,
      color: 'destructive' as const
    },
    notification_limit: {
      title: 'Лимит уведомлений исчерпан',
      message: 'Новые уведомления в Telegram не будут отправлены до начала следующего месяца.',
      subtitle: 'Подключите Pro для увеличения лимита до 10 000 уведомлений в месяц.',
      icon: AlertTriangle,
      color: 'destructive' as const
    },
    pro_feature: {
      title: 'Премиум функция',
      message: 'Эта возможность доступна только в Pro версии. Разблокируйте полный потенциал вашего бизнеса.',
      subtitle: 'Автоматизация, аналитика и AI-инструменты в одном пакете.',
      icon: Crown,
      color: 'default' as const
    },
    general: {
      title: 'Разблокируйте Pro',
      message: 'Получите доступ ко всем возможностям платформы и автоматизируйте свой бизнес.',
      subtitle: 'Без ограничений, отмена в любой момент.',
      icon: Zap,
      color: 'default' as const
    }
  },
  en: {
    booking_limit: {
      title: 'Limit Reached',
      message: 'New bookings are temporarily paused. Upgrade to Pro to continue without limits. Current bookings are preserved.',
      subtitle: 'Limit is calculated on a rolling 7-day window.',
      icon: AlertTriangle,
      color: 'destructive' as const
    },
    notification_limit: {
      title: 'Notification Limit Reached',
      message: 'New Telegram notifications won\'t be sent until the next month starts.',
      subtitle: 'Upgrade to Pro to increase the limit to 10,000 notifications per month.',
      icon: AlertTriangle,
      color: 'destructive' as const
    },
    pro_feature: {
      title: 'Premium Feature',
      message: 'This feature is only available in the Pro version. Unlock your business\'s full potential.',
      subtitle: 'Automation, analytics, and AI tools in one package.',
      icon: Crown,
      color: 'default' as const
    },
    general: {
      title: 'Unlock Pro',
      message: 'Get access to all platform features and automate your business.',
      subtitle: 'No limits, cancel anytime.',
      icon: Zap,
      color: 'default' as const
    }
  }
};

const buttons = {
  ru: {
    upgrade: 'Перейти на Pro',
    upgradeWith: 'Разблокировать с Pro',
    cancel: 'Отмена',
    close: 'Закрыть',
    settings: 'Настройки',
    manage: 'Управлять'
  },
  en: {
    upgrade: 'Upgrade to Pro',
    upgradeWith: 'Unlock with Pro',
    cancel: 'Cancel',
    close: 'Close',
    settings: 'Settings',
    manage: 'Manage'
  }
};

export function PaywallModal({
  isOpen,
  onClose,
  onUpgrade,
  type,
  locale = 'ru',
  customTitle,
  customMessage
}: PaywallModalProps) {
  const content = paywallContent[locale][type];
  const btnTexts = buttons[locale];
  
  const IconComponent = content.icon;
  const isDestructive = content.color === 'destructive';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDestructive 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-primary/10 text-primary'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>
            
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold">
                {customTitle || content.title}
              </h2>
              {type === 'pro_feature' && (
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 dark:from-purple-900 dark:to-blue-900 dark:text-purple-300">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {customMessage || content.message}
            </p>
            
            {content.subtitle && (
              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {type === 'booking_limit' || type === 'pro_feature' ? (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  {btnTexts.cancel}
                </Button>
                <Button
                  onClick={onUpgrade}
                  className={`flex-1 ${
                    isDestructive 
                      ? 'bg-destructive hover:bg-destructive/90' 
                      : 'elegant-button'
                  }`}
                >
                  {btnTexts.upgrade}
                </Button>
              </>
            ) : type === 'notification_limit' ? (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  {btnTexts.settings}
                </Button>
                <Button
                  onClick={onUpgrade}
                  className="flex-1 elegant-button"
                >
                  {btnTexts.upgrade}
                </Button>
              </>
            ) : (
              <Button
                onClick={onUpgrade}
                className="w-full elegant-button"
              >
                {btnTexts.upgradeWith}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Inline Paywall Component for blocked actions
interface InlinePaywallProps {
  message: string;
  actionText?: string;
  onUpgrade: () => void;
  locale?: 'ru' | 'en';
  size?: 'sm' | 'md' | 'lg';
}

export function InlinePaywall({
  message,
  actionText,
  onUpgrade,
  locale = 'ru',
  size = 'md'
}: InlinePaywallProps) {
  const btnTexts = buttons[locale];
  const sizeClasses = {
    sm: 'p-3 text-xs',
    md: 'p-4 text-sm',
    lg: 'p-6 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 text-center space-y-2`}>
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>{message}</span>
      </div>
      
      <Button
        size={size === 'lg' ? 'default' : 'sm'}
        onClick={onUpgrade}
        className="elegant-button"
      >
        {actionText || btnTexts.upgradeWith}
      </Button>
    </div>
  );
}

// Lock Overlay Component for disabled features
interface LockOverlayProps {
  children: React.ReactNode;
  isLocked: boolean;
  onUpgrade: () => void;
  message?: string;
  locale?: 'ru' | 'en';
}

export function LockOverlay({
  children,
  isLocked,
  onUpgrade,
  message,
  locale = 'ru'
}: LockOverlayProps) {
  const btnTexts = buttons[locale];
  const defaultMessage = locale === 'ru' ? 'Доступно в Pro' : 'Available in Pro';

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-2 p-4"
        >
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs text-muted-foreground">
            {message || defaultMessage}
          </p>
          <Button
            size="sm"
            onClick={onUpgrade}
            className="elegant-button text-xs px-3 py-1"
          >
            {btnTexts.upgradeWith}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}