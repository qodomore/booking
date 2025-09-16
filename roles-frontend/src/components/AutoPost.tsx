import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, Settings, Check, Loader2, MessageSquare, Lock, Zap, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface AutoPostProps {
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro';
  quotaLeft?: number;
  isAdmin?: boolean;
}

const DAYS = [
  { id: 'mon', ru: 'Пн', en: 'Mon' },
  { id: 'tue', ru: 'Вт', en: 'Tue' },
  { id: 'wed', ru: 'Ср', en: 'Wed' },
  { id: 'thu', ru: 'Чт', en: 'Thu' },
  { id: 'fri', ru: 'Пт', en: 'Fri' },
  { id: 'sat', ru: 'Сб', en: 'Sat' },
  { id: 'sun', ru: 'Вс', en: 'Sun' },
];

const TIME_OPTIONS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export function AutoPost({ locale = 'ru', plan = 'free', quotaLeft = 30, isAdmin = true }: AutoPostProps) {
  const [autoPostEnabled, setAutoPostEnabled] = useState(false);
  const [postTime, setPostTime] = useState('10:00');
  const [postDays, setPostDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri']);
  const [channelLinked, setChannelLinked] = useState(false);
  const [isConnectChannelOpen, setIsConnectChannelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Text content
  const text = {
    ru: {
      title: 'Автопост свободных слотов',
      subtitle: 'Автоматическая публикация доступных времён записи',
      enable: 'Публиковать свободные слоты сегодня',
      postTime: 'Время публикации',
      postDays: 'Дни публикации',
      channelStatus: 'Канал',
      connected: 'Подключено',
      notConnected: 'Не подключено',
      connectChannel: 'Подключить канал',
      messagePreview: 'Предпросмотр сообщения',
      sendTest: 'Отправить тест',
      quotaLeft: 'Осталось уведомлений в мес',
      connectTelegram: 'Подключить Telegram',
      connectInstructions: 'Для автопостинга необходимо подключить Telegram-канал',
      instructions: [
        'Создайте канал в Telegram',
        'Добавьте бота @YourBot как администратора',
        'Скопируйте ID канала в поле ниже'
      ],
      channelId: 'ID канала',
      channelIdPlaceholder: '@your_channel или -100123456789',
      connect: 'Подключить',
      proFeature: 'Доступно в Pro',
      unlockPro: 'Разблокировать Pro',
      proDescription: 'Автоматическая публикация свободных слотов в Telegram увеличивает заполняемость на 25%',
      saving: 'Сохранение...',
      saved: 'Сохранено',
      testSent: 'Тестовое сообщение отправлено!',
      enableFirst: 'Сначала включите автопост',
      connectFirst: 'Сначала подключите канал'
    },
    en: {
      title: 'Auto-post free slots',
      subtitle: 'Automatic posting of available booking times',
      enable: 'Post free slots today',
      postTime: 'Post time',
      postDays: 'Post days',
      channelStatus: 'Channel',
      connected: 'Connected',
      notConnected: 'Not connected',
      connectChannel: 'Connect channel',
      messagePreview: 'Message preview',
      sendTest: 'Send test',
      quotaLeft: 'Notifications left this month',
      connectTelegram: 'Connect Telegram',
      connectInstructions: 'Connect Telegram channel for auto-posting',
      instructions: [
        'Create a channel in Telegram',
        'Add @YourBot as administrator',
        'Copy channel ID to the field below'
      ],
      channelId: 'Channel ID',
      channelIdPlaceholder: '@your_channel or -100123456789',
      connect: 'Connect',
      proFeature: 'Available in Pro',
      unlockPro: 'Unlock Pro',
      proDescription: 'Automatic posting of free slots to Telegram increases booking rate by 25%',
      saving: 'Saving...',
      saved: 'Saved',
      testSent: 'Test message sent!',
      enableFirst: 'Enable auto-post first',
      connectFirst: 'Connect channel first'
    }
  };

  const t = text[locale];

  // Auto-save when settings change
  useEffect(() => {
    if (saveStatus === 'idle') return;
    
    const saveTimer = setTimeout(() => {
      setIsSaving(true);
      setSaveStatus('saving');
      
      // Simulate API call
      setTimeout(() => {
        setIsSaving(false);
        setSaveStatus('saved');
        
        // Reset status after showing "saved"
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      }, 1000);
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [autoPostEnabled, postTime, postDays]);

  const handleToggleChange = (enabled: boolean) => {
    if (enabled && !channelLinked && plan === 'pro') {
      setIsConnectChannelOpen(true);
      return;
    }
    
    setAutoPostEnabled(enabled);
    if (enabled || postTime || postDays.length > 0) {
      setSaveStatus('saving');
    }
  };

  const handleDayToggle = (dayId: string) => {
    const newDays = postDays.includes(dayId)
      ? postDays.filter(d => d !== dayId)
      : [...postDays, dayId];
    
    setPostDays(newDays);
    setSaveStatus('saving');
  };

  const handleTimeChange = (time: string) => {
    setPostTime(time);
    setSaveStatus('saving');
  };

  const handleConnectChannel = () => {
    // Simulate connection
    setChannelLinked(true);
    setIsConnectChannelOpen(false);
    toast.success(locale === 'ru' ? 'Канал успешно подключён!' : 'Channel connected successfully!');
  };

  const handleSendTest = () => {
    if (!autoPostEnabled) {
      toast.error(t.enableFirst);
      return;
    }
    
    if (!channelLinked) {
      toast.error(t.connectFirst);
      return;
    }
    
    toast.success(t.testSent);
  };

  const generateSampleMessage = () => {
    const now = new Date();
    const times = ['14:00', '15:30', '17:00'];
    
    if (locale === 'ru') {
      return `🕐 Свободные слоты на сегодня (${now.getDate()}.${(now.getMonth() + 1).toString().padStart(2, '0')}):

✨ Маникюр: ${times[0]}, ${times[2]}
💅 Педикюр: ${times[1]}
💇‍♀️ Стрижка: ${times[0]}

📞 Записаться: +7 (999) 123-45-67
💬 Написать в WhatsApp: wa.me/79991234567

#свободныеслоты #запись #маникюр`;
    } else {
      return `🕐 Available slots today (${now.getDate()}.${(now.getMonth() + 1).toString().padStart(2, '0')}):

✨ Manicure: ${times[0]}, ${times[2]}
💅 Pedicure: ${times[1]}
💇‍♀️ Haircut: ${times[0]}

📞 Book: +7 (999) 123-45-67
💬 WhatsApp: wa.me/79991234567

#freeslots #booking #manicure`;
    }
  };

  const isLocked = !isAdmin || plan !== 'pro';

  return (
    <>
      <Card className={isLocked ? 'relative' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t.title}
            {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            {saveStatus === 'saved' && <Check className="w-4 h-4 text-green-500" />}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isLocked ? (
            <>
              {/* Enable Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.enable}</div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'ru' 
                      ? 'Автоматически публиковать доступные времена в канале'
                      : 'Automatically post available times to channel'
                    }
                  </div>
                </div>
                <Switch
                  checked={autoPostEnabled}
                  onCheckedChange={handleToggleChange}
                />
              </div>

              <Separator />

              {/* Time Picker */}
              <div className="space-y-3">
                <div className="font-medium">{t.postTime}</div>
                <Select value={postTime} onValueChange={handleTimeChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map(time => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Days Chips */}
              <div className="space-y-3">
                <div className="font-medium">{t.postDays}</div>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <Button
                      key={day.id}
                      variant={postDays.includes(day.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleDayToggle(day.id)}
                      className="w-12 h-8"
                    >
                      {day[locale]}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Channel Status */}
              <div className="space-y-3">
                <div className="font-medium">{t.channelStatus}</div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">
                      {channelLinked ? 'Telegram @salon_channel' : t.notConnected}
                    </span>
                    <Badge variant={channelLinked ? 'default' : 'secondary'}>
                      {channelLinked ? t.connected : t.notConnected}
                    </Badge>
                  </div>
                  {!channelLinked && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsConnectChannelOpen(true)}
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      {t.connectChannel}
                    </Button>
                  )}
                </div>
              </div>

              {/* Message Preview */}
              <div className="space-y-3">
                <div className="font-medium">{t.messagePreview}</div>
                <div className="p-3 border rounded-lg bg-muted/30">
                  <pre className="text-sm whitespace-pre-wrap font-sans text-muted-foreground">
                    {generateSampleMessage()}
                  </pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendTest}
                  disabled={!autoPostEnabled || !channelLinked}
                >
                  <Send className="w-3 h-3 mr-2" />
                  {t.sendTest}
                </Button>
              </div>

              {/* Quota Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.quotaLeft}</div>
                  <span className="text-sm text-muted-foreground">{quotaLeft}</span>
                </div>
                <Progress value={(quotaLeft / 100) * 100} className="h-2" />
              </div>
            </>
          ) : (
            /* Locked State */
            <div className="relative">
              {/* Blurred preview */}
              <div className="filter blur-sm pointer-events-none space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.enable}</div>
                    <div className="text-sm text-muted-foreground">
                      {locale === 'ru' 
                        ? 'Автоматически публиковать доступные времена в канале'
                        : 'Automatically post available times to channel'
                      }
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-3">
                  <div className="font-medium">{t.postTime}</div>
                  <div className="w-32 h-10 bg-muted rounded-md" />
                </div>

                <div className="space-y-3">
                  <div className="font-medium">{t.postDays}</div>
                  <div className="flex gap-2">
                    {DAYS.slice(0, 5).map(day => (
                      <div key={day.id} className="w-12 h-8 bg-muted rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center space-y-4">
                <Lock className="w-12 h-12 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">{t.proFeature}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t.proDescription}
                  </p>
                </div>
                <Button className="elegant-button">
                  <Zap className="w-4 h-4 mr-2" />
                  {t.unlockPro}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connect Channel Bottom Sheet */}
      <Sheet open={isConnectChannelOpen} onOpenChange={setIsConnectChannelOpen}>
        <SheetContent side="bottom" className="max-h-[80vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t.connectTelegram}
            </SheetTitle>
            <SheetDescription>
              {t.connectInstructions}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            <div className="space-y-4">
              <h4 className="font-medium">
                {locale === 'ru' ? 'Инструкция:' : 'Instructions:'}
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {t.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <label className="font-medium">{t.channelId}</label>
              <input
                type="text"
                placeholder={t.channelIdPlaceholder}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsConnectChannelOpen(false)}
                className="flex-1"
              >
                {locale === 'ru' ? 'Отмена' : 'Cancel'}
              </Button>
              <Button
                onClick={handleConnectChannel}
                className="flex-1 elegant-button"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.connect}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}