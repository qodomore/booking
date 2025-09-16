import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, FileText, Calendar, Clock, ArrowLeft } from 'lucide-react';
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
import { toast } from "sonner@2.0.3";

interface ClientPageProps {
  clientId?: string;
}

export function ClientPage({ clientId = '1' }: ClientPageProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [clientAppointments, setClientAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestContactOpen, setIsSuggestContactOpen] = useState(false);
  const { hapticFeedback } = useTelegram();
  const { getClient, appointments } = useAppointments();

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = async () => {
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
    if (!client) return null;
    
    const confirmed = clientAppointments.filter(apt => apt.status === 'CONFIRMED').length;
    const pending = clientAppointments.filter(apt => apt.status === 'PENDING').length;
    const cancelled = clientAppointments.filter(apt => apt.status === 'CANCELLED').length;
    const totalSpent = clientAppointments
      .filter(apt => apt.status === 'CONFIRMED' && apt.price)
      .reduce((sum, apt) => sum + (apt.price || 0), 0);

    return { confirmed, pending, cancelled, totalSpent, total: clientAppointments.length };
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        <Card className="clean-card">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Клиент не найден</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getAppointmentStats();

  // Handler functions for NextVisitAdmin
  const handleBookOneClick = () => {
    hapticFeedback.light();
    toast.success('Запись создана в один тап!');
    // TODO: Implement booking logic
  };

  const handleSuggestToClient = () => {
    hapticFeedback.light();
    setIsSuggestContactOpen(true);
  };

  const handleEditSuggestion = () => {
    hapticFeedback.light();
    toast.info('Открытие редактора времени...');
    // TODO: Open time editor
  };

  const handleSendTelegram = () => {
    console.log('Send Telegram message to client');
  };

  const handleCallClient = () => {
    if (client?.phone) {
      window.open(`tel:${client.phone}`, '_self');
    }
  };

  const handleCopyText = () => {
    console.log('Copy suggestion text');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Client Information */}
      <Card className="clean-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-2xl">{client.name}</h1>
              <p className="text-sm text-muted-foreground">ID: {client.id}</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {client.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a
                  href={`tel:${client.phone}`}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {client.phone}
                </a>
              </div>
            )}

            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a
                  href={`mailto:${client.email}`}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {client.email}
                </a>
              </div>
            )}

            {client.notes && (
              <div className="flex items-start gap-3 pt-2 border-t border-border">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-2">Заметки</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {client.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NextVisit Admin Card */}
      <NextVisitAdminCard
        locale="ru"
        plan="pro"
        suggestedDate="Завтра"
        suggestedTime="14:00"
        service={{
          id: '1',
          name: 'Стрижка',
          duration: 60,
          price: 2500,
          smartPrice: 2200
        }}
        resources={[
          { id: '1', name: 'Анна Иванова', type: 'master' },
          { id: '2', name: 'Кабинет 3', type: 'room' }
        ]}
        onBookOneClick={handleBookOneClick}
        onSuggestToClient={handleSuggestToClient}
        onEdit={handleEditSuggestion}
      />

      {/* Statistics */}
      {stats && (
        <Card className="clean-card">
          <CardHeader className="pb-4">
            <h2 className="font-semibold text-xl">Статистика</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Всего записей</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold text-green-600">₽{stats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Потрачено</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm flex-wrap">
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

      <Separator />

      {/* Appointments History */}
      <div className="space-y-4">
        <h2 className="font-semibold text-xl">История записей</h2>
        
        {clientAppointments.length === 0 ? (
          <Card className="clean-card">
            <CardContent className="p-8 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Нет записей</h3>
              <p className="text-muted-foreground">У клиента пока нет записей</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {clientAppointments.map((appointment) => {
              const dateTime = formatDateTime(appointment.start);
              const endTime = formatDateTime(appointment.end);
              
              return (
                <Card key={appointment.id} className="clean-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{appointment.title}</h3>
                          <Badge className={`text-xs px-2 py-1 ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{dateTime.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{dateTime.time} — {endTime.time}</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm">{appointment.notes}</p>
                          </div>
                        )}
                      </div>

                      {appointment.price && (
                        <div className="text-right">
                          <p className="font-semibold text-xl">₽{appointment.price.toLocaleString()}</p>
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

      {/* Suggest Contact Sheet */}
      <SuggestContactSheet
        isOpen={isSuggestContactOpen}
        onClose={() => setIsSuggestContactOpen(false)}
        locale="ru"
        clientName={client.name}
        service={{
          name: 'Стрижка',
          date: 'завтра',
          time: '14:00',
          duration: 60,
          price: 2200,
          resources: ['Анна Иванова']
        }}
        onSendTelegram={handleSendTelegram}
        onCall={handleCallClient}
        onCopyText={handleCopyText}
      />
    </div>
  );
}