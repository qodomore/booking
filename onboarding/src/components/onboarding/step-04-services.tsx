import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Scissors, Palette, Sparkles, Heart, Car, Utensils, Plus, X } from 'lucide-react';

interface Step04ServicesProps {
  locale?: 'RU' | 'EN';
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export function Step04Services({ locale = 'RU' }: Step04ServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: '', duration: 60, price: 0 });

  const content = {
    RU: {
      title: 'Ваши услуги',
      subtitle: 'Выберите категорию и добавьте основные услуги',
      category: 'Категория бизнеса',
      categoryPlaceholder: 'Выберите категорию',
      categories: {
        beauty: 'Салон красоты',
        barbershop: 'Барбершоп',
        nails: 'Маникюр/Педикюр',
        massage: 'Массаж/SPA',
        auto: 'Автосервис',
        restaurant: 'Ресторан/Кафе',
        fitness: 'Фитнес/Спорт',
        medical: 'Медицина',
        other: 'Другое'
      },
      serviceName: 'Название услуги',
      serviceNamePlaceholder: 'Стрижка мужская',
      duration: 'Длительность (мин)',
      price: 'Цена',
      pricePlaceholder: '1500',
      addService: 'Добавить услугу',
      servicesAdded: 'услуг добавлено',
      presets: {
        beauty: [
          { name: 'Стрижка женская', duration: 60, price: 2500 },
          { name: 'Окрашивание', duration: 120, price: 4500 },
          { name: 'Укладка', duration: 45, price: 1800 }
        ],
        barbershop: [
          { name: 'Стрижка мужская', duration: 30, price: 1500 },
          { name: 'Борода', duration: 20, price: 800 },
          { name: 'Стрижка + борода', duration: 45, price: 2000 }
        ]
      }
    },
    EN: {
      title: 'Your Services',
      subtitle: 'Choose category and add main services',
      category: 'Business Category',
      categoryPlaceholder: 'Select category',
      categories: {
        beauty: 'Beauty Salon',
        barbershop: 'Barbershop',
        nails: 'Nails',
        massage: 'Massage/SPA',
        auto: 'Auto Service',
        restaurant: 'Restaurant/Cafe',
        fitness: 'Fitness/Sports',
        medical: 'Medical',
        other: 'Other'
      },
      serviceName: 'Service Name',
      serviceNamePlaceholder: 'Men\'s Haircut',
      duration: 'Duration (min)',
      price: 'Price',
      pricePlaceholder: '50',
      addService: 'Add Service',
      servicesAdded: 'services added',
      presets: {
        beauty: [
          { name: 'Women\'s Haircut', duration: 60, price: 80 },
          { name: 'Hair Coloring', duration: 120, price: 150 },
          { name: 'Hair Styling', duration: 45, price: 60 }
        ],
        barbershop: [
          { name: 'Men\'s Haircut', duration: 30, price: 50 },
          { name: 'Beard Trim', duration: 20, price: 25 },
          { name: 'Haircut + Beard', duration: 45, price: 65 }
        ]
      }
    }
  };

  const t = content[locale];

  const categoryIcons = {
    beauty: <Sparkles className="w-5 h-5" />,
    barbershop: <Scissors className="w-5 h-5" />,
    nails: <Palette className="w-5 h-5" />,
    massage: <Heart className="w-5 h-5" />,
    auto: <Car className="w-5 h-5" />,
    restaurant: <Utensils className="w-5 h-5" />
  };

  const addService = () => {
    if (newService.name.trim()) {
      const service: Service = {
        id: Date.now().toString(),
        ...newService
      };
      setServices([...services, service]);
      setNewService({ name: '', duration: 60, price: 0 });
    }
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const loadPresets = (category: string) => {
    const presets = (t.presets as any)[category];
    if (presets) {
      const presetServices = presets.map((preset: any, index: number) => ({
        id: `preset-${Date.now()}-${index}`,
        ...preset
      }));
      setServices(presetServices);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadPresets(category);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Category Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <Label>{t.category}</Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t.categoryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.categories).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    {(categoryIcons as any)[key]}
                    {label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Add Service Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t.serviceName}</Label>
              <Input
                placeholder={t.serviceNamePlaceholder}
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t.duration}</Label>
              <Select 
                value={newService.duration.toString()} 
                onValueChange={(value) => setNewService({ ...newService, duration: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 30, 45, 60, 90, 120, 180].map(duration => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} мин
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t.price}</Label>
              <Input
                type="number"
                placeholder={t.pricePlaceholder}
                value={newService.price || ''}
                onChange={(e) => setNewService({ ...newService, price: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <Button onClick={addService} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {t.addService}
          </Button>
        </div>
      </Card>

      {/* Services List */}
      {services.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Ваши услуги</h3>
              <Badge variant="secondary">
                {services.length} {t.servicesAdded}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.duration} мин • {service.price} ₽
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(service.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}