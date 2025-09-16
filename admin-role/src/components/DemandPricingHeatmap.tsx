import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info, 
  Calendar,
  Clock,
  RussianRuble,
  Target,
  BarChart3,
  Lock,
  Zap
} from 'lucide-react';

interface HeatmapSlotData {
  day: string;
  hour: number;
  // History metrics
  occupancyPct: number;
  bookings: number;
  revenue: number;
  cancellationsPct: number;
  avgPrice: number;
  // Forecast metrics  
  demandPct: number;
  expectedBookings: number;
  suggestedPrice: number;
  priceChange: number; // percentage change from base price
  confidence: 'low' | 'mid' | 'high';
  // Factors for suggested price
  factors: PricingFactor[];
}

interface PricingFactor {
  label: string;
  impact: number; // -0.15 to +0.20 range
  weight: number; // 0-1 importance
}

interface DemandPricingHeatmapProps {
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro';
  onApplyPrice?: (context: PriceContext) => void;
}

interface PriceContext {
  service: string;
  resource: string;
  date: string;
  timeSlot: string;
  suggestedPrice: number;
  factors: PricingFactor[];
}

// Mock data generation
const generateMockSlotData = (
  mode: 'history' | 'forecast',
  range: 'week' | 'month'
): HeatmapSlotData[] => {
  const days = range === 'week' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['1', '5', '10', '15', '20', '25', '30'];
  
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 - 21:00
  const data: HeatmapSlotData[] = [];
  
  days.forEach((day, dayIndex) => {
    hours.forEach((hour, hourIndex) => {
      // Base patterns
      let baseOccupancy = 30;
      let baseDemand = 35;
      
      // Weekend patterns
      if (range === 'week' && (day === 'Сб' || day === 'Вс')) {
        baseOccupancy = day === 'Сб' ? 75 : 25;
        baseDemand = day === 'Сб' ? 80 : 30;
      }
      
      // Time patterns - morning and evening peaks
      if (hour >= 9 && hour <= 11) {
        baseOccupancy += 20;
        baseDemand += 25;
      }
      if (hour >= 16 && hour <= 19) {
        baseOccupancy += 35;
        baseDemand += 40;
      }
      if (hour === 13 || hour === 14) {
        baseOccupancy -= 20;
        baseDemand -= 15;
      }
      
      // Random variation
      const occupancy = Math.max(0, Math.min(100, baseOccupancy + (Math.random() - 0.5) * 25));
      const demand = Math.max(0, Math.min(100, baseDemand + (Math.random() - 0.5) * 30));
      
      // Price calculation
      const basePrice = 1800;
      const priceMultiplier = 1 + (demand - 50) / 100 * 0.3; // ±30% based on demand
      const suggestedPrice = Math.round(basePrice * priceMultiplier);
      const priceChange = ((suggestedPrice - basePrice) / basePrice) * 100;
      
      // Confidence based on data availability
      let confidence: 'low' | 'mid' | 'high' = 'mid';
      if (dayIndex < 2 || hourIndex < 3) confidence = 'high';
      if (dayIndex > 5 || hourIndex > 10 || Math.random() < 0.2) confidence = 'low';
      
      // Pricing factors
      const factors: PricingFactor[] = [
        {
          label: demand > 70 ? 'Высокий спрос' : demand < 30 ? 'Низкий спрос' : 'Умеренный спрос',
          impact: (demand - 50) / 100 * 0.15,
          weight: 0.8
        },
        {
          label: hour >= 16 && hour <= 19 ? 'Прайм-тайм' : 'Обычное время',
          impact: hour >= 16 && hour <= 19 ? 0.08 : -0.02,
          weight: 0.6
        },
        {
          label: day === 'Сб' ? 'Выходной день' : 'Рабочий день',
          impact: day === 'Сб' ? 0.12 : 0,
          weight: 0.4
        },
        {
          label: 'Загрузка рядом',
          impact: Math.random() * 0.1 - 0.05,
          weight: 0.3
        }
      ].filter(f => Math.abs(f.impact) > 0.01);
      
      data.push({
        day,
        hour,
        occupancyPct: Math.round(occupancy),
        bookings: Math.round(occupancy / 15) + Math.round(Math.random() * 3),
        revenue: Math.round((basePrice * occupancy / 100) * (2 + Math.random())),
        cancellationsPct: Math.round(Math.random() * 15),
        avgPrice: Math.round(basePrice + (Math.random() - 0.5) * 400),
        demandPct: Math.round(demand),
        expectedBookings: Math.round(demand / 20) + Math.round(Math.random() * 2),
        suggestedPrice,
        priceChange,
        confidence,
        factors
      });
    });
  });
  
  return data;
};

