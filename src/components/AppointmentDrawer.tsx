import React from 'react';
import { Calendar, Clock, User, Phone, CreditCard, FileText, ArrowRight, Edit, Calendar as CalendarIcon, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from './ui/drawer';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent } from './ui/card';
import { Appointment } from '../types/appointment';
import { useTelegram } from '../hooks/useTelegram';
import { useResources } from '../contexts/ResourceContext';

interface AppointmentDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onOpenClient?: (clientId: string) => void;
}

export function AppointmentDrawer({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onReschedule,
  onCancel,
  onOpenClient
}: AppointmentDrawerProps) {
  const { hapticFeedback } = useTelegram();
  const { getResourcesByType } = useResources();

  if (!appointment) return null;

  const specialists = getResourcesByType('specialist');
  const resource = specialists.find(s => s.id === appointment.resourceId);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('ru', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }),
      time: date.toLocaleTimeString('ru', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'Подтверждено';
      case 'PENDING': return 'Ожидает подтверждения';
      case 'CANCELLED': return 'Отменено';
      default: return 'Неизвестно';
    }
  };

  const getDuration = () => {
    const start = new Date(appointment.start);
    const end = new Date(appointment.end);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return diffMins;
  };

  const startDateTime = formatDateTime(appointment.start);
  const endDateTime = formatDateTime(appointment.end);

  const handleOpenClient = () => {
    hapticFeedback.medium();
    if (onOpenClient) {
      onOpenClient(appointment.client.id);
    }
  };

  const handleEdit = () => {
    hapticFeedback.light();
    if (onEdit) {
      onEdit(appointment);
    }
  };

  const handleReschedule = () => {
    hapticFeedback.light();
    if (onReschedule) {
      onReschedule(appointment);
    }
  };

  const handleCancel = () => {
    hapticFeedback.medium();
    if (onCancel) {
      onCancel(appointment);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle className="text-xl font-semibold">
            Запись
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-8 space-y-6 overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </Badge>
            <div className="text-sm text-muted-foreground">
              ID: {appointment.id}
            </div>
          </div>

          {/* Service Information */}
          <Card className="clean-card">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{appointment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Длительность: {getDuration()} мин
                  </p>
                </div>
                {appointment.price && (
                  <div className="text-right">
                    <p className="font-semibold text-lg">₽{appointment.price.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="clean-card">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Время записи</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {startDateTime.date}
                  </p>
                  <p className="font-medium">
                    {startDateTime.time} — {endDateTime.time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specialist */}
          {resource && (
            <Card className="clean-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Ресурс</h3>
                    <p className="text-sm text-muted-foreground">{resource.name}</p>
                    {resource.skills && resource.skills.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {resource.skills.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client Information */}
          <Card className="clean-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Клиент</h3>
                  <button
                    onClick={handleOpenClient}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1 mt-1"
                  >
                    {appointment.client.name}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  {appointment.client.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {appointment.client.phone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {appointment.notes && (
            <Card className="clean-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Заметки</h3>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleOpenClient}
              variant="outline"
              className="w-full gap-2"
            >
              <User className="h-4 w-4" />
              Открыть клиента
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="gap-2"
                disabled={appointment.status === 'CANCELLED'}
              >
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
              
              <Button
                onClick={handleReschedule}
                variant="outline"
                className="gap-2"
                disabled={appointment.status === 'CANCELLED'}
              >
                <CalendarIcon className="h-4 w-4" />
                Перенести
              </Button>
            </div>

            {appointment.status !== 'CANCELLED' && (
              <Button
                onClick={handleCancel}
                variant="destructive"
                className="w-full"
              >
                Отменить запись
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}