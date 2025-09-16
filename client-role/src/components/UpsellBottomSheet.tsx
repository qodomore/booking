import React, { useState, useEffect } from 'react';
import { X, Clock, Banknote, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';

interface AddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface UpsellBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ru' | 'en';
  originalPrice: number;
  originalEndTime: string;
  discountPct: number;
  nearbySlotExists: boolean;
  addOns: AddOn[];
  onConfirm: (selectedAddOns: string[], add15Min: boolean, newPrice: number, newEndTime: string) => void;
}

export function UpsellBottomSheet({
  isOpen,
  onClose,
  language,
  originalPrice,
  originalEndTime,
  discountPct,
  nearbySlotExists,
  addOns,
  onConfirm
}: UpsellBottomSheetProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [add15Min, setAdd15Min] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slotConflict, setSlotConflict] = useState(false);
  const [alternativeSlots] = useState(['16:30', '17:00', '17:30']);

  const texts = {
    ru: {
      title: 'Улучшить визит',
      description: 'Добавьте услуги или продлите время',
      addOns: 'Дополнительные услуги',
      addOnsSubtext: 'Услуги подберём с учётом времени и мастера',
      add15Min: 'Добавить +15 минут',
      oldPrice: 'Было',
      newTotal: 'Итого',
      until: 'до',
      addToVisit: 'Добавить к визиту',
      keepAsIs: 'Оставить как есть',
      slotTaken: 'Упс, окно заняли. Доступны варианты ниже:',
      rub: '₽'
    },
    en: {
      title: 'Enhance Visit',
      description: 'Add services or extend time',
      addOns: 'Add-on Services',
      addOnsSubtext: "We'll fit add-ons with time and staff",
      add15Min: 'Add +15 min',
      oldPrice: 'Was',
      newTotal: 'Total',
      until: 'until',
      addToVisit: 'Add to visit',
      keepAsIs: 'Keep as is',
      slotTaken: 'Oops, time was taken. Try these:',
      rub: ''
    }
  };

  const t = texts[language];

  const calculateNewPrice = () => {
    let price = originalPrice;
    
    // Add selected add-ons
    selectedAddOns.forEach(addonId => {
      const addon = addOns.find(a => a.id === addonId);
      if (addon) price += addon.price;
    });

    // Apply discount for +15 min
    if (add15Min) {
      price = price * (1 - discountPct / 100);
    }

    return Math.round(price);
  };

  const calculateNewEndTime = () => {
    const [hours, minutes] = originalEndTime.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;
    
    // Add duration from selected add-ons
    selectedAddOns.forEach(addonId => {
      const addon = addOns.find(a => a.id === addonId);
      if (addon) totalMinutes += addon.duration;
    });

    // Add 15 minutes if selected
    if (add15Min) {
      totalMinutes += 15;
    }

    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const handleAddOnToggle = (addonId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleAdd15MinToggle = (checked: boolean) => {
    setAdd15Min(checked);
    // Simulate conflict check
    if (checked && Math.random() > 0.8) {
      setSlotConflict(true);
    } else {
      setSlotConflict(false);
    }
  };

  const handleConfirm = async () => {
    if (slotConflict) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onConfirm(selectedAddOns, add15Min, calculateNewPrice(), calculateNewEndTime());
    setIsProcessing(false);
  };

  const handleAlternativeSlotSelect = (slot: string) => {
    setSlotConflict(false);
    // Here you would update the end time based on the selected alternative
  };

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAddOns([]);
      setAdd15Min(false);
      setSlotConflict(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const newPrice = calculateNewPrice();
  const newEndTime = calculateNewEndTime();
  const hasChanges = selectedAddOns.length > 0 || add15Min;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] bg-background/95 backdrop-blur-sm border-0 rounded-t-xl"
      >
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>{t.title}</SheetTitle>
              <SheetDescription>{t.description}</SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Add-ons Section */}
          {addOns.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">{t.addOns}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.addOnsSubtext}</p>
              
              <div className="space-y-3">
                {addOns.map(addon => (
                  <div key={addon.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={addon.id}
                        checked={selectedAddOns.includes(addon.id)}
                        onCheckedChange={() => handleAddOnToggle(addon.id)}
                      />
                      <div>
                        <label htmlFor={addon.id} className="font-medium cursor-pointer">
                          {addon.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {addon.duration} мин
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {addon.price}{t.rub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* +15 min Section */}
          {nearbySlotExists && (
            <div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Switch
                    id="add15min"
                    checked={add15Min}
                    onCheckedChange={handleAdd15MinToggle}
                  />
                  <div>
                    <label htmlFor="add15min" className="font-medium cursor-pointer">
                      {t.add15Min}
                    </label>
                    <p className="text-sm text-success-500">
                      -{discountPct}% скидка
                    </p>
                  </div>
                </div>
              </div>

              {/* Conflict Alert */}
              {slotConflict && (
                <Card className="p-4 bg-danger-100 border-danger-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-danger-500 mb-3">{t.slotTaken}</p>
                      <div className="flex flex-wrap gap-2">
                        {alternativeSlots.map(slot => (
                          <Button
                            key={slot}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAlternativeSlotSelect(slot)}
                            className="text-xs"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Summary */}
          {hasChanges && (
            <Card className="p-4 bg-surface-subtle/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t.oldPrice}</span>
                  </div>
                  <span className="text-sm text-muted-foreground line-through">
                    {originalPrice}{t.rub}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.newTotal}</span>
                  <span className="text-lg font-medium">
                    {newPrice}{t.rub}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t.until}</span>
                  </div>
                  <span className="font-medium">{newEndTime}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6 border-t border-border/50">
          <Button
            onClick={handleConfirm}
            disabled={!hasChanges || slotConflict || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Обновляем...' : t.addToVisit}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            disabled={isProcessing}
          >
            {t.keepAsIs}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}