import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Phone, Clock, UserCheck, Calendar, Gift, Volume2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { AutomationToggle } from './ui/automation-toggle';
import { useTelegram } from '../hooks/useTelegram';

interface NotificationTrigger {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  channels: ('telegram' | 'sms' | 'whatsapp' | 'email')[];
  enabled: boolean;
  preview: {
    telegram?: string;
    sms?: string;
    whatsapp?: string;
    email?: string;
  };
}

interface NotificationSettingsProps {
  onBack?: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const { hapticFeedback } = useTelegram();
  
  const [triggers, setTriggers] = useState<NotificationTrigger[]>([
    {
      id: 'booking-reminder-24h',
      name: 'Напоминание за 24 часа',
      description: 'Автоматическое напоминание клиенту о записи',
      icon: Clock,
      channels: ['telegram', 'sms'],
      enabled: true,
      preview: {
        telegram: '🕐 Напоминаем о записи завтра в 14:30 на маникюр к Анне Ивановой.\n📍 Салон "Красота", ул. Пушкина 10\n📞 Изменить: t.me/salon_bot',
        sms: 'Напоминание: завтра 14:30 - маникюр, Анна Иванова. Салон Красота, ул.Пушкина 10. Изменить: salon.ru/b123'
      }
    },
    {
      id: 'booking-reminder-2h',
      name: 'Напоминание за 2 часа',
      description: 'Срочное напоминание перед визитом',
      icon: Clock,
      channels: ['telegram', 'sms', 'whatsapp'],
      enabled: true,
      preview: {
        telegram: '⏰ Через 2 часа запись на маникюр к Анне Ивановой!\n📍 Салон Красота, ул.Пушкина 10\n⚡ Успейте подготовиться',
        sms: 'Через 2 часа: маникюр, Анна Иванова. Салон Красота, ул.Пушкина 10',
        whatsapp: '⏰ Напоминание!\nЧерез 2 часа у вас запись:\n💅 Маникюр у Анны Ивановой\n📍 Салон Красота, ул.Пушкина 10'
      }
    },
    {
      id: 'no-show',
      name: 'Клиент не пришел',
      description: 'Уведомление администратору о пропуске',
      icon: UserCheck,
      channels: ['telegram'],
      enabled: true,
      preview: {
        telegram: '❌ No-show: Анна Смирнова не пришла на маникюр в 14:30\n👩‍💄 Мастер: Анна Иванова освободилась\n📞 +7999123456'
      }
    },
    {
      id: 'birthday',
      name: 'День рождения клиента',
      description: 'Поздравление и предложение записи',
      icon: Gift,
      channels: ['telegram', 'whatsapp'],
      enabled: false,
      preview: {
        telegram: '🎉 С Днем рождения, Анна!\n🎁 Дарим скидку 20% на любую услугу до конца месяца\n📅 Записаться: t.me/salon_bot',
        whatsapp: '🎂 Поздравляем с Днем рождения, Анна!\n🎁 Специально для вас скидка 20%\n💅 Запишитесь на любимую процедуру!'
      }
    },
    {
      id: 'new-booking',
      name: 'Новая запись',
      description: 'Уведомление администратору о новой записи',
      icon: Calendar,
      channels: ['telegram'],
      enabled: true,
      preview: {
        telegram: '📅 Новая запись!\n👤 Анна Смирнова (+7999123456)\n💅 Маникюр • 14:30 • завтра\n👩‍💄 Мастер: Анна Иванова'
      }
    }
  ]);

  const [channels, setChannels] = useState({
    telegram: true,
    sms: false,
    whatsapp: true,
    email: false,
    sound: true,
  });

  const handleTriggerToggle = (triggerId: string) => {
    hapticFeedback.light();
    setTriggers(prev => prev.map(trigger =>
      trigger.id === triggerId
        ? { ...trigger, enabled: !trigger.enabled }
        : trigger
    ));
  };

