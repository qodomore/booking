import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  QrCode, 
  Link, 
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  Copy,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

// codeRef: TelegramHeader.tsx, hooks/useTelegram.tsx
interface ConnectTelegramScreenProps {
  onNext?: () => void;
  onBack?: () => void;
  state?: 'default' | 'success' | 'error' | 'loading';
  locale?: 'ru' | 'en';
}

interface WebhookStatus {
  status: 'connected' | 'error' | 'disabled';
  message: string;
  lastUpdate?: string;
}

const texts = {
  ru: {
    title: 'Подключение Telegram',
    subtitle: 'Настройте интеграцию с Telegram для уведомлений и Mini-App',
    qrTitle: 'QR-код Mini-App',
    qrDescription: 'Клиенты смогут сканировать этот код для записи',
    linkTitle: 'Ссылка на Mini-App',
    linkDescription: 'Отправьте эту ссылку клиентам в Telegram',
    webhookTitle: 'Статус вебхука',
    webhookDescription: 'Подключение для получения уведомлений',
    connected: 'Подключено',
    error: 'Ошибка',
    disabled: 'Отключено',
    checkAgain: 'Проверить снова',
    copyLink: 'Скопировать ссылку',
    openInTelegram: 'Открыть в Telegram',
    instruction: 'Инструкция',
    linkCopied: 'Ссылка скопирована!',
    lastUpdate: 'Обновлено',
    finish: 'Завершить настройку',
    webhookConnected: 'Вебхук успешно подключен',
    webhookError: 'Ошибка подключения вебхука. Проверьте настройки.',
    webhookDisabled: 'Вебхук отключен. Уведомления работать не будут.',
    checkingStatus: 'Проверка статуса...'
  },
  en: {
    title: 'Telegram Connection',
    subtitle: 'Set up Telegram integration for notifications and Mini-App',
    qrTitle: 'Mini-App QR Code',
    qrDescription: 'Clients can scan this code to make appointments',
    linkTitle: 'Mini-App Link',
    linkDescription: 'Send this link to clients in Telegram',
    webhookTitle: 'Webhook Status',
    webhookDescription: 'Connection for receiving notifications',
    connected: 'Connected',
    error: 'Error',
    disabled: 'Disabled',
    checkAgain: 'Check Again',
    copyLink: 'Copy Link',
    openInTelegram: 'Open in Telegram',
    instruction: 'Instructions',
    linkCopied: 'Link copied!',
    lastUpdate: 'Updated',
    finish: 'Complete Setup',
    webhookConnected: 'Webhook successfully connected',
    webhookError: 'Webhook connection error. Check settings.',
    webhookDisabled: 'Webhook disabled. Notifications will not work.',
    checkingStatus: 'Checking status...'
  }
};

export function ConnectTelegramScreen({ 
  onNext, 
  onBack, 
  state = 'default',
  locale = 'ru' 
}: ConnectTelegramScreenProps) {
  const [webhookStatus, setWebhookStatus] = useState<WebhookStatus>({
    status: 'disabled',
    message: '',
    lastUpdate: undefined
  });
  
  const [isChecking, setIsChecking] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const t = texts[locale];

  // Mock Mini-App URL and QR
  const miniAppUrl = 'https://t.me/QodoBookingBot/app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(miniAppUrl)}`;

  useEffect(() => {
    // Check webhook status on mount
    checkWebhookStatus();
  }, []);

  const checkWebhookStatus = async () => {
    setIsChecking(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock different statuses
      const statuses: WebhookStatus[] = [
        {
          status: 'connected',
          message: t.webhookConnected,
          lastUpdate: new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')
        },
        {
          status: 'error',
          message: t.webhookError,
          lastUpdate: new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')
        },
        {
          status: 'disabled',
          message: t.webhookDisabled,
          lastUpdate: undefined
        }
      ];
      
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setWebhookStatus(randomStatus);
      
    } catch (error) {
      setWebhookStatus({
        status: 'error',
        message: t.webhookError,
        lastUpdate: new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')
      });
    } finally {
      setIsChecking(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(miniAppUrl);
      toast.success(t.linkCopied);
    } catch (error) {
      toast.error(locale === 'ru' ? 'Ошибка копирования' : 'Copy error');
    }
  };

  const openInTelegram = () => {
    window.open(miniAppUrl, '_blank');
  };

  const getStatusColor = (status: WebhookStatus['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'error':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'disabled':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: WebhookStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'disabled':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (state === 'success') {
    return (
      <div className="max-w-md mx-auto space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {locale === 'ru' ? 'Telegram подключен!' : 'Telegram Connected!'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ru' 
              ? 'Переходим в рабочую область...' 
              : 'Moving to workspace...'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h1 className="text-2xl font-semibold">{t.title}</h1>
        </div>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* QR Code Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t.qrTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.qrDescription}</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white rounded-lg p-4 border">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Mini-App Link Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t.linkTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.linkDescription}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={copyLink}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              {t.copyLink}
            </Button>
            <Button 
              onClick={openInTelegram}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t.openInTelegram}
            </Button>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <code className="text-xs break-all">{miniAppUrl}</code>
          </div>
        </div>
      </Card>

      {/* Webhook Status Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t.webhookTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.webhookDescription}</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={checkWebhookStatus}
              disabled={isChecking}
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(webhookStatus.status)}>
                {getStatusIcon(webhookStatus.status)}
                <span className="ml-1">
                  {webhookStatus.status === 'connected' && t.connected}
                  {webhookStatus.status === 'error' && t.error}
                  {webhookStatus.status === 'disabled' && t.disabled}
                </span>
              </Badge>
              
              {webhookStatus.lastUpdate && (
                <span className="text-xs text-muted-foreground">
                  {t.lastUpdate}: {webhookStatus.lastUpdate}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {isChecking ? t.checkingStatus : webhookStatus.message}
            </p>
          </div>
        </div>
      </Card>

      {/* Instructions Button */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setShowInstructions(!showInstructions)}
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        {t.instruction}
      </Button>

      {/* Instructions Panel */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-4">
            <div className="space-y-3 text-sm">
              <h4 className="font-medium">
                {locale === 'ru' ? 'Шаги подключения:' : 'Connection steps:'}
              </h4>
              <ol className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 mt-0.5">1</span>
                  {locale === 'ru' 
                    ? 'Откройте Mini-App по ссылке выше'
                    : 'Open Mini-App using the link above'}
                </li>
                <li className="flex gap-2">
                  <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 mt-0.5">2</span>
                  {locale === 'ru' 
                    ? 'Дайте разрешения боту для отправки уведомлений'
                    : 'Grant permissions to the bot for sending notifications'}
                </li>
                <li className="flex gap-2">
                  <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 mt-0.5">3</span>
                  {locale === 'ru' 
                    ? 'Нажмите "Проверить снова" для обновления статуса'
                    : 'Click "Check Again" to update status'}
                </li>
              </ol>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Finish Button */}
      <Button 
        onClick={onNext}
        className="w-full elegant-button h-12"
        disabled={webhookStatus.status === 'error'}
      >
        {t.finish}
      </Button>
    </div>
  );
}