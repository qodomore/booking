import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookingConfirmationScreen } from './BookingConfirmationScreen';
import { BookingSuccess } from './BookingSuccess';

interface BookingConfirmationDemoProps {
  onBack?: () => void;
}

export function BookingConfirmationDemo({ onBack }: BookingConfirmationDemoProps) {
  const [currentView, setCurrentView] = useState<'demo' | 'confirmation' | 'success'>('demo');
  const [completedBooking, setCompletedBooking] = useState<any>(null);

  // Мок данные для демонстрации
  const mockBookingData = {
    service: {
      id: '1',
      name: 'Классический маникюр',
      duration: 90,
      price: 2500,
      description: 'Комплексный уход за ногтями с покрытием'
    },
    masterId: 'master-1',
    masterName: 'Анна Петрова',
    selectedTime: '14:30',
    selectedDate: '2024-12-15'
  };

  const handleBookingConfirm = (clientData: any, upsellData?: any) => {
    const booking = {
      id: Date.now().toString(),
      serviceName: mockBookingData.service.name,
      masterName: mockBookingData.masterName,
      date: mockBookingData.selectedDate,
      time: mockBookingData.selectedTime,
      duration: upsellData?.totalDuration || mockBookingData.service.duration,
      price: upsellData?.totalPrice || mockBookingData.service.price,
      clientName: clientData.name,
      address: 'ул. Пушкина, д. 15'
    };
    
    setCompletedBooking(booking);
    setCurrentView('success');
  };

  const handleBackToDemo = () => {
    setCurrentView('demo');
    setCompletedBooking(null);
  };

  if (currentView === 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <BookingConfirmationScreen
            bookingData={mockBookingData}
            onConfirm={handleBookingConfirm}
            onBack={handleBackToDemo}
            onChangeService={() => console.log('Change service')}
            onChangeTime={() => console.log('Change time')}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'success' && completedBooking) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <BookingSuccess
            booking={completedBooking}
            onClose={handleBackToDemo}
            onRepeatBooking={() => console.log('Repeat booking')}
            onBookNextVisit={() => console.log('Book next visit')}
            onChooseNextTime={() => console.log('Choose next time')}
            plan="pro"
          />
        </div>
      </div>
    );
  }

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
            <Settings className="w-6 h-6 text-primary" />
            Демо: Подтверждение брони с Upsell
          </h1>
          <p className="text-muted-foreground">
            Тестирование новой функциональности UpsellHint
          </p>
        </div>
      </div>

      {/* Feature Description */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Новая функциональность UpsellHint</h3>
              <p className="text-sm text-muted-foreground">
                Интеграция дополнительных услуг в процесс подтверждения записи
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Что реализовано:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• UpsellHint компонент в блоке итогов</li>
                <li>• Интеграция с UpsellBottomSheet</li>
                <li>• Пересчет цены и времени в реальном времени</li>
                <li>• Гейтинг для функций Pro тарифа</li>
                <li>• Обновленный StickyProgressBar с ценой</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Логика работы:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• nearbySlotExists: true (соседний слот доступен)</li>
                <li>• Скидка 10% за продление +15 мин</li>
                <li>• Доступны 3 доп. услуги</li>
                <li>• План: free (показывает пейвол для админа)</li>
                <li>• Кнопка "Добавить" обновляет итоги</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Data */}
      <Card>
        <CardHeader>
          <CardTitle>Тестовые данные</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Базовая услуга</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Название:</span> {mockBookingData.service.name}</p>
                <p><span className="text-muted-foreground">Время:</span> {mockBookingData.service.duration} мин</p>
                <p><span className="text-muted-foreground">Цена:</span> ₽{mockBookingData.service.price.toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Мастер и время</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Мастер:</span> {mockBookingData.masterName}</p>
                <p><span className="text-muted-foreground">Дата:</span> 15 декабря 2024</p>
                <p><span className="text-muted-foreground">Время:</span> {mockBookingData.selectedTime}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Дополнительные услуги</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Укладка:</span> ₽800 (20 мин)</p>
                <p><span className="text-muted-foreground">Массаж головы:</span> ₽500 (15 мин)</p>
                <p><span className="text-muted-foreground">Уход для волос:</span> ₽600 (10 мин)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Демонстрация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => setCurrentView('confirmation')}
              className="elegant-button flex-1"
              size="lg"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Тестировать подтверждение брони
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">nearbySlotExists: true</Badge>
            <Badge variant="outline">userPlan: free</Badge>
            <Badge variant="outline">isAdmin: true</Badge>
            <Badge variant="outline">+15 мин скидка: 10%</Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Сценарий тестирования:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Заполните данные клиента</li>
              <li>Нажмите на "Рядом +15 мин −10%" в блоке итогов</li>
              <li>Попробуйте добавить дополнительные услуги (покажет пейвол)</li>
              <li>Включите переключатель "+15 мин" (также пейвол)</li>
              <li>Посмотрите на изменение итоговой цены в прогресс-баре</li>
              <li>Подтвердите запись и увидите экран успеха</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}