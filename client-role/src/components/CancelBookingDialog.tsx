import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, comment?: string) => void;
  language: 'ru' | 'en';
  bookingName?: string;
}

export function CancelBookingDialog({
  open,
  onOpenChange,
  onConfirm,
  language,
  bookingName,
}: CancelBookingDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [comment, setComment] = useState('');

  const texts = {
    ru: {
      title: 'Отмена записи',
      description: bookingName
        ? `Вы уверены, что хотите отменить запись на "${bookingName}"?`
        : 'Вы уверены, что хотите отменить эту запись?',
      selectReason: 'Выберите причину отмены:',
      reasons: {
        schedule: 'Изменились планы',
        found_better: 'Нашёл другой вариант',
        price: 'Не устраивает цена',
        location: 'Неудобное расположение',
        other: 'Другая причина',
      },
      additionalComment: 'Дополнительный комментарий (необязательно)',
      cancel: 'Отменить',
      confirmCancel: 'Подтвердить отмену',
    },
    en: {
      title: 'Cancel Booking',
      description: bookingName
        ? `Are you sure you want to cancel the booking for "${bookingName}"?`
        : 'Are you sure you want to cancel this booking?',
      selectReason: 'Select cancellation reason:',
      reasons: {
        schedule: 'Plans changed',
        found_better: 'Found another option',
        price: 'Price not suitable',
        location: 'Inconvenient location',
        other: 'Other reason',
      },
      additionalComment: 'Additional comment (optional)',
      cancel: 'Cancel',
      confirmCancel: 'Confirm Cancellation',
    },
  };

  const t = texts[language];

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason, comment);
      // Reset form
      setSelectedReason('');
      setComment('');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setSelectedReason('');
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle>{t.title}</DialogTitle>
          </div>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">{t.selectReason}</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              <div className="space-y-3">
                {Object.entries(t.reasons).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label
                      htmlFor={key}
                      className="font-normal cursor-pointer flex-1"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
              {t.additionalComment}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'ru'
                  ? 'Расскажите подробнее...'
                  : 'Tell us more...'
              }
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {t.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!selectedReason}
          >
            {t.confirmCancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
