import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MapPin, Clock, Percent, Crown, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Checkbox } from './checkbox';
import { Badge } from './badge';

interface TargetingSegment {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  enabled: boolean;
}

interface TargetingBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (selectedSegments: string[]) => void;
  quota: number;
  slotInfo?: {
    time: string;
    duration: number;
    price?: number;
    discount?: number;
  };
}

export function TargetingBottomSheet({
  isOpen,
  onClose,
  onSend,
  quota,
  slotInfo
}: TargetingBottomSheetProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const segments: TargetingSegment[] = [
    {
      id: 'nearby',
      title: 'Рядом по локации',
      description: 'Клиенты в радиусе 2 км',
      icon: <MapPin className="w-4 h-4" />,
      count: 127,
      enabled: true
    },
    {
      id: 'recent',
      title: 'Были в последние 90 дней',
      description: 'Активные клиенты',
      icon: <Clock className="w-4 h-4" />,
      count: 89,
      enabled: true
    },
    {
      id: 'price-sensitive',
      title: 'Цена-чувствительные',
      description: 'Реагируют на скидки',
      icon: <Percent className="w-4 h-4" />,
      count: 156,
      enabled: true
    },
    {
      id: 'vip-off',
      title: 'VIP со скидками',
      description: 'VIP клиенты, покупавшие со скидкой',
      icon: <Crown className="w-4 h-4" />,
      count: 34,
      enabled: true
    }
  ];

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const getTotalRecipients = () => {
    return segments
      .filter(segment => selectedSegments.includes(segment.id))
      .reduce((total, segment) => total + segment.count, 0);
  };

  const handleSend = () => {
    console.log('Sending to segments:', selectedSegments);
    if (selectedSegments.length > 0) {
      onSend(selectedSegments);
      setSelectedSegments([]);
      onClose();
    }
  };

  const canSend = selectedSegments.length > 0 && quota > 0;
  const totalRecipients = getTotalRecipients();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden"
          >
            <Card className="rounded-t-xl rounded-b-none border-t border-x-0 border-b-0 bg-background">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="font-semibold">Разослать предложение</h3>
                  <p className="text-sm text-muted-foreground">
                    Выберите сегменты клиентов
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Slot Info */}
              {slotInfo && (
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{slotInfo.time}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(slotInfo.duration / 60)}ч {slotInfo.duration % 60}м
                        {slotInfo.price && (
                          <>
                            {' • '}
                            {slotInfo.discount ? (
                              <>
                                <span className="line-through">
                                  {slotInfo.price.toLocaleString()}₽
                                </span>
                                {' '}
                                <span className="text-green-600 font-medium">
                                  {(slotInfo.price * (1 - slotInfo.discount / 100)).toLocaleString()}₽
                                </span>
                              </>
                            ) : (
                              `${slotInfo.price.toLocaleString()}₽`
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="max-h-[50vh] overflow-y-auto">
                {/* Segments */}
                <div className="p-4 space-y-3">
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedSegments.includes(segment.id)
                          ? 'bg-primary/5 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSegmentToggle(segment.id)}
                    >
                      <Checkbox
                        checked={selectedSegments.includes(segment.id)}
                        disabled={!segment.enabled}
                        onChange={() => handleSegmentToggle(segment.id)}
                      />
                      
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {segment.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{segment.title}</span>
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {segment.count}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {segment.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Advanced Options */}
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-muted-foreground"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <span>Дополнительные настройки</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </Button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 border-t pt-3"
                      >
                        <div className="text-sm text-muted-foreground">
                          <p>• Сообщения отправляются через Telegram</p>
                          <p>• Клиенты могут отказаться от рассылки</p>
                          <p>• Статистика доставки в разделе "Аналитика"</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quota Warning */}
                {quota === 0 && (
                  <div className="p-4 border-t bg-destructive/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                        <Send className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-destructive">
                          Лимит Telegram исчерпан
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Пополните квоту или обновитесь до Pro
                        </p>
                        <Button size="sm" className="mt-2">
                          Пополнить квоту
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-background">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground">
                    Получателей: <span className="font-medium">{totalRecipients}</span>
                    {quota > 0 && (
                      <>
                        {' • '}
                        Квота: <span className="font-medium">{quota}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Отмена
                  </Button>
                  <Button
                    className="flex-1 elegant-button"
                    disabled={!canSend}
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Отправить
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}