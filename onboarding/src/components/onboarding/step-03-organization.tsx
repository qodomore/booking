import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { MapPin, Phone, Clock, Building } from 'lucide-react';

interface Step03OrganizationProps {
  locale?: 'RU' | 'EN';
}

export function Step03Organization({ locale = 'RU' }: Step03OrganizationProps) {
  const [isMultiLocation, setIsMultiLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    phone: '',
    workingHours: ''
  });

  const content = {
    RU: {
      title: 'Информация о заведении',
      subtitle: 'Расскажите о вашем бизнесе',
      name: 'Название заведения',
      namePlaceholder: 'Салон красоты "Стиль"',
      city: 'Город',
      cityPlaceholder: 'Москва',
      address: 'Адрес',
      addressPlaceholder: 'ул. Тверская, 12, оф. 15',
      phone: 'Телефон',
      phonePlaceholder: '+7 (999) 123-45-67',
      workingHours: 'Часы работы',
      workingHoursPlaceholder: 'Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00',
      multiLocation: 'Несколько заведений',
      multiLocationDesc: 'У вас есть филиалы или несколько локаций?'
    },
    EN: {
      title: 'Business Information',
      subtitle: 'Tell us about your business',
      name: 'Business Name',
      namePlaceholder: 'Beauty Salon "Style"',
      city: 'City',
      cityPlaceholder: 'New York',
      address: 'Address',
      addressPlaceholder: '123 Main Street, Suite 15',
      phone: 'Phone',
      phonePlaceholder: '+1 (555) 123-4567',
      workingHours: 'Working Hours',
      workingHoursPlaceholder: 'Mon-Fri: 9:00-20:00, Sat-Sun: 10:00-18:00',
      multiLocation: 'Multiple Locations',
      multiLocationDesc: 'Do you have branches or multiple locations?'
    }
  };

  const t = content[locale];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              {t.name}
            </Label>
            <Input
              id="name"
              placeholder={t.namePlaceholder}
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t.city}
            </Label>
            <Input
              id="city"
              placeholder={t.cityPlaceholder}
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">{t.address}</Label>
            <Textarea
              id="address"
              placeholder={t.addressPlaceholder}
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              rows={2}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t.phone}
            </Label>
            <Input
              id="phone"
              placeholder={t.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
            />
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t.workingHours}
            </Label>
            <Input
              id="hours"
              placeholder={t.workingHoursPlaceholder}
              value={formData.workingHours}
              onChange={(e) => updateFormData('workingHours', e.target.value)}
            />
          </div>

          {/* Multi-location toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <div className="font-medium">{t.multiLocation}</div>
              <div className="text-sm text-muted-foreground">{t.multiLocationDesc}</div>
            </div>
            <Switch
              checked={isMultiLocation}
              onCheckedChange={setIsMultiLocation}
            />
          </div>

          {isMultiLocation && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-sm text-blue-800">
                {locale === 'RU' 
                  ? 'Отлично! Мы настроим систему для управления несколькими локациями.'
                  : 'Great! We\'ll set up the system for managing multiple locations.'
                }
              </div>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}