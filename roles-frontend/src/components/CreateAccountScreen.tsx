import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Globe, 
  Clock, 
  CreditCard,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

// codeRef: SettingsBottomSheet.tsx, BusinessContext.tsx
interface CreateAccountScreenProps {
  onNext?: (data: AccountData) => void;
  onBack?: () => void;
  state?: 'default' | 'loading' | 'success' | 'error';
  locale?: 'ru' | 'en';
}

interface AccountData {
  businessName: string;
  timezone: string;
  currency: string;
  language: string;
  businessType: string;
}

const timezones = [
  { value: 'Europe/Moscow', label: 'Москва (UTC+3)', ru: 'Москва (UTC+3)', en: 'Moscow (UTC+3)' },
  { value: 'Europe/Kiev', label: 'Киев (UTC+2)', ru: 'Киев (UTC+2)', en: 'Kiev (UTC+2)' },
  { value: 'Asia/Almaty', label: 'Алматы (UTC+6)', ru: 'Алматы (UTC+6)', en: 'Almaty (UTC+6)' },
  { value: 'Europe/London', label: 'Лондон (UTC+0)', ru: 'Лондон (UTC+0)', en: 'London (UTC+0)' },
  { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)', ru: 'Нью-Йорк (UTC-5)', en: 'New York (UTC-5)' }
];

const currencies = [
  { value: 'RUB', label: '₽ Российский рубль', ru: '₽ Российский рубль', en: '₽ Russian Ruble' },
  { value: 'USD', label: '$ Доллар США', ru: '$ Доллар США', en: '$ US Dollar' },
  { value: 'EUR', label: '€ Евро', ru: '€ Евро', en: '€ Euro' },
  { value: 'KZT', label: '₸ Казахстанский тенге', ru: '₸ Казахстанский тенге', en: '₸ Kazakhstani Tenge' },
  { value: 'UAH', label: '₴ Украинская гривна', ru: '₴ Украинская гривна', en: '₴ Ukrainian Hryvnia' }
];

const businessTypes = [
  { value: 'beauty', ru: 'Красота и здоровье', en: 'Beauty & Health' },
  { value: 'medical', ru: 'Медицина', en: 'Medical' },
  { value: 'education', ru: 'Образование', en: 'Education' },
  { value: 'fitness', ru: 'Фитнес и спорт', en: 'Fitness & Sports' },
  { value: 'consulting', ru: 'Консалтинг', en: 'Consulting' },
  { value: 'other', ru: 'Другое', en: 'Other' }
];

const texts = {
  ru: {
    title: 'Создание аккаунта',
    subtitle: 'Настройте основные параметры вашего бизнеса',
    businessName: 'Название бизнеса',
    businessNamePlaceholder: 'Введите название вашего бизнеса',
    timezone: 'Часовой пояс',
    currency: 'Валюта',
    language: 'Язык интерфейса',
    businessType: 'Тип бизнеса',
    createButton: 'Создать аккаунт',
    creatingButton: 'Создание...',
    required: 'Обязательное поле',
    nameRequired: 'Введите название бизнеса',
    timezoneRequired: 'Выберите часовой пояс',
    currencyRequired: 'Выберите валюту',
    languageRequired: 'Выберите язык',
    success: 'Аккаунт успешно создан!',
    error: 'Ошибка при создании аккаунта'
  },
  en: {
    title: 'Create Account',
    subtitle: 'Set up the basic parameters of your business',
    businessName: 'Business Name',
    businessNamePlaceholder: 'Enter your business name',
    timezone: 'Time Zone',
    currency: 'Currency',
    language: 'Interface Language',
    businessType: 'Business Type',
    createButton: 'Create Account',
    creatingButton: 'Creating...',
    required: 'Required field',
    nameRequired: 'Enter business name',
    timezoneRequired: 'Select time zone',
    currencyRequired: 'Select currency',
    languageRequired: 'Select language',
    success: 'Account created successfully!',
    error: 'Error creating account'
  }
};

export function CreateAccountScreen({ 
  onNext, 
  onBack, 
  state = 'default',
  locale = 'ru' 
}: CreateAccountScreenProps) {
  const [formData, setFormData] = useState<AccountData>({
    businessName: '',
    timezone: '',
    currency: '',
    language: locale,
    businessType: ''
  });
  
  const [errors, setErrors] = useState<Partial<AccountData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = texts[locale];

  const validateForm = (): boolean => {
    const newErrors: Partial<AccountData> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = t.nameRequired;
    }
    if (!formData.timezone) {
      newErrors.timezone = t.timezoneRequired;
    }
    if (!formData.currency) {
      newErrors.currency = t.currencyRequired;
    }
    if (!formData.language) {
      newErrors.language = t.languageRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(locale === 'ru' ? 'Заполните все обязательные поля' : 'Fill all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t.success);
      onNext?.(formData);
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof AccountData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t.success}</h2>
          <p className="text-muted-foreground">
            {locale === 'ru' 
              ? 'Переходим к подключению Telegram...' 
              : 'Moving to Telegram connection...'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-md mx-auto space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t.error}</h2>
          <p className="text-muted-foreground mb-4">
            {locale === 'ru' 
              ? 'Попробуйте еще раз или обратитесь в поддержку' 
              : 'Try again or contact support'}
          </p>
          <Button onClick={() => window.location.reload()}>
            {locale === 'ru' ? 'Попробовать снова' : 'Try Again'}
          </Button>
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

      {/* Form */}
      <Card className="p-6 space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="businessName" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {t.businessName}
            <Badge variant="secondary" className="text-xs">*</Badge>
          </Label>
          <Input
            id="businessName"
            placeholder={t.businessNamePlaceholder}
            value={formData.businessName}
            onChange={(e) => updateFormData('businessName', e.target.value)}
            className={errors.businessName ? 'border-red-500' : ''}
          />
          {errors.businessName && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.businessName}
            </p>
          )}
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t.timezone}
            <Badge variant="secondary" className="text-xs">*</Badge>
          </Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) => updateFormData('timezone', value)}
          >
            <SelectTrigger className={errors.timezone ? 'border-red-500' : ''}>
              <SelectValue placeholder={locale === 'ru' ? 'Выберите часовой пояс' : 'Select timezone'} />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timezone && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.timezone}
            </p>
          )}
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            {t.currency}
            <Badge variant="secondary" className="text-xs">*</Badge>
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => updateFormData('currency', value)}
          >
            <SelectTrigger className={errors.currency ? 'border-red-500' : ''}>
              <SelectValue placeholder={locale === 'ru' ? 'Выберите валюту' : 'Select currency'} />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.currency && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.currency}
            </p>
          )}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t.language}
            <Badge variant="secondary" className="text-xs">*</Badge>
          </Label>
          <Select
            value={formData.language}
            onValueChange={(value) => updateFormData('language', value)}
          >
            <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
              <SelectValue placeholder={locale === 'ru' ? 'Выберите язык' : 'Select language'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">🇷🇺 Русский</SelectItem>
              <SelectItem value="en">🇺🇸 English</SelectItem>
            </SelectContent>
          </Select>
          {errors.language && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.language}
            </p>
          )}
        </div>

        {/* Business Type (Optional) */}
        <div className="space-y-2">
          <Label>{t.businessType}</Label>
          <Select
            value={formData.businessType}
            onValueChange={(value) => updateFormData('businessType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={locale === 'ru' ? 'Выберите тип бизнеса' : 'Select business type'} />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || state === 'loading'}
        className="w-full elegant-button h-12"
      >
        {isSubmitting || state === 'loading' ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.creatingButton}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span>{t.createButton}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </Button>
    </div>
  );
}