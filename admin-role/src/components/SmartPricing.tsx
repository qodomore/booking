import React, { useState } from 'react';
import { Banknote, TrendingUp, Clock, Users, Target, Settings, BarChart3, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

interface Service {
  id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  demand: 'high' | 'medium' | 'low';
  timeMultiplier: number;
  masterMultiplier: number;
  isSmartPricingEnabled: boolean;
  bookingsToday: number;
  averageRating: number;
  category: string;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'time' | 'demand' | 'master' | 'season' | 'client';
  description: string;
  isActive: boolean;
  modifier: number;
  conditions: string[];
}

const services: Service[] = [
  {
    id: '1',
    name: 'Маникюр классический',
    basePrice: 1500,
    currentPrice: 1650,
    demand: 'high',
    timeMultiplier: 1.1,
    masterMultiplier: 1.0,
    isSmartPricingEnabled: true,
    bookingsToday: 8,
    averageRating: 4.8,
    category: 'Ногтевой сервис'
  },
  {
    id: '2',
    name: 'Стрижка женская',
    basePrice: 2000,
    currentPrice: 2200,
    demand: 'medium',
    timeMultiplier: 1.15,
    masterMultiplier: 1.2,
    isSmartPricingEnabled: true,
    bookingsToday: 5,
    averageRating: 4.9,
    category: 'Парикмахерские услуги'
  },
  {
    id: '3',
    name: 'Окрашивание',
    basePrice: 4000,
    currentPrice: 4600,
    demand: 'high',
    timeMultiplier: 1.0,
    masterMultiplier: 1.3,
    isSmartPricingEnabled: true,
    bookingsToday: 3,
    averageRating: 4.7,
    category: 'Парикмахерские услуги'
  },
  {
    id: '4',
    name: 'Педикюр',
    basePrice: 2500,
    currentPrice: 2500,
    demand: 'low',
    timeMultiplier: 1.0,
    masterMultiplier: 1.0,
    isSmartPricingEnabled: false,
    bookingsToday: 2,
    averageRating: 4.6,
    category: 'Ногтевой сервис'
  }
];

const pricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Премиальное время',
    type: 'time',
    description: 'Повышение цены в популярные часы (16:00-19:00)',
    isActive: true,
    modifier: 15,
    conditions: ['Время 16:00-19:00', 'Будние дни']
  },
  {
    id: '2',
    name: 'Высокий спрос',
    type: 'demand',
    description: 'Динамическое ценообразование при высокой загрузке',
    isActive: true,
    modifier: 20,
    conditions: ['Загрузка >80%', 'Менее 3 свободных слотов']
  },
  {
    id: '3',
    name: 'Топ-мастер',
    type: 'master',
    description: 'Надбавка за работу с мастерами высокого уровня',
    isActive: true,
    modifier: 25,
    conditions: ['Рейтинг мастера >4.8', 'Опыт >5 лет']
  },
  {
    id: '4',
    name: 'Сезонность',
    type: 'season',
    description: 'Корректировка цен в зависимости от сезона',
    isActive: false,
    modifier: 10,
    conditions: ['Праздничные периоды', 'Сезон свадеб']
  },
  {
    id: '5',
    name: 'VIP клиенты',
    type: 'client',
    description: 'Персональное ценообразование для VIP клиентов',
    isActive: true,
    modifier: -10,
    conditions: ['Статус VIP', 'Более 10 визитов']
  }
];

interface SmartPricingProps {
  onBack?: () => void;
}

