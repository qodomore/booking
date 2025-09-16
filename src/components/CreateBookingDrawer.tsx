import React, { useState } from 'react';
import { X, Calendar, Clock, User, Grid3X3, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useResources, Client } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';
import { toast } from 'sonner@2.0.3';

interface CreateBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: {
    resourceId: string;
    resourceName: string;
    timeSlot: string;
  } | null;
  onBookingCreated: (booking: any) => void;
}

interface BookingForm {
  serviceId: string;
  clientName: string;
  clientPhone: string;
  duration: string;
  notes: string;
}

export function CreateBookingDrawer({ 
  isOpen, 
  onClose, 
  selectedSlot, 
  onBookingCreated 
}: CreateBookingDrawerProps) {
  const { services, clients, addClient, updateClient } = useResources();
  const { hapticFeedback } = useTelegram();

  const [form, setForm] = useState<BookingForm>({
    serviceId: '',
    clientName: '',
    clientPhone: '',
    duration: '30',
    notes: ''
  });

  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients);

  // Автоматически обновляем длительность при выборе услуги
  React.useEffect(() => {
    if (form.serviceId) {
      const selectedService = services.find(s => s.id === form.serviceId);
      if (selectedService) {
        setForm(prev => ({ 
          ...prev, 
          duration: selectedService.duration.toString() 
        }));
      }
    }
  }, [form.serviceId, services]);

  // Фильтруем клиентов при изменении имени
  React.useEffect(() => {
    if (form.clientName.length > 0) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(form.clientName.toLowerCase()) ||
        client.phone.includes(form.clientName)
      );
      setFilteredClients(filtered);
      setShowClientSuggestions(filtered.length > 0 && form.clientName.length > 1);
    } else {
      setFilteredClients([]);
      setShowClientSuggestions(false);
    }
  }, [form.clientName, clients]);

  const handleClientSelect = (client: Client) => {
    setForm(prev => ({
      ...prev,
      clientName: client.name,
      clientPhone: client.phone
    }));
    setShowClientSuggestions(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const durations = [
    { value: '30', label: '30 минут' },
    { value: '60', label: '1 час' },
    { value: '90', label: '1.5 часа' },
    { value: '120', label: '2 часа' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !form.serviceId || !form.clientName) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    hapticFeedback.light();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const selectedService = services.find(s => s.id === form.serviceId);
      const servicePrice = selectedService?.price || 0;
      
      // Проверяем, существует ли клиент
      const existingClient = clients.find(client => 
        client.name.toLowerCase() === form.clientName.toLowerCase() || 
        (form.clientPhone && client.phone === form.clientPhone)
      );

      let clientId: string;
      
      if (existingClient) {
        // Обновляем существующего клиента
        updateClient(existingClient.id, {
          name: form.clientName, // Обновляем имя на случай, если было изменено
          phone: form.clientPhone || existingClient.phone,
          totalVisits: existingClient.totalVisits + 1,
          totalSpent: existingClient.totalSpent + servicePrice,
          lastVisit: new Date()
        });
        clientId = existingClient.id;
        toast.success('Запись создана! Данные клиента обновлены.');
      } else {
        // Создаем нового клиента
        const newClient = {
          name: form.clientName,
          phone: form.clientPhone || '',
          preferredContact: (form.clientPhone ? 'phone' : 'telegram') as 'phone' | 'email' | 'telegram' | 'whatsapp',
          notes: form.notes || '',
          totalVisits: 1,
          totalSpent: servicePrice,
          lastVisit: new Date()
        };
        addClient(newClient);
        clientId = Date.now().toString(); // Будет заменен на реальный ID в addClient
        toast.success('Запись создана! Новый клиент добавлен в базу.');
      }
      
      const booking = {
        id: Date.now().toString(),
        resourceId: selectedSlot.resourceId,
        resourceName: selectedSlot.resourceName,
        startTime: selectedSlot.timeSlot,
        service: selectedService?.name || 'Услуга',
        client: form.clientName,
        phone: form.clientPhone,
        duration: parseInt(form.duration),
        notes: form.notes,
        price: servicePrice,
        clientId: clientId, // Добавляем ID клиента к записи
        createdAt: new Date().toISOString()
      };

      onBookingCreated(booking);
      
      // Reset form
      setForm({
        serviceId: '',
        clientName: '',
        clientPhone: '',
        duration: '30',
        notes: ''
      });
      
    } catch (error) {
      toast.error('Ошибка при создании записи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (startTime: string, duration: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(duration);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const selectedService = services.find(s => s.id === form.serviceId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-3xl border border-border animate-elegant-fade-in shadow-2xl" style={{ maxHeight: '70vh' }}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background rounded-t-3xl">
          <div>
            <h2 className="font-semibold text-lg">Создать запись</h2>
            {selectedSlot && (
              <p className="text-sm text-muted-foreground">
                {selectedSlot.resourceName} • {selectedSlot.timeSlot}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full w-8 h-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content and Buttons - All Scrollable */}
        <div 
          className="overflow-y-auto telegram-scroll" 
          style={{ 
            maxHeight: 'calc(70vh - 100px)', 
            touchAction: 'pan-y', 
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Slot Info */}
              {selectedSlot && (
                <Card className="glass-card border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {selectedSlot.resourceName}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {selectedSlot.timeSlot}
                            {form.duration && ` - ${calculateEndTime(selectedSlot.timeSlot, form.duration)}`}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Выбранный слот времени
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Услуга *
                </Label>
                <Select 
                  value={form.serviceId} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, serviceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{service.name}</span>
                          <span className="text-muted-foreground ml-2">
                            ₽{service.price.toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedService && (
                  <p className="text-xs text-muted-foreground">
                    {selectedService.duration} мин • ₽{selectedService.price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Длительность
                </Label>
                <Select 
                  value={form.duration} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Client Name */}
              <div className="space-y-2 relative">
                <Label htmlFor="clientName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Имя клиента *
                </Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Введите имя клиента"
                  value={form.clientName}
                  onChange={(e) => setForm(prev => ({ ...prev, clientName: e.target.value }))}
                  onFocus={() => form.clientName.length > 1 && setShowClientSuggestions(filteredClients.length > 0)}
                  onBlur={() => setTimeout(() => setShowClientSuggestions(false), 150)}
                  required
                />
                
                {/* Client Suggestions Dropdown */}
                {showClientSuggestions && filteredClients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-32 overflow-y-auto">
                    {filteredClients.slice(0, 5).map((client) => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{client.name}</p>
                            <p className="text-xs text-muted-foreground">{client.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{client.totalVisits} визитов</p>
                            <p className="text-xs text-muted-foreground">₽{client.totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Phone */}
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Телефон</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={form.clientPhone}
                  onChange={(e) => setForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                />
                {form.clientPhone && clients.some(c => c.phone === form.clientPhone) && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Найден существующий клиент
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Заметки</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Дополнительная информация"
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              {/* Summary */}
              {selectedService && form.clientName && (
                <Card className="glass-card border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-2 text-green-800 dark:text-green-200">
                      Сводка записи
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Клиент:</span> {form.clientName}</p>
                      <p><span className="text-muted-foreground">Услуга:</span> {selectedService.name}</p>
                      <p><span className="text-muted-foreground">Время:</span> {selectedSlot?.timeSlot} - {selectedSlot && calculateEndTime(selectedSlot.timeSlot, form.duration)}</p>
                      <p><span className="text-muted-foreground">Стоимость:</span> ₽{selectedService.price.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Buttons - Now part of scrollable content */}
              <div className="pt-4 border-t border-border">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!form.serviceId || !form.clientName || isSubmitting}
                    className="flex-1 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Создание...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Создать
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}