const services = [
  { id: 'all', name: { ru: 'Все услуги', en: 'All Services' } },
  { id: 'manicure', name: { ru: 'Маникюр', en: 'Manicure' } },
  { id: 'haircut', name: { ru: 'Стрижка', en: 'Haircut' } },
  { id: 'coloring', name: { ru: 'Окрашивание', en: 'Coloring' } },
  { id: 'massage', name: { ru: 'Массаж', en: 'Massage' } }
];

const resources = [
  { id: 'all', name: { ru: 'Все ресурсы', en: 'All Resources' } },
  { id: 'anna', name: { ru: 'Анна К.', en: 'Anna K.' } },
  { id: 'maria', name: { ru: 'Мария П.', en: 'Maria P.' } },
  { id: 'elena', name: { ru: 'Елена С.', en: 'Elena S.' } }
];

const getMetricDisplayName = (metric: string, locale: 'ru' | 'en') => {
  const names = {
    occupancy: { ru: 'Занятость %', en: 'Occupancy %' },
    bookings: { ru: 'Брони', en: 'Bookings' },
    revenue: { ru: 'Выручка', en: 'Revenue' },
    cancellations: { ru: 'Отмены %', en: 'Cancellations %' },
    demand: { ru: 'Ожид. спрос %', en: 'Expected Demand %' },
    expectedBookings: { ru: 'Ожид. брони', en: 'Expected Bookings' },
    price: { ru: 'Реком. цена', en: 'Suggested Price' }
  };
  return names[metric as keyof typeof names]?.[locale] || metric;
};

