import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, FileText, Calendar, Clock, X, ArrowLeft } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from './ui/drawer';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { NextVisitAdminCard } from './ui/next-visit-admin-card';
import { SuggestContactSheet } from './ui/suggest-contact-sheet';
import { Client, Appointment } from '../types/appointment';
import { useTelegram } from '../hooks/useTelegram';
import { useAppointments } from '../hooks/useAppointments';

interface ClientDetailsDrawerProps {
  clientId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
}

export function ClientDetailsDrawer({
  clientId,
  isOpen,
  onClose,
  onBack
}: ClientDetailsDrawerProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [clientAppointments, setClientAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestSheetOpen, setIsSuggestSheetOpen] = useState(false);
  const { hapticFeedback } = useTelegram();
  const { getClient, appointments } = useAppointments();

  useEffect(() => {
    if (clientId && isOpen) {
      loadClientData();
    }
  }, [clientId, isOpen]);

  const loadClientData = async () => {
    if (!clientId) return;

    setIsLoading(true);
    try {
      const clientData = await getClient(clientId);
      setClient(clientData);

      // Получаем записи клиента
      const clientAppts = appointments.filter(apt => apt.client.id === clientId);
      // Сортируем по дате (новые сверху)
      clientAppts.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
      setClientAppointments(clientAppts);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('ru', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
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
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'Подтверждено';
      case 'PENDING': return 'Ожидает';
      case 'CANCELLED': return 'Отменено';
      default: return 'Неизвестно';
    }
  };

  const getAppointmentStats = () => {
    const confirmed = clientAppointments.filter(apt => apt.status === 'CONFIRMED').length;
    const pending = clientAppointments.filter(apt => apt.status === 'PENDING').length;
    const cancelled = clientAppointments.filter(apt => apt.status === 'CANCELLED').length;
    const totalSpent = clientAppointments
      .filter(apt => apt.status === 'CONFIRMED' && apt.price)
      .reduce((sum, apt) => sum + (apt.price || 0), 0);

    return { confirmed, pending, cancelled, totalSpent, total: clientAppointments.length };
  };

  const handleClose = () => {
    hapticFeedback.light();
    onClose();
  };

  const handleBack = () => {
    hapticFeedback.light();
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const handleBookOneClick = () => {
    hapticFeedback.light();
    // TODO: Открыть форму создания записи с предзаполненными данными
    console.log('Book one click for client:', client?.name);
  };

  const handleSuggestToClient = () => {
    hapticFeedback.light();
    setIsSuggestSheetOpen(true);
  };

  const handleEditSuggestion = () => {
    hapticFeedback.light();
    // TODO: Открыть форму редактирования рекомендации
    console.log('Edit suggestion for client:', client?.name);
  };

  const handleCloseSuggestSheet = () => {
    setIsSuggestSheetOpen(false);
  };

  if (!isOpen) return null;

  const stats = client ? getAppointmentStats() : null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DrawerTitle className="text-xl font-semibold">
              {isLoading ? 'Загрузка...' : 'Клиент'}
            </DrawerTitle>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-8 space-y-6 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : client ? (
            <>
              {/* Client Information */}
              <Card className="clean-card">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">{client.name}</h2>
                      <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {client.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${client.phone}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          {client.phone}
                        </a>
                      </div>
                    )}

                    {client.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${client.email}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          {client.email}
                        </a>
                      </div>
                    )}

                    {client.notes && (
                      <div className="flex items-start gap-3 pt-2 border-t border-border">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">Заметки</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {client.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              {stats && (
                <Card className="clean-card">
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold">Статистика</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{stats.total}</p>
                        <p className="text-sm text-muted-foreground">Всего записей</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">₽{stats.totalSpent.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Потрачено</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Подтверждено: {stats.confirmed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Ожидает: {stats.pending}</span>
                      </div>
                      {stats.cancelled > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Отменено: {stats.cancelled}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Visit Recommendation */}
              {client && clientAppointments.length > 0 && (
                <NextVisitAdminCard
                  locale="ru"
                  plan="pro"
                  suggestedDate="15 декабря"
                  suggestedTime="14:00"
                  service={{
                    id: '1',
                    name: 'Стрижка + укладка',
                    duration: 90,
                    price: 3500,
                    smartPrice: 3200
                  }}
                  resources={[
                    { id: '1', name: 'Анна Иванова', type: 'master' },
                    { id: '2', name: 'Кабинет 3', type: 'room' }
                  ]}
                  onBookOneClick={handleBookOneClick}
                  onSuggestToClient={handleSuggestToClient}
                  onEdit={handleEditSuggestion}
                />
              )}

              <Separator />

              {/* Appointments History */}
              <div className="space-y-4">
                <h3 className="font-semibold">История записей</h3>
                
                {clientAppointments.length === 0 ? (
                  <Card className="clean-card">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">У клиента пока нет записей</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {clientAppointments.map((appointment) => {
                      const dateTime = formatDateTime(appointment.start);
                      const endTime = formatDateTime(appointment.end);
                      
                      return (
                        <Card key={appointment.id} className="clean-card">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{appointment.title}</h4>
                                  <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(appointment.status)}`}>
                                    {getStatusText(appointment.status)}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{dateTime.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{dateTime.time} — {endTime.time}</span>
                                  </div>
                                </div>

                                {appointment.notes && (
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.notes}
                                  </p>
                                )}
                              </div>

                              {appointment.price && (
                                <div className="text-right">
                                  <p className="font-semibold">₽{appointment.price.toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Card className="clean-card">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Клиент не найден</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DrawerContent>

      {/* Suggest Contact Sheet */}
      <SuggestContactSheet
        isOpen={isSuggestSheetOpen}
        onClose={handleCloseSuggestSheet}
        locale="ru"
        clientName={client?.name || 'Клиент'}
        service={{
          name: 'Стрижка + укладка',
          date: '15 декабря',
          time: '14:00',
          duration: 90,
          price: 3200,
          resources: ['Анна Иванова']
        }}
        onSendTelegram={() => {
          console.log('Send Telegram to:', client?.name);
        }}
        onCall={() => {
          if (client?.phone) {
            window.location.href = `tel:${client.phone}`;
          }
        }}
        onCopyText={() => {
          console.log('Copy text for:', client?.name);
        }}
      />
    </Drawer>
  );
}