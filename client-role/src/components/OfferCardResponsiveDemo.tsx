import React from 'react';
import { Percent, Clock, Star, Sparkles } from 'lucide-react';
import { OfferCard } from './OfferCard';

export function OfferCardResponsiveDemo() {
  const getOfferIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <Percent className="w-5 h-5" />;
      case 'new-client':
        return <Star className="w-5 h-5" />;
      case 'quick-booking':
        return <Clock className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getOfferColor = (type: string) => {
    switch (type) {
      case 'discount':
        return 'bg-blue-500';
      case 'new-client':
        return 'bg-yellow-500';
      case 'quick-booking':
        return 'bg-green-500';
      default:
        return 'bg-purple-500';
    }
  };

  const mockOffers = [
    {
      id: 'demo-1',
      type: 'discount',
      title: '−15% в непиковые часы',
      description: 'Скидка на услуги красоты с 10:00 до 14:00 в будние дни. Акция действует на все виды маникюра и педикюра.',
      discount: '15%',
      validUntil: '31 декабря 2024 года',
      isAI: true,
      isLimited: false
    },
    {
      id: 'demo-2',
      type: 'new-client',
      title: '−20% на первое посещение нового клиента',
      description: 'Специальная скидка для новых клиентов на любую услугу в нашем салоне красоты. Не упустите возможность!',
      discount: '20%',
      validUntil: 'до 15 января 2025 года включительно',
      isAI: false,
      isLimited: true
    },
    {
      id: 'demo-3',
      type: 'quick-booking',
      title: 'Быстрая запись на завтра',
      description: 'Свободные окна на сегодня и завтра в удобное для вас время',
      discount: null,
      validUntil: 'только завтра',
      isAI: false,
      isLimited: true
    }
  ];

  const texts = {
    aiRecommendation: 'Рекомендация ИИ',
    limited: 'Ограниченное предложение',
    aiDescription: 'На основе ваших предпочтений',
    validUntil: 'Действует до',
    use: 'Использовать'
  };

  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Тест карточек офферов - Stacked Layout</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Проверка отображения "Действует до" на разных размерах экрана (360px-414px)
        </p>
        
        <div className="space-y-4">
          {mockOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onUse={() => console.log('Offer used:', offer.id)}
              getOfferIcon={getOfferIcon}
              getOfferColor={getOfferColor}
              texts={texts}
              variant="stacked"
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Тест карточек офферов - Inline Layout</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Проверка отображения на более широких экранах
        </p>
        
        <div className="space-y-4">
          {mockOffers.map((offer) => (
            <OfferCard
              key={`inline-${offer.id}`}
              offer={offer}
              onUse={() => console.log('Offer used:', offer.id)}
              getOfferIcon={getOfferIcon}
              getOfferColor={getOfferColor}
              texts={texts}
              variant="inline"
            />
          ))}
        </div>
      </div>
    </div>
  );
}