import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Filter, 
  Plus,
  MoreVertical,
  Eye,
  MessageCircle,
  Calendar,
  TrendingUp,
  UserPlus,
  Download,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ClientDetailsDrawer } from './ClientDetailsDrawer';
import { useTelegram } from '../hooks/useTelegram';

interface ClientDatabaseProps {
  onBack: () => void;
}

const mockClients = [
  {
    id: 1,
    name: 'Анна Петрова',
    phone: '+7 (999) 123-45-67',
    email: 'anna@example.com',
    visits: 12,
    lastVisit: '2024-03-15',
    totalSpent: 45600,
    segment: 'VIP',
    status: 'active'
  },
  {
    id: 2,
    name: 'Мария Иванова',
    phone: '+7 (999) 234-56-78',
    email: 'maria@example.com',
    visits: 8,
    lastVisit: '2024-03-10',
    totalSpent: 28900,
    segment: 'Regular',
    status: 'active'
  },
  {
    id: 3,
    name: 'Елена Сидорова',
    phone: '+7 (999) 345-67-89',
    email: 'elena@example.com',
    visits: 3,
    lastVisit: '2024-02-28',
    totalSpent: 9500,
    segment: 'New',
    status: 'inactive'
  }
];

const analyticsData = [
  { label: 'Всего клиентов', value: '1,247', change: '+12%', icon: Users },
  { label: 'Активных клиентов', value: '856', change: '+8%', icon: TrendingUp },
  { label: 'Новых за месяц', value: '89', change: '+24%', icon: UserPlus },
  { label: 'Средний чек', value: '3,450₽', change: '+15%', icon: BarChart3 }
];

export function ClientDatabase({ onBack }: ClientDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const telegram = useTelegram();

  const handleClientAction = (action: string, clientId: string | number, clientName: string) => {
    if (telegram?.hapticFeedback) {
      telegram.hapticFeedback.impactOccurred('light');
    }
    
    switch (action) {
      case 'view':
        setSelectedClientId(clientId.toString());
        setIsClientDetailsOpen(true);
        break;
      case 'message':
        telegram?.showAlert?.(`Отправка сообщения клиенту: ${clientName}`);
        break;
      case 'book':
        telegram?.showAlert?.(`Создание записи для: ${clientName}`);
        break;
    }
  };

  const handleCloseClientDetails = () => {
    setIsClientDetailsOpen(false);
    setSelectedClientId(null);
  };

  const getSegmentBadge = (segment: string) => {
    const variants = {
      'VIP': 'default',
      'Regular': 'secondary',
      'New': 'outline'
    };
    return variants[segment] || 'outline';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-muted/50 active:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">База клиентов</h2>
            <p className="text-sm text-muted-foreground">Управление клиентской базой</p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.value}</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {item.change}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск клиентов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>

          {/* Segment Filter */}
          <div className="flex gap-2">
            {['all', 'VIP', 'Regular', 'New'].map((segment) => (
              <Button
                key={segment}
                variant={selectedSegment === segment ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSegment(segment)}
                className="text-xs px-3 py-1.5 h-auto"
              >
                {segment === 'all' ? 'Все' : segment}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Client List */}
      <div className="space-y-3">
        {mockClients
          .filter(client => 
            selectedSegment === 'all' || client.segment === selectedSegment
          )
          .filter(client =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone.includes(searchQuery) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((client) => (
            <Card key={client.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{client.name}</h3>
                      <Badge variant={getSegmentBadge(client.segment)} className="text-xs px-2 py-0.5">
                        {client.segment}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{client.phone}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Визитов: {client.visits}</span>
                        <span>Потрачено: {client.totalSpent.toLocaleString()}₽</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => handleClientAction('view', client.id, client.name)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => handleClientAction('message', client.id, client.name)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => handleClientAction('book', client.id, client.name)}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Export and Settings */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium">Управление данными</h3>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                if (telegram?.hapticFeedback) {
                  telegram.hapticFeedback.impactOccurred('light');
                }
                telegram?.showAlert?.('Экспорт клиентской базы в CSV формате начат');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Экспорт данных
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                if (telegram?.hapticFeedback) {
                  telegram.hapticFeedback.impactOccurred('light');
                }
                telegram?.showAlert?.('Настройки сегментации клиентов:\n\n• Автоматическая сегментация по активности\n• Настройка критериев VIP статуса\n• Персонализированные метрики');
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </Button>
          </div>
        </div>
      </Card>

      {/* Client Details Drawer */}
      <ClientDetailsDrawer
        clientId={selectedClientId}
        isOpen={isClientDetailsOpen}
        onClose={handleCloseClientDetails}
      />
    </motion.div>
  );
}