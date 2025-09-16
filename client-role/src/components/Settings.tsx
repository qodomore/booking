import React, { useContext } from 'react';
import { ArrowLeft, Bell, Globe, Moon, Sun, BellOff, User, Phone, MessageSquare } from 'lucide-react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function Settings() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    language, 
    setLanguage,
    theme,
    setTheme,
    notifications,
    setNotifications,
    setCurrentScreen 
  } = context;

  const texts = {
    ru: {
      settings: 'Настройки',
      notifications: 'Уведомления',
      marketing: 'Маркетинговые уведомления',
      muteAll: 'Тихие уведомления (/mute)',
      muteDescription: 'Отключить все звуки и вибрацию',
      language: 'Язык',
      theme: 'Тема',
      light: 'Светлая',
      dark: 'Тёмная',
      personalData: 'Личные данные',
      phone: 'Телефон',
      telegram: 'Telegram',
      russian: 'Русский',
      english: 'English'
    },
    en: {
      settings: 'Settings',
      notifications: 'Notifications',
      marketing: 'Marketing notifications',
      muteAll: 'Silent notifications (/mute)',
      muteDescription: 'Turn off all sounds and vibration',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      personalData: 'Personal Data',
      phone: 'Phone',
      telegram: 'Telegram',
      russian: 'Русский',
      english: 'English'
    }
  };

  const t = texts[language];

  const handleBack = () => {
    setCurrentScreen('my-bookings');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
  };

  const handleLanguageChange = (newLang: 'ru' | 'en') => {
    setLanguage(newLang);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 pt-16">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-medium">{t.settings}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Personal Data */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-medium">{t.personalData}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">{t.phone}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+7 (999) 123-45-67"
                  className="pl-10"
                  defaultValue="+7 (999) 123-45-67"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegram" className="text-sm">{t.telegram}</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="telegram"
                  placeholder="@username"
                  className="pl-10"
                  defaultValue="@user123"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-medium">{t.notifications}</h2>
          </div>
          
          <div className="space-y-4">


            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{t.marketing}</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
              />
            </div>
            
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BellOff className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{t.muteAll}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.muteDescription}</p>
                </div>
                <Switch
                  checked={notifications.mute}
                  onCheckedChange={(checked) => handleNotificationChange('mute', checked)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <div className="space-y-4">
            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium">{t.language}</p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">{t.russian}</SelectItem>
                  <SelectItem value="en">{t.english}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                )}
                <p className="font-medium">{t.theme}</p>
              </div>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t.light}</SelectItem>
                  <SelectItem value="dark">{t.dark}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}