import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Check, 
  ArrowLeft,
  Building,
  MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

// codeRef: SubscriptionProvider.tsx
interface LocaleSettingsScreenProps {
  onBack?: () => void;
  locale?: 'ru' | 'en';
}

const languages = [
  { 
    code: 'ru', 
    name: 'Русский', 
    nativeName: 'Русский',
    flag: '🇷🇺',
    examples: {
      service: 'Маникюр',
      time: '14:30',
      price: '2 500 ₽',
      notification: 'Напоминание о записи завтра в 14:30'
    }
  },
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    flag: '🇺🇸',
    examples: {
      service: 'Manicure',
      time: '2:30 PM',
      price: '$35',
      notification: 'Appointment reminder tomorrow at 2:30 PM'
    }
  }
];

const texts = {
  ru: {
    title: 'Язык интерфейса',
    subtitle: 'Настройка локализации для аккаунта и локаций',
    accountLevel: 'Уровень аккаунта',
    accountDescription: 'Основной язык для владельца и администраторов',
    locationLevel: 'Уровень локации',
    locationDescription: 'Язык для клиентов и публичных страниц',
    priority: 'Приоритет настроек',
    priorityDescription: 'Настройки локации имеют приоритет над настройками аккаунта',
    examples: 'Примеры',
    service: 'Услуга',
    time: 'Время',
    price: 'Цена',
    notification: 'Уведомление',
    save: 'Сохранить',
    saved: 'Настройки сохранены'
  },
  en: {
    title: 'Interface Language',
    subtitle: 'Localization settings for account and locations',
    accountLevel: 'Account Level',
    accountDescription: 'Main language for owners and administrators',
    locationLevel: 'Location Level', 
    locationDescription: 'Language for clients and public pages',
    priority: 'Settings Priority',
    priorityDescription: 'Location settings take priority over account settings',
    examples: 'Examples',
    service: 'Service',
    time: 'Time',
    price: 'Price',
    notification: 'Notification',
    save: 'Save',
    saved: 'Settings saved'
  }
};

export function LocaleSettingsScreen({ 
  onBack, 
  locale = 'ru' 
}: LocaleSettingsScreenProps) {
  const [accountLocale, setAccountLocale] = useState<string>('ru');
  const [locationLocale, setLocationLocale] = useState<string>('ru');
  const [isLoading, setIsLoading] = useState(false);

  const t = texts[locale];

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t.saved);
    } catch (error) {
      toast.error(locale === 'ru' ? 'Ошибка сохранения' : 'Save error');
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguage = (code: string) => {
    return languages.find(lang => lang.code === code) || languages[0];
  };

  const currentLocationLanguage = getLanguage(locationLocale);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Account Level Settings */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t.accountLevel}</h3>
              <p className="text-sm text-muted-foreground">{t.accountDescription}</p>
            </div>
          </div>
          
          <RadioGroup 
            value={accountLocale} 
            onValueChange={setAccountLocale}
            className="grid grid-cols-1 gap-3"
          >
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-3">
                <RadioGroupItem value={lang.code} id={`account-${lang.code}`} />
                <Label 
                  htmlFor={`account-${lang.code}`}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{lang.name}</div>
                  </div>
                  {accountLocale === lang.code && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>

      {/* Location Level Settings */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">{t.locationLevel}</h3>
              <p className="text-sm text-muted-foreground">{t.locationDescription}</p>
            </div>
          </div>
          
          <RadioGroup 
            value={locationLocale} 
            onValueChange={setLocationLocale}
            className="grid grid-cols-1 gap-3"
          >
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-3">
                <RadioGroupItem value={lang.code} id={`location-${lang.code}`} />
                <Label 
                  htmlFor={`location-${lang.code}`}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{lang.name}</div>
                  </div>
                  {locationLocale === lang.code && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>

      {/* Priority Info */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">{t.priority}</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">{t.priorityDescription}</p>
          </div>
        </div>
      </Card>

      {/* Examples Preview */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t.examples}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Badge variant="outline">{currentLocationLanguage.nativeName}</Badge>
              
              <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.service}:</span>
                  <span>{currentLocationLanguage.examples.service}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.time}:</span>
                  <span>{currentLocationLanguage.examples.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.price}:</span>
                  <span>{currentLocationLanguage.examples.price}</span>
                </div>
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">
                  {t.notification}: {currentLocationLanguage.examples.notification}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="elegant-button min-w-32"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {locale === 'ru' ? 'Сохранение...' : 'Saving...'}
            </div>
          ) : (
            t.save
          )}
        </Button>
      </div>
    </div>
  );
}