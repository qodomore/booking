import { useState } from 'react';
import { Building2, Globe, Phone, Mail, MapPin, Palette, Upload, Eye } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';

interface BusinessProfileStepProps {
  locale?: 'RU' | 'EN';
}

const translations = {
  RU: {
    title: 'Профиль бизнеса',
    subtitle: 'Настройте информацию о вашем бизнесе для клиентов',
    businessInfo: 'Основная информация',
    brandName: 'Название бренда',
    brandNamePlaceholder: 'Введите название вашего бизнеса',
    description: 'Описание (кратко)',
    descriptionPlaceholder: 'Опишите ваши услуги в нескольких словах',
    phone: 'Телефон',
    phonePlaceholder: '+7 (___) ___-__-__',
    email: 'Email',
    emailPlaceholder: 'info@yourbusiness.com',
    website: 'Сайт/Соцсети',
    websitePlaceholder: 'https://your-website.com',
    timezone: 'Часовой пояс',
    language: 'Язык интерфейса',
    branding: 'Брендинг',
    logo: 'Логотип',
    uploadLogo: 'Загрузить логотип',
    accentColor: 'Цвет акцента',
    showContacts: 'Показывать контакты клиентам в боте',
    helpTitle: 'Информация для клиентов',
    helpDescription: 'Эти данные увидят клиенты в Mini-App при записи к вам',
    timezones: {
      'Europe/Moscow': 'Москва (UTC+3)',
      'Europe/Kiev': 'Киев (UTC+2)', 
      'Asia/Almaty': 'Алматы (UTC+6)',
      'Europe/Minsk': 'Минск (UTC+3)'
    },
    languages: {
      ru: 'Русский',
      en: 'English'
    },
    required: 'Обязательно',
    validationError: 'Заполните все обязательные поля'
  },
  EN: {
    title: 'Business Profile',
    subtitle: 'Set up your business information for clients',
    businessInfo: 'Basic Information',
    brandName: 'Brand Name',
    brandNamePlaceholder: 'Enter your business name',
    description: 'Description (brief)',
    descriptionPlaceholder: 'Describe your services in a few words',
    phone: 'Phone',
    phonePlaceholder: '+1 (___) ___-____',
    email: 'Email',
    emailPlaceholder: 'info@yourbusiness.com',
    website: 'Website/Social',
    websitePlaceholder: 'https://your-website.com',
    timezone: 'Timezone',
    language: 'Interface Language',
    branding: 'Branding',
    logo: 'Logo',
    uploadLogo: 'Upload Logo',
    accentColor: 'Accent Color',
    showContacts: 'Show contacts to clients in bot',
    helpTitle: 'Client Information',
    helpDescription: 'This data will be visible to clients in the Mini-App when booking',
    timezones: {
      'Europe/Moscow': 'Moscow (UTC+3)',
      'Europe/Kiev': 'Kiev (UTC+2)',
      'Asia/Almaty': 'Almaty (UTC+6)',
      'Europe/Minsk': 'Minsk (UTC+3)'
    },
    languages: {
      ru: 'Русский',
      en: 'English'
    },
    required: 'Required',
    validationError: 'Please fill in all required fields'
  }
};

export function Step05BusinessProfile({ locale = 'RU' }: BusinessProfileStepProps) {
  const t = translations[locale];
  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'Europe/Moscow',
    language: 'ru',
    logo: null as File | null,
    accentColor: '#5B82F6',
    showContacts: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.brandName.trim()) {
      newErrors.brandName = t.required;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t.required;
    }
    
    if (!formData.timezone) {
      newErrors.timezone = t.required;
    }
    
    if (!formData.language) {
      newErrors.language = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('logo', file);
    }
  };

  // Remove this line as it causes infinite re-renders
  // Validation will be done on form submission

  const colorOptions = [
    { value: '#5B82F6', name: 'Blue' },
    { value: '#10B981', name: 'Emerald' },
    { value: '#F59E0B', name: 'Amber' },
    { value: '#EF4444', name: 'Red' },
    { value: '#8B5CF6', name: 'Violet' },
    { value: '#06B6D4', name: 'Cyan' }
  ];

  return (
    <div className="space-y-7">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Basic Information */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-medium text-foreground">{t.businessInfo}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Brand Name */}
              <div className="space-y-2">
                <Label htmlFor="brandName" className="flex items-center gap-1">
                  {t.brandName}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="brandName"
                  placeholder={t.brandNamePlaceholder}
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  className={errors.brandName ? 'border-destructive' : ''}
                />
                {errors.brandName && (
                  <p className="text-sm text-destructive">{errors.brandName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {t.phone}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {t.website}
                </Label>
                <Input
                  id="website"
                  placeholder={t.websitePlaceholder}
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {t.timezone}
                  <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger className={errors.timezone ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.timezones).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="text-sm text-destructive">{errors.timezone}</p>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  {t.language}
                  <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className={errors.language ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.languages).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-sm text-destructive">{errors.language}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                placeholder={t.descriptionPlaceholder}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </Card>

        {/* Branding */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="font-medium text-foreground">{t.branding}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>{t.logo}</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    {formData.logo ? (
                      <img 
                        src={URL.createObjectURL(formData.logo)} 
                        alt="Logo" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="text-primary border-primary/20 hover:bg-primary/10">
                        {t.uploadLogo}
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <Label>{t.accentColor}</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleInputChange('accentColor', color.value)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        formData.accentColor === color.value 
                          ? 'border-foreground scale-110' 
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Show Contacts Option */}
            <div className="flex items-center gap-3 pt-4">
              <Checkbox
                id="show-contacts"
                checked={formData.showContacts}
                onCheckedChange={(checked) => handleInputChange('showContacts', !!checked)}
              />
              <Label htmlFor="show-contacts" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {t.showContacts}
              </Label>
            </div>
          </div>
        </Card>

        {/* Help Card */}
        <Alert className="border-primary/20 bg-primary/5">
          <Eye className="w-4 h-4 text-primary" />
          <AlertDescription className="text-primary">
            <div className="space-y-1">
              <p className="font-medium">{t.helpTitle}</p>
              <p className="text-sm">{t.helpDescription}</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Validation Error */}
        {Object.keys(errors).length > 0 && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertDescription className="text-destructive">
              {t.validationError}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: PATCH /v1/accounts/&#123;id&#125; business_profile; логотип в object storage; accent_color — код токена</p>
      </div>
    </div>
  );
}