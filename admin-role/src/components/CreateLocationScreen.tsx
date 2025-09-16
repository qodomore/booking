import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight,
  ArrowLeft,
  Plus,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

// codeRef: BusinessContext.tsx
interface CreateLocationScreenProps {
  onNext?: (data: LocationData) => void;
  onBack?: () => void;
  state?: 'default' | 'loading' | 'success' | 'error';
  locale?: 'ru' | 'en';
}

interface LocationData {
  name: string;
  address: string;
  phone: string;
  workingHours: {
    enabled: boolean;
    hours: Record<string, { start: string; end: string; enabled: boolean }>;
  };
}

const weekDays = {
  ru: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

const texts = {
  ru: {
    title: 'Создание локации',
    subtitle: 'Добавьте основную информацию о вашей локации',
    locationName: 'Название локации',
    locationNamePlaceholder: 'Основной офис, Филиал №1...',
    address: 'Адрес',
    addressPlaceholder: 'ул. Пример, д. 1, офис 10',
    phone: 'Телефон',
    phonePlaceholder: '+7 (999) 123-45-67',
    workingHours: 'Часы работы',
    setupLater: 'настроить позже',
    enableWorkingHours: 'Настроить рабочие часы',
    nextButton: 'Далее',
    nextingButton: 'Создание...',
    required: 'Обязательное поле',
    nameRequired: 'Введите название локации',
    success: 'Локация создана!',
    error: 'Ошибка при создании локации',
    optional: 'Необязательно'
  },
  en: {
    title: 'Create Location',
    subtitle: 'Add basic information about your location',
    locationName: 'Location Name',
    locationNamePlaceholder: 'Main Office, Branch #1...',
    address: 'Address',
    addressPlaceholder: '123 Example St, Office 10',
    phone: 'Phone',
    phonePlaceholder: '+1 (555) 123-4567',
    workingHours: 'Working Hours',
    setupLater: 'set up later',
    enableWorkingHours: 'Set up working hours',
    nextButton: 'Next',
    nextingButton: 'Creating...',
    required: 'Required field',
    nameRequired: 'Enter location name',
    success: 'Location created!',
    error: 'Error creating location',
    optional: 'Optional'
  }
};

export function CreateLocationScreen({ 
  onNext, 
  onBack, 
  state = 'default',
  locale = 'ru' 
}: CreateLocationScreenProps) {
  const [formData, setFormData] = useState<LocationData>({
    name: '',
    address: '',
    phone: '',
    workingHours: {
      enabled: false,
      hours: {
        monday: { start: '09:00', end: '18:00', enabled: true },
        tuesday: { start: '09:00', end: '18:00', enabled: true },
        wednesday: { start: '09:00', end: '18:00', enabled: true },
        thursday: { start: '09:00', end: '18:00', enabled: true },
        friday: { start: '09:00', end: '18:00', enabled: true },
        saturday: { start: '10:00', end: '16:00', enabled: false },
        sunday: { start: '10:00', end: '16:00', enabled: false }
      }
    }
  });
  
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = texts[locale];
  const days = weekDays[locale];

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t.success);
      onNext?.(formData);
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof Omit<LocationData, 'workingHours'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const updateWorkingHours = (enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, enabled }
    }));
  };

  const updateDayHours = (day: string, field: 'start' | 'end' | 'enabled', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        hours: {
          ...prev.workingHours.hours,
          [day]: {
            ...prev.workingHours.hours[day],
            [field]: value
          }
        }
      }
    }));
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
        {/* Location Name */}
        <div className="space-y-2">
          <Label htmlFor="locationName" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {t.locationName}
            <Badge variant="secondary" className="text-xs">*</Badge>
          </Label>
          <Input
            id="locationName"
            placeholder={t.locationNamePlaceholder}
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {t.address}
            <Badge variant="outline" className="text-xs">{t.optional}</Badge>
          </Label>
          <Input
            id="address"
            placeholder={t.addressPlaceholder}
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {t.phone}
            <Badge variant="outline" className="text-xs">{t.optional}</Badge>
          </Label>
          <Input
            id="phone"
            placeholder={t.phonePlaceholder}
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
          />
        </div>

        {/* Working Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t.workingHours}
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.workingHours.enabled}
                onCheckedChange={updateWorkingHours}
              />
              <span className="text-sm text-muted-foreground">
                {formData.workingHours.enabled ? t.enableWorkingHours : t.setupLater}
              </span>
            </div>
          </div>

          {formData.workingHours.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-4 bg-muted/30 rounded-lg"
            >
              {Object.entries(formData.workingHours.hours).map(([dayKey, dayData], index) => (
                <div key={dayKey} className="flex items-center gap-3">
                  <Switch
                    checked={dayData.enabled}
                    onCheckedChange={(enabled) => updateDayHours(dayKey, 'enabled', enabled)}
                  />
                  <div className="flex-1 grid grid-cols-3 gap-2 items-center">
                    <span className="text-sm font-medium">{days[index]}</span>
                    <Input
                      type="time"
                      value={dayData.start}
                      onChange={(e) => updateDayHours(dayKey, 'start', e.target.value)}
                      disabled={!dayData.enabled}
                      className="text-xs"
                    />
                    <Input
                      type="time"
                      value={dayData.end}
                      onChange={(e) => updateDayHours(dayKey, 'end', e.target.value)}
                      disabled={!dayData.enabled}
                      className="text-xs"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </Card>

      {/* Next Steps Card */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1">
              {locale === 'ru' ? 'Что дальше?' : 'What\'s next?'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {locale === 'ru' 
                ? 'После создания локации мы поможем подключить Telegram Mini-App и настроить QR-код для клиентов'
                : 'After creating the location, we\'ll help you connect Telegram Mini-App and set up QR code for clients'}
            </p>
          </div>
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
            {t.nextingButton}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span>{t.nextButton}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </Button>
    </div>
  );
}