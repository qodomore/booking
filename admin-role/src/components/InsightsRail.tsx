import React, { useState } from 'react';
import { Info, AlertTriangle, ChevronRight, MoreHorizontal, Clock, EyeOff, Lock, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { motion, AnimatePresence } from 'motion/react';

interface Insight {
  id: string;
  severity: 'info' | 'warn';
  title: string;
  description: string;
  actionRoute: string;
  muted: boolean;
  icon?: string;
}

interface InsightsRailProps {
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro';
  theme?: string;
  onNavigate?: (route: string, filters?: any) => void;
}

const mockInsights: Insight[] = [
  {
    id: '1',
    severity: 'warn',
    title: 'У Анны низкая загрузка утром (38%)',
    description: 'Запустите утреннюю кампанию для увеличения записей с 9:00 до 12:00',
    actionRoute: 'marketing',
    muted: false,
    icon: '👩‍💼'
  },
  {
    id: '2',
    severity: 'warn',
    title: '3 отмены подряд сб 12–14',
    description: 'Проверьте цену и доступность слотов в выходные дни',
    actionRoute: 'smart-pricing',
    muted: false,
    icon: '📅'
  },
  {
    id: '3',
    severity: 'info',
    title: 'Высокий риск no-show у 7 клиентов',
    description: 'Рекомендуем отправить напоминания за 2 часа до визита',
    actionRoute: 'notifications',
    muted: false,
    icon: '⚠️'
  },
  {
    id: '4',
    severity: 'info',
    title: 'Пиковое время 14:00-16:00',
    description: 'Рассмотрите повышение цен на популярные слоты',
    actionRoute: 'smart-pricing',
    muted: false,
    icon: '📈'
  }
];

export function InsightsRail({ locale = 'ru', plan = 'free', theme = 'blue', onNavigate }: InsightsRailProps) {
  const [insights, setInsights] = useState<Insight[]>(mockInsights.filter(insight => !insight.muted));
  const [mutedTypes, setMutedTypes] = useState<Set<string>>(new Set());

  // Text content
  const text = {
    ru: {
      title: 'Инсайты',
      subtitle: 'AI-рекомендации для вашего бизнеса',
      openRecommendations: 'Открыть рекомендации',
      snooze7days: 'Отложить на 7 дней',
      hideType: 'Не показывать такой тип',
      proFeature: 'Доступно в Pro',
      unlockPro: 'Разблокировать Pro',
      proDescription: 'Получайте персонализированные AI-рекомендации на основе данных вашего бизнеса',
      teaserTitle: 'AI-анализ эффективности',
      teaserDescription: 'Умные рекомендации помогут увеличить прибыль на 25-40%'
    },
    en: {
      title: 'Insights',
      subtitle: 'AI recommendations for your business',
      openRecommendations: 'Open recommendations',
      snooze7days: 'Snooze for 7 days',
      hideType: 'Hide this type',
      proFeature: 'Available in Pro',
      unlockPro: 'Unlock Pro',
      proDescription: 'Get personalized AI recommendations based on your business data',
      teaserTitle: 'AI Performance Analysis',
      teaserDescription: 'Smart recommendations can increase profit by 25-40%'
    }
  };

  const t = text[locale];

  const handleSnooze = (insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
    // In real app, this would make an API call to snooze for 7 days
  };

  const handleHideType = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      const typeKey = insight.actionRoute;
      setMutedTypes(prev => new Set([...prev, typeKey]));
      setInsights(prev => prev.filter(i => i.actionRoute !== typeKey));
      // In real app, this would make an API call to mute this insight type
    }
  };

  const handleInsightClick = (insight: Insight) => {
    if (onNavigate) {
      let filters = {};
      
      switch (insight.actionRoute) {
        case 'marketing':
          filters = { resourceFilter: 'anna', timeFilter: 'morning' };
          break;
        case 'smart-pricing':
          filters = { dayFilter: 'weekend', timeFilter: '12-14' };
          break;
        case 'notifications':
          filters = { riskFilter: 'no-show' };
          break;
      }
      
      onNavigate(insight.actionRoute, filters);
    }
  };

  const getSeverityIcon = (severity: string) => {
    return severity === 'warn' ? AlertTriangle : Info;
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'warn' ? 'destructive' : 'secondary';
  };

  // Show only 1 insight for free plan
  const visibleInsights = plan === 'pro' ? insights : insights.slice(0, 1);

  if (insights.length === 0 && plan === 'pro') {
    return null; // Hide completely if no insights for pro users
  }

  return (
    <div className="space-y-3 max-w-full overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <Info className="w-3 h-3 text-primary" />
        </div>
        <h3 className="font-medium">{t.title}</h3>
        <Badge variant="secondary" className="text-xs">
          AI
        </Badge>
      </div>

      <div className="space-y-3 max-w-full overflow-hidden">
        <AnimatePresence>
          {visibleInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <span className="text-lg">{insight.icon}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={getSeverityColor(insight.severity)}
                            className="text-xs"
                          >
                            {React.createElement(getSeverityIcon(insight.severity), { className: "w-3 h-3 mr-1" })}
                            {insight.severity === 'warn' ? 'Внимание' : 'Инфо'}
                          </Badge>
                        </div>

                        {/* Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSnooze(insight.id)}>
                              <Clock className="w-4 h-4 mr-2" />
                              {t.snooze7days}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleHideType(insight.id)}>
                              <EyeOff className="w-4 h-4 mr-2" />
                              {t.hideType}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {insight.title}
                      </h4>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {insight.description}
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleInsightClick(insight)}
                      >
                        {t.openRecommendations}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pro Teaser for Free Plan */}
        {plan !== 'pro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: visibleInsights.length * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              {/* Blur overlay */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3 px-4">
                <Lock className="w-8 h-8 text-muted-foreground" />
                <div className="text-center space-y-1 max-w-full">
                  <h4 className="font-medium text-sm">{t.proFeature}</h4>
                  <p className="text-xs text-muted-foreground px-2">
                    {t.proDescription}
                  </p>
                </div>
                <Button size="sm" className="elegant-button">
                  <Zap className="w-4 h-4 mr-2" />
                  {t.unlockPro}
                </Button>
              </div>

              {/* Blurred preview content */}
              <CardContent className="p-4 filter blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        <Info className="w-3 h-3 mr-1" />
                        Инфо
                      </Badge>
                    </div>

                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      {t.teaserTitle}
                    </h4>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {t.teaserDescription}
                    </p>

                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      {t.openRecommendations}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}