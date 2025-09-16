import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, Calculator, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { useResources, Bundle, Service } from '../contexts/ResourceContext';

interface BundleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  bundle?: Bundle | null;
  currentServiceId?: string;
  userRole: 'admin' | 'client';
  plan: 'free' | 'pro';
  locale: 'ru' | 'en';
}

interface BundleFormData {
  name: string;
  serviceIds: string[];
  priceMode: 'sum' | 'discount' | 'fixed';
  priceDiscountPct: number;
  priceFixed: number;
  durationMode: 'sum' | 'custom';
  durationCustomMin: number;
  resourceRules: {
    sameHuman: boolean;
    roomTypeId: string;
    equipmentIds: string[];
    concurrency: 'serial' | 'parallel';
  };
}

const texts = {
  ru: {
    title: 'Создать комплект',
    editTitle: 'Редактировать комплект',
    bundleName: 'Название комплекса',
    bundleNamePlaceholder: 'Например, "Полный уход"',
    selectServices: 'Выбрать услуги',
    selectServicesDesc: 'От 2 до 5 услуг',
    pricing: 'Расчёт цены',
    pricingSum: 'Сумма цен',
    pricingDiscount: 'Сумма − скидка %',
    pricingFixed: 'Фикс-цена',
    duration: 'Длительность',
    durationSum: 'Сумма длительностей',
    durationCustom: 'Своя длительность',
    resourceRules: 'Правила ресурсов',
    sameHuman: 'Один и тот же мастер',
    requiresRoom: 'Требуется зал/комната',
    requiresEquipment: 'Требуется оборудование',
    concurrency: 'Совместимость',
    serial: 'По очереди',
    parallel: 'Параллельно',
    preview: 'Предварительный просмотр',
    totalPrice: 'Итог',
    totalDuration: 'Длительность',
    save: 'Сохранить',
    cancel: 'Отмена',
    conflicts: 'Конфликты ресурсов',
    maxServices: 'Максимум 5 услуг',
    minServices: 'Минимум 2 услуги',
    minutes: 'мин',
    proFeature: 'Функция Pro'
  },
  en: {
    title: 'Create Bundle',
    editTitle: 'Edit Bundle',
    bundleName: 'Bundle Name',
    bundleNamePlaceholder: 'e.g., "Complete Care"',
    selectServices: 'Select Services',
    selectServicesDesc: '2 to 5 services',
    pricing: 'Price Calculation',
    pricingSum: 'Sum of prices',
    pricingDiscount: 'Sum − discount %',
    pricingFixed: 'Fixed price',
    duration: 'Duration',
    durationSum: 'Sum of durations',
    durationCustom: 'Custom duration',
    resourceRules: 'Resource Rules',
    sameHuman: 'Same staff member',
    requiresRoom: 'Requires room',
    requiresEquipment: 'Requires equipment',
    concurrency: 'Concurrency',
    serial: 'Sequential',
    parallel: 'Parallel',
    preview: 'Preview',
    totalPrice: 'Total',
    totalDuration: 'Duration',
    save: 'Save',
    cancel: 'Cancel',
    conflicts: 'Resource conflicts',
    maxServices: 'Maximum 5 services',
    minServices: 'Minimum 2 services',
    minutes: 'min',
    proFeature: 'Pro Feature'
  }
};

