import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, CreditCard, MapPin, Edit, Trash2, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { BookingStatusDialog } from './BookingStatusDialog';
import { useTelegram } from '../hooks/useTelegram';
import { toast } from 'sonner@2.0.3';

interface BookingDetails {
  id: string;
  client: string;
  service: string;
  startTime: string;
  endTime: string;
  resourceName: string;
  state: 'confirmed' | 'pending' | 'blocked' | 'overdue' | 'completed' | 'cancelled';
  phone?: string;
  price?: number;
  notes?: string;
  createdAt: string;
}

interface BookingDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails | null;
  onEdit?: (booking: BookingDetails) => void;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (booking: BookingDetails) => void;
  onStatusChange?: (bookingId: string, newStatus: string, notes?: string) => void;
}

export function BookingDetailsDrawer({ 
  isOpen, 
  onClose, 
  booking,
  onEdit,
  onCancel,
  onReschedule,
  onStatusChange
}: BookingDetailsDrawerProps) {
  const { hapticFeedback } = useTelegram();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  if (!isOpen || !booking) return null;

  const getStateStyles = (state: BookingDetails['state']) => {
    switch (state) {
      case 'confirmed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'blocked':
        return 'bg-muted text-muted-foreground border-border';
      case 'overdue':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStateText = (state: BookingDetails['state']) => {
    switch (state) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает подтверждения';
      case 'blocked': return 'Заблокировано';
      case 'overdue': return 'Просрочено';
      case 'completed': return 'Выполнено';
      case 'cancelled': return 'Отменено';
      default: return '';
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(booking);
      hapticFeedback.light();
    }
  };

  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(booking);
      hapticFeedback.light();
    }
  };

  const handleCancel = async () => {
    try {
      if (onCancel) {
        await onCancel(booking.id);
        toast.success('Запись отменена');
        hapticFeedback.success();
        onClose();
      }
    } catch (error) {
      toast.error('Ошибка при отмене записи');
      hapticFeedback.error();
    }
    setIsConfirmDialogOpen(false);
  };

  const handleStatusChange = (bookingId: string, newStatus: string, notes?: string) => {
    if (onStatusChange) {
      onStatusChange(bookingId, newStatus, notes);
      hapticFeedback.medium();
    }
    setIsStatusDialogOpen(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end">
      <div className="w-full max-w-md mx-auto bg-background rounded-t-3xl border-t border-border animate-elegant-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-semibold text-lg">Детали записи</h2>
            <Badge className={`mt-1 ${getStateStyles(booking.state)}`}>
              {getStateText(booking.state)}
            </Badge>
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

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Client Info */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{booking.client}</h3>
                  {booking.phone && (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{booking.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service & Time */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Детали услуги</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.service}</p>
                    <p className="text-sm text-muted-foreground">{booking.resourceName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>

                {booking.price && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">₽{booking.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Стоимость услуги</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {booking.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Заметки</h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {booking.notes}
                  </p>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Информация о записи</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>ID: {booking.id}</p>
                <p>Создано: {formatDateTime(booking.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="space-y-3">
            {/* Status Change Action */}
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(true)}
              className="w-full gap-2"
              disabled={booking.state === 'blocked'}
            >
              <RotateCcw className="h-4 w-4" />
              Изменить статус
            </Button>

            {/* Primary Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex-1 gap-2"
                disabled={booking.state === 'blocked'}
              >
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
              <Button
                variant="outline"
                onClick={handleReschedule}
                className="flex-1 gap-2"
                disabled={booking.state === 'blocked'}
              >
                <MapPin className="h-4 w-4" />
                Перенести
              </Button>
            </div>

            {/* Cancel Action */}
            {booking.state !== 'blocked' && (
              <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Отменить запись
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Отменить запись?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите отменить запись для {booking.client} на {booking.startTime}? 
                      Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Оставить</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleCancel}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Отменить запись
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* Status Change Dialog */}
      <BookingStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        booking={booking ? {
          id: booking.id,
          client: booking.client,
          service: booking.service,
          startTime: booking.startTime,
          endTime: booking.endTime,
          state: booking.state
        } : null}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}