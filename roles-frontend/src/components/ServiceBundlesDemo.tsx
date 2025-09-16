import React, { useState } from 'react';
import { ArrowLeft, Package, Scissors } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { ServiceBundles } from './ServiceBundles';
import { useResources } from '../contexts/ResourceContext';

interface ServiceBundlesDemoProps {
  onBack: () => void;
}

export function ServiceBundlesDemo({ onBack }: ServiceBundlesDemoProps) {
  const { services } = useResources();
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(services[0]?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>
        <div>
          <h1 className="font-semibold text-2xl gradient-text-elegant">Комплексы услуг</h1>
          <p className="text-sm text-muted-foreground">
            Демонстрация функциональности связок услуг в форме редактирования
          </p>
        </div>
      </div>

      {/* Service Selection for Demo */}
      <Card className="clean-card">
        <CardHeader>
          <h3 className="font-semibold">Выберите услугу для демо</h3>
          <p className="text-sm text-muted-foreground">
            Секция комплексов будет показана для выбранной услуги
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map(service => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedServiceId === service.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedServiceId(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Scissors className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-primary mb-1">Что тестируем</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Создание и редактирование комплексов услуг</li>
                <li>• Различные режимы ценообразования (сумма, скидка, фикс-цена)</li>
                <li>• Правила ресурсов и совместимости</li>
                <li>• Pro-гейтинг для бесплатного плана</li>
                <li>• Интеграцию с системой апселла</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Bundles Component */}
      {selectedServiceId && (
        <ServiceBundles
          currentServiceId={selectedServiceId}
          userRole="admin"
          plan="free" // Измените на "pro" чтобы протестировать разблокированный режим
          locale="ru"
        />
      )}

      {/* Pro Version Demo */}
      <Card className="clean-card">
        <CardHeader>
          <h3 className="font-semibold">Pro версия</h3>
          <p className="text-sm text-muted-foreground">
            Компонент с разблокированными функциями
          </p>
        </CardHeader>
        <CardContent>
          {selectedServiceId && (
            <ServiceBundles
              currentServiceId={selectedServiceId}
              userRole="admin"
              plan="pro"
              locale="ru"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}