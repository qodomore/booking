import React, { useState } from 'react';
import { User, Plus, Edit, Trash2, Star, Calendar, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Master {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialties: string[];
  experience: number;
  rating: number;
  isActive: boolean;
  schedule: {
    [key: string]: { start: string; end: string; } | null;
  };
  commission: number;
  avatar?: string;
  bio: string;
  totalClients: number;
  totalRevenue: number;
}

const initialMasters: Master[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    phone: '+7 (999) 111-11-11',
    email: 'anna@salon.ru',
    specialties: ['Маникюр', 'Педикюр', 'Наращивание ногтей'],
    experience: 5,
    rating: 4.8,
    isActive: true,
    schedule: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '16:00' },
      sunday: null
    },
    commission: 50,
    bio: 'Специалист по маникюру с опытом работы более 5 лет. Владею всеми техниками современного nail-арта.',
    totalClients: 245,
    totalRevenue: 350000
  },
  {
    id: '2',
    name: 'Мария Петрова',
    phone: '+7 (999) 222-22-22',
    email: 'maria@salon.ru',
    specialties: ['Стрижка', 'Окрашивание', 'Укладка'],
    experience: 8,
    rating: 4.9,
    isActive: true,
    schedule: {
      monday: { start: '10:00', end: '19:00' },
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: null,
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: { start: '11:00', end: '15:00' }
    },
    commission: 60,
    bio: 'Топ-стилист салона. Специализируюсь на сложных окрашиваниях и авторских стрижках.',
    totalClients: 180,
    totalRevenue: 520000
  },
  {
    id: '3',
    name: 'Елена Сидорова',
    phone: '+7 (999) 333-33-33',
    email: 'elena@salon.ru',
    specialties: ['Массаж', 'Косметология', 'Чистка лица'],
    experience: 3,
    rating: 4.7,
    isActive: false,
    schedule: {
      monday: { start: '11:00', end: '20:00' },
      tuesday: { start: '11:00', end: '20:00' },
      wednesday: { start: '11:00', end: '20:00' },
      thursday: { start: '11:00', end: '20:00' },
      friday: { start: '11:00', end: '20:00' },
      saturday: null,
      sunday: null
    },
    commission: 45,
    bio: 'Косметолог-эстетист. Специализируюсь на уходовых процедурах и массаже.',
    totalClients: 95,
    totalRevenue: 180000
  }
];

const allSpecialties = [
  'Маникюр', 'Педикюр', 'Наращивание ногтей', 'Стрижка', 'Окрашивание', 
  'Укладка', 'Массаж', 'Косметология', 'Чистка лица', 'Перманентный макияж',
  'Ламинирование ресниц', 'Наращивание ресниц'
];

const daysOfWeek = [
  { key: 'monday', name: 'Понедельник' },
  { key: 'tuesday', name: 'Вторник' },
  { key: 'wednesday', name: 'Среда' },
  { key: 'thursday', name: 'Четверг' },
  { key: 'friday', name: 'Пятница' },
  { key: 'saturday', name: 'Суббота' },
  { key: 'sunday', name: 'Воскресенье' }
];

