import React, { useContext, useState } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { ReminderCard } from './ReminderCard';
import { ConfirmBottomSheet } from './ConfirmBottomSheet';
import { AppContext } from '../App';
import { toast } from 'sonner@2.0.3';

export function Inbox() {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { language, setCurrentScreen, setHasUnreadMessages } = context;
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);

  // Mark messages as read when component mounts
  React.useEffect(() => {
    setHasUnreadMessages(false);
  }, [setHasUnreadMessages]);
  const [selectedSlot, setSelectedSlot] = useState({
    date: '15 сентября',
    time: '14:30',
    service: {
      name: 'Маникюр классический',
      duration: 90
    },
    resource: 'Анна Петрова',
    price: 1500
  });

  const texts = {
    ru: {
      title: 'Сообщения',
      empty: 'Нет новых сообщений',
      emptyDescription: 'Здесь будут появляться уведомления о записях и предложения',
      successToast: `Готово! Вы записаны ${selectedSlot.date}, ${selectedSlot.time}`,
      optOutToast: 'Предложения отключены на 30 дней'
    },
    en: {
      title: 'Messages',
      empty: 'No new messages',
      emptyDescription: 'Booking notifications and suggestions will appear here',
      successToast: `Done! You're booked for ${selectedSlot.date}, ${selectedSlot.time}`,
      optOutToast: 'Suggestions disabled for 30 days'
    }
  };

  const t = texts[language];

  const handleAgree = () => {
    setShowConfirmSheet(true);
  };

  const handlePickAnother = () => {
    // Navigate to time selection with pre-filled filters
    setCurrentScreen('time-selection');
  };



  const handleConfirmBooking = () => {
    setShowConfirmSheet(false);
    toast.success(t.successToast);
    
    // Navigate to success screen after short delay
    setTimeout(() => {
      setCurrentScreen('success');
    }, 1000);
  };

  // Simulate new message arriving after some interaction (for demo purposes)
  const handleOptOut = () => {
    toast.success(t.optOutToast);
    // Simulate a new message arriving later
    setTimeout(() => {
      setHasUnreadMessages(true);
    }, 5000);
  };

  const handleChangeTime = () => {
    setShowConfirmSheet(false);
    setCurrentScreen('time-selection');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border-hairline pt-safe">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('home')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>{t.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-6">
        {/* Reminder Card */}
        <ReminderCard
          suggestedDate={selectedSlot.date}
          suggestedTime={selectedSlot.time}
          service={selectedSlot.service}
          resource={selectedSlot.resource}
          onAgree={handleAgree}
          onPickAnother={handlePickAnother}
          onOptOut={handleOptOut}
        />

        {/* Empty State (for when no reminders) */}
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="mb-2">{t.empty}</h3>
          <p className="text-text-secondary max-w-sm mx-auto">
            {t.emptyDescription}
          </p>
        </div>
      </div>

      {/* Confirm Bottom Sheet */}
      <ConfirmBottomSheet
        isOpen={showConfirmSheet}
        onClose={() => setShowConfirmSheet(false)}
        bookingSlot={selectedSlot}
        onConfirm={handleConfirmBooking}
        onChangeTime={handleChangeTime}
      />
    </div>
  );
}