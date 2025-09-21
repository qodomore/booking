import { useState } from 'react';
import { User, Phone, Shield, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';

interface ClientDataStepProps {
  locale?: 'RU' | 'EN';
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

const translations = {
  RU: {
    title: 'Данные для записи',
    subtitle: 'Заполните контактные данные для подтверждения записи',
    nameLabel: 'Имя',
    namePlaceholder: 'Введите ваше имя',
    phoneLabel: 'Телефон',
    phonePlaceholder: '+7 (___) ___-__-__',
    phoneHelp: 'Номер виден только мастеру для связи по записи',
    agreementLabel: 'Согласен с правилами и политикой конфиденциальности',
    reminderInfo: 'Мы пришлём напоминание T-24 и T-2 в Telegram. Можно выключить через /mute',
    confirmButton: 'Подтвердить запись',
    loadingText: 'Создаем запись...',
    errorTitle: 'Ошибка при создании записи',
    errorDescription: 'Попробуйте еще раз или обратитесь в поддержку',
    retryButton: 'Повторить',
    nameRequired: 'Введите имя',
    phoneRequired: 'Введите корректный номер телефона',
    agreementRequired: 'Необходимо согласие с правилами'
  },
  EN: {
    title: 'Booking Details',
    subtitle: 'Fill in contact details to confirm your booking',
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    phoneLabel: 'Phone',
    phonePlaceholder: '+1 (___) ___-____',
    phoneHelp: 'Phone number is only visible to the master for booking contact',
    agreementLabel: 'I agree to the terms and privacy policy',
    reminderInfo: 'We will send reminders T-24 and T-2 via Telegram. You can disable with /mute',
    confirmButton: 'Confirm Booking',
    loadingText: 'Creating booking...',
    errorTitle: 'Error creating booking',
    errorDescription: 'Please try again or contact support',
    retryButton: 'Retry',
    nameRequired: 'Please enter your name',
    phoneRequired: 'Please enter a valid phone number',
    agreementRequired: 'Agreement to terms is required'
  }
};

export function Step06ClientData({ locale = 'RU' }: ClientDataStepProps) {
  const t = translations[locale];
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    agreement: false
  });
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
    }
    
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = t.phoneRequired;
    }
    
    if (!formData.agreement) {
      newErrors.agreement = t.agreementRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoadingState('loading');
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setLoadingState('success');
        // Would normally navigate to next step
      } else {
        setLoadingState('error');
      }
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (locale === 'RU') {
      const match = numbers.match(/^7?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      if (match) {
        return '+7 ' + [match[1], match[2], match[3], match[4]]
          .filter(Boolean)
          .join(' ')
          .replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4');
      }
    }
    return value;
  };

  if (loadingState === 'error') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.errorTitle}</h2>
          <p className="text-muted-foreground">{t.errorDescription}</p>
        </div>
        <Button onClick={() => setLoadingState('idle')} className="bg-primary hover:bg-primary/90">
          {t.retryButton}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Form */}
      <Card className="p-8 shadow-sm rounded-2xl border border-border max-w-md mx-auto">
        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {t.nameLabel}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t.namePlaceholder}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-destructive focus:border-destructive' : ''}
              disabled={loadingState === 'loading'}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              {t.phoneLabel}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
              className={errors.phone ? 'border-destructive focus:border-destructive' : ''}
              disabled={loadingState === 'loading'}
            />
            <p className="text-xs text-muted-foreground">{t.phoneHelp}</p>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Agreement Checkbox */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreement"
                checked={formData.agreement}
                onCheckedChange={(checked) => handleInputChange('agreement', !!checked)}
                disabled={loadingState === 'loading'}
                className={errors.agreement ? 'border-destructive' : ''}
              />
              <Label 
                htmlFor="agreement" 
                className="text-sm leading-relaxed cursor-pointer"
              >
                {t.agreementLabel}
              </Label>
            </div>
            {errors.agreement && (
              <p className="text-sm text-destructive ml-6">{errors.agreement}</p>
            )}
          </div>

          {/* Reminder Info */}
          <Alert className="border-primary/20 bg-primary/5">
            <MessageSquare className="w-4 h-4 text-primary" />
            <AlertDescription className="text-primary text-sm">
              {t.reminderInfo}
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loadingState === 'loading'}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loadingState === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {t.loadingText}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                {t.confirmButton}
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: Создавать временный hold через POST /v1/bookings/holds &#123; service_id, start_at, idempotency_key &#125; на 90 с. 
        На успех — перейти к оплате/финалу</p>
      </div>
    </div>
  );
}