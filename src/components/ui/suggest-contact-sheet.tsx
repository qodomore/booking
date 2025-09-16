import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import { Send, Phone, Copy, Check, Calendar, Clock, User } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface SuggestContactSheetProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'ru' | 'en';
  clientName?: string;
  service?: {
    name: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    resources: string[];
  };
  onSendTelegram?: () => void;
  onCall?: () => void;
  onCopyText?: () => void;
}

const translations = {
  ru: {
    title: 'Предложить клиенту',
    subtitle: 'Выберите способ связи с клиентом',
    sendTelegram: 'Отправить в Telegram',
    telegramHint: 'Отправим в Telegram личным сообщением',
    call: 'Позвонить',
    copyText: 'Скопировать текст',
    messagePreview: 'Предпросмотр сообщения',
    templateMessage: 'Привет, {clientName}! 👋\n\nРекомендую записаться на {service} на {date} в {time}.\n\n📅 Длительность: {duration} мин\n👤 Мастер: {resources}\n💰 Цена: ₽{price}\n\nПодтвердите запись или выберите другое время.',
    messageCopied: 'Текст скопирован',
    telegramSent: 'Предложение отправлено',
    close: 'Закрыть'
  },
  en: {
    title: 'Suggest to client',
    subtitle: 'Choose how to contact the client',
    sendTelegram: 'Send via Telegram',
    telegramHint: 'Send via Telegram DM',
    call: 'Call',
    copyText: 'Copy text',
    messagePreview: 'Message preview',
    templateMessage: 'Hello, {clientName}! 👋\n\nI recommend booking {service} on {date} at {time}.\n\n📅 Duration: {duration} min\n👤 Master: {resources}\n💰 Price: ${price}\n\nConfirm the appointment or choose another time.',
    messageCopied: 'Text copied',
    telegramSent: 'Suggestion sent',
    close: 'Close'
  }
};

export function SuggestContactSheet({
  isOpen,
  onClose,
  locale = 'ru',
  clientName = 'Анна',
  service = {
    name: 'Стрижка',
    date: 'завтра',
    time: '14:00',
    duration: 60,
    price: 2500,
    resources: ['Анна Иванова']
  },
  onSendTelegram,
  onCall,
  onCopyText
}: SuggestContactSheetProps) {
  const t = translations[locale];
  const [copiedText, setCopiedText] = useState(false);

  const messageTemplate = t.templateMessage
    .replace('{clientName}', clientName)
    .replace('{service}', service.name)
    .replace('{date}', service.date)
    .replace('{time}', service.time)
    .replace('{duration}', service.duration.toString())
    .replace('{resources}', service.resources.join(', '))
    .replace('{price}', service.price.toLocaleString());

  const handleSendTelegram = () => {
    toast.success(t.telegramSent);
    onSendTelegram?.();
    onClose();
  };

  const handleCall = () => {
    onCall?.();
    onClose();
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageTemplate);
      setCopiedText(true);
      toast.success(t.messageCopied);
      setTimeout(() => setCopiedText(false), 2000);
      onCopyText?.();
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="px-4 pb-8">
        <SheetHeader className="text-left space-y-3">
          <SheetTitle className="text-lg font-medium">{t.title}</SheetTitle>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Options */}
          <div className="space-y-3">
            {/* Telegram Option */}
            <Button
              variant="outline"
              onClick={handleSendTelegram}
              className="w-full justify-start h-auto p-4 space-y-2"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">{t.sendTelegram}</p>
                  <p className="text-xs text-muted-foreground">{t.telegramHint}</p>
                </div>
              </div>
            </Button>

            {/* Phone Option */}
            <Button
              variant="outline"
              onClick={handleCall}
              className="w-full justify-start h-auto p-4"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">{t.call}</p>
                </div>
              </div>
            </Button>

            {/* Copy Text Option */}
            <Button
              variant="outline"
              onClick={handleCopyText}
              className="w-full justify-start h-auto p-4"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {copiedText ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">{t.copyText}</p>
                </div>
              </div>
            </Button>
          </div>

          <Separator />

          {/* Message Preview */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t.messagePreview}</h4>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              {/* Service Info Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1.5" />
                  {service.name}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {service.duration} мин
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <User className="w-3 h-3 mr-1.5" />
                  {service.resources[0]}
                </Badge>
              </div>

              {/* Message Text */}
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {messageTemplate}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}