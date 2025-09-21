import { useState } from 'react';
import { 
  Calendar, 
  X, 
  MessageSquare, 
  MapPin, 
  Clock, 
  ArrowLeft,
  AlertTriangle,
  Check,
  Phone
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

interface ManagementStepProps {
  locale?: 'RU' | 'EN';
}

type ActionState = 'idle' | 'loading' | 'success' | 'error';

const translations = {
  RU: {
    title: 'Управление записью',
    subtitle: 'Вы можете изменить или отменить запись, а также связаться с мастером',
    currentBooking: 'Текущая запись',
    actions: 'Действия',
    reschedule: 'Перенести',
    cancel: 'Отменить',
    chatWithMaster: 'Написать мастеру',
    showRoute: 'Показать маршрут',
    backToServices: 'Вернуться к услугам',
    cancellationPolicy: 'Политика отмены',
    policyText: 'Отмена за 24+ часов — бесплатно. Отмена менее чем за 24 часа — удержание 50% стоимости.',
    helpText: 'Вы всегда можете вернуться к этой записи из диалога с ботом',
    
    // Cancel dialog
    cancelDialogTitle: 'Отмена записи',
    cancelDialogDescription: 'Вы уверены, что хотите отменить запись?',
    cancelReason: 'Причина отмены (опционально)',
    cancelReasonPlaceholder: 'Укажите причину отмены...',
    confirmCancel: 'Подтвердить отмену',
    keepBooking: 'Оставить запись',
    
    // Reschedule dialog
    rescheduleDialogTitle: 'Перенос записи',
    rescheduleDialogDescription: 'Выберите новую дату и время',
    selectNewTime: 'Выберите новое время',
    confirmReschedule: 'Подтвердить перенос',
    
    // States
    cancelling: 'Отменяем запись...',
    rescheduling: 'Переносим запись...',
    cancelled: 'Запись отменена',
    rescheduled: 'Запись перенесена',
    error: 'Произошла ошибка',
    errorDescription: 'Не удалось выполнить операцию. Попробуйте позже или обратитесь в поддержку.',
    
    // Booking details
    service: 'Стрижка и укладка',
    master: 'Анна Иванова',
    date: '15 января 2024',
    time: '14:00',
    duration: '60 минут',
    address: 'ул. Пушкина, 10, Москва',
    phone: '+7 (495) 123-45-67'
  },
  EN: {
    title: 'Manage Booking',
    subtitle: 'You can change or cancel your booking, and also contact the master',
    currentBooking: 'Current Booking',
    actions: 'Actions',
    reschedule: 'Reschedule',
    cancel: 'Cancel',
    chatWithMaster: 'Chat with Master',
    showRoute: 'Show Route',
    backToServices: 'Back to Services',
    cancellationPolicy: 'Cancellation Policy',
    policyText: 'Cancellation 24+ hours ahead — free. Cancellation less than 24 hours — 50% fee applies.',
    helpText: 'You can always return to this booking from the bot chat',
    
    // Cancel dialog
    cancelDialogTitle: 'Cancel Booking',
    cancelDialogDescription: 'Are you sure you want to cancel this booking?',
    cancelReason: 'Cancellation reason (optional)',
    cancelReasonPlaceholder: 'Enter cancellation reason...',
    confirmCancel: 'Confirm Cancellation',
    keepBooking: 'Keep Booking',
    
    // Reschedule dialog
    rescheduleDialogTitle: 'Reschedule Booking',
    rescheduleDialogDescription: 'Choose new date and time',
    selectNewTime: 'Select new time',
    confirmReschedule: 'Confirm Reschedule',
    
    // States
    cancelling: 'Cancelling booking...',
    rescheduling: 'Rescheduling booking...',
    cancelled: 'Booking cancelled',
    rescheduled: 'Booking rescheduled',
    error: 'An error occurred',
    errorDescription: 'Unable to complete the operation. Please try later or contact support.',
    
    // Booking details
    service: 'Haircut and Styling',
    master: 'Anna Ivanova',
    date: 'January 15, 2024',
    time: '2:00 PM',
    duration: '60 minutes',
    address: '10 Pushkin St, Moscow',
    phone: '+7 (495) 123-45-67'
  }
};

export function Step09Management({ locale = 'RU' }: ManagementStepProps) {
  const t = translations[locale];
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionState, setActionState] = useState<ActionState>('idle');

  const bookingData = {
    service: t.service,
    master: t.master,
    date: t.date,
    time: t.time,
    duration: t.duration,
    address: t.address,
    phone: t.phone
  };

  const handleCancel = async () => {
    setActionState('loading');
    setShowCancelDialog(false);
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setActionState(success ? 'success' : 'error');
    }, 2000);
  };

  const handleReschedule = async () => {
    setActionState('loading');
    setShowRescheduleDialog(false);
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setActionState(success ? 'success' : 'error');
    }, 2000);
  };

  const handleChatWithMaster = () => {
    // Simulate deep link to Telegram
    window.open('https://t.me/demo_master_bot', '_blank');
  };

  const handleShowRoute = () => {
    // Simulate opening maps
    const query = encodeURIComponent(bookingData.address);
    window.open(`https://yandex.ru/maps/?text=${query}`, '_blank');
  };

  // Loading state
  if (actionState === 'loading') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">
            {showCancelDialog ? t.cancelling : t.rescheduling}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'RU' ? 'Пожалуйста, подождите...' : 'Please wait...'}
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (actionState === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">
            {showCancelDialog ? t.cancelled : t.rescheduled}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'RU' 
              ? 'Операция выполнена успешно' 
              : 'Operation completed successfully'
            }
          </p>
        </div>
        <Button 
          onClick={() => setActionState('idle')}
          className="bg-primary hover:bg-primary/90"
        >
          {locale === 'RU' ? 'Вернуться' : 'Go Back'}
        </Button>
      </div>
    );
  }

  // Error state
  if (actionState === 'error') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.error}</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">{t.errorDescription}</p>
        </div>
        <Button 
          onClick={() => setActionState('idle')}
          className="bg-primary hover:bg-primary/90"
        >
          {locale === 'RU' ? 'Попробовать снова' : 'Try Again'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Current Booking Card */}
      <Card className="p-8 shadow-sm rounded-2xl border border-border max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-medium text-foreground">{t.currentBooking}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'RU' ? 'Услуга' : 'Service'}
                </p>
                <p className="font-medium text-foreground">{bookingData.service}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'RU' ? 'Мастер' : 'Master'}
                </p>
                <p className="font-medium text-foreground">{bookingData.master}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'RU' ? 'Дата и время' : 'Date & Time'}
                </p>
                <p className="font-medium text-foreground">
                  {bookingData.date}, {bookingData.time}
                </p>
                <p className="text-sm text-muted-foreground">
                  {locale === 'RU' ? 'Длительность' : 'Duration'}: {bookingData.duration}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'RU' ? 'Адрес' : 'Address'}
                </p>
                <p className="font-medium text-foreground">{bookingData.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'RU' ? 'Телефон' : 'Phone'}
                </p>
                <p className="font-medium text-foreground">{bookingData.phone}</p>
              </div>
              
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                {locale === 'RU' ? 'Подтверждено' : 'Confirmed'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6 shadow-sm rounded-2xl border border-border max-w-2xl mx-auto">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">{t.actions}</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(true)}
              className="flex items-center gap-2 h-12 text-primary border-primary/20 hover:bg-primary/10"
            >
              <Clock className="w-4 h-4" />
              {t.reschedule}
            </Button>

            <Button
              variant="outline"
              onClick={handleChatWithMaster}
              className="flex items-center gap-2 h-12 text-primary border-primary/20 hover:bg-primary/10"
            >
              <MessageSquare className="w-4 h-4" />
              {t.chatWithMaster}
            </Button>

            <Button
              variant="outline"
              onClick={handleShowRoute}
              className="flex items-center gap-2 h-12 text-primary border-primary/20 hover:bg-primary/10"
            >
              <MapPin className="w-4 h-4" />
              {t.showRoute}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className="flex items-center gap-2 h-12 text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
              {t.cancel}
            </Button>
          </div>
        </div>
      </Card>

      {/* Cancellation Policy */}
      <Alert className="max-w-2xl mx-auto border-amber-200 bg-amber-50">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="space-y-1">
            <p className="font-medium">{t.cancellationPolicy}</p>
            <p className="text-sm">{t.policyText}</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Help Text */}
      <Alert className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
        <MessageSquare className="w-4 h-4 text-primary" />
        <AlertDescription className="text-primary text-sm">
          {t.helpText}
        </AlertDescription>
      </Alert>

      {/* Back Button */}
      <div className="text-center">
        <Button variant="ghost" className="text-primary hover:bg-primary/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.backToServices}
        </Button>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {t.cancelDialogTitle}
            </DialogTitle>
            <DialogDescription>
              {t.cancelDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">{t.cancelReason}</Label>
              <Textarea
                id="cancel-reason"
                placeholder={t.cancelReasonPlaceholder}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                className="flex-1"
              >
                {t.keepBooking}
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {t.confirmCancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t.rescheduleDialogTitle}
            </DialogTitle>
            <DialogDescription>
              {t.rescheduleDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">{t.selectNewTime}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {locale === 'RU' 
                  ? 'Здесь будет календарь выбора нового времени'
                  : 'New time selection calendar would be here'
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRescheduleDialog(false)}
                className="flex-1"
              >
                {locale === 'RU' ? 'Отмена' : 'Cancel'}
              </Button>
              <Button
                onClick={handleReschedule}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {t.confirmReschedule}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: Извлечь бронь GET /v1/bookings/&#123;id&#125;; перенос/отмена — соответствующие PATCH/DELETE; 
        отправлять booking.updated|booking.cancelled в Notifications</p>
      </div>
    </div>
  );
}