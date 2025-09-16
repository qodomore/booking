import React, { useState } from 'react';
import { Clock, Search, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { StickyProgressBar } from './ui/sticky-progress-bar';
import { useResources, Service } from '../contexts/ResourceContext';

interface ServiceSelectionScreenProps {
  onServiceSelect: (service: Service) => void;
  onBack?: () => void;
}

export function ServiceSelectionScreen({ onServiceSelect, onBack }: ServiceSelectionScreenProps) {
  const { services } = useResources();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Фильтруем активные услуги
  const activeServices = services.filter(service => service.isActive);
  
  // Фильтруем по поисковому запросу
  const filteredServices = activeServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Группируем услуги по категориям
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const steps = [
    { id: 1, label: 'Выбор услуги', completed: false },
    { id: 2, label: 'Выбор времени', completed: false },
    { id: 3, label: 'Подтверждение', completed: false }
  ];

  const handleServiceClick = (service: Service) => {
    setSelectedServiceId(service.id);
  };

  const handleContinue = () => {
    const selectedService = activeServices.find(s => s.id === selectedServiceId);
    if (selectedService && !isTransitioning) {
      setIsTransitioning(true);
      console.log('Selected service:', selectedService.name);
      
      // Добавляем небольшую задержку для визуального эффекта
      setTimeout(() => {
        onServiceSelect(selectedService);
      }, 200);
    }
  };

  const getDurationText = (duration: number): string => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) {
        return `${hours} ч`;
      }
      return `${hours} ч ${minutes} мин`;
    }
    return `${duration} мин`;
  };

  const renderServiceCard = (service: Service) => {
    const isSelected = selectedServiceId === service.id;
    
    return (
      <Card 
        key={service.id}
        className={`clean-card cursor-pointer transition-all duration-200 hover:scale-102 ${
          isSelected ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:border-primary/30'
        }`}
        onClick={() => handleServiceClick(service)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isSelected ? 'text-primary' : ''}`}>
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
            </div>
            
            {isSelected && (
              <div className="ml-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {getDurationText(service.duration)}
                </span>
              </div>
              
              {service.duration <= 60 && (
                <Badge variant="secondary" className="text-xs elegant-tag gap-1">
                  <Zap className="h-3 w-3" />
                  Быстро
                </Badge>
              )}
            </div>
            
            <div className="text-right">
              <span className="font-semibold text-lg">
                ₽{service.price.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="font-semibold text-2xl">Выберите услугу</h1>
        <p className="text-sm text-muted-foreground">
          Выберите услугу из доступного списка
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === 1;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {step.id}
                </div>
                <span className={`
                  text-sm font-medium transition-colors
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                `}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="w-16 h-0.5 mx-4 mt-[-24px] bg-muted" />
              )}
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск услуг..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services by Category */}
      {Object.keys(servicesByCategory).length === 0 ? (
        <Card className="clean-card">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Услуги не найдены</h3>
            <p className="text-sm text-muted-foreground">
              Попробуйте изменить поисковый запрос
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{category}</h2>
                <Badge variant="outline" className="text-xs">
                  {categoryServices.length} {categoryServices.length === 1 ? 'услуга' : 'услуг'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {categoryServices.map(renderServiceCard)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Progress Bar */}
      <StickyProgressBar
        currentStep={1}
        steps={steps}
        ctaText={isTransitioning ? 'Переходим...' : selectedServiceId ? 'Продолжить' : 'Выберите услугу'}
        onCtaClick={handleContinue}
        ctaDisabled={!selectedServiceId || isTransitioning}
      />
    </div>
  );
}