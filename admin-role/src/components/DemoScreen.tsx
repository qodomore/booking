import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Users,
  Shield,
  Wallet,
  FileText,
  Globe,
  Calendar,
  Settings,
  PlayCircle,
  Sparkles,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface DemoScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  locale?: 'ru' | 'en';
}

const demoScreens = [
  {
    id: 'booking-confirmation',
    title: 'Подтверждение брони с Upsell',
    description: 'Новая функциональность UpsellHint в процессе записи',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    category: 'Новое'
  },
  {
    id: 'upsell-hint-test',
    title: 'Тест UpsellHint компонента',
    description: 'Изолированное тестирование компонента UpsellHint',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    category: 'Новое'
  },
  {
    id: 'onboarding-account',
    title: 'Создание аккаунта',
    description: 'Первый шаг онбординга - настройка бизнеса',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    category: 'Онбординг'
  },
  {
    id: 'onboarding-location',
    title: 'Создание локации',
    description: 'Второй шаг - добавление первой локации',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    category: 'Онбординг'
  },
  {
    id: 'onboarding-telegram',
    title: 'Подключение Telegram',
    description: 'Финальный шаг - настройка интеграции',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    category: 'Онбординг'
  },
  {
    id: 'team',
    title: 'Управление командой',
    description: 'Роли, приглашения, управление доступом',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    category: 'Команда'
  },
  {
    id: 'security',
    title: 'Безопасность и сессии',
    description: 'Активные устройства и сессии',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    category: 'Безопасность'
  },
  {
    id: 'wallet',
    title: 'Кошелёк',
    description: 'Баланс, пополнение, управление средствами',
    icon: <Wallet className="w-5 h-5" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    category: 'Биллинг'
  },
  {
    id: 'billing',
    title: 'История платежей',
    description: 'Транзакции, счета, экспорт данных',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    category: 'Биллинг'
  },
  {
    id: 'locale',
    title: 'Язык интерфейса',
    description: 'Настройка локализации системы',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    category: 'Настройки'
  },
  {
    id: 'schedule',
    title: 'Расписание и блокировки',
    description: 'Управление временем работы ресурсов',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    category: 'Расписание'
  }
];

const texts = {
  ru: {
    title: 'Демо экраны',
    subtitle: 'Все новые экраны проекта Qodo.booking',
    launch: 'Запустить',
    back: 'Назад',
    allScreens: 'Все экраны',
    description: 'Выберите экран для демонстрации функциональности'
  },
  en: {
    title: 'Demo Screens',
    subtitle: 'All new screens of Qodo.booking project',
    launch: 'Launch',
    back: 'Back',
    allScreens: 'All Screens',
    description: 'Select a screen to demonstrate functionality'
  }
};

export function DemoScreen({ 
  onBack, 
  onNavigate,
  locale = 'ru' 
}: DemoScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const t = texts[locale];

  const categories = Array.from(new Set(demoScreens.map(screen => screen.category)));
  
  const filteredScreens = selectedCategory 
    ? demoScreens.filter(screen => screen.category === selectedCategory)
    : demoScreens;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t.description}</h3>
            <p className="text-sm text-muted-foreground">
              {locale === 'ru' 
                ? 'Каждый экран содержит различные состояния: загрузка, успех, ошибка, пустое состояние'
                : 'Each screen contains different states: loading, success, error, empty state'}
            </p>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          {t.allScreens}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Screens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScreens.map((screen, index) => (
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${screen.color}`}>
                      {screen.icon}
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {screen.category}
                      </Badge>
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {screen.title}
                      </h3>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {screen.description}
                </p>
                
                <Button 
                  onClick={() => onNavigate?.(screen.id)}
                  className="w-full elegant-button"
                  size="sm"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {t.launch}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <Card className="p-4 bg-muted/30">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {locale === 'ru' 
              ? '🎯 Все экраны адаптивны и поддерживают темную тему'
              : '🎯 All screens are responsive and support dark theme'}
          </p>
          <p className="text-xs text-muted-foreground">
            {locale === 'ru'
              ? 'Проект создан согласно требованиям технического задания'
              : 'Project created according to technical requirements'}
          </p>
        </div>
      </Card>
    </div>
  );
}