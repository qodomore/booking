import { CheckCircle, Smartphone, Calendar, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';

interface Step01WelcomeProps {
  locale?: 'RU' | 'EN';
}

export function Step01Welcome({ locale = 'RU' }: Step01WelcomeProps) {
  const content = {
    RU: {
      title: 'Добро пожаловать в Qodo.booking!',
      subtitle: 'Настроим ваш сервис бронирования всего за несколько минут',
      features: [
        {
          icon: <Smartphone className="w-6 h-6 text-primary" />,
          title: 'Telegram Mini-App',
          description: 'Клиенты бронируют через удобный интерфейс в Telegram'
        },
        {
          icon: <Calendar className="w-6 h-6 text-primary" />,
          title: 'Умный календарь',
          description: 'Автоматическое управление расписанием и ресурсами'
        },
        {
          icon: <TrendingUp className="w-6 h-6 text-primary" />,
          title: 'Аналитика и AI',
          description: 'Отчеты, автоматизация и умные рекомендации'
        }
      ],
      estimate: 'Настройка займет около 5-7 минут'
    },
    EN: {
      title: 'Welcome to Qodo.booking!',
      subtitle: 'Set up your booking service in just a few minutes',
      features: [
        {
          icon: <Smartphone className="w-6 h-6 text-primary" />,
          title: 'Telegram Mini-App',
          description: 'Clients book through convenient Telegram interface'
        },
        {
          icon: <Calendar className="w-6 h-6 text-primary" />,
          title: 'Smart Calendar',
          description: 'Automatic schedule and resource management'
        },
        {
          icon: <TrendingUp className="w-6 h-6 text-primary" />,
          title: 'Analytics & AI',
          description: 'Reports, automation and smart recommendations'
        }
      ],
      estimate: 'Setup takes about 5-7 minutes'
    }
  };

  const t = content[locale];

  return (
    <div className="text-center">
      {/* Header Section */}
      <div className="mb-7">
        <h1 className="text-foreground mb-5">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-5 mb-7 max-w-lg mx-auto">
        {t.features.map((feature, index) => (
          <div key={index}>
            <div className="flex items-start gap-4 text-left py-4">
              {/* Icon Container - 48x48 with enhanced brand background */}
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 text-primary">
                  {feature.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-1">
                <h3 className="text-foreground font-medium">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
            
            {/* Separator between items */}
            {index < t.features.length - 1 && (
              <Separator className="my-5" />
            )}
          </div>
        ))}
      </div>

      {/* Status Alert - Success style with proper tokens */}
      <Alert className="max-w-lg mx-auto border-primary/20 bg-primary/5">
        <CheckCircle className="w-6 h-6 text-primary" />
        <AlertDescription className="text-primary flex items-center gap-2">
          {t.estimate}
        </AlertDescription>
      </Alert>
    </div>
  );
}