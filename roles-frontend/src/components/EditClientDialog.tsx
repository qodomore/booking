import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MessageCircle, Edit2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useResources, Client } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';
import { toast } from 'sonner@2.0.3';

interface EditClientDialogProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ClientForm {
  name: string;
  phone: string;
  email: string;
  telegramUsername: string;
  preferredContact: 'phone' | 'email' | 'telegram' | 'whatsapp';
  notes: string;
}

export function EditClientDialog({ client, isOpen, onClose }: EditClientDialogProps) {
  const { updateClient } = useResources();
  const { hapticFeedback } = useTelegram();
  
  const [form, setForm] = useState<ClientForm>({
    name: '',
    phone: '',
    email: '',
    telegramUsername: '',
    preferredContact: 'phone',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Заполняем форму данными клиента
  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        phone: client.phone,
        email: client.email || '',
        telegramUsername: client.telegramUsername || '',
        preferredContact: client.preferredContact,
        notes: client.notes || ''
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client || !form.name.trim()) {
      toast.error('Введите имя клиента');
      return;
    }

    setIsSubmitting(true);
    hapticFeedback.light();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedClient: Partial<Client> = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        telegramUsername: form.telegramUsername.trim() || undefined,
        telegramNick: form.telegramUsername.trim() ? `@${form.telegramUsername.trim()}` : undefined,
        preferredContact: form.preferredContact,
        notes: form.notes.trim() || undefined
      };

      updateClient(client.id, updatedClient);
      
      toast.success('Данные клиента обновлены!');
      onClose();
      
    } catch (error) {
      toast.error('Ошибка при обновлении данных');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Редактировать клиента
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Имя */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Полное имя *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Введите полное имя"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Телефон */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Телефон
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={form.phone}
              onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          {/* Telegram Username */}
          <div className="space-y-2">
            <Label htmlFor="telegram" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Telegram username
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                @
              </div>
              <Input
                id="telegram"
                type="text"
                placeholder="username"
                value={form.telegramUsername}
                onChange={(e) => setForm(prev => ({ ...prev, telegramUsername: e.target.value.replace('@', '') }))}
                className="pl-8"
              />
            </div>
          </div>

          {/* Предпочитаемый способ связи */}
          <div className="space-y-2">
            <Label>Предпочитаемый способ связи</Label>
            <Select 
              value={form.preferredContact} 
              onValueChange={(value: 'phone' | 'email' | 'telegram' | 'whatsapp') => 
                setForm(prev => ({ ...prev, preferredContact: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Телефон</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Заметки */}
          <div className="space-y-2">
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              placeholder="Дополнительная информация о клиенте"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.name.trim()}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}