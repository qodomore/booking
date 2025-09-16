import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookingCalendarNew } from './BookingCalendarNew';
import { BookingCalendarBeforeService } from './BookingCalendarBeforeService';
import { BookingCalendarAfterService } from './BookingCalendarAfterService';
import { BookingComponentLibrary } from './BookingComponentLibrary';
import { Badge } from './ui/badge';
import { Package, CheckCircle } from 'lucide-react';

export function BookingCalendarDemo() {
  const [activeTab, setActiveTab] = useState('full-flow');

  const flows = [
    {
      id: 'full-flow',
      label: 'Полный флоу записи',
      description: 'Новый полный процесс от выбора услуги до подтверждения',
      component: <BookingCalendarNew />
    },
    {
      id: 'before',
      label: 'A: До выбора услуги',
      description: 'Показывает диапазоны доступности мастеров',
      component: <BookingCalendarBeforeService />
    },
    {
      id: 'after', 
      label: 'B: После выбора услуги',
      description: 'Показывает валидные старты для конкретной услуги',
      component: <BookingCalendarAfterService />
    },
    {
      id: 'library',
      label: 'Библиотека компонентов',
      description: 'Все компоненты и их состояния',
      component: <BookingComponentLibrary />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Демо календаря записей</span>
            <Badge variant="secondary">Desktop 1440px</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Современный профессиональный дизайн с улучшенным UX флоу. 
            Использует шрифт Kornilow, компоненты TimeRangeChip, StartTimeChip, 
            ResourceCard и StickyProgressBar.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Ключевые улучшения:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• До выбора услуги — диапазоны доступности (10:00–12:00)</li>
                <li>• После выбора услуги — валидные старты (09:00, 10:30, 12:00)</li>
                <li>• Устранён конфликт слотов и длительности услуг</li>
                <li>• Прогресс-бар из 3 шагов с правильной последовательностью</li>
                <li>• Современная типографика с правильными пропорциями</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flow Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {flows.map((flow) => (
            <TabsTrigger key={flow.id} value={flow.id} className="text-xs">
              {flow.id === 'library' ? (
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Библиотека
                </div>
              ) : flow.id === 'full-flow' ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Полный флоу
                </div>
              ) : (
                flow.label
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {flows.map((flow) => (
          <TabsContent key={flow.id} value={flow.id} className="mt-6">
            {flow.id !== 'library' && flow.id !== 'full-flow' && (
              <Card className="clean-card mb-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{flow.label}</h3>
                  <p className="text-sm text-muted-foreground">{flow.description}</p>
                </CardContent>
              </Card>
            )}
            {flow.component}
          </TabsContent>
        ))}
      </Tabs>

      {/* Implementation Notes */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle>Технические детали</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Компоненты:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-primary">TimeRangeChip</p>
                <p className="text-muted-foreground">Для диапазонов времени (10:00–12:00)</p>
              </div>
              <div>
                <p className="font-medium text-primary">StartTimeChip</p>
                <p className="text-muted-foreground">Для конкретных стартов (09:00, 10:30)</p>
              </div>
              <div>
                <p className="font-medium text-primary">ResourceCard</p>
                <p className="text-muted-foreground">Два состояния: availability / start-times</p>
              </div>
              <div>
                <p className="font-medium text-primary">StickyProgressBar</p>
                <p className="text-muted-foreground">3-шаговый прогресс с CTA</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">UX принципы:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Минимальные тап-цели 44×44px для touch-устройств</li>
              <li>• Контраст WCAG AA для доступности</li>
              <li>• Плавные анимации с cubic-bezier(0.4, 0, 0.2, 1)</li>
              <li>• Скелетоны вместо спиннеров для лучшего UX</li>
              <li>• Sticky CTA для высокой конверсии</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}