  const handleChannelToggle = (channel: keyof typeof channels) => {
    hapticFeedback.light();
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'telegram': return MessageSquare;
      case 'sms': return MessageSquare;
      case 'whatsapp': return Phone;
      case 'email': return Mail;
      default: return Bell;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'telegram': return 'text-blue-500 bg-blue-500/10';
      case 'sms': return 'text-green-500 bg-green-500/10';
      case 'whatsapp': return 'text-green-600 bg-green-600/10';
      case 'email': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getChannelName = (channel: string) => {
    switch (channel) {
      case 'telegram': return 'Telegram';
      case 'sms': return 'SMS';
      case 'whatsapp': return 'WhatsApp';
      case 'email': return 'Email';
      default: return channel;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h2 className="gradient-text-elegant">Уведомления</h2>
          <p className="text-muted-foreground">Настройка автоматических уведомлений клиентов и персонала</p>
        </div>
      </div>

      {/* Channel Settings */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3>Каналы уведомлений</h3>
              <p className="text-sm text-muted-foreground font-normal">
                Включите нужные способы отправки уведомлений
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {Object.entries(channels).map(([channel, enabled]) => {
            const Icon = getChannelIcon(channel);
            const colorClass = getChannelColor(channel);
            
            if (channel === 'sound') {
              return (
                <div key={channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Volume2 className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <span className="font-medium">Звуковые сигналы</span>
                      <p className="text-xs text-muted-foreground">Звук при получении уведомлений</p>
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => handleChannelToggle(channel as keyof typeof channels)}
                  />
                </div>
              );
            }
            
            return (
              <div key={channel} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-medium">{getChannelName(channel)}</span>
                    <p className="text-xs text-muted-foreground">
                      {channel === 'telegram' ? 'Быстрые уведомления в мессенджер' :
                       channel === 'sms' ? 'SMS на номер клиента' :
                       channel === 'whatsapp' ? 'Сообщения WhatsApp Business' :
                       'Email уведомления'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleChannelToggle(channel as keyof typeof channels)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Next Visit Automation */}
      <AutomationToggle
        locale="ru"
        initialSettings={{
          autoNextVisit: true,
          autoMode: 'admin_only',
          quietHours: '22:00–08:00',
          frequency: 'on_completion'
        }}
        onChange={(settings) => {
          console.log('Automation settings changed:', settings);
          hapticFeedback.light();
        }}
      />

      {/* Notification Triggers */}
      <div className="space-y-4">
        <h3 className="font-semibold">Триггеры уведомлений</h3>
        
        {triggers.map((trigger) => {
          const Icon = trigger.icon;
          
          return (
            <Card key={trigger.id} className={`clean-card transition-all duration-200 ${
              trigger.enabled ? 'border-primary/20 bg-primary/2' : ''
            }`}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        trigger.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{trigger.name}</h4>
                        <p className="text-sm text-muted-foreground">{trigger.description}</p>
                        
                        {/* Channels */}
                        <div className="flex items-center gap-2 mt-2">
                          {trigger.channels.map((channel) => {
                            const ChannelIcon = getChannelIcon(channel);
                            return (
                              <Badge 
                                key={channel} 
                                variant={trigger.enabled ? "default" : "secondary"}
                                className="text-xs"
                              >
                                <ChannelIcon className="h-3 w-3 mr-1" />
                                {getChannelName(channel)}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <Switch
                      checked={trigger.enabled}
                      onCheckedChange={() => handleTriggerToggle(trigger.id)}
                    />
                  </div>

                  {/* Preview Messages */}
                  {trigger.enabled && (
                    <div className="space-y-3 pt-3 border-t border-border/50">
                      <h5 className="text-sm font-medium text-muted-foreground">Превью сообщений:</h5>
                      
                      {Object.entries(trigger.preview).map(([channel, message]) => {
                        const ChannelIcon = getChannelIcon(channel);
                        const colorClass = getChannelColor(channel);
                        
                        return (
                          <div key={channel} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded flex items-center justify-center ${colorClass}`}>
                                <ChannelIcon className="h-3 w-3" />
                              </div>
                              <span className="text-sm font-medium">{getChannelName(channel)}</span>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-muted/30 border text-sm">
                              <pre className="whitespace-pre-wrap font-normal">{message}</pre>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle>Статистика уведомлений</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-semibold text-primary">126</p>
              <p className="text-xs text-muted-foreground">Отправлено сегодня</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-semibold text-green-600">94%</p>
              <p className="text-xs text-muted-foreground">Доставлено</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-semibold text-blue-600">78%</p>
              <p className="text-xs text-muted-foreground">Прочита��о</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-semibold text-orange-600">12</p>
              <p className="text-xs text-muted-foreground">No-show снижено</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}