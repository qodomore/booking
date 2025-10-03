import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Send, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { SlotMiniCard } from './ui/slot-mini-card';
import { TargetingBottomSheet } from './ui/targeting-bottom-sheet';
import { toast } from 'sonner@2.0.3';

interface FreeSlot {
  id: string;
  time: string;
  duration: number;
  price?: number;
  discount?: number;
  resources: string[];
}

interface GapsTodayProps {
  locale?: 'ru' | 'en';
  sendQuotaLeft?: number;
  plan?: 'free' | 'pro';
  onSlotBook?: (slot: FreeSlot) => void;
}

export function GapsToday({ 
  locale = 'ru', 
  sendQuotaLeft = 50,
  plan = 'free',
  onSlotBook 
}: GapsTodayProps) {
  const [selectedSlot, setSelectedSlot] = useState<FreeSlot | null>(null);
  const [isTargetingOpen, setIsTargetingOpen] = useState(false);
  const [visibleSlots, setVisibleSlots] = useState(6);
  
  // Debug log to check if component is active
  console.log('GapsToday component rendered with:', { locale, sendQuotaLeft, plan });

  // Mock data for free slots
  const freeSlots: FreeSlot[] = [
    {
      id: '1',
      time: '10:00',
      duration: 60,
      price: 3500,
      discount: 15,
      resources: ['Анна К.', 'Кабинет 1']
    },
    {
      id: '2',
      time: '11:30',
      duration: 90,
      price: 4200,
      resources: ['Мария П.', 'Кабинет 2']
    },
    {
      id: '3',
      time: '14:00',
      duration: 45,
      price: 2800,
      discount: 10,
      resources: ['Елена С.']
    },
    {
      id: '4',
      time: '15:15',
      duration: 75,
      price: 3800,
      resources: ['Анна К.', 'Ольга В.']
    },
    {
      id: '5',
      time: '16:45',
      duration: 60,
      price: 3500,
      discount: 20,
      resources: ['Мария П.']
    },
    {
      id: '6',
      time: '18:00',
      duration: 120,
      price: 5500,
      resources: ['VIP кабинет', 'Анна К.']
    },
    {
      id: '7',
      time: '19:30',
      duration: 90,
      price: 4200,
      discount: 15,
      resources: ['Елена С.', 'Кабинет 3']
    },
    {
      id: '8',
      time: '20:45',
      duration: 60,
      price: 3500,
      resources: ['Мария П.']
    }
  ];

  const texts = {
    ru: {
      title: 'Свободные окна сегодня',
      subtitle: 'Заполните пустые слоты специальными предложениями',
      broadcastOffer: 'Разослать предложение',
      showMore: 'Показать ещё',
      noSlots: 'Сегодня нет коротких окон',
      noSlotsDesc: 'Все временные слоты заняты или заблокированы',
      quotaEmpty: 'Лимит Telegram исчерпан',
      quotaEmptyDesc: 'Пополните квоту или обновитесь до Pro',
      upgradeButton: 'Обновить до Pro',
      offerSent: 'Предложение отправлено',
      offerSentDesc: 'клиентам',
      slotBooked: 'Окно забронировано',
      slotBookedDesc: 'Время успешно заблокировано для клиента'
    },
    en: {
      title: "Today's free slots",
      subtitle: 'Fill empty time slots with special offers',
      broadcastOffer: 'Broadcast offer',
      showMore: 'Show more',
      noSlots: 'No short gaps today',
      noSlotsDesc: 'All time slots are booked or blocked',
      quotaEmpty: 'Telegram limit exhausted',
      quotaEmptyDesc: 'Top up quota or upgrade to Pro',
      upgradeButton: 'Upgrade to Pro',
      offerSent: 'Offer sent',
      offerSentDesc: 'clients',
      slotBooked: 'Slot booked',
      slotBookedDesc: 'Time successfully blocked for client'
    }
  };

  const t = texts[locale];

  const handleSlotClick = (slot: FreeSlot) => {
    console.log('Slot clicked:', slot);
    setSelectedSlot(slot);
    if (onSlotBook) {
      onSlotBook(slot);
      toast.success(`${t.slotBooked}`, {
        description: `${slot.time} - ${t.slotBookedDesc}`
      });
    } else {
      // Показываем feedback даже если нет обработчика
      toast.success(`Выбрано время ${slot.time}`, {
        description: 'Окно готово к бронированию'
      });
    }
  };

  const handleBroadcastClick = () => {
    console.log('Broadcast clicked, quota:', sendQuotaLeft);
    if (sendQuotaLeft === 0) {
      toast.error(t.quotaEmpty, {
        description: t.quotaEmptyDesc,
        action: {
          label: t.upgradeButton,
          onClick: () => {
            console.log('Open paywall');
            toast.info('Открывается окно обновления тарифа...');
          }
        }
      });
      return;
    }
    setIsTargetingOpen(true);
  };

  const handleSendOffer = (selectedSegments: string[]) => {
    console.log('Sending offer to segments:', selectedSegments);
    // Calculate total recipients (mock calculation)
    const totalRecipients = Math.floor(Math.random() * 200) + 50;
    
    toast.success(`${t.offerSent} ${totalRecipients} ${t.offerSentDesc}`, {
      description: `Сегменты: ${selectedSegments.length} выбрано`
    });
    
    // Close targeting sheet
    setIsTargetingOpen(false);
  };

  const handleShowMore = () => {
    console.log('Show more clicked, current visible:', visibleSlots);
    const newVisible = Math.min(visibleSlots + 4, freeSlots.length);
    setVisibleSlots(newVisible);
    
    toast.info(`Показано ещё ${newVisible - visibleSlots} слотов`);
  };

  // Empty state
  if (freeSlots.length === 0) {
    console.log('GapsToday: No slots available, showing empty state');
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-muted/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">{t.noSlots}</h3>
          <p className="text-sm text-muted-foreground">{t.noSlotsDesc}</p>
        </div>
      </Card>
    );
  }
  
  console.log('GapsToday: Rendering with', freeSlots.length, 'slots, visible:', visibleSlots);

  return (
    <>
      <Card className="p-4 bg-gradient-to-r from-background to-accent/5 border border-border/50 overflow-visible">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBroadcastClick();
            }}
            disabled={sendQuotaLeft === 0}
            className="elegant-button flex-shrink-0 text-white"
            size="sm"
          >
            <Send className="w-4 h-4 mr-2" />
            {t.broadcastOffer}
          </Button>
        </div>

        {/* Quota Warning */}
        {sendQuotaLeft === 0 && (
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-destructive">{t.quotaEmpty}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.quotaEmptyDesc}
                </p>
                <Button size="sm" className="mt-3">
                  {t.upgradeButton}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Slots Rail */}
        <div className="relative py-2">
          <div className="flex gap-3 overflow-x-auto overflow-y-visible pb-4 pt-2 -mx-1 px-1 scrollbar-hide">
            {freeSlots.slice(0, visibleSlots).map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative z-0 hover:z-20"
              >
                <SlotMiniCard
                  time={slot.time}
                  duration={slot.duration}
                  price={slot.price}
                  discount={slot.discount}
                  resources={slot.resources}
                  onClick={() => {
                    console.log('SlotMiniCard onClick triggered for slot:', slot.id);
                    handleSlotClick(slot);
                  }}
                  isSelected={selectedSlot?.id === slot.id}
                />
              </motion.div>
            ))}
          </div>

          {/* Show More Button */}
          {visibleSlots < freeSlots.length && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShowMore();
                }}
                className="text-sm hover:bg-primary hover:text-white transition-colors border-2"
                size="sm"
              >
                {t.showMore}
                <ChevronRight className="w-4 h-4 ml-1" />
                <span className="ml-1 text-xs opacity-70">
                  ({freeSlots.length - visibleSlots})
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/30">
          <span>Свободных окон: <strong className="text-foreground">{freeSlots.length}</strong></span>
          {sendQuotaLeft > 0 && (
            <span>Квота отправки: <strong className="text-foreground">{sendQuotaLeft}</strong></span>
          )}
          <span>План: <strong className="text-foreground">{plan === 'pro' ? 'Pro' : 'Free'}</strong></span>
        </div>
      </Card>

      {/* Targeting Bottom Sheet */}
      <TargetingBottomSheet
        isOpen={isTargetingOpen}
        onClose={() => setIsTargetingOpen(false)}
        onSend={handleSendOffer}
        quota={sendQuotaLeft}
        slotInfo={selectedSlot ? {
          time: selectedSlot.time,
          duration: selectedSlot.duration,
          price: selectedSlot.price,
          discount: selectedSlot.discount
        } : undefined}
      />
    </>
  );
}