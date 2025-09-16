import React, { useState } from 'react';
import { Card } from './card';
import { Switch } from './switch';
import { Badge } from './badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Separator } from './separator';
import { Calendar, Clock, MessageSquare, Bell, Info } from 'lucide-react';

interface AutomationToggleProps {
  locale?: 'ru' | 'en';
  initialSettings?: {
    autoNextVisit: boolean;
    autoMode: 'auto_send' | 'admin_only';
    quietHours: string;
    frequency: 'on_completion' | 'weekly';
  };
  onChange?: (settings: {
    autoNextVisit: boolean;
    autoMode: 'auto_send' | 'admin_only';
    quietHours: string;
    frequency: 'on_completion' | 'weekly';
  }) => void;
  className?: string;
}

const translations = {
  ru: {
    title: 'Следующие визиты (авто-предложения)',
    subtitle: 'Автоматически предлагайте клиентам следующие записи',
    mode: 'Режим отправки',
    autoSend: 'Авто-отправка',
    adminOnly: 'Только предложения в админке',
    quietHours: 'Тихие часы',
    quietHoursHint: '22:00–08:00',
    frequency: 'Частота предложений',
    onCompletion: 'По завершении визита',
    weekly: 'Раз в неделю',
    note: 'Можно отключить в любой момент',
    enabled: 'Включено',
    disabled: 'Отключено'
  },
  en: {
    title: 'Next visits (auto-suggest)',
    subtitle: 'Automatically suggest next appointments to clients',
    mode: 'Send mode',
    autoSend: 'Auto-send',
    adminOnly: 'Admin suggestions only',
    quietHours: 'Quiet hours',
    quietHoursHint: '10 pm–8 am',
    frequency: 'Suggestion frequency',
    onCompletion: 'On visit completion',
    weekly: 'Once a week',
    note: 'Can be disabled at any time',
    enabled: 'Enabled',
    disabled: 'Disabled'
  }
};

export function AutomationToggle({
  locale = 'ru',
  initialSettings = {
    autoNextVisit: true,
    autoMode: 'admin_only',
    quietHours: '22:00–08:00',
    frequency: 'on_completion'
  },
  onChange,
  className = ''
}: AutomationToggleProps) {
  const t = translations[locale];
  const [settings, setSettings] = useState(initialSettings);

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    onChange?.(newSettings);
  };

  const handleToggleChange = (autoNextVisit: boolean) => {
    const newSettings = { ...settings, autoNextVisit };
    handleSettingsChange(newSettings);
  };

  const handleModeChange = (autoMode: 'auto_send' | 'admin_only') => {
    const newSettings = { ...settings, autoMode };
    handleSettingsChange(newSettings);
  };

  const handleFrequencyChange = (frequency: 'on_completion' | 'weekly') => {
    const newSettings = { ...settings, frequency };
    handleSettingsChange(newSettings);
  };

  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      {/* Main Toggle */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-medium">{t.title}</h3>
              <Badge 
                variant={settings.autoNextVisit ? "default" : "secondary"}
                className="text-xs"
              >
                {settings.autoNextVisit ? t.enabled : t.disabled}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.subtitle}
            </p>
          </div>
          <Switch
            checked={settings.autoNextVisit}
            onCheckedChange={handleToggleChange}
          />
        </div>

        {/* Sub-settings */}
        {settings.autoNextVisit && (
          <div className="space-y-4 pl-8 border-l-2 border-border ml-2">
            {/* Send Mode */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">{t.mode}</label>
              </div>
              <Select value={settings.autoMode} onValueChange={handleModeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto_send">{t.autoSend}</SelectItem>
                  <SelectItem value="admin_only">{t.adminOnly}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Quiet Hours */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">{t.quietHours}</label>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {settings.quietHours}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {t.quietHoursHint}
                </span>
              </div>
            </div>

            <Separator />

            {/* Frequency */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">{t.frequency}</label>
              </div>
              <Select value={settings.frequency} onValueChange={handleFrequencyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_completion">{t.onCompletion}</SelectItem>
                  <SelectItem value="weekly">{t.weekly}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
        <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.note}
        </p>
      </div>
    </Card>
  );
}