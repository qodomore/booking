import { FileCode, Database, Zap, CreditCard, Bell, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface DevAnnotationsProps {
  locale?: 'RU' | 'EN';
}

const translations = {
  RU: {
    title: 'Техническая документация',
    subtitle: 'Примечания для разработчиков по интеграции API и состояниям компонентов',
    
    step4: 'Шаг 4: Выбор даты и времени',
    step4Description: 'Компонент календаря с фильтрацией по мастеру и длительности',
    
    step5: 'Шаг 5: Данные клиента',
    step5Description: 'Форма с валидацией и созданием временного hold\'а',
    
    step6: 'Шаг 6: Оплата',
    step6Description: 'Интеграция с платежными системами (опционально)',
    
    step7: 'Шаг 7: Подтверждение',
    step7Description: 'Финализация бронирования и настройка напоминаний',
    
    step8: 'Шаг 8: Управление',
    step8Description: 'Интерфейс для изменения и отмены бронирований',
    
    apiEndpoints: 'API Эндпоинты',
    states: 'Состояния компонентов',
    events: 'События системы',
    caching: 'Кэширование',
    security: 'Безопасность'
  },
  EN: {
    title: 'Technical Documentation',
    subtitle: 'Developer notes for API integration and component states',
    
    step4: 'Step 4: Date and Time Selection',
    step4Description: 'Calendar component with master and duration filtering',
    
    step5: 'Step 5: Client Data',
    step5Description: 'Form with validation and temporary hold creation',
    
    step6: 'Step 6: Payment',
    step6Description: 'Payment system integration (optional)',
    
    step7: 'Step 7: Confirmation',
    step7Description: 'Booking finalization and reminder setup',
    
    step8: 'Step 8: Management',
    step8Description: 'Interface for booking changes and cancellations',
    
    apiEndpoints: 'API Endpoints',
    states: 'Component States',
    events: 'System Events',
    caching: 'Caching',
    security: 'Security'
  }
};

export function DevAnnotations({ locale = 'RU' }: DevAnnotationsProps) {
  const t = translations[locale];

  const annotations = [
    {
      step: t.step4,
      description: t.step4Description,
      icon: <Database className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800',
      notes: [
        {
          type: 'API',
          content: 'GET /v1/availability?service_id&date&master_id&duration'
        },
        {
          type: 'Cache',
          content: 'Redis, TTL 10 минут для слотов'
        },
        {
          type: 'States',
          content: 'loading | success | empty | error'
        }
      ]
    },
    {
      step: t.step5,
      description: t.step5Description,
      icon: <FileCode className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800',
      notes: [
        {
          type: 'API',
          content: 'POST /v1/bookings/holds { service_id, start_at, idempotency_key }'
        },
        {
          type: 'TTL',
          content: '90 секунд на временный hold'
        },
        {
          type: 'Validation',
          content: 'Имя (required), телефон (маска), согласие (required)'
        }
      ]
    },
    {
      step: t.step6,
      description: t.step6Description,
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800',
      notes: [
        {
          type: 'API',
          content: 'POST /v1/payments → redirect PSP'
        },
        {
          type: 'Webhook',
          content: 'payment.completed → подтвердить бронь'
        },
        {
          type: 'Fallback',
          content: 'Переход к POST /v1/bookings без оплаты'
        }
      ]
    },
    {
      step: t.step7,
      description: t.step7Description,
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-amber-100 text-amber-800',
      notes: [
        {
          type: 'API',
          content: 'POST /v1/bookings (SERIALIZABLE isolation)'
        },
        {
          type: 'Event',
          content: 'booking.created → Notifications T-24/T-2'
        },
        {
          type: 'Export',
          content: '.ics файл для календаря'
        }
      ]
    },
    {
      step: t.step8,
      description: t.step8Description,
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-800',
      notes: [
        {
          type: 'API',
          content: 'GET /v1/bookings/{id}, PATCH (перенос), DELETE (отмена)'
        },
        {
          type: 'Events',
          content: 'booking.updated | booking.cancelled'
        },
        {
          type: 'Deep Link',
          content: 'Telegram chat с мастером'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-foreground">{t.title}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Annotations Grid */}
      <div className="space-y-6">
        {annotations.map((annotation, index) => (
          <Card key={index} className="p-6 shadow-sm rounded-2xl border border-border">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${annotation.color}`}>
                  {annotation.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">
                    {annotation.step}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {annotation.description}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Technical Notes */}
              <div className="space-y-3">
                {annotation.notes.map((note, noteIndex) => (
                  <div key={noteIndex} className="flex items-start gap-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs font-mono shrink-0 mt-0.5"
                    >
                      {note.type}
                    </Badge>
                    <code className="text-xs text-muted-foreground font-mono leading-relaxed flex-1">
                      {note.content}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Global System Notes */}
      <Card className="p-6 shadow-sm rounded-2xl border border-border bg-muted/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">
              {locale === 'RU' ? 'Системная архитектура' : 'System Architecture'}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">{t.apiEndpoints}</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div>GET /v1/availability</div>
                <div>POST /v1/bookings/holds</div>
                <div>POST /v1/payments</div>
                <div>POST /v1/bookings</div>
                <div>PATCH /v1/bookings/:id</div>
                <div>DELETE /v1/bookings/:id</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">{t.events}</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div>booking.created</div>
                <div>booking.updated</div>
                <div>booking.cancelled</div>
                <div>payment.completed</div>
                <div>payment.failed</div>
                <div>reminder.sent</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">{t.states}</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div>idle | loading | success | error</div>
                <div>empty (для пустых результатов)</div>
                <div>failed (для ошибок платежей)</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">{t.caching}</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div>Redis: availability (10 min)</div>
                <div>Memory: user sessions</div>
                <div>Hold TTL: 90 секунд</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}