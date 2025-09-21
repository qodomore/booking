import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { User, Home, Wrench, Plus, X, Calendar } from 'lucide-react';

interface Step05ResourcesProps {
  locale?: 'RU' | 'EN';
}

interface Resource {
  id: string;
  name: string;
  type: 'human' | 'room' | 'equipment';
}

export function Step05Resources({ locale = 'RU' }: Step05ResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState({ name: '', type: 'human' as const });
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  });

  const content = {
    RU: {
      title: 'Ресурсы и расписание',
      subtitle: 'Добавьте мастеров, кабинеты и оборудование',
      resources: 'Ресурсы',
      schedule: 'Расписание',
      resourceName: 'Название ресурса',
      resourceType: 'Тип ресурса',
      types: {
        human: 'Мастер',
        room: 'Кабинет',
        equipment: 'Оборудование'
      },
      placeholders: {
        human: 'Анна Петрова',
        room: 'Кабинет №1',
        equipment: 'Аппарат для маникюра'
      },
      addResource: 'Добавить ресурс',
      workingDays: 'Рабочие дни',
      workingHours: 'Рабочие часы',
      days: {
        monday: 'Понедельник',
        tuesday: 'Вторник',
        wednesday: 'Среда',
        thursday: 'Четверг',
        friday: 'Пятница',
        saturday: 'Суббота',
        sunday: 'Воскресенье'
      },
      timeFrom: 'С',
      timeTo: 'До',
      preview: 'Предварительный просмотр календаря'
    },
    EN: {
      title: 'Resources and Schedule',
      subtitle: 'Add masters, rooms and equipment',
      resources: 'Resources',
      schedule: 'Schedule',
      resourceName: 'Resource Name',
      resourceType: 'Resource Type',
      types: {
        human: 'Master',
        room: 'Room',
        equipment: 'Equipment'
      },
      placeholders: {
        human: 'Anna Petrova',
        room: 'Room #1',
        equipment: 'Manicure Machine'
      },
      addResource: 'Add Resource',
      workingDays: 'Working Days',
      workingHours: 'Working Hours',
      days: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      },
      timeFrom: 'From',
      timeTo: 'To',
      preview: 'Calendar Preview'
    }
  };

  const t = content[locale];

  const resourceIcons = {
    human: <User className="w-4 h-4" />,
    room: <Home className="w-4 h-4" />,
    equipment: <Wrench className="w-4 h-4" />
  };

  const addResource = () => {
    if (newResource.name.trim()) {
      const resource: Resource = {
        id: Date.now().toString(),
        ...newResource
      };
      setResources([...resources, resource]);
      setNewResource({ name: '', type: 'human' });
    }
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const toggleWorkingDay = (day: keyof typeof workingDays) => {
    setWorkingDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resources">{t.resources}</TabsTrigger>
          <TabsTrigger value="schedule">{t.schedule}</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          {/* Add Resource Form */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.resourceName}</Label>
                  <Input
                    placeholder={t.placeholders[newResource.type]}
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{t.resourceType}</Label>
                  <Select 
                    value={newResource.type} 
                    onValueChange={(value: 'human' | 'room' | 'equipment') => 
                      setNewResource({ ...newResource, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.types).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {resourceIcons[key as keyof typeof resourceIcons]}
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={addResource} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {t.addResource}
              </Button>
            </div>
          </Card>

          {/* Resources List */}
          {resources.length > 0 && (
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="font-medium">Добавленные ресурсы</h3>
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {resourceIcons[resource.type]}
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.types[resource.type]}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResource(resource.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {/* Working Days */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-medium">{t.workingDays}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(t.days).map(([key, day]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={workingDays[key as keyof typeof workingDays]}
                      onCheckedChange={() => toggleWorkingDay(key as keyof typeof workingDays)}
                    />
                    <Label htmlFor={key} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Working Hours */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-medium">{t.workingHours}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.timeFrom}</Label>
                  <Select defaultValue="09:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t.timeTo}</Label>
                  <Select defaultValue="18:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Calendar Preview */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <h3 className="font-medium">{t.preview}</h3>
              </div>
              <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-sm text-muted-foreground">
                  {locale === 'RU' ? 'Здесь будет календарь...' : 'Calendar will be here...'}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}