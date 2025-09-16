import React, { useState } from 'react';
import { Plus, Scissors, Edit, Trash2, Clock, RussianRuble, Tag, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { useResources, Service } from '../contexts/ResourceContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ServiceBundles } from './ServiceBundles';

export function ServiceManagement() {
  const { services, addService, updateService, removeService } = useResources();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    category: '',
    imageUrl: '',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }

    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      duration: 60,
      price: 0,
      category: '',
      imageUrl: '',
      isActive: true,
    });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: service.category,
      imageUrl: service.imageUrl || '',
      isActive: service.isActive,
    });
    setIsDialogOpen(true);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} ч`;
    }
    return `${hours} ч ${remainingMinutes} мин`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gradient-text-elegant">Управление услугами</h2>
          <p className="text-muted-foreground">Каталог услуг вашего салона</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 elegant-button">
              <Plus className="h-4 w-4" />
              Добавить услугу
            </Button>
          </DialogTrigger>
          <DialogContent className="clean-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Редактировать услугу' : 'Добавить новую услугу'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название услуги</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Например, Классический маникюр"
                  required
                  className="focus-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Например, Маникюр"
                  required
                  className="focus-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Краткое описание услуги"
                  rows={3}
                  className="focus-elegant"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Длительность (мин)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="focus-elegant"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Цена (руб)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    className="focus-elegant"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL изображения</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="focus-elegant"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Активная услуга</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
              
              {/* Service Bundles Section */}
              {editingService && (
                <div className="pt-4">
                  <ServiceBundles
                    currentServiceId={editingService.id}
                    userRole="admin"
                    plan="free"
                    locale="ru"
                  />
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 elegant-button">
                  {editingService ? 'Сохранить' : 'Создать'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{category}</h3>
                <p className="text-sm text-muted-foreground">
                  {categoryServices.length} {categoryServices.length === 1 ? 'услуга' : 'услуг'}
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryServices.map(service => (
                <Card key={service.id} className="glass-card hover:scale-[1.01] transition-all duration-300 animate-elegant-fade-in group border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {service.imageUrl && (
                          <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-muted">
                            <ImageWithFallback
                              src={service.imageUrl}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/15 to-primary/8 rounded-lg flex items-center justify-center shadow-elegant border border-primary/15 flex-shrink-0">
                            <Scissors className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground group-hover:gradient-text-elegant transition-all duration-300 leading-tight">
                              {service.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 focus-elegant rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 focus-elegant rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={() => removeService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{formatDuration(service.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-primary">
                        <RussianRuble className="h-3 w-3" />
                        <span className="text-sm">{formatPrice(service.price)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={service.isActive ? "default" : "secondary"}
                        className={service.isActive ? "elegant-tag" : ""}
                      >
                        {service.isActive ? 'Активна' : 'Неактивна'}
                      </Badge>
                      
                      {!service.imageUrl && (
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <Card className="clean-card text-center py-16">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scissors className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Нет услуг</h3>
              <p className="text-muted-foreground mb-6">
                Добавьте первую услугу в каталог
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="elegant-button">
                Добавить услугу
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}