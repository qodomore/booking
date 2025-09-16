import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus,
  Edit3,
  Trash2,
  X,
  ArrowLeft,
  AlertTriangle,
  Repeat,
  User,
  MapPin,
  Coffee,
  Wrench,
  GraduationCap
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { toast } from 'sonner';

// codeRef: ResourceManagement.tsx, ResourceContext.tsx
interface ScheduleTimeOffScreenProps {
  onBack?: () => void;
  state?: 'default' | 'empty' | 'loading' | 'success' | 'error';
  locale?: 'ru' | 'en';
}

interface TimeOffBlock {
  id: string;
  resourceId: string;
  resourceName: string;
  type: 'vacation' | 'sick' | 'maintenance' | 'training' | 'break';
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

const mockResources = [
  { id: '1', name: 'Анна Петрова', avatar: '', type: 'master' },
  { id: '2', name: 'Михаил Иванов', avatar: '', type: 'master' },
  { id: '3', name: 'Кабинет №1', avatar: '', type: 'room' },
  { id: '4', name: 'Аппарат УЗИ', avatar: '', type: 'equipment' }
];

const mockTimeOffBlocks: TimeOffBlock[] = [
  {
    id: '1',
    resourceId: '1',
    resourceName: 'Анна Петрова',
    type: 'vacation',
    title: 'Отпуск',
    description: 'Ежегодный отпуск',
    startDate: '2024-02-15',
    endDate: '2024-02-25',
    isAllDay: true,
    isRecurring: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    resourceId: '2',
    resourceName: 'Михаил Иванов',
    type: 'break',
    title: 'Обеденный перерыв',
    startDate: '2024-02-01',
    endDate: '2024-02-01',
    startTime: '13:00',
    endTime: '14:00',
    isAllDay: false,
    isRecurring: true,
    recurringType: 'daily',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    resourceId: '3',
    resourceName: 'Кабинет №1',
    type: 'maintenance',
    title: 'Техническое обслуживание',
    description: 'Плановая замена оборудования',
    startDate: '2024-02-20',
    endDate: '2024-02-20',
    startTime: '18:00',
    endTime: '22:00',
    isAllDay: false,
    isRecurring: false,
    createdAt: '2024-01-20T15:00:00Z'
  }
];

const blockTypes = {
  vacation: { 
    icon: <User className="w-4 h-4" />, 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    ru: 'Отпуск',
    en: 'Vacation'
  },
  sick: { 
    icon: <AlertTriangle className="w-4 h-4" />, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    ru: 'Больничный',
    en: 'Sick Leave'
  },
  maintenance: { 
    icon: <Wrench className="w-4 h-4" />, 
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    ru: 'Обслуживание',
    en: 'Maintenance'
  },
  training: { 
    icon: <GraduationCap className="w-4 h-4" />, 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    ru: 'Обучение',
    en: 'Training'
  },
  break: { 
    icon: <Coffee className="w-4 h-4" />, 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    ru: 'Перерыв',
    en: 'Break'
  }
};

const texts = {
  ru: {
    title: 'Расписание и блокировки',
    subtitle: 'Управление временем работы ресурсов',
    addBlock: 'Добавить блокировку',
    resource: 'Ресурс',
    type: 'Тип блокировки',
    period: 'Период',
    actions: 'Действия',
    edit: 'Редактировать',
    delete: 'Удалить',
    empty: 'Нет блокировок',
    emptyDescription: 'Добавьте первую блокировку для управления расписанием',
    dialog: {
      title: 'Новая блокировка',
      editTitle: 'Редактировать блокировку',
      resource: 'Выберите ресурс',
      blockType: 'Тип блокировки',
      blockTitle: 'Название',
      titlePlaceholder: 'Например: Отпуск, Обслуживание...',
      description: 'Описание',
      descriptionPlaceholder: 'Дополнительная информация...',
      startDate: 'Дата начала',
      endDate: 'Дата окончания',
      allDay: 'Весь день',
      startTime: 'Время начала',
      endTime: 'Время окончания',
      recurring: 'Повторяющаяся',
      recurringType: 'Тип повторения',
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
      save: 'Сохранить',
      cancel: 'Отмена',
      saving: 'Сохранение...'
    },
    deleteConfirm: 'Удалить блокировку?',
    deleteDescription: 'Это действие нельзя отменить.',
    blockSaved: 'Блокировка сохранена',
    blockDeleted: 'Блокировка удалена',
    error: 'Ошибка операции'
  },
  en: {
    title: 'Schedule & Time Off',
    subtitle: 'Manage resource availability',
    addBlock: 'Add Block',
    resource: 'Resource',
    type: 'Block Type',
    period: 'Period',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    empty: 'No blocks',
    emptyDescription: 'Add your first time block to manage schedule',
    dialog: {
      title: 'New Block',
      editTitle: 'Edit Block',
      resource: 'Select resource',
      blockType: 'Block type',
      blockTitle: 'Title',
      titlePlaceholder: 'e.g. Vacation, Maintenance...',
      description: 'Description',
      descriptionPlaceholder: 'Additional information...',
      startDate: 'Start Date',
      endDate: 'End Date',
      allDay: 'All Day',
      startTime: 'Start Time',
      endTime: 'End Time',
      recurring: 'Recurring',
      recurringType: 'Repeat Type',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...'
    },
    deleteConfirm: 'Delete block?',
    deleteDescription: 'This action cannot be undone.',
    blockSaved: 'Block saved',
    blockDeleted: 'Block deleted',
    error: 'Operation error'
  }
};

export function ScheduleTimeOffScreen({ 
  onBack, 
  state = 'default',
  locale = 'ru' 
}: ScheduleTimeOffScreenProps) {
  const [timeOffBlocks, setTimeOffBlocks] = useState(mockTimeOffBlocks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeOffBlock | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    resourceId: '',
    type: 'vacation' as keyof typeof blockTypes,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    isAllDay: true,
    isRecurring: false,
    recurringType: 'daily' as 'daily' | 'weekly' | 'monthly'
  });

