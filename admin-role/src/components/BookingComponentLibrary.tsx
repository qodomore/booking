import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { TimeRangeChip } from './ui/time-range-chip';
import { StartTimeChip, StartTimeChipGrid } from './ui/start-time-chip';
import { ResourceCard } from './ui/resource-card';
import { StickyProgressBar } from './ui/sticky-progress-bar';
import { DateChips } from './ui/filter-chips';
import { EmptyState } from './ui/empty-state';
import { Calendar, Clock, Star, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function BookingComponentLibrary() {
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  const mockSteps = [
    { id: 1, label: 'Выбор услуги', completed: false },
    { id: 2, label: 'Выбор времени', completed: false },
    { id: 3, label: 'Подтверждение', completed: false }
  ];

  const mockTimeRanges = [
    { start: '10:00', end: '12:00' },
    { start: '14:30', end: '17:00' },
    { start: '18:00', end: '20:00' }
  ];

  const mockStartTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'];

  const components = [
    {
      id: 'chips',
      label: 'Чипы времени',
      description: 'TimeRangeChip, StartTimeChip, DateChips'
    },
    {
      id: 'cards',
      label: 'Карточки ресурсов',
      description: 'ResourceCard в разных состояниях'
    },
    {
      id: 'navigation',
      label: 'Навигация',
      description: 'StickyProgressBar, EmptyState'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-semibold text-3xl">Библиотека компонентов календаря</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Современные компоненты для системы записи с профессиональным дизайном 
          и оптимизированным UX. Все компоненты адаптированы под Telegram WebApp.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">Desktop 1440px</Badge>
          <Badge variant="secondary">Kornilow Font</Badge>
          <Badge variant="secondary">WCAG AA</Badge>
        </div>
      </div>

      <Tabs defaultValue="chips" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {components.map((component) => (
            <TabsTrigger key={component.id} value={component.id} className="text-sm">
              {component.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Чипы времени */}
        <TabsContent value="chips" className="space-y-8">
          <Card className="clean-card">
            <CardHeader>
              <CardTitle>Чипы дат (DateChips)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Для выбора даты записи. Минимальная тап-цель 44×44px.
              </p>
            </CardHeader>
            <CardContent>
              <DateChips
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader>
              <CardTitle>Чипы диапазонов времени (TimeRangeChip)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Показывают диапазоны доступности до выбора услуги.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Состояние по умолчанию</h4>
                <div className="flex flex-wrap gap-2">
                  {mockTimeRanges.map((range, index) => (
                    <TimeRangeChip
                      key={index}
                      startTime={range.start}
                      endTime={range.end}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Отключенное состояние</h4>
                <div className="flex flex-wrap gap-2">
                  <TimeRangeChip
                    startTime="19:00"
                    endTime="20:00"
                    variant="disabled"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader>
              <CardTitle>Чипы стартов времени (StartTimeChip)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Показывают валидные старты после выбора услуги.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Отдельные чипы</h4>
                <div className="flex flex-wrap gap-2">
                  <StartTimeChip time="09:00" />
                  <StartTimeChip time="10:30" selected />
                  <StartTimeChip time="12:00" disabled />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Сетка с кнопкой "Ещё"</h4>
                <StartTimeChipGrid
                  times={mockStartTimes}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  maxVisible={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Карточки ресурсов */}
        <TabsContent value="cards" className="space-y-8">
          <Card className="clean-card">
            <CardHeader>
              <CardTitle>ResourceCard - До выбора услуги</CardTitle>
              <p className="text-sm text-muted-foreground">
                Показывает диапазоны доступности мастера.
              </p>
            </CardHeader>
            <CardContent>
              <ResourceCard
                id="master-1"
                name="Анна Петрова"
                rating={4.8}
                specialties={['Маникюр', 'Педикюр', 'Гель-лак']}
                bookingCount={5}
                variant="availability"
                availableRanges={mockTimeRanges}
                nextAvailable="14:30"
                availableHours={4.5}
              />
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader>
              <CardTitle>ResourceCard - После выбора услуги</CardTitle>
              <p className="text-sm text-muted-foreground">
                Показывает валидные старты для конкретной услуги.
              </p>
            </CardHeader>
            <CardContent>
              <ResourceCard
                id="master-2"
                name="Мария Иванова"
                rating={4.9}
                specialties={['Стрижка', 'Окрашивание', 'Укладка']}
                bookingCount={3}
                variant="start-times"
                availableStartTimes={mockStartTimes.slice(0, 6)}
                selectedTime="10:30"
                serviceDuration={60}
                onTimeSelect={(time) => console.log('Selected time:', time)}
              />
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader>
              <CardTitle>ResourceCard - Пустые состояния</CardTitle>
              <p className="text-sm text-muted-foreground">
                Различные сценарии недоступности.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Нет окон сегодня</h4>
                <ResourceCard
                  id="master-3"
                  name="Елена Сидорова"
                  rating={4.7}
                  specialties={['Брови', 'Ресницы']}
                  bookingCount={8}
                  variant="availability"
                  availableRanges={[]}
                  nextAvailable="завтра в 12:30"
                  availableHours={0}
                  emptyState="none-today"
                />
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Высокая нагрузка</h4>
                <ResourceCard
                  id="master-4"
                  name="Ольга Козлова"
                  rating={4.6}
                  specialties={['Маникюр', 'Дизайн']}
                  bookingCount={7}
                  variant="availability"
                  availableRanges={[{ start: '16:00', end: '17:00' }]}
                  nextAvailable="16:00"
                  availableHours={1}
                  emptyState="heavy-load"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader>
              <CardTitle>ResourceCard - Состояние загрузки</CardTitle>
              <p className="text-sm text-muted-foreground">
                Скелетон вместо спиннера для лучшего UX.
              </p>
            </CardHeader>
            <CardContent>
              <ResourceCard
                id="master-loading"
                name=""
                rating={0}
                specialties={[]}
                variant="loading"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Навигация */}
        <TabsContent value="navigation" className="space-y-8">
          <Card className="clean-card">
            <CardHeader>
              <CardTitle>StickyProgressBar</CardTitle>
              <p className="text-sm text-muted-foreground">
                Липкая панель прогресса с 3 шагами и динамичным CTA.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={currentStep === 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                >
                  Шаг 1
                </Button>
                <Button
                  variant={currentStep === 2 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentStep(2)}
                >
                  Шаг 2
                </Button>
                <Button
                  variant={currentStep === 3 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentStep(3)}
                >
                  Шаг 3
                </Button>
              </div>
              
              <div className="relative bg-muted/20 p-8 rounded-lg">
                <StickyProgressBar
                  currentStep={currentStep}
                  steps={mockSteps.map(step => ({
                    ...step,
                    completed: step.id < currentStep
                  }))}
                  ctaText={
                    currentStep === 1 ? 'Выбрать услугу' :
                    currentStep === 2 ? 'Подтвердить 14:30' :
                    'Подтвердить запись'
                  }
                  onCtaClick={() => console.log('CTA clicked for step', currentStep)}
                  className="relative border shadow-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader>
              <CardTitle>EmptyState</CardTitle>
              <p className="text-sm text-muted-foreground">
                Пустые состояния с понятными действиями.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Нет мастеров</h4>
                <EmptyState
                  icon={User}
                  title="Нет доступных мастеров"
                  description="Добавьте специалистов в разделе 'Мастера'"
                  action={{
                    label: "Добавить мастера",
                    onClick: () => console.log('Add master')
                  }}
                />
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Нет записей</h4>
                <EmptyState
                  icon={Calendar}
                  title="Пока нет записей"
                  description="Создайте первую запись для клиента"
                  action={{
                    label: "Создать запись",
                    onClick: () => console.log('Create booking')
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Design System Info */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle>Система дизайна</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Типографика</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Шрифт: Kornilow</li>
                <li>• Размеры: 20/16/14/12px</li>
                <li>• Межстрочный: 120-140%</li>
                <li>• Трекинг: -0.01em</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Сетка и отступы</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Базовая сетка: 8pt</li>
                <li>• Отступы: 16-24px</li>
                <li>• Тап-цели: ≥44×44px</li>
                <li>• Радиус: 1rem</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Анимации</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Переходы: 200ms</li>
                <li>• Easing: cubic-bezier</li>
                <li>• Hover: scale(1.02)</li>
                <li>• Active: scale(0.98)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}