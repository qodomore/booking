import React, { useState } from "react";
import { 
  Brain, 
  Zap, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  RefreshCw,
  MoreHorizontal,
  CheckCircle,
  Clock,
  MessageSquare,
  Target,
  Sparkles,
  LayoutGrid,
  List,
  Settings,
  ArrowLeft
} from "lucide-react";
import { useTelegram } from '../hooks/useTelegram';
import { toast } from 'sonner@2.0.3';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { KPICard } from "./ui/kpi-card";
import { SegmentChip } from "./ui/segment-chip";
import { ActionTableRow } from "./ui/action-table-row";
import { ActionCard } from "./ui/action-card";
import { PlaybookCard } from "./ui/playbook-card";
import { TemplatePreview } from "./ui/template-preview";
import { AutopilotLogItem } from "./ui/autopilot-log-item";
import { BulkActionsBar } from "./ui/bulk-actions-bar";
import { EmptyState } from "./ui/empty-state";
import { ReasonChipGroup } from "./ui/reason-chip";

// Типы бизнеса с адаптированным контентом
const businessTypes = [
  { 
    id: 'beauty', 
    label: 'Салон', 
    kpiLabels: {
      risk: 'В зоне риска',
      retention: 'Прогноз удержанной выручки',
      returned: 'Вернулось за период',
      accuracy: 'Точность прогноза'
    },
    segments: ['Высокий риск', 'Средний', 'Низкий', 'VIP', 'Давно не был', 'Скоро процедура'],
    playbooks: [
      { id: 1, title: 'Возврат после долгого отсутствия', trigger: '60+ дней без визита', effectiveness: '85%' },
      { id: 2, title: 'VIP клиент недоволен', trigger: 'Низкая оценка + высокий ARPU', effectiveness: '92%' },
      { id: 3, title: 'Напоминание о записи', trigger: 'Обычная периодичность', effectiveness: '78%' },
      { id: 4, title: 'Акция для лояльных', trigger: 'Регулярные визиты', effectiveness: '65%' }
    ]
  },
  { 
    id: 'fitness', 
    label: 'Фитнес',
    kpiLabels: {
      risk: 'Риск оттока',
      retention: 'Прогноз продлений',
      returned: 'Возобновили занятия',
      accuracy: 'Точность прогноза'
    },
    segments: ['Высокий риск', 'Средний', 'Низкий', 'Premium', 'Неактивен', 'Истекает абонемент'],
    playbooks: [
      { id: 1, title: 'Возврат неактивного', trigger: '14+ дней без тренировок', effectiveness: '73%' },
      { id: 2, title: 'Продление абонемента', trigger: 'Истечение через 7 дней', effectiveness: '89%' },
      { id: 3, title: 'Персональная мотивация', trigger: 'Снижение активности', effectiveness: '68%' },
      { id: 4, title: 'Upgrade плана', trigger: 'Высокая активность', effectiveness: '82%' }
    ]
  },
  { 
    id: 'auto', 
    label: 'Автосервис',
    kpiLabels: {
      risk: 'Потеря клиентов',
      retention: 'Прогноз сервисов',
      returned: 'Повторные обращения',
      accuracy: 'Точность прогноза'
    },
    segments: ['Высокий риск', 'Средний', 'Низкий', 'Корпоративные', 'Просрочен ТО', 'Скоро ТО'],
    playbooks: [
      { id: 1, title: 'Напоминание о ТО', trigger: 'Подошел срок обслуживания', effectiveness: '91%' },
      { id: 2, title: 'Возврат после ремонта', trigger: '30 дней после крупного ремонта', effectiveness: '76%' },
      { id: 3, title: 'Сезонный сервис', trigger: 'Смена сезона', effectiveness: '84%' },
      { id: 4, title: 'Диагностика за полцены', trigger: 'Долго не было', effectiveness: '69%' }
    ]
  },
  { 
    id: 'education', 
    label: 'Образование',
    kpiLabels: {
      risk: 'Риск отчисления',
      retention: 'Прогноз завершений',
      returned: 'Возобновили обучение',
      accuracy: 'Точность прогноза'
    },
    segments: ['Высокий риск', 'Средний', 'Низкий', 'Отличники', 'Пропускает', 'Заканчивает курс'],
    playbooks: [
      { id: 1, title: 'Мотивация отстающего', trigger: 'Низкие оценки + пропуски', effectiveness: '71%' },
      { id: 2, title: 'Предложение доп. курса', trigger: 'Высокие результаты', effectiveness: '88%' },
      { id: 3, title: 'Поддержка в трудностях', trigger: 'Резкое снижение активности', effectiveness: '79%' },
      { id: 4, title: 'Напоминание о дедлайне', trigger: 'Приближение срока сдачи', effectiveness: '95%' }
    ]
  },
  { 
    id: 'universal', 
    label: 'Универсальный',
    kpiLabels: {
      risk: 'В зоне риска',
      retention: 'Прогноз удержания',
      returned: 'Вернулось за период',
      accuracy: 'Точность прогноза'
    },
    segments: ['Высокий риск', 'Средний', 'Низкий', 'VIP', 'Неактивен', 'Требует внимания'],
    playbooks: [
      { id: 1, title: 'Возврат неактивного клиента', trigger: 'Долгое отсутствие', effectiveness: '75%' },
      { id: 2, title: 'Удержание VIP', trigger: 'Снижение активности важного клиента', effectiveness: '90%' },
      { id: 3, title: 'Реактивация по скидке', trigger: 'Средний риск оттока', effectiveness: '68%' },
      { id: 4, title: 'Персональное предложение', trigger: 'Изменение поведения', effectiveness: '82%' }
    ]
  }
];

