import React, { useContext, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { SlotMini, SlotMiniData } from './SlotMini';
import { ConfirmBottomSheet } from './ConfirmBottomSheet';
import { AppContext } from '../App';
import { toast } from 'sonner@2.0.3';

interface HotSlotsProps {
  slots: SlotMiniData[];
}

export function HotSlots({ slots }: HotSlotsProps) {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { language, setCurrentScreen } = context;
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotMiniData | null>(null);

  const texts = {
    ru: {
      title: 'Горячие слоты',
      showMore: 'Показать ещё',
      successToast: 'Готово! Вы записаны',
    },
    en: {
      title: 'Hot Slots',
      showMore: 'Show More',
      successToast: 'Done! You\'re booked',
    }
  };

  const t = texts[language];

  // Show up to 4 slots
  const displayedSlots = slots.slice(0, 4);

  const handleSlotTap = (slot: SlotMiniData) => {
    setSelectedSlot(slot);
    setShowConfirmSheet(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    
    setShowConfirmSheet(false);
    toast.success(`${t.successToast} ${selectedSlot.date}, ${selectedSlot.time}`);
    
    // Navigate to success screen after short delay
    setTimeout(() => {
      setCurrentScreen('success');
    }, 1000);
  };

  const handleChangeTime = () => {
    setShowConfirmSheet(false);
    setCurrentScreen('time-selection');
  };

  const handleShowMore = () => {
    // Navigate to time selection or dedicated slots view
    setCurrentScreen('time-selection');
  };

  // Convert SlotMiniData to booking format for ConfirmBottomSheet
  const getBookingSlotFromMini = (slot: SlotMiniData) => ({
    date: slot.date,
    time: slot.time,
    service: slot.service,
    resource: slot.resource,
    price: slot.price
  });

  if (displayedSlots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2>{t.title}</h2>
        {slots.length > 4 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShowMore}
            className="text-primary hover:text-primary/80 p-0 h-auto"
          >
            {t.showMore}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayedSlots.map((slot) => (
          <SlotMini
            key={slot.id}
            slot={slot}
            onTap={handleSlotTap}
          />
        ))}
      </div>

      {/* Show More Button (if needed and no header button) */}
      {slots.length > 4 && (
        <div className="sm:hidden">
          <Button 
            variant="outline" 
            className="w-full rounded-card"
            onClick={handleShowMore}
          >
            {t.showMore}
          </Button>
        </div>
      )}

      {/* Confirm Bottom Sheet */}
      {selectedSlot && (
        <ConfirmBottomSheet
          isOpen={showConfirmSheet}
          onClose={() => setShowConfirmSheet(false)}
          bookingSlot={getBookingSlotFromMini(selectedSlot)}
          onConfirm={handleConfirmBooking}
          onChangeTime={handleChangeTime}
        />
      )}
    </div>
  );
}