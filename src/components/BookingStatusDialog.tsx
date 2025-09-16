import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Ban, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useTelegram } from '../hooks/useTelegram';
import { toast } from 'sonner@2.0.3';

interface BookingStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    client: string;
    service: string;
    startTime: string;
    endTime: string;
    state: 'confirmed' | 'pending' | 'blocked' | 'overdue' | 'completed' | 'cancelled';
  } | null;
  onStatusChange: (bookingId: string, newStatus: string, notes?: string) => void;
}

interface StatusOption {
  id: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'blocked' | 'overdue';
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  disabled?: boolean;
}

export function BookingStatusDialog({ 
  isOpen, 
  onClose, 
  booking, 
  onStatusChange 
}: BookingStatusDialogProps) {
  const { hapticFeedback } = useTelegram();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions: StatusOption[] = [
    {
      id: 'confirmed',
      label: 'Подтверждена',
      description: 'Запись подтверждена клиентом',
      icon: CheckCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10 border-primary/20',
    },
    {
      id: 'pending',
      label: 'Ожидает подтверждения',
      description: 'Ждем подтверждения от клиента',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
    },
    {
      id: 'completed',
      label: 'Выполнена',
      description: 'Услуга оказана успешно',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
    },
    {
      id: 'cancelled',
      label: 'Отменена',
      description: 'Запись отменена',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
    },
    {
      id: 'overdue',
      label: 'Просрочена',
      description: 'Клиент не пришел на запись',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
    },
    {
      id: 'blocked',
      label: 'Заблокирована',
      description: 'Время заблокировано для записей',
      icon: Ban,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200',
    },
  ];

  const handleSubmit = async () => {
    if (!booking || !selectedStatus) {
      toast.error('Выберите новый статус');
      return;
    }

    if (selectedStatus === booking.state) {
      toast.error('Выбранный статус уже установлен');
      return;
    }

    setIsSubmitting(true);
    hapticFeedback.light();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      onStatusChange(booking.id, selectedStatus, notes || undefined);
      
      const statusOption = statusOptions.find(opt => opt.id === selectedStatus);
      toast.success(`Статус изменен на "${statusOption?.label}"`);
      
      // Reset state
      setSelectedStatus('');
      setNotes('');
      onClose();
      
    } catch (error) {
      toast.error('Ошибка при изменении статуса');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedStatus('');
      setNotes('');
      onClose();
    }
  };

  if (!booking) return null;

  const currentStatus = statusOptions.find(opt => opt.id === booking.state);
  const selectedStatusOption = statusOptions.find(opt => opt.id === selectedStatus);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Изменить статус записи
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Booking Info */}
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{booking.client}</span>
                <span className="text-sm text-muted-foreground">
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{booking.service}</span>
                {currentStatus && (
                  <Badge className={`${currentStatus.bgColor} ${currentStatus.color} border`}>
                    {currentStatus.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Выберите новый статус:</Label>
            <div className="grid gap-2">
              {statusOptions.map((status) => {
                const Icon = status.icon;
                const isSelected = selectedStatus === status.id;
                const isCurrent = booking.state === status.id;
                
                return (
                  <button
                    key={status.id}
                    onClick={() => {
                      if (!isCurrent) {
                        setSelectedStatus(status.id);
                        hapticFeedback.light();
                      }
                    }}
                    disabled={isCurrent}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/5' 
                        : isCurrent
                          ? 'border-muted bg-muted/50 opacity-50 cursor-not-allowed'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center mt-0.5
                      ${isSelected ? 'bg-primary text-primary-foreground' : status.bgColor}
                    `}>
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : status.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{status.label}</span>
                        {isCurrent && (
                          <Badge variant="secondary" className="text-xs">
                            Текущий
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {status.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          {selectedStatus && selectedStatus !== booking.state && (
            <div className="space-y-2">
              <Label htmlFor="notes">
                Комментарий к изменению статуса (необязательно)
              </Label>
              <Textarea
                id="notes"
                placeholder="Добавьте комментарий к изменению статуса..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Preview */}
          {selectedStatusOption && selectedStatus !== booking.state && (
            <div className="p-3 rounded-lg bg-accent/30 border border-accent">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Статус изменится с</span>
                <Badge className={`${currentStatus?.bgColor} ${currentStatus?.color} border text-xs`}>
                  {currentStatus?.label}
                </Badge>
                <span className="text-muted-foreground">на</span>
                <Badge className={`${selectedStatusOption.bgColor} ${selectedStatusOption.color} border text-xs`}>
                  {selectedStatusOption.label}
                </Badge>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedStatus || selectedStatus === booking.state || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Изменяем...
                </>
              ) : (
                'Изменить статус'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}