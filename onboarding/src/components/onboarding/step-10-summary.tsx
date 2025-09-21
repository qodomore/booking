import { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  ArrowRight,
  BarChart3,
  Settings,
  Crown
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';

interface SummaryStepProps {
  locale?: 'RU' | 'EN';
  subscriptionActive?: boolean;
}

const translations = {
  RU: {
    title: 'Настройка завершена!',
    subtitle: 'Ваш сервис бронирования готов к работе. Проверьте финальные настройки',
    
    // Setup summary
    setupSummary: 'Сводка настроек',
    businessProfile: 'Профиль бизнеса',
    businessProfileStatus: 'Настроен',
    locations: 'Локации',
    locationsCount: '1 локация добавлена',
    services: 'Услуги',
    servicesCount: 'Каталог услуг создан',
    subscription: 'Подписка',
    subscriptionActive: 'Маркетинг + AI активна',
    subscriptionFree: 'Базовый тариф',
    aiFeatures: 'AI-функции',
    aiFeaturesEnabled: 'Настроены и активны',
    aiFeaturesDisabled: 'Доступны после активации подписки',
    
    // Next steps
    nextSteps: 'Следующие шаги',
    step1: 'Пригласите мастеров в систему',
    step1Description: 'Добавьте сотрудников для приема записей',
    step2: 'Настройте Telegram-бота',
    step2Description: 'Подключите бота для приема записей от клиентов',
    step3: 'Проведите тестовую запись',
    step3Description: 'Проверьте работу системы перед запуском',
    
    // Actions
    goToDashboard: 'Перейти в дашборд',
    viewGuide: 'Посмотреть руководство',
    
    // Success message
    successTitle: 'Поздравляем!',
    successDescription: 'Вы успешно настроили свой сервис бронирования. Система готова принимать записи от клиентов.',
    
    // Quick stats
    quickStats: 'Быстрая статистика',
    totalBookings: 'Записей',
    totalRevenue: 'Выручка',
    clientsServed: 'Клиентов',
    avgRating: 'Рейтинг'
  },
  EN: {
    title: 'Setup Complete!',
    subtitle: 'Your booking service is ready to go. Review your final settings',
    
    // Setup summary
    setupSummary: 'Setup Summary',
    businessProfile: 'Business Profile',
    businessProfileStatus: 'Configured',
    locations: 'Locations',
    locationsCount: '1 location added',
    services: 'Services',
    servicesCount: 'Service catalog created',
    subscription: 'Subscription',
    subscriptionActive: 'Marketing + AI active',
    subscriptionFree: 'Basic plan',
    aiFeatures: 'AI Features',
    aiFeaturesEnabled: 'Configured and active',
    aiFeaturesDisabled: 'Available after subscription activation',
    
    // Next steps
    nextSteps: 'Next Steps',
    step1: 'Invite masters to the system',
    step1Description: 'Add staff members to accept bookings',
    step2: 'Set up Telegram bot',
    step2Description: 'Connect bot to receive bookings from clients',
    step3: 'Conduct test booking',
    step3Description: 'Test the system before going live',
    
    // Actions
    goToDashboard: 'Go to Dashboard',
    viewGuide: 'View Guide',
    
    // Success message
    successTitle: 'Congratulations!',
    successDescription: 'You have successfully set up your booking service. The system is ready to accept client bookings.',
    
    // Quick stats
    quickStats: 'Quick Stats',
    totalBookings: 'Bookings',
    totalRevenue: 'Revenue',
    clientsServed: 'Clients',
    avgRating: 'Rating'
  }
};

export function Step10Summary({ locale = 'RU', subscriptionActive = false }: SummaryStepProps) {
  const t = translations[locale];
  const [showStats] = useState(false); // Will be enabled when real data is available

  const setupItems = [
    {
      icon: <Users className="w-5 h-5" />,
      title: t.businessProfile,
      status: t.businessProfileStatus,
      completed: true
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: t.locations,
      status: t.locationsCount,
      completed: true
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: t.services,
      status: t.servicesCount,
      completed: true
    },
    {
      icon: subscriptionActive ? <Crown className="w-5 h-5" /> : <Settings className="w-5 h-5" />,
      title: t.subscription,
      status: subscriptionActive ? t.subscriptionActive : t.subscriptionFree,
      completed: true
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: t.aiFeatures,
      status: subscriptionActive ? t.aiFeaturesEnabled : t.aiFeaturesDisabled,
      completed: subscriptionActive
    }
  ];

  const nextStepsList = [
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: t.step1,
      description: t.step1Description
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: t.step2,
      description: t.step2Description
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      title: t.step3,
      description: t.step3Description
    }
  ];

  return (
    <div className="space-y-7">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Message */}
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            <div className="space-y-1">
              <p className="font-medium">{t.successTitle}</p>
              <p className="text-sm">{t.successDescription}</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Setup Summary */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <h2 className="font-medium text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              {t.setupSummary}
            </h2>

            <div className="space-y-4">
              {setupItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    item.completed 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                  </div>
                  <div>
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-muted rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Stats (placeholder for future) */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t.totalBookings, value: '0', icon: <Calendar className="w-4 h-4" /> },
              { label: t.totalRevenue, value: '0 ₽', icon: <DollarSign className="w-4 h-4" /> },
              { label: t.clientsServed, value: '0', icon: <Users className="w-4 h-4" /> },
              { label: t.avgRating, value: '5.0', icon: <CheckCircle className="w-4 h-4" /> }
            ].map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        )}

        {/* Next Steps */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <h2 className="font-medium text-foreground flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              {t.nextSteps}
            </h2>

            <div className="space-y-4">
              {nextStepsList.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            className="text-primary border-primary/20 hover:bg-primary/10"
          >
            {t.viewGuide}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t.goToDashboard}
          </Button>
        </div>
      </div>

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: Переход к основному дашборду приложения. Сохранить состояние онбординга как завершенный.</p>
      </div>
    </div>
  );
}