  const t = texts[locale];

  const formatDateRange = (startDate: string, endDate: string, startTime?: string, endTime?: string, isAllDay?: boolean) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    
    const startStr = start.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', dateOptions);
    const endStr = end.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', dateOptions);
    
    let result = startDate === endDate ? startStr : `${startStr} - ${endStr}`;
    
    if (!isAllDay && startTime && endTime) {
      result += ` (${startTime} - ${endTime})`;
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({
      resourceId: '',
      type: 'vacation',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '18:00',
      isAllDay: true,
      isRecurring: false,
      recurringType: 'daily'
    });
    setEditingBlock(null);
  };

  const openDialog = (block?: TimeOffBlock) => {
    if (block) {
      setEditingBlock(block);
      setFormData({
        resourceId: block.resourceId,
        type: block.type,
        title: block.title,
        description: block.description || '',
        startDate: block.startDate,
        endDate: block.endDate,
        startTime: block.startTime || '09:00',
        endTime: block.endTime || '18:00',
        isAllDay: block.isAllDay,
        isRecurring: block.isRecurring,
        recurringType: block.recurringType || 'daily'
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!formData.resourceId || !formData.title || !formData.startDate) {
      toast.error(locale === 'ru' ? 'Заполните обязательные поля' : 'Fill required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const resource = mockResources.find(r => r.id === formData.resourceId);
      
      if (editingBlock) {
        // Update existing block
        setTimeOffBlocks(prev => prev.map(block => 
          block.id === editingBlock.id 
            ? {
                ...block,
                ...formData,
                resourceName: resource?.name || '',
              }
            : block
        ));
      } else {
        // Create new block
        const newBlock: TimeOffBlock = {
          id: Date.now().toString(),
          ...formData,
          resourceName: resource?.name || '',
          createdAt: new Date().toISOString()
        };
        setTimeOffBlocks(prev => [...prev, newBlock]);
      }
      
      toast.success(t.blockSaved);
      closeDialog();
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (blockId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimeOffBlocks(prev => prev.filter(block => block.id !== blockId));
      toast.success(t.blockDeleted);
    } catch (error) {
      toast.error(t.error);
    }
  };

  if (state === 'empty') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t.empty}</h3>
          <p className="text-muted-foreground mb-6">{t.emptyDescription}</p>
          <Button onClick={() => openDialog()} className="elegant-button">
            <Plus className="w-4 h-4 mr-2" />
            {t.addBlock}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="elegant-button">
              <Plus className="w-4 h-4 mr-2" />
              {t.addBlock}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBlock ? t.dialog.editTitle : t.dialog.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Resource Selection */}
              <div>
                <Label>{t.dialog.resource}</Label>
                <Select 
                  value={formData.resourceId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resourceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.dialog.resource} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockResources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs text-primary">
                                {resource.name.charAt(0)}
                              </span>
                            </div>
                          </Avatar>
                          <span>{resource.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Block Type */}
              <div>
                <Label>{t.dialog.blockType}</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: keyof typeof blockTypes) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(blockTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          <span>{type[locale]}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <Label>{t.dialog.blockTitle}</Label>
                <Input
                  placeholder={t.dialog.titlePlaceholder}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div>
                <Label>{t.dialog.description}</Label>
                <Textarea
                  placeholder={t.dialog.descriptionPlaceholder}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.dialog.startDate}</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.dialog.endDate}</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center justify-between">
                <Label>{t.dialog.allDay}</Label>
                <Switch
                  checked={formData.isAllDay}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: checked }))}
                />
              </div>

              {/* Time Range (if not all day) */}
              {!formData.isAllDay && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t.dialog.startTime}</Label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>{t.dialog.endTime}</Label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Recurring Toggle */}
              <div className="flex items-center justify-between">
                <Label>{t.dialog.recurring}</Label>
                <Switch
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                />
              </div>

              {/* Recurring Type */}
              {formData.isRecurring && (
                <div>
                  <Label>{t.dialog.recurringType}</Label>
                  <RadioGroup 
                    value={formData.recurringType} 
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                      setFormData(prev => ({ ...prev, recurringType: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">{t.dialog.daily}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">{t.dialog.weekly}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">{t.dialog.monthly}</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeDialog} className="flex-1">
                  {t.dialog.cancel}
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 elegant-button"
                >
                  {isLoading ? t.dialog.saving : t.dialog.save}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Time Off Blocks Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">{t.resource}</th>
                <th className="text-left p-4 font-medium">{t.type}</th>
                <th className="text-left p-4 font-medium">{t.period}</th>
                <th className="text-right p-4 font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {timeOffBlocks.map((block) => (
                  <motion.tr
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {block.resourceName.charAt(0)}
                            </span>
                          </div>
                        </Avatar>
                        <div>
                          <div className="font-medium">{block.resourceName}</div>
                          <div className="text-sm font-medium text-muted-foreground">{block.title}</div>
                          {block.description && (
                            <div className="text-xs text-muted-foreground">{block.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <Badge className={blockTypes[block.type].color}>
                        {blockTypes[block.type].icon}
                        <span className="ml-1">{blockTypes[block.type][locale]}</span>
                      </Badge>
                      {block.isRecurring && (
                        <div className="flex items-center gap-1 mt-1">
                          <Repeat className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {block.recurringType === 'daily' && t.dialog.daily}
                            {block.recurringType === 'weekly' && t.dialog.weekly}
                            {block.recurringType === 'monthly' && t.dialog.monthly}
                          </span>
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDateRange(
                            block.startDate, 
                            block.endDate, 
                            block.startTime, 
                            block.endTime, 
                            block.isAllDay
                          )}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(block)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(block.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {timeOffBlocks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {locale === 'ru' ? 'Нет блокировок' : 'No blocks'}
          </div>
        )}
      </Card>
    </div>
  );
}