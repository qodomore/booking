import { useState } from 'react';
import { MapPin, Clock, Plus, Edit3, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';

interface LocationsHoursStepProps {
  locale?: 'RU' | 'EN';
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  metro?: string;
}

interface WorkingHours {
  day: string;
  isActive: boolean;
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
}

const translations = {
  RU: {
    title: 'Локации и часы работы',
    subtitle: 'Настройте адреса и график работы вашего бизнеса',
    locations: 'Локации',
    addLocation: 'Добавить локацию',
    editLocation: 'Редактировать локацию',
    deleteLocation: 'Удалить локацию',
    noLocations: 'Нет добавленных локаций',
    noLocationsDescription: 'Добавьте первую локацию для начала работы',
    addFirstLocation: 'Добавить первую локацию',
    
    // Location form
    locationName: 'Название локации',
    locationNamePlaceholder: 'Например, Главный офис',
    address: 'Адрес',
    addressPlaceholder: 'ул. Пушкина, 10',
    city: 'Город',
    cityPlaceholder: 'Москва',
    phone: 'Телефон локации',
    phonePlaceholder: '+7 (495) 123-45-67',
    metro: 'Метро/Ориентир',
    metroPlaceholder: 'м. Тверская',
    
    // Working hours
    defaultSchedule: 'График по умолчанию',
    workingHours: 'Часы работы',
    dayOff: 'Выходной',
    breakTime: 'Перерыв',
    exceptions: 'Исключения и праздники',
    addException: 'Добавить исключение',
    
    // Days
    days: {
      monday: 'Понедельник',
      tuesday: 'Вторник', 
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье'
    },
    
    // Actions
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    
    // Validation
    required: 'Обязательно',
    validationError: 'Заполните обязательные поля'
  },
  EN: {
    title: 'Locations & Hours',
    subtitle: 'Set up your business addresses and working schedule',
    locations: 'Locations',
    addLocation: 'Add Location',
    editLocation: 'Edit Location',
    deleteLocation: 'Delete Location',
    noLocations: 'No locations added',
    noLocationsDescription: 'Add your first location to get started',
    addFirstLocation: 'Add First Location',
    
    // Location form
    locationName: 'Location Name',
    locationNamePlaceholder: 'e.g. Main Office',
    address: 'Address',
    addressPlaceholder: '10 Main Street',
    city: 'City',
    cityPlaceholder: 'New York',
    phone: 'Location Phone',
    phonePlaceholder: '+1 (555) 123-4567',
    metro: 'Metro/Landmark',
    metroPlaceholder: 'Near Central Station',
    
    // Working hours
    defaultSchedule: 'Default Schedule',
    workingHours: 'Working Hours',
    dayOff: 'Day Off',
    breakTime: 'Break',
    exceptions: 'Exceptions & Holidays',
    addException: 'Add Exception',
    
    // Days
    days: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday', 
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    },
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    
    // Validation
    required: 'Required',
    validationError: 'Please fill in required fields'
  }
};

