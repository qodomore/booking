import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import { Badge } from './badge';
import { RussianRuble, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface HeatmapData {
  day: string;
  hour: number;
  load: number; // 0-100%
  price: number;
  bookings: number;
}

interface HeatmapCardProps {
  heatmapData: HeatmapData[];
  serviceId: string;
  resourceId: string;
  range: 'week' | 'month';
  onServiceChange: (value: string) => void;
  onResourceChange: (value: string) => void;
  onRangeChange: (value: 'week' | 'month') => void;
  onRecommendPrice: () => void;
}

// Mock data generation
const generateMockData = (range: 'week' | 'month'): HeatmapData[] => {
  const days = range === 'week' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['1', '5', '10', '15', '20', '25', '30'];
  
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9:00 - 20:00
  const data: HeatmapData[] = [];
  
  days.forEach(day => {
    hours.forEach(hour => {
      // Generate realistic patterns
      let baseLoad = 30;
      
      // Weekend patterns
      if (range === 'week' && (day === 'Сб' || day === 'Вс')) {
        baseLoad = day === 'Сб' ? 70 : 20;
      }
      
      // Time patterns
      if (hour >= 10 && hour <= 12) baseLoad += 25; // Morning peak
      if (hour >= 16 && hour <= 19) baseLoad += 30; // Evening peak
      if (hour === 13 || hour === 14) baseLoad -= 15; // Lunch dip
      
      // Random variation
      const load = Math.max(0, Math.min(100, baseLoad + (Math.random() - 0.5) * 30));
      
      data.push({
        day,
        hour,
        load: Math.round(load),
        price: 1500 + load * 15 + (Math.random() - 0.5) * 500,
        bookings: Math.round(load / 10)
      });
    });
  });
  
  return data;
};

const services = [
  { id: 'manicure', name: 'Маникюр' },
  { id: 'haircut', name: 'Стрижка' },
  { id: 'coloring', name: 'Окрашивание' },
  { id: 'massage', name: 'Массаж' }
];

const resources = [
  { id: 'anna', name: 'Анна К.' },
  { id: 'maria', name: 'Мария П.' },
  { id: 'elena', name: 'Елена С.' },
  { id: 'all', name: 'Все мастера' }
];

export function HeatmapCard({
  serviceId,
  resourceId,
  range,
  onServiceChange,
  onResourceChange,
  onRangeChange,
  onRecommendPrice
}: Omit<HeatmapCardProps, 'heatmapData'>) {
  const [selectedCell, setSelectedCell] = useState<HeatmapData | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null);
  
  const heatmapData = generateMockData(range);
  const days = range === 'week' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['1', '5', '10', '15', '20', '25', '30'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 9);

  const getLoadColor = (load: number) => {
    if (load < 20) return 'bg-green-100 border-green-200 text-green-800';
    if (load < 40) return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    if (load < 60) return 'bg-orange-100 border-orange-200 text-orange-800';
    if (load < 80) return 'bg-red-100 border-red-200 text-red-800';
    return 'bg-red-200 border-red-300 text-red-900';
  };

  const getLegendColor = (percentage: number) => {
    if (percentage < 20) return 'bg-green-400';
    if (percentage < 40) return 'bg-yellow-400';
    if (percentage < 60) return 'bg-orange-400';
    if (percentage < 80) return 'bg-red-400';
    return 'bg-red-600';
  };

  const getCellData = (day: string, hour: number): HeatmapData => {
    return heatmapData.find(d => d.day === day && d.hour === hour) || {
      day, hour, load: 0, price: 1500, bookings: 0
    };
  };

  const displayCell = hoveredCell || selectedCell;

  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">Карта загруженности и цен</CardTitle>
          <Button 
            onClick={onRecommendPrice}
            className="elegant-button sm:self-end"
            size="sm"
          >
            <RussianRuble className="w-4 h-4 mr-2" />
            Рекомендовать цену
          </Button>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={serviceId} onValueChange={onServiceChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Выберите услугу" />
            </SelectTrigger>
            <SelectContent>
              {services.map(service => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={resourceId} onValueChange={onResourceChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Выберите ресурс" />
            </SelectTrigger>
            <SelectContent>
              {resources.map(resource => (
                <SelectItem key={resource.id} value={resource.id}>
                  {resource.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Badge 
              variant={range === 'week' ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1"
              onClick={() => onRangeChange('week')}
            >
              Неделя
            </Badge>
            <Badge 
              variant={range === 'month' ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1"
              onClick={() => onRangeChange('month')}
            >
              Месяц
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Heatmap Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-8 gap-1 text-xs">
              {/* Header row with hours */}
              <div className="h-8"></div> {/* Empty cell for day column */}
              {hours.map(hour => (
                <div key={hour} className="h-8 flex items-center justify-center font-medium text-muted-foreground">
                  {hour}:00
                </div>
              ))}

              {/* Data rows */}
              {days.map(day => (
                <React.Fragment key={day}>
                  {/* Day label */}
                  <div className="h-8 flex items-center justify-center font-medium text-muted-foreground bg-muted/30 rounded">
                    {day}
                  </div>
                  
                  {/* Hour cells */}
                  {hours.map(hour => {
                    const cellData = getCellData(day, hour);
                    return (
                      <motion.div
                        key={`${day}-${hour}`}
                        className={`h-8 rounded cursor-pointer border transition-all duration-200 flex items-center justify-center text-xs font-medium ${getLoadColor(cellData.load)} hover:scale-110 hover:z-10 hover:shadow-lg`}
                        onClick={() => setSelectedCell(cellData)}
                        onMouseEnter={() => setHoveredCell(cellData)}
                        onMouseLeave={() => setHoveredCell(null)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {cellData.load}%
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Legend and Info Panel */}
          <div className="w-full lg:w-64 space-y-4">
            {/* Legend */}
            <div>
              <h4 className="font-medium mb-3">Загруженность</h4>
              <div className="space-y-2">
                {[
                  { range: '0-20%', label: 'Низкая', percentage: 10 },
                  { range: '20-40%', label: 'Умеренная', percentage: 30 },
                  { range: '40-60%', label: 'Средняя', percentage: 50 },
                  { range: '60-80%', label: 'Высокая', percentage: 70 },
                  { range: '80-100%', label: 'Максимальная', percentage: 90 }
                ].map(item => (
                  <div key={item.range} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded ${getLegendColor(item.percentage)}`}></div>
                    <span className="text-muted-foreground">{item.range}</span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cell Info */}
            {displayCell && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-muted/30 rounded-lg border"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded ${getLegendColor(displayCell.load)}`}></div>
                  <span className="font-medium">
                    {displayCell.day}, {displayCell.hour}:00
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ожид. загрузка:</span>
                    <span className="font-medium">{displayCell.load}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Рек. цена:</span>
                    <span className="font-medium">{Math.round(displayCell.price).toLocaleString()} ₽</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Записей:</span>
                    <span className="font-medium">{displayCell.bookings}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full mt-3 elegant-button"
                  onClick={onRecommendPrice}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Рекомендовать
                </Button>
              </motion.div>
            )}

            {/* Summary Stats */}
            <div className="p-4 bg-accent/50 rounded-lg">
              <h4 className="font-medium mb-3">Сводка</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Средняя загрузка:</span>
                  <span className="font-medium">
                    {Math.round(heatmapData.reduce((sum, d) => sum + d.load, 0) / heatmapData.length)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Пиковое время:</span>
                  <span className="font-medium">16:00-19:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Оптим. цена:</span>
                  <span className="font-medium">2 100 ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}