export function MasterManagement() {
  const [masters, setMasters] = useState<Master[]>(initialMasters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaster, setEditingMaster] = useState<Master | null>(null);

  const handleAddMaster = () => {
    setEditingMaster(null);
    setIsDialogOpen(true);
  };

  const handleEditMaster = (master: Master) => {
    setEditingMaster(master);
    setIsDialogOpen(true);
  };

  const handleSaveMaster = (formData: any) => {
    if (editingMaster) {
      setMasters(prev => prev.map(m => m.id === editingMaster.id ? { ...m, ...formData } : m));
    } else {
      const newMaster: Master = {
        id: Date.now().toString(),
        ...formData,
        rating: 0,
        totalClients: 0,
        totalRevenue: 0
      };
      setMasters(prev => [...prev, newMaster]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteMaster = (id: string) => {
    setMasters(prev => prev.filter(m => m.id !== id));
  };

  const toggleMasterStatus = (id: string) => {
    setMasters(prev => prev.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Управление мастерами</h2>
          <p className="text-gray-500 mt-1 text-sm">Настройте профили мастеров и их расписание</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddMaster} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="md:hidden">Добавить</span>
              <span className="hidden md:inline">Добавить мастера</span>
            </Button>
          </DialogTrigger>
          <MasterDialog 
            master={editingMaster} 
            onSave={handleSaveMaster}
            specialties={allSpecialties}
          />
        </Dialog>
      </div>

      {/* Masters Grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {masters.map(master => (
          <Card key={master.id} className={`${!master.isActive ? 'opacity-60' : ''} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">{master.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs md:text-sm text-gray-600">{master.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={master.isActive}
                    onCheckedChange={() => toggleMasterStatus(master.id)}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
              {/* Specialties */}
              <div>
                <div className="flex flex-wrap gap-1">
                  {master.specialties.slice(0, 3).map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {master.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{master.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Experience and Commission */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p>Опыт: {master.experience} лет</p>
                </div>
                <div>
                  <p>Комиссия: {master.commission}%</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 pt-3 md:pt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs md:text-sm"
                  onClick={() => handleEditMaster(master)}
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">Редактировать</span>
                  <span className="sm:hidden">Изменить</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteMaster(master.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface MasterDialogProps {
  master: Master | null;
  onSave: (data: any) => void;
  specialties: string[];
}

function MasterDialog({ master, onSave, specialties }: MasterDialogProps) {
  const [formData, setFormData] = useState({
    name: master?.name || '',
    phone: master?.phone || '',
    email: master?.email || '',
    specialties: master?.specialties || [],
    experience: master?.experience || 1,
    commission: master?.commission || 50,
    bio: master?.bio || '',
    isActive: master?.isActive ?? true,
    schedule: master?.schedule || {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: null,
      sunday: null
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleScheduleChange = (day: string, field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day] ? { ...prev.schedule[day], [field]: value } : { start: '09:00', end: '18:00' }
      }
    }));
  };

  const toggleWorkDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day] ? null : { start: '09:00', end: '18:00' }
      }
    }));
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
      <DialogHeader>
        <DialogTitle className="text-lg">{master ? 'Редактировать мастера' : 'Новый мастер'}</DialogTitle>
        <DialogDescription>
          {master ? 'Измените информацию о мастере, расписание и просмотрите статистику' : 'Заполните данные для добавления нового мастера в салон'}
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          {master && <TabsTrigger value="stats">Статистика</TabsTrigger>}
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="info" className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bio">О мастере</Label>
                <Textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                  placeholder="Краткое описание мастера..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Опыт (лет)</Label>
                  <Input 
                    id="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({...prev, experience: parseInt(e.target.value)}))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="commission">Комиссия (%)</Label>
                  <Input 
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.commission}
                    onChange={(e) => setFormData(prev => ({...prev, commission: parseInt(e.target.value)}))}
                    required
                  />
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-4">
                <h3 className="font-medium">Специализации</h3>
                <div className="grid grid-cols-2 gap-2">
                  {specialties.map(specialty => (
                    <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="font-medium">Расписание работы</h3>
              <div className="space-y-3">
                {daysOfWeek.map(day => (
                  <div key={day.key} className="flex items-center gap-4">
                    <div className="w-32">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.schedule[day.key] !== null}
                          onChange={() => toggleWorkDay(day.key)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{day.name}</span>
                      </label>
                    </div>
                    
                    {formData.schedule[day.key] && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={formData.schedule[day.key]?.start || '09:00'}
                          onChange={(e) => handleScheduleChange(day.key, 'start', e.target.value)}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-500">до</span>
                        <Input
                          type="time"
                          value={formData.schedule[day.key]?.end || '18:00'}
                          onChange={(e) => handleScheduleChange(day.key, 'end', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {master && (
            <TabsContent value="stats" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{master.totalClients}</p>
                        <p className="text-sm text-gray-500">Всего клиентов</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Banknote className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                          {(master.totalRevenue / 1000).toFixed(0)}k ₽
                        </p>
                        <p className="text-sm text-gray-500">Общий доход</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Рейтинг</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{master.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Статус</p>
                        <Badge className={master.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {master.isActive ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="submit">
              {master ? 'Сохранить изменения' : 'Добавить мастера'}
            </Button>
          </div>
        </form>
      </Tabs>
    </DialogContent>
  );
}