export function Step06LocationsHours({ locale = 'RU' }: LocationsHoursStepProps) {
  const t = translations[locale];
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    metro: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default working hours
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: 'monday', isActive: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'tuesday', isActive: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'wednesday', isActive: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'thursday', isActive: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'friday', isActive: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'saturday', isActive: true, start: '10:00', end: '16:00' },
    { day: 'sunday', isActive: false, start: '10:00', end: '16:00' }
  ]);

  const validateLocationForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!locationForm.name.trim()) {
      newErrors.name = t.required;
    }
    
    if (!locationForm.address.trim()) {
      newErrors.address = t.required;
    }
    
    if (!locationForm.city.trim()) {
      newErrors.city = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationFormChange = (field: string, value: string) => {
    setLocationForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveLocation = () => {
    if (!validateLocationForm()) return;

    const newLocation: Location = {
      id: editingLocation?.id || Date.now().toString(),
      ...locationForm
    };

    if (editingLocation) {
      setLocations(prev => prev.map(loc => loc.id === editingLocation.id ? newLocation : loc));
    } else {
      setLocations(prev => [...prev, newLocation]);
    }

    handleCloseLocationDialog();
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setLocationForm({
      name: location.name,
      address: location.address,
      city: location.city,
      phone: location.phone || '',
      metro: location.metro || ''
    });
    setShowLocationDialog(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  const handleCloseLocationDialog = () => {
    setShowLocationDialog(false);
    setEditingLocation(null);
    setLocationForm({ name: '', address: '', city: '', phone: '', metro: '' });
    setErrors({});
  };

  const handleWorkingHoursChange = (dayIndex: number, field: keyof WorkingHours, value: any) => {
    setWorkingHours(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    ));
  };

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
        {/* Locations */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-medium text-foreground">{t.locations}</h2>
              </div>
              <Button
                onClick={() => setShowLocationDialog(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.addLocation}
              </Button>
            </div>

            {locations.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">{t.noLocations}</h3>
                <p className="text-muted-foreground mb-6">{t.noLocationsDescription}</p>
                <Button
                  onClick={() => setShowLocationDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addFirstLocation}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {locations.map((location) => (
                  <Card key={location.id} className="p-6 border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-2">{location.name}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>{location.address}, {location.city}</p>
                          {location.phone && <p>📞 {location.phone}</p>}
                          {location.metro && <p>🚇 {location.metro}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditLocation(location)}
                          className="text-primary hover:bg-primary/10"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLocation(location.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Working Hours */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="font-medium text-foreground">{t.defaultSchedule}</h2>
            </div>

            <div className="space-y-4">
              {workingHours.map((day, index) => (
                <div key={day.day} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="w-28">
                    <span className="text-sm font-medium">
                      {t.days[day.day as keyof typeof t.days]}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={day.isActive}
                      onChange={(e) => handleWorkingHoursChange(index, 'isActive', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs text-muted-foreground">
                      {day.isActive ? t.workingHours : t.dayOff}
                    </span>
                  </div>

                  {day.isActive && (
                    <>
                      <Input
                        type="time"
                        value={day.start}
                        onChange={(e) => handleWorkingHoursChange(index, 'start', e.target.value)}
                        className="w-24"
                      />
                      <span className="text-muted-foreground">—</span>
                      <Input
                        type="time"
                        value={day.end}
                        onChange={(e) => handleWorkingHoursChange(index, 'end', e.target.value)}
                        className="w-24"
                      />
                      
                      {day.breakStart && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            {t.breakTime}: {day.breakStart} — {day.breakEnd}
                          </Badge>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Exceptions */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-medium text-foreground">{t.exceptions}</h2>
              </div>
              <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/10">
                <Plus className="w-4 h-4 mr-2" />
                {t.addException}
              </Button>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                {locale === 'RU' 
                  ? 'Здесь можно настроить праздничные дни и особые часы работы'
                  : 'Here you can set up holidays and special working hours'
                }
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>

      {/* Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? t.editLocation : t.addLocation}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-name" className="flex items-center gap-1">
                {t.locationName}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location-name"
                placeholder={t.locationNamePlaceholder}
                value={locationForm.name}
                onChange={(e) => handleLocationFormChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-address" className="flex items-center gap-1">
                {t.address}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location-address"
                placeholder={t.addressPlaceholder}
                value={locationForm.address}
                onChange={(e) => handleLocationFormChange('address', e.target.value)}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-city" className="flex items-center gap-1">
                {t.city}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location-city"
                placeholder={t.cityPlaceholder}
                value={locationForm.city}
                onChange={(e) => handleLocationFormChange('city', e.target.value)}
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-phone">{t.phone}</Label>
              <Input
                id="location-phone"
                placeholder={t.phonePlaceholder}
                value={locationForm.phone}
                onChange={(e) => handleLocationFormChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-metro">{t.metro}</Label>
              <Input
                id="location-metro"
                placeholder={t.metroPlaceholder}
                value={locationForm.metro}
                onChange={(e) => handleLocationFormChange('metro', e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseLocationDialog}
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleSaveLocation}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {t.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: CRUD /v1/locations; /v1/working-hours + exceptions. Время хранить в TZ аккаунта</p>
      </div>
    </div>
  );
}