export function SmartPricing({ onBack }: SmartPricingProps) {
  const [servicesData, setServicesData] = useState<Service[]>(services);
  const [rulesData, setRulesData] = useState<PricingRule[]>(pricingRules);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getDemandColor = (demand: Service['demand']) => {
    switch (demand) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandIcon = (demand: Service['demand']) => {
    switch (demand) {
      case 'high': return '🔥';
      case 'medium': return '📈';
      case 'low': return '📉';
      default: return '📊';
    }
  };

  const toggleSmartPricing = (serviceId: string) => {
    setServicesData(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isSmartPricingEnabled: !service.isSmartPricingEnabled }
        : service
    ));
  };

  const toggleRule = (ruleId: string) => {
    setRulesData(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
  };

  const calculatePriceChange = (service: Service) => {
    const change = ((service.currentPrice - service.basePrice) / service.basePrice) * 100;
    return change;
  };

  const totalRevenue = servicesData.reduce((sum, service) => 
    sum + (service.currentPrice * service.bookingsToday), 0
  );

  const totalBookings = servicesData.reduce((sum, service) => 
    sum + service.bookingsToday, 0
  );

  const averageIncrease = servicesData
    .filter(s => s.isSmartPricingEnabled)
    .reduce((sum, service) => sum + calculatePriceChange(service), 0) / 
    servicesData.filter(s => s.isSmartPricingEnabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Смарт-прайсинг</h2>
            <p className="text-gray-500 mt-1 text-sm">Динамическое ценообразование на основе спроса</p>
          </div>
        </div>
        
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <TrendingUp className="w-3 h-3" />
          Активно
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">
                  {(totalRevenue / 1000).toFixed(0)}k ₽
                </p>
                <p className="text-xs md:text-sm text-gray-500">Доход сегодня</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{totalBookings}</p>
                <p className="text-sm text-gray-500">Записей сегодня</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  +{averageIncrease.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Средний рост цен</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
                <p className="text-sm text-gray-500">Эффективность</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Умное ценообразование активно корректирует цены в реальном времени на основе спроса, времени дня и других факторов.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Услуги</TabsTrigger>
          <TabsTrigger value="rules">Правила</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-4">
            {servicesData.map(service => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.category}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getDemandIcon(service.demand)}</span>
                        <Badge className={getDemandColor(service.demand)}>
                          {service.demand === 'high' ? 'Высокий спрос' :
                           service.demand === 'medium' ? 'Средний спрос' : 'Низкий спрос'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-8 items-center">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Базовая цена</p>
                        <p className="font-semibold text-gray-600">
                          {service.basePrice.toLocaleString()} ₽
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Текущая цена</p>
                        <p className="font-semibold text-gray-900">
                          {service.currentPrice.toLocaleString()} ₽
                        </p>
                        {calculatePriceChange(service) !== 0 && (
                          <p className={`text-xs ${
                            calculatePriceChange(service) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {calculatePriceChange(service) > 0 ? '+' : ''}
                            {calculatePriceChange(service).toFixed(1)}%
                          </p>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Записей сегодня</p>
                        <p className="font-semibold text-gray-900">{service.bookingsToday}</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-sm text-gray-500 mb-2">Смарт-прайсинг</p>
                        <Switch
                          checked={service.isSmartPricingEnabled}
                          onCheckedChange={() => toggleSmartPricing(service.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <div className="space-y-4">
            {rulesData.map(rule => (
              <Card key={rule.id} className={`${!rule.isActive ? 'opacity-60' : ''} hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                        <Badge variant="outline">
                          {rule.type === 'time' ? '⏰ Время' :
                           rule.type === 'demand' ? '📊 Спрос' :
                           rule.type === 'master' ? '👤 Мастер' :
                           rule.type === 'season' ? '🗓️ Сезон' : '👑 Клиент'}
                        </Badge>
                        <Badge variant={rule.modifier > 0 ? 'default' : 'secondary'}>
                          {rule.modifier > 0 ? '+' : ''}{rule.modifier}%
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{rule.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {rule.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-sm text-gray-500 mb-2">Активно</p>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                      </div>
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Влияние на доходность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Дополнительный доход</p>
                      <p className="text-sm text-green-600">За счет динамического ценообразования</p>
                    </div>
                    <p className="text-xl font-semibold text-green-900">+18.5%</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Средний чек</p>
                      <p className="text-sm text-blue-600">По сравнению с фиксированными ценами</p>
                    </div>
                    <p className="text-xl font-semibold text-blue-900">+12.3%</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">Оптимизация загрузки</p>
                      <p className="text-sm text-purple-600">Равномерное распределение записей</p>
                    </div>
                    <p className="text-xl font-semibold text-purple-900">+25%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Активность правил</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rulesData.filter(rule => rule.isActive).map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{rule.name}</p>
                        <p className="text-sm text-gray-500">Применений сегодня: 12</p>
                      </div>
                      <Badge variant={rule.modifier > 0 ? 'default' : 'secondary'}>
                        {rule.modifier > 0 ? '+' : ''}{rule.modifier}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time-based Pricing Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ценообразование по времени дня</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-2 text-center text-sm">
                {Array.from({ length: 12 }, (_, i) => {
                  const hour = 9 + i;
                  const isPremium = hour >= 16 && hour <= 19;
                  return (
                    <div key={hour} className={`p-3 rounded-lg ${
                      isPremium ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <p className="font-medium">{hour}:00</p>
                      <p className="text-xs">
                        {isPremium ? '+15%' : '0%'}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>Обычные часы</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 rounded"></div>
                  <span>Премиальные часы</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}