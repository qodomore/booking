import { useState } from 'react';
import { 
  Scissors, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Lock,
  FileDown,
  Tag
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';

interface ServicesPricingStepProps {
  locale?: 'RU' | 'EN';
  subscriptionActive?: boolean;
}

interface Service {
  id: string;
  name: string;
  categoryId: string;
  duration: number;
  price: number;
  description: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const translations = {
  RU: {
    title: 'Услуги и цены',
    subtitle: 'Настройте каталог услуг и ценообразование',
    categories: 'Категории',
    services: 'Услуги',
    addService: 'Добавить услугу',
    editService: 'Редактировать услугу',
    importTemplate: 'Импорт из шаблона',
    smartPricing: 'Смарт-цены (рекомендации)',
    smartPricingDescription: 'Автоматические рекомендации цен на основе загрузки и конкурентов',
    smartPricingLocked: 'Смарт-цены доступны в тарифе "Маркетинг + AI"',
    activateSubscription: 'Активировать подписку',
    
    // Service form
    serviceName: 'Название услуги',
    serviceNamePlaceholder: 'Например, Стрижка мужская',
    category: 'Категория',
    duration: 'Длительность (мин)',
    durationPlaceholder: '60',
    basePrice: 'Базовая цена (₽)',
    basePricePlaceholder: '1500',
    description: 'Короткое описание',
    descriptionPlaceholder: 'Описание услуги для клиентов...',
    
    // Categories
    categoryAll: 'Все категории',
    categoryHaircuts: 'Стрижки',
    categoryColoring: 'Окрашивание',
    categoryStyling: 'Укладки',
    categoryManicure: 'Маникюр',
    categoryPedicure: 'Педикюр',
    categoryMassage: 'Массаж',
    categoryFacial: 'Уход за лицом',
    
    // Actions
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    
    // Validation
    required: 'Обязательно',
    validationError: 'Заполните обязательные поля',
    
    // Empty state
    noServices: 'Нет добавленных услуг',
    noServicesDescription: 'Создайте первую услугу или импортируйте готовый шаблон',
    addFirstService: 'Добавить первую услугу',
    
    // Template options
    salonTemplate: 'Шаблон салона красоты',
    barberTemplate: 'Шаблон барбершопа',
    nailTemplate: 'Шаблон ногтевого сервиса',
    massageTemplate: 'Шаблон массажного салона'
  },
  EN: {
    title: 'Services & Pricing',
    subtitle: 'Set up your service catalog and pricing',
    categories: 'Categories',
    services: 'Services',
    addService: 'Add Service',
    editService: 'Edit Service',
    importTemplate: 'Import Template',
    smartPricing: 'Smart Pricing (Recommendations)',
    smartPricingDescription: 'Automatic price recommendations based on utilization and competitors',
    smartPricingLocked: 'Smart Pricing available in "Marketing + AI" plan',
    activateSubscription: 'Activate Subscription',
    
    // Service form
    serviceName: 'Service Name',
    serviceNamePlaceholder: 'e.g. Men\'s Haircut',
    category: 'Category',
    duration: 'Duration (min)',
    durationPlaceholder: '60',
    basePrice: 'Base Price ($)',
    basePricePlaceholder: '50',
    description: 'Short Description',
    descriptionPlaceholder: 'Service description for clients...',
    
    // Categories
    categoryAll: 'All Categories',
    categoryHaircuts: 'Haircuts',
    categoryColoring: 'Coloring',
    categoryStyling: 'Styling',
    categoryManicure: 'Manicure',
    categoryPedicure: 'Pedicure',
    categoryMassage: 'Massage',
    categoryFacial: 'Facial Care',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    
    // Validation
    required: 'Required',
    validationError: 'Please fill in required fields',
    
    // Empty state
    noServices: 'No services added',
    noServicesDescription: 'Create your first service or import a ready template',
    addFirstService: 'Add First Service',
    
    // Template options
    salonTemplate: 'Beauty Salon Template',
    barberTemplate: 'Barbershop Template',
    nailTemplate: 'Nail Service Template',
    massageTemplate: 'Massage Salon Template'
  }
};

export function Step07ServicesPricing({ locale = 'RU', subscriptionActive = false }: ServicesPricingStepProps) {
  const t = translations[locale];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [smartPricingEnabled, setSmartPricingEnabled] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    categoryId: 'haircuts',
    duration: '',
    price: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: Category[] = [
    { id: 'all', name: t.categoryAll, color: '#6B7280' },
    { id: 'haircuts', name: t.categoryHaircuts, color: '#5B82F6' },
    { id: 'coloring', name: t.categoryColoring, color: '#10B981' },
    { id: 'styling', name: t.categoryStyling, color: '#F59E0B' },
    { id: 'manicure', name: t.categoryManicure, color: '#EF4444' },
    { id: 'pedicure', name: t.categoryPedicure, color: '#8B5CF6' },
    { id: 'massage', name: t.categoryMassage, color: '#06B6D4' },
    { id: 'facial', name: t.categoryFacial, color: '#84CC16' }
  ];

  const validateServiceForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!serviceForm.name.trim()) {
      newErrors.name = t.required;
    }
    
    if (!serviceForm.duration || parseInt(serviceForm.duration) <= 0) {
      newErrors.duration = t.required;
    }
    
    if (!serviceForm.price || parseFloat(serviceForm.price) <= 0) {
      newErrors.price = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceFormChange = (field: string, value: string) => {
    setServiceForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveService = () => {
    if (!validateServiceForm()) return;

    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: serviceForm.name,
      categoryId: serviceForm.categoryId,
      duration: parseInt(serviceForm.duration),
      price: parseFloat(serviceForm.price),
      description: serviceForm.description
    };

    if (editingService) {
      setServices(prev => prev.map(service => 
        service.id === editingService.id ? newService : service
      ));
    } else {
      setServices(prev => [...prev, newService]);
    }

    handleCloseServiceDialog();
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      categoryId: service.categoryId,
      duration: service.duration.toString(),
      price: service.price.toString(),
      description: service.description
    });
    setShowServiceDialog(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleCloseServiceDialog = () => {
    setShowServiceDialog(false);
    setEditingService(null);
    setServiceForm({ name: '', categoryId: 'haircuts', duration: '', price: '', description: '' });
    setErrors({});
  };

  const handleSmartPricingToggle = () => {
    if (!subscriptionActive) {
      // Navigate to subscription step
      return;
    }
    setSmartPricingEnabled(!smartPricingEnabled);
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.categoryId === selectedCategory);

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);
  const getCategoryName = (id: string) => getCategoryById(id)?.name || '';

  return (
    <div className="space-y-7">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Smart Pricing */}
        <Card className="p-6 shadow-sm rounded-2xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${subscriptionActive ? 'bg-primary/10' : 'bg-muted'}`}>
                {subscriptionActive ? (
                  <Sparkles className="w-5 h-5 text-primary" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{t.smartPricing}</h3>
                <p className="text-sm text-muted-foreground">
                  {subscriptionActive ? t.smartPricingDescription : t.smartPricingLocked}
                </p>
              </div>
            </div>
            
            {subscriptionActive ? (
              <Switch
                checked={smartPricingEnabled}
                onCheckedChange={setSmartPricingEnabled}
              />
            ) : (
              <Button 
                variant="outline"
                onClick={handleSmartPricingToggle}
                className="text-primary border-primary/20 hover:bg-primary/10"
              >
                <Lock className="w-4 h-4 mr-2" />
                {t.activateSubscription}
              </Button>
            )}
          </div>
        </Card>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </button>
          ))}
        </div>

        {/* Services */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-primary" />
                <h2 className="font-medium text-foreground">{t.services}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="text-primary border-primary/20 hover:bg-primary/10"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  {t.importTemplate}
                </Button>
                <Button
                  onClick={() => setShowServiceDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addService}
                </Button>
              </div>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">{t.noServices}</h3>
                <p className="text-muted-foreground mb-6">{t.noServicesDescription}</p>
                <Button
                  onClick={() => setShowServiceDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addFirstService}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => {
                  const category = getCategoryById(service.categoryId);
                  return (
                    <Card key={service.id} className="p-6 border border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-foreground">{service.name}</h3>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: category?.color,
                                color: category?.color
                              }}
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {getCategoryName(service.categoryId)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration} мин
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {service.price} ₽
                            </div>
                          </div>
                          {service.description && (
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditService(service)}
                            className="text-primary hover:bg-primary/10"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Service Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingService ? t.editService : t.addService}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name" className="flex items-center gap-1">
                {t.serviceName}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="service-name"
                placeholder={t.serviceNamePlaceholder}
                value={serviceForm.name}
                onChange={(e) => handleServiceFormChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t.category}</Label>
              <Select 
                value={serviceForm.categoryId} 
                onValueChange={(value) => handleServiceFormChange('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat.id !== 'all').map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-duration" className="flex items-center gap-1">
                  {t.duration}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="service-duration"
                  type="number"
                  placeholder={t.durationPlaceholder}
                  value={serviceForm.duration}
                  onChange={(e) => handleServiceFormChange('duration', e.target.value)}
                  className={errors.duration ? 'border-destructive' : ''}
                />
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-price" className="flex items-center gap-1">
                  {t.basePrice}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="service-price"
                  type="number"
                  placeholder={t.basePricePlaceholder}
                  value={serviceForm.price}
                  onChange={(e) => handleServiceFormChange('price', e.target.value)}
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">{t.description}</Label>
              <Textarea
                id="service-description"
                placeholder={t.descriptionPlaceholder}
                value={serviceForm.description}
                onChange={(e) => handleServiceFormChange('description', e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseServiceDialog}
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleSaveService}
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
        <p>DEV: CRUD /v1/services; smart-pricing через POST /v1/ai/pricing/recommend — доступ только при подписке</p>
      </div>
    </div>
  );
}