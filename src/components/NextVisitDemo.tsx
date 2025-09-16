import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { NextVisitCard } from './ui/next-visit-card';
import { NextVisitAdminCard } from './ui/next-visit-admin-card';
import { SuggestContactSheet } from './ui/suggest-contact-sheet';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTelegram } from '../hooks/useTelegram';
import { toast } from 'sonner@2.0.3';

export function NextVisitDemo() {
  const { hapticFeedback } = useTelegram();
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'premium'>('free');
  const [currentLocale, setCurrentLocale] = useState<'ru' | 'en'>('ru');
  const [isSuggestContactOpen, setIsSuggestContactOpen] = useState(false);

  const handleBookOneClick = () => {
    hapticFeedback.success();
    toast.success('Записываем на следующий визит!', {
      description: 'Переход к подтверждению записи...'
    });
  };

  const handleChooseTime = () => {
    hapticFeedback.light();
    toast.info('Выбираем другое время', {
      description: 'Переход к календарю записи...'
    });
  };

  const handleSuggestToClient = () => {
    hapticFeedback.light();
    setIsSuggestContactOpen(true);
  };

  const handleEditSuggestion = () => {
    hapticFeedback.light();
    toast.info('Редактирование предложения', {
      description: 'Переход к редактору времени...'
    });
  };

  const handleSendTelegram = () => {
    console.log('Send Telegram message');
  };

  const handleCallClient = () => {
    console.log('Call client');
  };

  const handleCopyText = () => {
    console.log('Copy suggestion text');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3">
        <h2 className="gradient-text-elegant">NextVisit Card Demo</h2>
        <p className="text-sm text-muted-foreground">
          Демонстрация карточки предложения следующего визита
        </p>
      </div>

      {/* Settings */}
      <Card className="clean-card">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium">Настройки демо</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">План подписки</label>
              <Select value={currentPlan} onValueChange={(value: any) => setCurrentPlan(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Язык</label>
              <Select value={currentLocale} onValueChange={(value: any) => setCurrentLocale(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant={currentPlan === 'free' ? 'default' : 'secondary'}>
              План: {currentPlan}
            </Badge>
            <Badge variant={currentPlan !== 'pro' && currentPlan !== 'premium' ? 'destructive' : 'secondary'}>
              {currentPlan !== 'pro' && currentPlan !== 'premium' ? 'Заблокировано' : 'Доступно'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Demo Cards */}
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Admin карточка (для карточки клиента)</h4>
          <NextVisitAdminCard
            locale={currentLocale}
            plan={currentPlan}
            suggestedDate="Завтра"
            suggestedTime="14:00"
            service={{
              id: '1',
              name: 'Стрижка',
              duration: 60,
              price: 2500,
              smartPrice: 2200
            }}
            resources={[
              { id: '1', name: 'Анна Иванова', type: 'master' },
              { id: '2', name: 'Кабинет 3', type: 'room' }
            ]}
            onBookOneClick={handleBookOneClick}
            onSuggestToClient={handleSuggestToClient}
            onEdit={handleEditSuggestion}
          />
        </div>

        <div>
          <h4 className="font-medium mb-3">Базовая карточка (для клиентов)</h4>
          <NextVisitCard
            locale={currentLocale}
            plan={currentPlan}
            suggestedDate="завтра"
            suggestedTime="14:00"
            resources={[
              { id: '1', name: 'Анна Иванова', type: 'master' },
              { id: '2', name: 'Кабинет 3', type: 'room' }
            ]}
            onBookOneClick={handleBookOneClick}
            onChooseTime={handleChooseTime}
          />
        </div>

        <div>
          <h4 className="font-medium mb-3">С одним ресурсом</h4>
          <NextVisitCard
            locale={currentLocale}
            plan={currentPlan}
            suggestedDate="через неделю"
            suggestedTime="16:30"
            resources={[
              { id: '1', name: 'Мария Петрова', type: 'master' }
            ]}
            onBookOneClick={handleBookOneClick}
            onChooseTime={handleChooseTime}
          />
        </div>

        <div>
          <h4 className="font-medium mb-3">Со многими ресурсами</h4>
          <NextVisitCard
            locale={currentLocale}
            plan={currentPlan}
            suggestedDate="понедельник"
            suggestedTime="10:00"
            resources={[
              { id: '1', name: 'Елена Смирнова', type: 'master' },
              { id: '2', name: 'Зал йоги', type: 'room' },
              { id: '3', name: 'Коврик для йоги', type: 'equipment' }
            ]}
            onBookOneClick={handleBookOneClick}
            onChooseTime={handleChooseTime}
          />
        </div>

        <div>
          <h4 className="font-medium mb-3">Без предложенного времени</h4>
          <NextVisitCard
            locale={currentLocale}
            plan={currentPlan}
            resources={[
              { id: '1', name: 'Ваш мастер', type: 'master' }
            ]}
            onBookOneClick={handleBookOneClick}
            onChooseTime={handleChooseTime}
          />
        </div>
      </div>

      {/* Usage Examples */}
      <Card className="clean-card">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium">Примеры использования</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Экран успеха бронирования:</strong> показывается сразу после успешной записи</p>
            <p>• <strong>История визитов:</strong> в диалоге с подробностями клиента</p>
            <p>• <strong>Блокировка Pro:</strong> для планов Free карточка заблокирована</p>
            <p>• <strong>Интеракции:</strong> "Записать в 1 тап" → переход к Confirm, "Выбрать другое время" → календарь</p>
          </div>
        </CardContent>
      </Card>

      {/* Suggest Contact Sheet */}
      <SuggestContactSheet
        isOpen={isSuggestContactOpen}
        onClose={() => setIsSuggestContactOpen(false)}
        locale={currentLocale}
        clientName="Анна"
        service={{
          name: 'Стрижка',
          date: 'завтра',
          time: '14:00',
          duration: 60,
          price: 2200,
          resources: ['Анна Иванова']
        }}
        onSendTelegram={handleSendTelegram}
        onCall={handleCallClient}
        onCopyText={handleCopyText}
      />
    </div>
  );
}