import React, { useState } from 'react';
import { Plus, User, Calendar, MapPin, Wrench, Edit, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { useResources, Resource } from '../contexts/ResourceContext';
import { LuxuryResourceCard } from './LuxuryResourceCard';

export function ResourceManagement() {
  const { resources, services, addResource, updateResource, removeResource, getResourcesByType } = useResources();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'specialist' as Resource['type'],
    skills: '',
    serviceIds: [] as string[],
    capacity: 1,
    status: 'active' as Resource['status'],
    phone: '',
    email: '',
  });

  const specialists = getResourcesByType('specialist');
  const slots = getResourcesByType('slot');
  const equipment = getResourcesByType('equipment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resourceData = {
      name: formData.name,
      type: formData.type,
      status: formData.status,
      availability: {
        'monday': true,
        'tuesday': true,
        'wednesday': true,
        'thursday': true,
        'friday': true,
        'saturday': false,
        'sunday': false,
      },
      ...(formData.type === 'specialist' && { 
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        serviceIds: formData.serviceIds,
        phone: formData.phone,
        email: formData.email,
      }),
      ...(formData.type === 'slot' && { capacity: formData.capacity }),
    };

    if (editingResource) {
      updateResource(editingResource.id, resourceData);
    } else {
      addResource(resourceData);
    }

    setIsDialogOpen(false);
    setEditingResource(null);
    setFormData({ 
      name: '', 
      type: 'specialist', 
      skills: '', 
      serviceIds: [], 
      capacity: 1,
      status: 'active',
      phone: '',
      email: '',
    });
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      skills: resource.skills?.join(', ') || '',
      serviceIds: resource.serviceIds || [],
      capacity: resource.capacity || 1,
      status: resource.status,
      phone: resource.phone || '',
      email: resource.email || '',
    });
    setIsDialogOpen(true);
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
  };

  const removeSelectedService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.filter(id => id !== serviceId)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gradient-text-elegant">Управление ресурсами</h2>
          <p className="text-muted-foreground">Специалисты, слоты и оборудование</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 elegant-button">
              <Plus className="h-4 w-4" />
              Добавить ресурс
            </Button>
          </DialogTrigger>
          <DialogContent className="clean-card max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? 'Редактировать ресурс' : 'Добавить новый ресурс'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите название ресурса"
                  required
                  className="focus-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Тип ресурса</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: Resource['type']) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="focus-elegant">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="specialist">Специалист</SelectItem>
                    <SelectItem value="slot">Слот/Кабинет</SelectItem>
                    <SelectItem value="equipment">Оборудование</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: Resource['status']) => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="focus-elegant">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="inactive">Неактивен</SelectItem>
                    <SelectItem value="busy">Занят</SelectItem>
                    <SelectItem value="vacation">В отпуске</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.type === 'specialist' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+7 (999) 123-45-67"
                      className="focus-elegant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="specialist@example.com"
                      className="focus-elegant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Услуги</Label>
                    {formData.serviceIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.serviceIds.map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          if (!service) return null;
                          return (
                            <Badge 
                              key={serviceId}
                              variant="secondary" 
                              className="elegant-tag pr-1"
                            >
                              {service.name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-destructive/20"
                                onClick={() => removeSelectedService(serviceId)}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-2">
                      {services.filter(service => service.isActive).map(service => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={formData.serviceIds.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <label 
                            htmlFor={`service-${service.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {service.name} - {service.category}
                          </label>
                        </div>
                      ))}
                      {services.filter(service => service.isActive).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          Нет доступных услуг
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Дополнительные навыки (через запятую)</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="Массаж, Консультации"
                      rows={2}
                      className="focus-elegant"
                    />
                  </div>
                </>
              )}
              
              {formData.type === 'slot' && (
                <div className="space-y-2">
                  <Label htmlFor="capacity">Вместимость</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="focus-elegant"
                  />
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 elegant-button">
                  {editingResource ? 'Сохранить' : 'Создать'}
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

      <div className="grid gap-6">
        {specialists.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Специалисты</h3>
                <p className="text-sm text-muted-foreground">{specialists.length} активных</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {specialists.map(resource => (
                <LuxuryResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onEdit={handleEdit}
                  onDelete={removeResource}
                />
              ))}
            </div>
          </div>
        )}

        {slots.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Слоты и кабинеты</h3>
                <p className="text-sm text-muted-foreground">{slots.length} доступных</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {slots.map(resource => (
                <LuxuryResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onEdit={handleEdit}
                  onDelete={removeResource}
                />
              ))}
            </div>
          </div>
        )}

        {equipment.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Оборудование</h3>
                <p className="text-sm text-muted-foreground">{equipment.length} единиц</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {equipment.map(resource => (
                <LuxuryResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onEdit={handleEdit}
                  onDelete={removeResource}
                />
              ))}
            </div>
          </div>
        )}

        {resources.length === 0 && (
          <Card className="clean-card text-center py-16">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Нет ресурсов</h3>
              <p className="text-muted-foreground mb-6">
                Добавьте первый ресурс для начала работы с системой
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="elegant-button">
                Добавить ресурс
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}