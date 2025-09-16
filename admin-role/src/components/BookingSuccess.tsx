import React from 'react';
import { SuccessCard, useAddToCalendar, useShareBooking } from './ui/success-card';
import { useTelegram } from '../hooks/useTelegram';

interface BookingSuccessProps {
  booking: {
    id: string;
    serviceName: string;
    masterName: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    address?: string;
    clientName: string;
  };
  onClose: () => void;
  onRepeatBooking?: () => void;
  onBookNextVisit?: () => void;
  onChooseNextTime?: () => void;
  plan?: 'free' | 'pro' | 'premium';
}

export function BookingSuccess({ booking, onClose, onRepeatBooking, onBookNextVisit, onChooseNextTime, plan = 'free' }: BookingSuccessProps) {
  const { hapticFeedback } = useTelegram();
  const addToCalendar = useAddToCalendar();
  const shareBooking = useShareBooking();

  const handleAddToCalendar = (bookingDetails: any) => {
    hapticFeedback.success();
    addToCalendar(bookingDetails);
  };

  const handleShare = (bookingDetails: any) => {
    hapticFeedback.light();
    shareBooking(bookingDetails);
  };

  const handleRepeatBooking = (bookingDetails: any) => {
    hapticFeedback.medium();
    onRepeatBooking?.();
  };

  const handleBookNextVisit = () => {
    hapticFeedback.success();
    onBookNextVisit?.();
  };

  const handleChooseNextTime = () => {
    hapticFeedback.light();
    onChooseNextTime?.();
  };

  return (
    <SuccessCard
      booking={booking}
      onAddToCalendar={handleAddToCalendar}
      onShare={handleShare}
      onRepeatBooking={handleRepeatBooking}
      onBookNextVisit={handleBookNextVisit}
      onChooseNextTime={handleChooseNextTime}
      plan={plan}
      onClose={onClose}
    />
  );
}