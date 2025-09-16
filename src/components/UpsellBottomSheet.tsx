import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Minus, RussianRuble, Zap, Lock, Package, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useResources, Bundle } from '../contexts/ResourceContext';

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

interface UpsellData {
  timeExtension: boolean;
  additionalServices: string[];
  selectedBundleId?: string;
  totalPrice: number;
  totalDuration: number;
  discount: number;
}

interface UpsellBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (upsellData: UpsellData) => void;
  basePrice: number;
  baseDuration: number;
  baseServiceId?: string;
  nearbySlotExists: boolean;
  additionalServices: AdditionalService[];
  userPlan: 'free' | 'pro' | 'premium';
  isAdmin: boolean;
}

export function UpsellBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  basePrice,
  baseDuration,
  baseServiceId,
  nearbySlotExists,
  additionalServices,
  userPlan,
  isAdmin
}: UpsellBottomSheetProps) {
  const { bundles, calculateBundlePrice, calculateBundleDuration, getServicesByIds } = useResources();
  const [timeExtension, setTimeExtension] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Проверяем доступность функции (гейтинг)
  const isFeatureLocked = isAdmin && userPlan !== 'pro' && userPlan !== 'premium';

  const timeExtensionMinutes = 15;
  const timeExtensionDiscount = 0.1; // 10% скидка

  // Получаем рекомендованные комплексы
  const getRecommendedBundles = (): Bundle[] => {
    if (!baseServiceId) return [];

    return bundles
      .filter(bundle => {
        // Комплекс должен включать базовую услугу
        if (!bundle.serviceIds.includes(baseServiceId)) return false;

        // Комплекс должен быть активным
        if (!bundle.isActive) return false;

        // Простая проверка совместимости по ресурсам
        // В реальной реализации здесь была бы более сложная логика
        return true;
      })
      .sort((a, b) => {
        // Сортируем по выгоде (скидке и цене)
        const aSavings = calculateBundlePrice(a) / a.serviceIds.length;
        const bSavings = calculateBundlePrice(b) / b.serviceIds.length;
        return bSavings - aSavings;
      })
      .slice(0, 2); // Берем максимум 2 лучших
  };

  const recommendedBundles = getRecommendedBundles();

  useEffect(() => {
    if (!isOpen) {
      setTimeExtension(false);
      setSelectedServices([]);
      setSelectedBundleId(null);
      setShowPaywall(false);
    }
  }, [isOpen]);

  // Рассчитываем итоговую стоимость и время
  const calculateTotals = () => {
    let totalPrice = basePrice;
    let totalDuration = baseDuration;
    let discount = 0;

    // Если выбран комплекс, используем его вместо базовой услуги
    if (selectedBundleId) {
      const selectedBundle = bundles.find(b => b.id === selectedBundleId);
      if (selectedBundle) {
        totalPrice = calculateBundlePrice(selectedBundle);
        totalDuration = calculateBundleDuration(selectedBundle);

        // Рассчитываем экономию по сравнению с покупкой услуг по отдельности
        const individualTotal = selectedBundle.serviceIds.reduce((sum, serviceId) => {
          const service = getServicesByIds([serviceId])[0];
          return sum + (service?.price || 0);
        }, 0);

        if (individualTotal > totalPrice) {
          discount = individualTotal - totalPrice;
        }
      }
    } else {
      // Добавляем дополнительные услуги
      selectedServices.forEach(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        if (service) {
          totalPrice += service.price;
          totalDuration += service.duration;
        }
      });

      // Применяем скидку за продление времени
      if (timeExtension && nearbySlotExists) {
        totalDuration += timeExtensionMinutes;
        const timeDiscount = totalPrice * timeExtensionDiscount;
        discount += timeDiscount;
        totalPrice = totalPrice - timeDiscount;
      }
    }

    return {
      totalPrice: Math.round(totalPrice),
      totalDuration,
      discount: Math.round(discount)
    };
  };

  const { totalPrice, totalDuration, discount } = calculateTotals();

  const handleServiceToggle = (serviceId: string) => {
    if (isFeatureLocked) {
      setShowPaywall(true);
      return;
    }

    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleTimeExtensionToggle = () => {
    if (isFeatureLocked) {
      setShowPaywall(true);
      return;
    }

    if (!nearbySlotExists) return;
    setTimeExtension(!timeExtension);
  };

  const handleConfirm = () => {
    const upsellData: UpsellData = {
      timeExtension,
      additionalServices: selectedServices,
      selectedBundleId,
      totalPrice,
      totalDuration,
      discount
    };
    onConfirm(upsellData);
  };

  const handleBundleSelect = (bundleId: string) => {
    if (isFeatureLocked) {
      setShowPaywall(true);
      return;
    }
    
    const newBundleId = selectedBundleId === bundleId ? null : bundleId;
    setSelectedBundleId(newBundleId);
    
    // Если выбран комплекс, автоматически отключаем отдельные услуги и продление времени
    if (newBundleId) {
      setSelectedServices([]);
      setTimeExtension(false);
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-lg">Дополнительные опции</h3>
              <p className="text-sm text-muted-foreground">
                Добавьте услуги или увеличьте время
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Recommended Bundles */}
            {recommendedBundles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Рекомендованные комплексы</h4>
                {recommendedBundles.map(bundle => {
                  const bundlePrice = calculateBundlePrice(bundle);
                  const bundleDuration = calculateBundleDuration(bundle);
                  const bundleServices = getServicesByIds(bundle.serviceIds);
                  const isSelected = selectedBundleId === bundle.id;
                  
                  // Рассчитываем экономию
                  const individualTotal = bundle.serviceIds.reduce((sum, serviceId) => {
                    const service = getServicesByIds([serviceId])[0];
                    return sum + (service?.price || 0);
                  }, 0);
                  const savings = individualTotal - bundlePrice;
                  const savingsPercent = individualTotal > 0 ? Math.round((savings / individualTotal) * 100) : 0;

                  return (
                    <Card key={bundle.id} className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`} onClick={() => handleBundleSelect(bundle.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="h-4 w-4 text-primary" />
                              <p className="font-medium">{bundle.name}</p>
                              {savings > 0 && (
                                <Badge variant="secondary" className="text-xs text-green-700 bg-green-100">
                                  −{savingsPercent}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {bundleServices.map(s => s.name).join(' + ')}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {getDurationText(bundleDuration)}
                              </span>
                              <span className="text-sm font-medium flex items-center gap-1">
                                <RussianRuble className="h-3 w-3" />
                                {bundlePrice.toLocaleString()}
                              </span>
                              {savings > 0 && (
                                <span className="text-xs text-green-600">
                                  экономия ₽{savings.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isFeatureLocked && (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                              {isSelected && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Time Extension */}
            {nearbySlotExists && !selectedBundleId && (
              <Card className="clean-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">+15 мин времени</p>
                          <Badge variant="secondary" className="text-xs">
                            −10%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Соседний слот свободен
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isFeatureLocked && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={timeExtension}
                        onCheckedChange={handleTimeExtensionToggle}
                        disabled={isFeatureLocked || !!selectedBundleId}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Services */}
            {additionalServices.length > 0 && !selectedBundleId && (
              <div className="space-y-3">
                <h4 className="font-medium">Дополнительные услуги</h4>
                {additionalServices.map(service => (
                  <Card key={service.id} className="clean-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Plus className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{service.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-muted-foreground">
                                {getDurationText(service.duration)}
                              </span>
                              <span className="text-sm font-medium flex items-center gap-1">
                                <RussianRuble className="h-3 w-3" />
                                {service.price.toLocaleString()}
                              </span>
                            </div>
                            {service.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {service.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isFeatureLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Checkbox
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                            disabled={isFeatureLocked || !!selectedBundleId}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Summary */}
            <Card className="clean-card border-primary/20 bg-primary/5">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-medium">Итого</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Базовая услуга</span>
                    <div className="flex items-center gap-1">
                      <RussianRuble className="h-3 w-3" />
                      <span>{basePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedServices.map(serviceId => {
                    const service = additionalServices.find(s => s.id === serviceId);
                    if (!service) return null;
                    return (
                      <div key={serviceId} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{service.name}</span>
                        <div className="flex items-center gap-1">
                          <RussianRuble className="h-3 w-3" />
                          <span>{service.price.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Скидка за продление</span>
                      <div className="flex items-center gap-1">
                        <Minus className="h-3 w-3" />
                        <RussianRuble className="h-3 w-3" />
                        <span>{discount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between font-medium">
                    <div className="flex items-center gap-2">
                      <span>Итого</span>
                      <span className="text-sm text-muted-foreground">
                        ({getDurationText(totalDuration)})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RussianRuble className="h-4 w-4" />
                      <span className="text-lg">{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                className="flex-1 elegant-button"
                onClick={handleConfirm}
                disabled={!timeExtension && selectedServices.length === 0 && !selectedBundleId}
              >
                Добавить
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Функция Pro</h3>
                <p className="text-sm text-muted-foreground">
                  Дополнительные услуги и продление времени доступны в тарифе Pro
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaywall(false)}
                  className="flex-1"
                >
                  Понятно
                </Button>
                <Button
                  className="flex-1 elegant-button"
                  onClick={() => {
                    setShowPaywall(false);
                    // Здесь можно добавить навигацию к подписке
                  }}
                >
                  Обновить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}