// Моковые данные
const mockKPIData = {
  risk: { value: 128, change: '+12', period: '7 дн' },
  retention: { value: '₽ 184 000', change: '+8%', period: 'месяц' },
  returned: { value: '46 (22%)', change: '+5%', period: 'неделя' },
  accuracy: { value: '85%', change: '+2%', period: 'модель' }
};

const mockActions = [
  {
    id: 1,
    client: 'Анна Петрова',
    lastVisit: '95 дней назад',
    riskLevel: 'high',
    reasons: ['95 дней без визита', 'любит вечер', 'ARPU ₽1 800'],
    recommendation: 'Персональная скидка 25%',
    effect: '₽ 1 350',
    confidence: 85,
    channel: 'telegram',
    deadline: '2 дня',
    isSelected: false
  },
  {
    id: 2,
    client: 'Мария Сидорова',
    lastVisit: '45 дней назад',
    riskLevel: 'medium',
    reasons: ['пропустила 2 записи', 'VIP статус', 'ARPU ₽2 400'],
    recommendation: 'Напоминание + новая услуга',
    effect: '78%',
    confidence: 92,
    channel: 'sms',
    deadline: '5 дней',
    isSelected: false
  },
  {
    id: 3,
    client: 'Елена Козлова',
    lastVisit: '12 дней назад',
    riskLevel: 'low',
    reasons: ['скоро день рождения', 'лояльный клиент'],
    recommendation: 'Поздравление + акция',
    effect: '₽ 950',
    confidence: 76,
    channel: 'whatsapp',
    deadline: '1 день',
    isSelected: false
  }
];

const mockAutopilotLogs = [
  {
    id: 1,
    client: 'Ольга Иванова',
    action: 'Напоминание о записи',
    timestamp: '2 часа назад',
    status: 'delivered',
    result: { read: true, reply: false, booked: true }
  },
  {
    id: 2,
    client: 'Дмитрий Волков',
    action: 'Скидка 15% на возврат',
    timestamp: '5 часов назад',
    status: 'delivered',
    result: { read: true, reply: true, booked: false }
  },
  {
    id: 3,
    client: 'Александра Новикова',
    action: 'VIP предложение',
    timestamp: '1 день назад',
    status: 'delivered',
    result: { read: false, reply: false, booked: false }
  }
];

interface AICenterProps {
  onBack?: () => void;
}

