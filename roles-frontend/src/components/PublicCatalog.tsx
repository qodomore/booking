import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Globe, 
  Eye, 
  Share2, 
  Copy, 
  Settings,
  Palette,
  Image,
  Star,
  Clock,
  DollarSign,
  BarChart3,
  Toggle,
  Smartphone,
  Monitor,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { useTelegram } from '../hooks/useTelegram';

interface PublicCatalogProps {
  onBack: () => void;
}

const mockServices = [
  {
    id: 1,
    name: 'Классический маникюр',
    price: 2500,
    duration: 60,
    rating: 4.9,
    reviews: 124,
    published: true
  },
  {
    id: 2,
    name: 'Гель-лак покрытие',
    price: 1800,
    duration: 45,
    rating: 4.8,
    reviews: 89,
    published: true
  },
  {
    id: 3,
    name: 'Педикюр классический',
    price: 3200,
    duration: 90,
    rating: 4.9,
    reviews: 156,
    published: false
  }
];

const catalogStats = [
  { label: 'Просмотров за месяц', value: '2,847', change: '+23%', icon: Eye },
  { label: 'Онлайн-записей', value: '156', change: '+31%', icon: BarChart3 },
  { label: 'Конверсия', value: '5.5%', change: '+12%', icon: Star },
  { label: 'Средний чек', value: '2,890₽', change: '+8%', icon: DollarSign }
];

export function PublicCatalog({ onBack }: PublicCatalogProps) {
  const [catalogEnabled, setCatalogEnabled] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState(true);
  const telegram = useTelegram();

  const catalogUrl = 'rms-catalog.ru/salon-beauty-123';

  const handleCopyLink = () => {
    if (telegram?.hapticFeedback) {
      telegram.hapticFeedback.impactOccurred('light');
    }
    navigator.clipboard.writeText(`https://${catalogUrl}`);
    telegram?.showAlert?.('Ссылка скопирована в буфер обмена');
  };

  const handleShare = () => {
    if (telegram?.hapticFeedback) {
      telegram.hapticFeedback.impactOccurred('light');
    }
    if (navigator.share) {
      navigator.share({
        title: 'Мой каталог услуг',
        url: `https://${catalogUrl}`
      });
    } else {
      telegram?.showAlert?.('Поделиться каталогом:\n\n📱 WhatsApp\n📧 Email\n💬 Telegram\n📋 Скопировать ссылку');
    }
  };

  const toggleServicePublish = (serviceId: number) => {
    if (telegram?.hapticFeedback) {
      telegram.hapticFeedback.impactOccurred('light');
    }
    telegram?.showAlert?.('Статус публикации услуги изменен');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Публичный каталог</h2>
            <p className="text-sm text-muted-foreground">Витрина ваших услуг</p>
          </div>
        </div>
      </div>

      {/* Catalog Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">Статус каталога</h3>
            <p className="text-sm text-muted-foreground">
              {catalogEnabled ? 'Каталог активен и доступен клиентам' : 'Каталог отключен'}
            </p>
          </div>
          <Switch 
            checked={catalogEnabled} 
            onCheckedChange={(checked) => {
              setCatalogEnabled(checked);
              if (telegram?.hapticFeedback) {
                telegram.hapticFeedback.impactOccurred('medium');
              }
            }}
          />
        </div>

        {catalogEnabled && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Globe className="w-4 h-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-muted-foreground truncate">
                  https://{catalogUrl}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Smartphone className="w-4 h-4 mr-2" />
                Мобильная версия
              </Button>
              <Button variant="outline" className="flex-1">
                <Monitor className="w-4 h-4 mr-2" />
                Десктоп версия
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Statistics */}
      {catalogEnabled && (
        <div className="grid grid-cols-2 gap-3">
          {catalogStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stat.value}</span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Online Booking Settings */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">Онлайн-запись</h3>
            <p className="text-sm text-muted-foreground">Разрешить клиентам записываться через каталог</p>
          </div>
          <Switch 
            checked={onlineBooking} 
            onCheckedChange={(checked) => {
              setOnlineBooking(checked);
              if (telegram?.hapticFeedback) {
                telegram.hapticFeedback.impactOccurred('medium');
              }
            }}
          />
        </div>
      </Card>

      {/* Services Management */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Управл��ние услугами</h3>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Настроить
          </Button>
        </div>

        <div className="space-y-3">
          {mockServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{service.name}</h4>
                  <Badge variant={service.published ? 'default' : 'secondary'} className="text-xs">
                    {service.published ? 'Опубликована' : 'Черновик'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {service.price}₽
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.duration} мин
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {service.rating} ({service.reviews})
                  </span>
                </div>
              </div>
              <Switch 
                checked={service.published}
                onCheckedChange={() => toggleServicePublish(service.id)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Customization */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Оформление каталога</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-auto p-4"
            onClick={() => {
              if (telegram?.hapticFeedback) {
                telegram.hapticFeedback.impactOccurred('light');
              }
              telegram?.showAlert?.('Настройки дизайна:\n\n🎨 Выбор цветовой схемы\n📝 Настройка логотипа\n🖼️ Загрузка фоновых изображений\n✨ Стили кнопок и форм');
            }}
          >
            <div className="text-center">
              <Palette className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Дизайн</div>
              <div className="text-xs text-muted-foreground">Цвета и стили</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4"
            onClick={() => {
              if (telegram?.hapticFeedback) {
                telegram.hapticFeedback.impactOccurred('light');
              }
              telegram?.showAlert?.('Управление контентом:\n\n📸 Галерея работ\n📄 Описания услуг\n🏷️ SEO настройки\n📞 Контактная информация');
            }}
          >
            <div className="text-center">
              <Image className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Контент</div>
              <div className="text-xs text-muted-foreground">Тексты и фото</div>
            </div>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}