export function DemandPricingHeatmap({ 
  locale = 'ru', 
  plan = 'free',
  onApplyPrice 
}: DemandPricingHeatmapProps) {
  const [mode, setMode] = useState<'history' | 'forecast'>('forecast');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedResource, setSelectedResource] = useState('all');
  const [range, setRange] = useState<'week' | 'month'>('week');
  const [metric, setMetric] = useState('demand');
  const [selectedCell, setSelectedCell] = useState<HeatmapSlotData | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapSlotData | null>(null);

  const isLocked = plan !== 'pro';

  const heatmapData = useMemo(() => 
    generateMockSlotData(mode, range), 
    [mode, range, selectedService, selectedResource]
  );

  const days = range === 'week' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['1', '5', '10', '15', '20', '25', '30'];
  
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  const historyMetrics = ['occupancy', 'bookings', 'revenue', 'cancellations'];
  const forecastMetrics = ['demand', 'expectedBookings', 'price'];
  const availableMetrics = mode === 'history' ? historyMetrics : forecastMetrics;

  // Update metric when mode changes
  React.useEffect(() => {
    if (mode === 'history' && !historyMetrics.includes(metric)) {
      setMetric('occupancy');
    } else if (mode === 'forecast' && !forecastMetrics.includes(metric)) {
      setMetric('demand');
    }
  }, [mode, metric]);

  const getMetricValue = (slot: HeatmapSlotData, metric: string): number => {
    switch (metric) {
      case 'occupancy': return slot.occupancyPct;
      case 'bookings': return slot.bookings;
      case 'revenue': return slot.revenue;
      case 'cancellations': return slot.cancellationsPct;
      case 'demand': return slot.demandPct;
      case 'expectedBookings': return slot.expectedBookings;
      case 'price': return slot.suggestedPrice;
      default: return 0;
    }
  };

  const getMetricColor = (value: number, metric: string): string => {
    if (metric === 'price') {
      // Color by demand percentage for price metric
      const slot = heatmapData.find(d => getMetricValue(d, 'price') === value);
      if (!slot) return 'bg-gray-100 border-gray-200 text-gray-700';
      
      const demand = slot.demandPct;
      if (demand < 30) return 'bg-green-100 border-green-200 text-green-800';
      if (demand < 60) return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      if (demand < 85) return 'bg-orange-100 border-orange-200 text-orange-800';
      return 'bg-red-100 border-red-200 text-red-800';
    }
    
    if (metric === 'revenue' || metric === 'bookings' || metric === 'expectedBookings') {
      // Use relative scaling for absolute values
      const maxValue = Math.max(...heatmapData.map(d => getMetricValue(d, metric)));
      const percentage = (value / maxValue) * 100;
      
      if (percentage < 30) return 'bg-green-100 border-green-200 text-green-800';
      if (percentage < 60) return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      if (percentage < 85) return 'bg-orange-100 border-orange-200 text-orange-800';
      return 'bg-red-100 border-red-200 text-red-800';
    }
    
    // For percentage-based metrics
    if (value < 30) return 'bg-green-100 border-green-200 text-green-800';
    if (value < 60) return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    if (value < 85) return 'bg-orange-100 border-orange-200 text-orange-800';
    return 'bg-red-100 border-red-200 text-red-800';
  };

  const getConfidenceIndicator = (confidence: 'low' | 'mid' | 'high') => {
    const indicators = {
      low: '▪',
      mid: '▪▪',
      high: '▪▪▪'
    };
    const colors = {
      low: 'text-red-500',
      mid: 'text-yellow-500', 
      high: 'text-green-500'
    };
    
    return (
      <span className={`text-xs font-mono ${colors[confidence]}`}>
        {indicators[confidence]}
      </span>
    );
  };

  const formatMetricValue = (value: number, metric: string): string => {
    switch (metric) {
      case 'occupancy':
      case 'demand':
      case 'cancellations':
        return `${value}%`;
      case 'revenue':
      case 'price':
        return `${Math.round(value / 1000)}k ₽`;
      case 'bookings':
      case 'expectedBookings':
        return value.toString();
      default:
        return value.toString();
    }
  };

  const getCellData = (day: string, hour: number): HeatmapSlotData => {
    return heatmapData.find(d => d.day === day && d.hour === hour) || {
      day, hour, occupancyPct: 0, bookings: 0, revenue: 0, cancellationsPct: 0,
      avgPrice: 1800, demandPct: 0, expectedBookings: 0, suggestedPrice: 1800,
      priceChange: 0, confidence: 'low' as const, factors: []
    };
  };

  const displayCell = hoveredCell || selectedCell;

  const handleApplyPrice = () => {
    if (!displayCell || !onApplyPrice) return;
    
    const context: PriceContext = {
      service: selectedService,
      resource: selectedResource,
      date: `${displayCell.day}`,
      timeSlot: `${displayCell.hour}:00-${displayCell.hour + 1}:00`,
      suggestedPrice: displayCell.suggestedPrice,
      factors: displayCell.factors
    };
    
    onApplyPrice(context);
  };

  const text = {
    ru: {
      title: 'Карта спроса и цен',
      history: 'История',
      forecast: 'Прогноз',
      week: 'Неделя',
      month: 'Месяц',
      applyPrice: 'Применить цену',
      selectService: 'Выберите услугу',
      selectResource: 'Выберите ресурс',
      legend: 'Легенда',
      lowLoad: 'Низкая',
      moderateLoad: 'Умеренная', 
      mediumLoad: 'Средняя',
      highLoad: 'Высокая',
      criticalLoad: 'Критическая',
      inspector: 'Детали слота',
      factors: 'Причины',
      confidence: 'Уверенность',
      low: 'Низкая',
      mid: 'Средняя',
      high: 'Высокая',
      proFeature: 'Доступно в Pro',
      unlockPro: 'Разблокировать Pro'
    },
    en: {
      title: 'Demand & Pricing Map',
      history: 'History',
      forecast: 'Forecast',
      week: 'Week',
      month: 'Month',
      applyPrice: 'Apply Price',
      selectService: 'Select Service',
      selectResource: 'Select Resource',
      legend: 'Legend',
      lowLoad: 'Low',
      moderateLoad: 'Moderate',
      mediumLoad: 'Medium', 
      highLoad: 'High',
      criticalLoad: 'Critical',
      inspector: 'Slot Details',
      factors: 'Drivers',
      confidence: 'Confidence',
      low: 'Low',
      mid: 'Medium',
      high: 'High',
      proFeature: 'Available in Pro',
      unlockPro: 'Unlock Pro'
    }
  };

  const t = text[locale];

  if (isLocked) {
    return (
      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Blurred preview */}
            <div className="filter blur-sm pointer-events-none">
              <div className="grid grid-cols-8 gap-1 text-xs mb-4">
                <div className="h-8"></div>
                {hours.slice(0, 7).map(hour => (
                  <div key={hour} className="h-8 flex items-center justify-center font-medium text-muted-foreground">
                    {hour}:00
                  </div>
                ))}
                {days.slice(0, 3).map(day => (
                  <React.Fragment key={day}>
                    <div className="h-8 flex items-center justify-center font-medium text-muted-foreground bg-muted/30 rounded">
                      {day}
                    </div>
                    {Array.from({ length: 7 }, (_, i) => (
                      <div key={i} className="h-8 rounded bg-orange-100 border border-orange-200 text-orange-800 flex items-center justify-center text-xs font-medium">
                        {Math.round(Math.random() * 80 + 20)}%
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center space-y-4">
              <Lock className="w-12 h-12 text-muted-foreground" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">{t.proFeature}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {locale === 'ru' 
                    ? 'Получите доступ к интеллектуальной карте спроса и ценообразования с детальной аналитикой и рекомендациями.'
                    : 'Get access to intelligent demand and pricing heatmap with detailed analytics and recommendations.'
                  }
                </p>
              </div>
              <Button className="elegant-button">
                <Zap className="w-4 h-4 mr-2" />
                {t.unlockPro}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="heatmap-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {t.title}
        </CardTitle>
        
        {/* Controls */}
        <div className="space-y-4">
          {/* Top row - Service and Resource selectors */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t.selectService} />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name[locale]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedResource} onValueChange={setSelectedResource}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t.selectResource} />
              </SelectTrigger>
              <SelectContent>
                {resources.map(resource => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name[locale]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Second row - Mode, Range, Metric */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'history' | 'forecast')}>
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="history">{t.history}</TabsTrigger>
                <TabsTrigger value="forecast">{t.forecast}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Badge 
                variant={range === 'week' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setRange('week')}
              >
                {t.week}
              </Badge>
              <Badge 
                variant={range === 'month' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setRange('month')}
              >
                {t.month}
              </Badge>
            </div>

            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics.map(m => (
                  <SelectItem key={m} value={m}>
                    {getMetricDisplayName(m, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Heatmap Grid */}
          <div className="flex-1 min-w-0">
            <div className="overflow-x-auto">
              <div className="grid gap-1 text-xs min-w-max" style={{ gridTemplateColumns: `auto repeat(${hours.length}, 1fr)` }}>
                {/* Header row with hours */}
                <div className="h-8"></div>
                {hours.map(hour => (
                  <div key={hour} className="h-8 w-12 flex items-center justify-center font-medium text-muted-foreground">
                    {hour}:00
                  </div>
                ))}

                {/* Data rows */}
                {days.map(day => (
                  <React.Fragment key={day}>
                    <div className="h-8 w-12 flex items-center justify-center font-medium text-muted-foreground bg-muted/30 rounded">
                      {day}
                    </div>
                    
                    {hours.map(hour => {
                      const cellData = getCellData(day, hour);
                      const metricValue = getMetricValue(cellData, metric);
                      const isClosedSlot = hour < 8 || hour > 21;
                      
                      if (isClosedSlot) {
                        return (
                          <div key={`${day}-${hour}`} className="h-8 w-12 rounded bg-muted/50 border border-muted flex items-center justify-center">
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          </div>
                        );
                      }

                      return (
                        <motion.div
                          key={`${day}-${hour}`}
                          className={`heatmap-cell h-8 w-12 rounded cursor-pointer border-2 flex flex-col items-center justify-center text-xs font-medium relative ${getMetricColor(metricValue, metric)}`}
                          onClick={() => setSelectedCell(cellData)}
                          onMouseEnter={() => setHoveredCell(cellData)}
                          onMouseLeave={() => setHoveredCell(null)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center leading-tight">
                            {formatMetricValue(metricValue, metric)}
                          </div>
                          {mode === 'forecast' && (
                            <div className="absolute -top-1 -right-1">
                              {getConfidenceIndicator(cellData.confidence)}
                            </div>
                          )}
                          {metric === 'price' && (
                            <div className="absolute -bottom-1 -right-1">
                              <Badge variant="secondary" className="text-xs px-1 py-0 h-auto">
                                {cellData.priceChange > 0 ? '+' : ''}{Math.round(cellData.priceChange)}%
                              </Badge>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Legend and Inspector */}
          <div className="w-full xl:w-80 space-y-4">
            {/* Legend */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                {t.legend}
              </h4>
              <div className="space-y-2">
                {[
                  { range: '0-30%', label: t.lowLoad, color: 'bg-green-400' },
                  { range: '30-60%', label: t.moderateLoad, color: 'bg-yellow-400' },
                  { range: '60-85%', label: t.mediumLoad, color: 'bg-orange-400' },
                  { range: '85-100%', label: t.highLoad, color: 'bg-red-400' }
                ].map(item => (
                  <div key={item.range} className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="text-muted-foreground text-xs">{item.range}</span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
              
              {mode === 'forecast' && (
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">{t.confidence}:</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-500 font-mono">▪▪▪</span>
                      <span>{t.high}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-yellow-500 font-mono">▪▪</span>
                      <span>{t.mid}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-red-500 font-mono">▪</span>
                      <span>{t.low}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inspector Panel */}
            <AnimatePresence>
              {displayCell && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {displayCell.day}, {displayCell.hour}:00-{displayCell.hour + 1}:00
                    </span>
                    {mode === 'forecast' && (
                      <div className="ml-auto">
                        {getConfidenceIndicator(displayCell.confidence)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {mode === 'history' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Занятость:</span>
                          <span className="font-medium">{displayCell.occupancyPct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Брони:</span>
                          <span className="font-medium">{displayCell.bookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Выручка:</span>
                          <span className="font-medium">{Math.round(displayCell.revenue / 1000)}k ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Отмены:</span>
                          <span className="font-medium">{displayCell.cancellationsPct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ср. цена:</span>
                          <span className="font-medium">{displayCell.avgPrice.toLocaleString()} ₽</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ожид. спрос:</span>
                          <span className="font-medium">{displayCell.demandPct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Реком. цена:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{displayCell.suggestedPrice.toLocaleString()} ₽</span>
                            <Badge variant={displayCell.priceChange > 0 ? "destructive" : "secondary"} className="text-xs">
                              {displayCell.priceChange > 0 ? '+' : ''}{Math.round(displayCell.priceChange)}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Уверенность:</span>
                          <span className="font-medium">{t[displayCell.confidence]}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {mode === 'forecast' && displayCell.factors.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {t.factors}
                      </h5>
                      <div className="space-y-1">
                        {displayCell.factors.slice(0, 4).map((factor, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{factor.label}</span>
                            <div className="flex items-center gap-1">
                              {factor.impact > 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : factor.impact < 0 ? (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              ) : (
                                <Minus className="w-3 h-3 text-muted-foreground" />
                              )}
                              <span className={factor.impact > 0 ? 'text-green-600' : factor.impact < 0 ? 'text-red-600' : 'text-muted-foreground'}>
                                {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full mt-4 elegant-button"
                    onClick={handleApplyPrice}
                  >
                    <RussianRuble className="w-4 h-4 mr-2" />
                    {t.applyPrice}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}