export function BundleEditor({
  isOpen,
  onClose,
  bundle,
  currentServiceId,
  userRole = 'admin',
  plan = 'free',
  locale = 'ru'
}: BundleEditorProps) {
  const { services, addBundle, updateBundle, calculateBundlePrice, calculateBundleDuration } = useResources();
  const t = texts[locale];
  const isLocked = userRole === 'admin' && plan !== 'pro';

  const [formData, setFormData] = useState<BundleFormData>({
    name: '',
    serviceIds: [],
    priceMode: 'sum',
    priceDiscountPct: 10,
    priceFixed: 0,
    durationMode: 'sum',
    durationCustomMin: 60,
    resourceRules: {
      sameHuman: false,
      roomTypeId: '',
      equipmentIds: [],
      concurrency: 'serial'
    }
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (bundle) {
      setFormData({
        name: bundle.name,
        serviceIds: bundle.serviceIds,
        priceMode: bundle.priceMode,
        priceDiscountPct: bundle.priceDiscountPct || 10,
        priceFixed: bundle.priceFixed || 0,
        durationMode: bundle.durationMode,
        durationCustomMin: bundle.durationCustomMin || 60,
        resourceRules: bundle.resourceRules
      });
    } else {
      setFormData({
        name: '',
        serviceIds: currentServiceId ? [currentServiceId] : [],
        priceMode: 'sum',
        priceDiscountPct: 10,
        priceFixed: 0,
        durationMode: 'sum',
        durationCustomMin: 60,
        resourceRules: {
          sameHuman: false,
          roomTypeId: '',
          equipmentIds: [],
          concurrency: 'serial'
        }
      });
    }
  }, [bundle, currentServiceId]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Укажите название комплекса');
    }

    if (formData.serviceIds.length < 2) {
      newErrors.push(t.minServices);
    }

    if (formData.serviceIds.length > 5) {
      newErrors.push(t.maxServices);
    }

    // Проверка циклических ссылок
    if (currentServiceId) {
      const hasCircularReference = formData.serviceIds.some(serviceId => {
        const service = services.find(s => s.id === serviceId);
        // В реальной реализации здесь была бы проверка на циклические ссылки
        return false;
      });
      
      if (hasCircularReference) {
        newErrors.push('Обнаружена циклическая ссылка');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (isLocked) return;

    const bundleData = {
      name: formData.name,
      serviceIds: formData.serviceIds,
      priceMode: formData.priceMode,
      priceDiscountPct: formData.priceMode === 'discount' ? formData.priceDiscountPct : undefined,
      priceFixed: formData.priceMode === 'fixed' ? formData.priceFixed : undefined,
      durationMode: formData.durationMode,
      durationCustomMin: formData.durationMode === 'custom' ? formData.durationCustomMin : undefined,
      resourceRules: formData.resourceRules,
      isActive: true
    };

    if (bundle) {
      updateBundle(bundle.id, bundleData);
    } else {
      addBundle(bundleData);
    }

    onClose();
  };

  const handleServiceToggle = (serviceId: string) => {
    if (isLocked) return;

    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
  };

  const calculatePreview = () => {
    const mockBundle: Bundle = {
      id: 'preview',
      name: formData.name,
      serviceIds: formData.serviceIds,
      priceMode: formData.priceMode,
      priceDiscountPct: formData.priceDiscountPct,
      priceFixed: formData.priceFixed,
      durationMode: formData.durationMode,
      durationCustomMin: formData.durationCustomMin,
      resourceRules: formData.resourceRules,
      isActive: true
    };

    return {
      price: calculateBundlePrice(mockBundle),
      duration: calculateBundleDuration(mockBundle)
    };
  };

  const { price: previewPrice, duration: previewDuration } = calculatePreview();

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins === 0 ? `${hours} ч` : `${hours} ч ${mins} мин`;
    }
    return `${minutes} мин`;
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
              <h3 className="font-semibold text-lg">
                {bundle ? t.editTitle : t.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.selectServicesDesc}
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
            {/* Bundle Name */}
            <div className="space-y-2">
              <Label>{t.bundleName}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t.bundleNamePlaceholder}
                disabled={isLocked}
              />
            </div>

            {/* Service Selection */}
            <div className="space-y-3">
              <Label>{t.selectServices}</Label>
              <div className="grid gap-2 max-h-48 overflow-y-auto">
                {services.filter(service => service.isActive).map(service => (
                  <Card key={service.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(service.duration)}
                          </span>
                          <span className="text-sm font-medium">
                            ₽{service.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Checkbox
                        checked={formData.serviceIds.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        disabled={isLocked}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing Rules */}
            <div className="space-y-3">
              <Label>{t.pricing}</Label>
              <RadioGroup
                value={formData.priceMode}
                onValueChange={(value: 'sum' | 'discount' | 'fixed') => 
                  setFormData(prev => ({ ...prev, priceMode: value }))
                }
                disabled={isLocked}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sum" id="price-sum" />
                  <Label htmlFor="price-sum">{t.pricingSum}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="discount" id="price-discount" />
                  <Label htmlFor="price-discount">{t.pricingDiscount}</Label>
                  {formData.priceMode === 'discount' && (
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.priceDiscountPct}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        priceDiscountPct: parseInt(e.target.value) || 0 
                      }))}
                      className="w-20 ml-2"
                      disabled={isLocked}
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="price-fixed" />
                  <Label htmlFor="price-fixed">{t.pricingFixed}</Label>
                  {formData.priceMode === 'fixed' && (
                    <Input
                      type="number"
                      min="0"
                      value={formData.priceFixed}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        priceFixed: parseInt(e.target.value) || 0 
                      }))}
                      className="w-32 ml-2"
                      disabled={isLocked}
                    />
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* Duration Rules */}
            <div className="space-y-3">
              <Label>{t.duration}</Label>
              <RadioGroup
                value={formData.durationMode}
                onValueChange={(value: 'sum' | 'custom') => 
                  setFormData(prev => ({ ...prev, durationMode: value }))
                }
                disabled={isLocked}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sum" id="duration-sum" />
                  <Label htmlFor="duration-sum">{t.durationSum}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="duration-custom" />
                  <Label htmlFor="duration-custom">{t.durationCustom}</Label>
                  {formData.durationMode === 'custom' && (
                    <div className="flex items-center gap-2 ml-2">
                      <Input
                        type="number"
                        min="15"
                        step="15"
                        value={formData.durationCustomMin}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          durationCustomMin: parseInt(e.target.value) || 0 
                        }))}
                        className="w-20"
                        disabled={isLocked}
                      />
                      <span className="text-sm text-muted-foreground">{t.minutes}</span>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* Resource Rules */}
            <div className="space-y-3">
              <Label>{t.resourceRules}</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="same-human">{t.sameHuman}</Label>
                  <Switch
                    id="same-human"
                    checked={formData.resourceRules.sameHuman}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        resourceRules: { ...prev.resourceRules, sameHuman: checked }
                      }))
                    }
                    disabled={isLocked}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.concurrency}</Label>
                  <RadioGroup
                    value={formData.resourceRules.concurrency}
                    onValueChange={(value: 'serial' | 'parallel') => 
                      setFormData(prev => ({
                        ...prev,
                        resourceRules: { ...prev.resourceRules, concurrency: value }
                      }))
                    }
                    disabled={isLocked}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="serial" id="concurrency-serial" />
                      <Label htmlFor="concurrency-serial">{t.serial}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parallel" id="concurrency-parallel" />
                      <Label htmlFor="concurrency-parallel">{t.parallel}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Preview */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-primary">{t.preview}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.totalPrice}</p>
                    <p className="font-semibold">₽{previewPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.totalDuration}</p>
                    <p className="font-semibold">{formatDuration(previewDuration)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Errors */}
            {errors.length > 0 && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <h4 className="font-medium text-destructive">{t.conflicts}</h4>
                  </div>
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-destructive">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-background">
            {isLocked && (
              <div className="mb-3 p-3 bg-muted rounded-lg flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.proFeature}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                className="flex-1 elegant-button"
                onClick={handleSubmit}
                disabled={errors.length > 0 || isLocked}
              >
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}