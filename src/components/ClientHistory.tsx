import React, { useState, useMemo } from 'react';
import { Search, User, Calendar, RotateCcw, Phone, MessageCircle, Filter, Users, CalendarPlus, Edit2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { FilterChips } from './ui/filter-chips';
import { ClientHistorySkeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { EditClientDialog } from './EditClientDialog';
import { NextVisitCard } from './ui/next-visit-card';
import { useResources, Client } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';
import { toast } from 'sonner@2.0.3';

interface Visit {
  id: string;
  date: string;
  service: string;
  resource: string;
  price: number;
  duration: number;
  status: 'completed' | 'no-show' | 'cancelled';
  notes?: string;
  rating?: number;
}

interface ExtendedClient extends Client {
  visits: Visit[];
  canRepeat: boolean;
  daysSinceLastVisit: number;
}

// Mock visits data
const mockVisits: Record<string, Visit[]> = {
  '1': [
    {
      id: 'v1',
      date: '2024-01-20',
      service: 'Базовая консультация',
      resource: 'Анна Иванова',
      price: 1500,
      duration: 60,
      status: 'completed',
      rating: 5,
      notes: 'Классический французский маникюр'
    },
    {
      id: 'v2',
      date: '2024-01-15',
      service: 'Дополнительная услуга',
      resource: 'Анна Иванова',
      price: 800,
      duration: 30,
      status: 'completed',
      rating: 5
    },
    {
      id: 'v3',
      date: '2024-01-10',
      service: 'Основная услуга',
      resource: 'Мария Петрова',
      price: 2500,
      duration: 90,
      status: 'completed',
      rating: 4
    }
  ],
  '2': [
    {
      id: 'v4',
      date: '2024-01-18',
      service: 'Основная услуга',
      resource: 'Мария Петрова',
      price: 2500,
      duration: 90,
      status: 'completed',
      rating: 5
    },
    {
      id: 'v5',
      date: '2024-01-05',
      service: 'Комплексное предложение',
      resource: 'Мария Петрова',
      price: 4500,
      duration: 180,
      status: 'completed',
      rating: 5
    }
  ]
};

export function ClientHistory() {
  const { clients } = useResources();
  const { hapticFeedback } = useTelegram();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedClient, setSelectedClient] = useState<ExtendedClient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extend clients with visit data
  const extendedClients: ExtendedClient[] = useMemo(() => {
    return clients.map(client => {
      const visits = mockVisits[client.id] || [];
      const lastVisitDate = client.lastVisit ? new Date(client.lastVisit) : null;
      const daysSinceLastVisit = lastVisitDate 
        ? Math.floor((Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      
      return {
        ...client,
        visits,
        canRepeat: visits.length > 0,
        daysSinceLastVisit
      };
    });
  }, [clients]);

  // Filter options
  const filterOptions = [
    { id: 'vip', label: 'VIP клиенты', icon: Users },
    { id: 'regular', label: 'Постоянные', icon: User },
    { id: 'recent', label: 'Недавние', icon: Calendar },
    { id: 'can-repeat', label: 'Можно повторить', icon: RotateCcw },
  ];

  // Apply filters
  const filteredClients = useMemo(() => {
    let filtered = extendedClients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Active filters
    activeFilters.forEach(filterId => {
      switch (filterId) {
        case 'vip':
          filtered = filtered.filter(client => client.totalSpent >= 10000);
          break;
        case 'regular':
          filtered = filtered.filter(client => client.totalVisits >= 5);
          break;
        case 'recent':
          filtered = filtered.filter(client => client.daysSinceLastVisit <= 30);
          break;
        case 'can-repeat':
          filtered = filtered.filter(client => client.canRepeat);
          break;
      }
    });

    // Sort by last visit (most recent first)
    return filtered.sort((a, b) => {
      const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
      const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
      return dateB - dateA;
    });
  }, [extendedClients, searchTerm, activeFilters]);

  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filterId)) {
        newFilters.delete(filterId);
      } else {
        newFilters.add(filterId);
      }
      return newFilters;
    });
  };

  const handleViewClient = (client: ExtendedClient) => {
    hapticFeedback.light();
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleRepeatBooking = (client: ExtendedClient, visitId?: string) => {
    hapticFeedback.success();
    
    if (visitId) {
      const visit = client.visits.find(v => v.id === visitId);
      if (visit) {
        toast.success(`Повторяем визит: ${visit.service}`, {
          description: `Мастер: ${visit.resource} • ${visit.duration} мин`
        });
        // TODO: Navigate to booking with pre-filled service and master
        // Здесь можно добавить навигацию к календарю с предзаполненными данными
      }
    } else {
      const lastVisit = client.visits[0]; // Последний визит
      if (lastVisit) {
        toast.success(`Повторяем услугу для ${client.name}`, {
          description: `${lastVisit.service} • ${lastVisit.resource}`
        });
        // TODO: Navigate to booking calendar filtered by preferred master
      }
    }
  };

  const handleBookWithSameResource = (client: ExtendedClient) => {
    hapticFeedback.medium();
    toast.success(`Создаем новую запись для ${client.name}`, {
      description: 'Переход к календарю бронирования...'
    });
    // TODO: Navigate to booking calendar with client pre-selected
    // Здесь можно добавить навигацию к BookingCalendarNew с предзаполненным клиентом
  };

  const handleEditClient = (client: Client) => {
    hapticFeedback.light();
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingClient(null);
  };

  const getStatusColor = (status: 'active' | 'inactive' | 'vip') => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getVisitStatusColor = (status: Visit['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'no-show': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getLastVisitText = (client: ExtendedClient) => {
    if (client.daysSinceLastVisit === 0) return 'Сегодня';
    if (client.daysSinceLastVisit === 1) return 'Вчера';
    if (client.daysSinceLastVisit <= 7) return `${client.daysSinceLastVisit} дн. назад`;
    if (client.daysSinceLastVisit <= 30) return `${Math.floor(client.daysSinceLastVisit / 7)} нед. назад`;
    return `${Math.floor(client.daysSinceLastVisit / 30)} мес. назад`;
  };

  // Set up filters with current data
  const currentFilters = filterOptions.map(filter => ({
    ...filter,
    active: activeFilters.has(filter.id),
    count: filter.id === 'vip' ? 
      extendedClients.filter(c => c.totalSpent >= 10000).length :
      filter.id === 'regular' ?
      extendedClients.filter(c => c.totalVisits >= 5).length :
      filter.id === 'recent' ?
      extendedClients.filter(c => c.daysSinceLastVisit <= 30).length :
      filter.id === 'can-repeat' ?
      extendedClients.filter(c => c.canRepeat).length :
      undefined
  }));

  if (isLoading) {
    return <ClientHistorySkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="gradient-text-elegant">История клиентов</h2>
        <p className="text-sm text-muted-foreground">
          {extendedClients.length} клиентов • {extendedClients.reduce((sum, c) => sum + c.totalVisits, 0)} визитов
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск по имени, телефону, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
        {searchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <button 
              onClick={() => setSearchTerm('')}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Фильтры:</h4>
        <FilterChips
          filters={currentFilters}
          onFilterToggle={handleFilterToggle}
          showFilterButton
          onFilterMenuOpen={() => {
            hapticFeedback.medium();
            // Open advanced filters sheet
          }}
        />
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredClients.length === extendedClients.length 
            ? `${filteredClients.length} клиентов` 
            : `${filteredClients.length} из ${extendedClients.length} клиентов`
          }
        </p>
        
        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Клиенты не найдены</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm 
              ? `По запросу "${searchTerm}" клиентов не найдено`
              : 'Попробуйте изменить фильтры'
            }
          </p>
          {activeFilters.size > 0 && (
            <button
              onClick={() => setActiveFilters(new Set())}
              className="text-sm text-primary hover:text-primary/80"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Clients List */}
      {filteredClients.length > 0 && (
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="clean-card hover:scale-[1.01] transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{client.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {client.totalSpent >= 10000 && (
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 text-xs">
                              VIP
                            </Badge>
                          )}
                          {client.totalVisits >= 5 && (
                            <Badge variant="secondary" className="text-xs">
                              Постоянный
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-3">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditClient(client)}
                          title="Редактировать клиента"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <a href={`tel:${client.phone}`} title="Позвонить">
                            <Phone className="h-3 w-3" />
                          </a>
                        </Button>
                        
                        {client.telegramUsername && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <a 
                              href={`https://t.me/${client.telegramUsername}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              title="Написать в Telegram"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
                      <div>
                        <p className="truncate">{client.phone}</p>
                        {client.telegramUsername && (
                          <p className="truncate">@{client.telegramUsername}</p>
                        )}
                        <p>Последний визит: {getLastVisitText(client)}</p>
                      </div>
                      <div>
                        <p>{client.totalVisits} визитов</p>
                        <p>₽{client.totalSpent.toLocaleString()} потрачено</p>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewClient(client)}
                        className="flex-1"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Подробнее
                      </Button>
                      
                      {client.canRepeat && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRepeatBooking(client)}
                          className="flex-1"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Повторить
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        className="elegant-button flex-1"
                        onClick={() => handleBookWithSameResource(client)}
                      >
                        <CalendarPlus className="h-3 w-3 mr-1" />
                        Забронировать
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Client Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedClient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="gradient-text-elegant">{selectedClient.name}</span>
                    <p className="text-sm text-muted-foreground font-normal">
                      {selectedClient.totalVisits} визитов • ₽{selectedClient.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Client Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClient(selectedClient)}
                      className="ml-auto"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Редактировать
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm text-muted-foreground">Телефон</p>
                      <p className="font-medium">{selectedClient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Средний чек</p>
                      <p className="font-medium">₽{Math.round(selectedClient.totalSpent / selectedClient.totalVisits).toLocaleString()}</p>
                    </div>
                    {selectedClient.email && (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedClient.email}</p>
                      </div>
                    )}
                    {selectedClient.telegramUsername && (
                      <div>
                        <p className="text-sm text-muted-foreground">Telegram</p>
                        <p className="font-medium">@{selectedClient.telegramUsername}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Контакт</p>
                      <p className="font-medium">
                        {selectedClient.preferredContact === 'phone' ? 'Телефон' :
                         selectedClient.preferredContact === 'email' ? 'Email' :
                         selectedClient.preferredContact === 'telegram' ? 'Telegram' : 'WhatsApp'}
                      </p>
                    </div>
                    {selectedClient.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Заметки</p>
                        <p className="font-medium">{selectedClient.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visit History */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">История визитов</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.visits.length} записей
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedClient.visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-card border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{formatDate(visit.date)}</span>
                            <Badge className={getVisitStatusColor(visit.status)}>
                              {visit.status === 'completed' ? 'Завершено' :
                               visit.status === 'no-show' ? 'Не пришел' : 'Отменено'}
                            </Badge>
                            {visit.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm">{visit.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm font-medium truncate">{visit.service}</p>
                          <p className="text-xs text-muted-foreground">
                            {visit.resource} • {visit.duration} мин
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-3">
                          <span className="font-semibold text-primary">
                            ₽{visit.price.toLocaleString()}
                          </span>
                          
                          {visit.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRepeatBooking(selectedClient, visit.id)}
                              className="h-8 px-2"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Visit Suggestion */}
                {selectedClient.canRepeat && (
                  <NextVisitCard
                    locale="ru"
                    plan="free" // Можно передавать план пользователя из пропсов
                    suggestedDate="через неделю"
                    suggestedTime="14:00"
                    resources={[
                      { 
                        id: 'last-master', 
                        name: selectedClient.visits[0]?.resource || 'Ваш мастер', 
                        type: 'master' 
                      }
                    ]}
                    onBookOneClick={() => {
                      hapticFeedback.success();
                      toast.success('Записываем на следующий визит', {
                        description: 'Переход к подтверждению записи...'
                      });
                      // TODO: Navigate to booking confirmation with pre-filled data
                    }}
                    onChooseTime={() => {
                      hapticFeedback.light();
                      toast.info('Выбираем другое время', {
                        description: 'Переход к календарю...'
                      });
                      // TODO: Navigate to calendar with pre-filled service
                    }}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleRepeatBooking(selectedClient)}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Повторить предложение
                  </Button>
                  
                  <Button
                    className="elegant-button flex-1"
                    onClick={() => handleBookWithSameResource(selectedClient)}
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Новое бронирование
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <EditClientDialog
        client={editingClient}
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
      />
    </div>
  );
}