export function AICenter({ onBack }: AICenterProps) {
  const { hapticFeedback } = useTelegram();
  const [activeMode, setActiveMode] = useState<'assistant' | 'autopilot'>('assistant');
  const [selectedBusinessType, setSelectedBusinessType] = useState('beauty');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [periodFilter, setPeriodFilter] = useState('week');

  const currentBusinessType = businessTypes.find(bt => bt.id === selectedBusinessType) || businessTypes[0];

  const handleActionSelect = (actionId: number) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleBulkAction = (action: string) => {
    if (hapticFeedback) {
      hapticFeedback.medium();
    }
    
    const selectedCount = selectedActions.length;
    const selectedClientsNames = mockActions
      .filter(a => selectedActions.includes(a.id))
      .map(a => a.client)
      .slice(0, 3)
      .join(', ');
    
    switch (action) {
      case 'activate':
      case 'apply':
        toast.success(
          `✅ Массовое применение!\n\n` +
          `📊 Обработано: ${selectedCount} действий\n` +
          `👥 Клиенты: ${selectedClientsNames}${selectedCount > 3 ? '...' : ''}\n\n` +
          `⏰ Отправка сообщений начнется через 2 минуты`,
          {
            duration: 6000,
            action: {
              label: 'Мониторинг',
              onClick: () => {
                toast.info('Открытие журнала отправки...');
              }
            }
          }
        );
        break;
        
      case 'archive':
        toast.info(
          `📁 Архивирование\n\n` +
          `📊 Заархивировано: ${selectedCount} действий\n` +
          `👥 Клиенты: ${selectedClientsNames}${selectedCount > 3 ? '...' : ''}\n\n` +
          `💡 Действия будут доступны в разделе "Архив"`
        );
        break;
        
      case 'delete':
        toast.error(
          `🗑️ Удаление\n\n` +
          `📊 Удалено: ${selectedCount} действий\n` +
          `👥 Клиенты: ${selectedClientsNames}${selectedCount > 3 ? '...' : ''}\n\n` +
          `⚠️ Восстановление невозможно`
        );
        break;
        
      case 'deactivate':
        toast.info(
          `⏸️ Деактивация\n\n` +
          `📊 Приостановлено: ${selectedCount} действий\n` +
          `👥 Клиенты: ${selectedClientsNames}${selectedCount > 3 ? '...' : ''}\n\n` +
          `💡 Можно активировать позже`
        );
        break;
        
      default:
        toast.success(`Действие "${action}" применено к ${selectedCount} элементам`);
    }
    
    setSelectedActions([]);
  };

  const handleRefresh = () => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    toast.success('Данные обновлены');
  };

  const handleFilters = () => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    toast.info('Панель фильтров');
  };

  const handleClearFilters = () => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    setSearchQuery('');
    setSelectedSegment('all');
    toast.success('Фильтры сброшены');
  };

  const handleUpdateData = () => {
    if (hapticFeedback) {
      hapticFeedback.medium();
    }
    toast.success('Данные обновляются...');
  };

  const handleCreateExperiment = () => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    toast.info('Создание A/B эксперимента');
  };

  const handleUsePlaybook = (playbookId: number) => {
    if (hapticFeedback) {
      hapticFeedback.medium();
    }
    const playbook = currentBusinessType.playbooks.find(p => p.id === playbookId);
    
    if (!playbook) return;
    
    // Показываем более детальное уведомление с информацией о результатах
    toast.success(
      `🎯 Плейбук активирован!\n\n` +
      `📋 ${playbook.title}\n` +
      `⚡ Триггер: ${playbook.trigger}\n` +
      `📈 Эффективность: ${playbook.effectiveness}\n\n` +
      `✅ Действие будет применено к подходящим клиентам`, 
      {
        duration: 8000,
        action: {
          label: 'Подробнее',
          onClick: () => {
            toast.info(
              `📊 Статистика плейбука:\n\n` +
              `• Успешных активаций: ${Math.floor(Math.random() * 50) + 20}\n` +
              `• Потенциальных клиентов: ${Math.floor(Math.random() * 15) + 5}\n` +
              `• Ожидаемый доход: ₽${(Math.random() * 50000 + 10000).toLocaleString()}\n` +
              `• Время активации: ~${Math.floor(Math.random() * 30) + 10} мин`
            );
          }
        }
      }
    );
    
    // Симулируем применение плейбука через небольшой промежуток
    setTimeout(() => {
      const clientsAffected = Math.floor(Math.random() * 12) + 3;
      const estimatedRevenue = Math.floor(Math.random() * 25000) + 5000;
      
      toast.success(
        `🎯 Плейбук запущен!\n\n` +
        `👥 Клиентов в обработке: ${clientsAffected}\n` +
        `💰 Потенциальный доход: ₽${estimatedRevenue.toLocaleString()}\n` +
        `⏱️ Статус: Отправка сообщений...`,
        {
          duration: 6000
        }
      );
    }, 2000);
  };

  const handlePlaybookClick = (playbookId: number) => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    const playbook = currentBusinessType.playbooks.find(p => p.id === playbookId);
    
    if (!playbook) return;
    
    // Показываем детальную информацию о плейбуке
    toast.info(
      `📋 ${playbook.title}\n\n` +
      `🎯 Условия запуска:\n${playbook.trigger}\n\n` +
      `📊 Показатели:\n` +
      `• Эффективность: ${playbook.effectiveness}\n` +
      `• Среднее время ответа: ${Math.floor(Math.random() * 120) + 30} мин\n` +
      `• Коэффициент конверсии: ${Math.floor(Math.random() * 40) + 60}%\n\n` +
      `💡 Последний запуск: ${Math.floor(Math.random() * 7) + 1} дн. назад`,
      {
        duration: 10000,
        action: {
          label: 'Настроить',
          onClick: () => {
            toast.success('Открытие настроек плейбука...');
          }
        }
      }
    );
  };

  const handleEditPlaybook = (playbookId: number) => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    const playbook = currentBusinessType.playbooks.find(p => p.id === playbookId);
    
    if (!playbook) return;
    
    toast.info(
      `⚙️ Настройки плейбука\n\n` +
      `📋 ${playbook.title}\n\n` +
      `🛠️ Доступные настройки:\n` +
      `• Условия активации\n` +
      `• Шаблон сообщения\n` +
      `• Канал отправки\n` +
      `• Время ожидания ответа\n` +
      `• Частота повторов\n\n` +
      `💡 Нажмите "Открыть", чтобы перейти к настройкам`,
      {
        duration: 8000,
        action: {
          label: 'Открыть',
          onClick: () => {
            toast.success(
              `✅ Настройки "${playbook.title}" сохранены!\n\n` +
              `🔄 Изменения:\n` +
              `• Канал: Telegram → WhatsApp\n` +
              `• Скидка: 15% → 20%\n` +
              `• Время отправки: 10:00 → 14:00\n\n` +
              `⏰ Изменения вступят в силу через 5 минут`
            );
          }
        }
      }
    );
  };

  // Handlers for actions in the queue
  const handleApplyAction = (actionId: number) => {
    if (hapticFeedback) {
      hapticFeedback.medium();
    }
    const action = mockActions.find(a => a.id === actionId);
    if (!action) return;

    toast.success(
      `✅ Действие применено!\n\n` +
      `👤 Клиент: ${action.client}\n` +
      `📋 Рекомендация: ${action.recommendation}\n` +
      `📱 Канал: ${action.channel}\n\n` +
      `⏰ Отправка в течение 5 минут`,
      {
        duration: 5000,
        action: {
          label: 'История',
          onClick: () => {
            toast.info('Открытие истории сообщений...');
          }
        }
      }
    );

    // Simulate sending
    setTimeout(() => {
      toast.success(
        `📨 Сообщение отправлено!\n\n` +
        `👤 ${action.client}\n` +
        `✅ Доставлено через ${action.channel}\n` +
        `📊 Ожидаемый результат: ${action.effect}`
      );
    }, 3000);
  };

  const handleSkipAction = (actionId: number) => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    const action = mockActions.find(a => a.id === actionId);
    if (!action) return;

    toast.info(
      `⏭️ Действие пропущено\n\n` +
      `👤 Клиент: ${action.client}\n` +
      `📋 Рекомендация: ${action.recommendation}\n\n` +
      `💡 Действие будет доступно завтра`,
      {
        duration: 4000
      }
    );
  };

  const handleWriteAction = (actionId: number) => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    const action = mockActions.find(a => a.id === actionId);
    if (!action) return;

    toast.info(
      `✍️ Написать сообщение\n\n` +
      `👤 Клиент: ${action.client}\n` +
      `📱 Канал: ${action.channel}\n\n` +
      `💡 Рекомендуемый текст:\n"${action.recommendation}"\n\n` +
      `🎯 Персонализация: ${action.reasons.slice(0, 2).join(', ')}`,
      {
        duration: 8000,
        action: {
          label: 'Открыть',
          onClick: () => {
            toast.success('Открытие редактора сообщений...');
          }
        }
      }
    );
  };

  const handleScheduleAction = (actionId: number) => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    const action = mockActions.find(a => a.id === actionId);
    if (!action) return;

    toast.info(
      `📅 Запланировать отправку\n\n` +
      `👤 Клиент: ${action.client}\n` +
      `📋 Рекомендация: ${action.recommendation}\n\n` +
      `⏰ Предложенное время:\n• Завтра в 10:00\n• Через 3 дня в 14:00\n• В понедельник в 11:00`,
      {
        duration: 6000,
        action: {
          label: 'Выбрать',
          onClick: () => {
            toast.success(
              `✅ Отправка запланирована!\n\n` +
              `👤 ${action.client}\n` +
              `📅 Дата: Завтра в 10:00\n` +
              `📱 Канал: ${action.channel}`
            );
          }
        }
      }
    );
  };

  const handleSelectAllActions = () => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    
    if (selectedActions.length === mockActions.length) {
      setSelectedActions([]);
      toast.info('Все действия сняты с выбора');
    } else {
      setSelectedActions(mockActions.map(a => a.id));
      toast.success(`Выбрано ${mockActions.length} действий`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="space-y-2">
              <h1>Интеллектуальный центр</h1>
              <p className="text-muted-foreground">
                Инструменты роста, адаптированные под ваш бизнес
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mode Switcher & Filters */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'assistant' | 'autopilot')}>
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="assistant" className="gap-2">
                    <Brain className="h-4 w-4" />
                    Ассистент
                  </TabsTrigger>
                  <TabsTrigger value="autopilot" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Автопилот
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Сегодня</SelectItem>
                    <SelectItem value="week">Неделя</SelectItem>
                    <SelectItem value="month">Месяц</SelectItem>
                    <SelectItem value="quarter">Квартал</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={currentBusinessType.kpiLabels.risk}
          value={mockKPIData.risk.value.toString()}
          change={mockKPIData.risk.change}
          period={mockKPIData.risk.period}
          trend="up"
          variant="warning"
        />
        <KPICard
          title={currentBusinessType.kpiLabels.retention}
          value={mockKPIData.retention.value}
          change={mockKPIData.retention.change}
          period={mockKPIData.retention.period}
          trend="up"
          variant="success"
        />
        <KPICard
          title={currentBusinessType.kpiLabels.returned}
          value={mockKPIData.returned.value}
          change={mockKPIData.returned.change}
          period={mockKPIData.returned.period}
          trend="up"
          variant="info"
        />
        <KPICard
          title={currentBusinessType.kpiLabels.accuracy}
          value={mockKPIData.accuracy.value}
          change={mockKPIData.accuracy.change}
          period={mockKPIData.accuracy.period}
          trend="up"
          variant="default"
        />
      </div>

      {/* Segments & Filters */}
      <Card className="glass-card sticky top-4 z-10">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Segment Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Сегменты:</span>
              <SegmentChip
                label="Все"
                count={mockActions.length}
                isActive={selectedSegment === 'all'}
                onClick={() => {
                  if (hapticFeedback) hapticFeedback.light();
                  setSelectedSegment('all');
                  toast.info(`Показаны все клиенты (${mockActions.length})`);
                }}
              />
              {currentBusinessType.segments.map((segment, index) => {
                const count = Math.floor(Math.random() * 20) + 5;
                return (
                  <SegmentChip
                    key={segment}
                    label={segment}
                    count={count}
                    isActive={selectedSegment === segment}
                    onClick={() => {
                      if (hapticFeedback) hapticFeedback.light();
                      setSelectedSegment(segment);
                      toast.info(`Фильтр: ${segment} (${count} клиентов)`);
                    }}
                    variant={index === 0 ? 'danger' : index === 1 ? 'warning' : 'default'}
                  />
                );
              })}
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск клиентов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button variant="outline" size="sm" onClick={handleFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Сбросить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Actions Queue (65%) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3>Очередь действий</h3>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    if (hapticFeedback) hapticFeedback.light();
                    setViewMode('table');
                    toast.info('Переключено на табличный вид');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    if (hapticFeedback) hapticFeedback.light();
                    setViewMode('cards');
                    toast.info('Переключено на карточный вид');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {mockActions.length > 0 ? (
            viewMode === 'table' ? (
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/30">
                        <tr className="text-left">
                          <th className="p-3 text-xs font-medium text-muted-foreground">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              checked={selectedActions.length === mockActions.length && mockActions.length > 0}
                              onChange={handleSelectAllActions}
                            />
                          </th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Клиент</th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Причина риска</th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Рекомендация</th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Эффект</th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Уверенность</th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Канал</th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Дедлайн</th>
                          <th className="p-3 text-xs font-medium text-muted-foreground">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockActions.map((action) => (
                          <ActionTableRow
                            key={action.id}
                            action={action}
                            isSelected={selectedActions.includes(action.id)}
                            onSelect={() => handleActionSelect(action.id)}
                            onApply={() => handleApplyAction(action.id)}
                            onSkip={() => handleSkipAction(action.id)}
                            onSchedule={() => handleScheduleAction(action.id)}
                            onWrite={() => handleWriteAction(action.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockActions.map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    isSelected={selectedActions.includes(action.id)}
                    onSelect={() => handleActionSelect(action.id)}
                    onApply={() => handleApplyAction(action.id)}
                    onSkip={() => handleSkipAction(action.id)}
                    onWrite={() => handleWriteAction(action.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <EmptyState
              icon={Brain}
              title="Новых рекомендаций пока нет"
              description="Попробуйте расширить период или сменить сегмент"
              action={
                <Button onClick={handleUpdateData}>
                  Обновить данные
                </Button>
              }
            />
          )}
        </div>

        {/* Right Column - Domain Context (35%) */}
        <div className="space-y-6">
          {/* Playbooks */}
          <div className="space-y-4">
            <h4>Плейбуки</h4>
            <div className="space-y-3">
              {currentBusinessType.playbooks.map((playbook) => (
                <PlaybookCard 
                  key={playbook.id} 
                  playbook={playbook} 
                  onUse={handleUsePlaybook}
                  onClick={handlePlaybookClick}
                  onEdit={handleEditPlaybook}
                  variant="default"
                  showActions={true}
                />
              ))}
            </div>
          </div>

          {/* Message Templates */}
          <div className="space-y-4">
            <h4>Шаблоны сообщений</h4>
            <TemplatePreview />
          </div>

          {/* Experiments */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Эксперименты</CardTitle>
                <Button variant="outline" size="sm" onClick={handleCreateExperiment}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Создать A/B
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Тон сообщений</div>
                  <div className="text-xs text-muted-foreground">Формальный vs Дружелюбный</div>
                </div>
                <Badge variant="secondary">Активен</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Размер скидки</div>
                  <div className="text-xs text-muted-foreground">15% vs 25%</div>
                </div>
                <Badge variant="outline">Планируется</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Autopilot Log */}
          {activeMode === 'autopilot' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4>Журнал автопилота</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Активен</span>
                </div>
              </div>
              <div className="space-y-3">
                {mockAutopilotLogs.map((log) => (
                  <AutopilotLogItem key={log.id} log={log} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedActions.length}
        onClearSelection={() => setSelectedActions([])}
        onBulkArchive={() => handleBulkAction('archive')}
        onBulkDelete={() => handleBulkAction('delete')}
        onBulkActivate={() => handleBulkAction('activate')}
        onBulkDeactivate={() => handleBulkAction('deactivate')}
      />
    </div>
  );
}