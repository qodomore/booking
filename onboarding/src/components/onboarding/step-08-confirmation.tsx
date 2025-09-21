import { useState } from 'react';
import { 
  Check, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  Download, 
  Share2,
  MessageSquare 
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';

interface ConfirmationStepProps {
  locale?: 'RU' | 'EN';
}

const translations = {
  RU: {
    title: 'Запись подтверждена!',
    subtitle: 'Ваша запись успешно создана. Детали бронирования ниже',
    bookingDetails: 'Детали записи',
    service: 'Услуга',
    master: 'Мастер',
    dateTime: 'Дата и время',
    duration: 'Длительность',
    location: 'Адрес',
    price: 'Стоимость',
    paymentStatus: 'Статус оплаты',
    paid: 'Оплачено',
    payAtLocation: 'Оплата на месте',
    reminderSettings: 'Настройки напоминаний',
    enableReminders: 'Присылать напоминания в Telegram',
    reminderDescription: 'Напоминания помогают не забыть о визите. Вы можете выключить их в любой момент',
    reminderTimes: 'За 24 часа и за 2 часа до визита',
    muteInfo: 'Отключить через команду /mute в боте',
    addToCalendar: 'Добавить в календарь',
    shareLink: 'Поделиться ссылкой',
    done: 'Готово',
    serviceName: 'Стрижка и укладка',
    masterName: 'Анна Иванова',
    bookingDate: '15 января 2024',
    bookingTime: '14:00',
    serviceDuration: '60 минут',
    salonAddress: 'ул. Пушкина, 10, Москва',
    calendarDownload: 'Файл календаря загружен',
    linkCopied: 'Ссылка скопирована в буфер обмена'
  },
  EN: {
    title: 'Booking Confirmed!',
    subtitle: 'Your booking has been successfully created. Booking details below',
    bookingDetails: 'Booking Details',
    service: 'Service',
    master: 'Master',
    dateTime: 'Date & Time',
    duration: 'Duration',
    location: 'Location',
    price: 'Price',
    paymentStatus: 'Payment Status',
    paid: 'Paid',
    payAtLocation: 'Pay at location',
    reminderSettings: 'Reminder Settings',
    enableReminders: 'Send reminders via Telegram',
    reminderDescription: 'Reminders help you not forget about your visit. You can disable them anytime',
    reminderTimes: '24 hours and 2 hours before visit',
    muteInfo: 'Disable with /mute command in bot',
    addToCalendar: 'Add to Calendar',
    shareLink: 'Share Link',
    done: 'Done',
    serviceName: 'Haircut and Styling',
    masterName: 'Anna Ivanova',
    bookingDate: 'January 15, 2024',
    bookingTime: '2:00 PM',
    serviceDuration: '60 minutes',
    salonAddress: '10 Pushkin St, Moscow',
    calendarDownload: 'Calendar file downloaded',
    linkCopied: 'Link copied to clipboard'
  }
};

export function Step08Confirmation({ locale = 'RU' }: ConfirmationStepProps) {
  const t = translations[locale];
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState<'calendar' | 'share' | null>(null);

  const bookingData = {
    service: t.serviceName,
    master: t.masterName,
    date: t.bookingDate,
    time: t.bookingTime,
    duration: t.serviceDuration,
    location: t.salonAddress,
    price: 2500,
    paid: true // Mock payment status
  };

  const handleAddToCalendar = () => {
    // Mock calendar download
    setShowSuccess('calendar');
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleShareLink = () => {
    // Mock link sharing
    setShowSuccess('share');
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="space-y-7">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Booking Details Card */}
      <Card className="p-8 shadow-sm rounded-2xl border border-border max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-medium text-foreground">{t.bookingDetails}</h2>
          </div>

          <div className="grid gap-4">
            {/* Service */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.service}</p>
                  <p className="font-medium text-foreground">{bookingData.service}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Master */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.master}</p>
                  <p className="font-medium text-foreground">{bookingData.master}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Date & Time */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.dateTime}</p>
                  <p className="font-medium text-foreground">
                    {bookingData.date}, {bookingData.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.duration}: {bookingData.duration}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                  <p className="font-medium text-foreground">{bookingData.location}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price & Payment */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.price}</p>
                  <p className="font-medium text-foreground">{bookingData.price} ₽</p>
                </div>
              </div>
              <Badge 
                variant={bookingData.paid ? "default" : "secondary"}
                className={bookingData.paid ? "bg-emerald-100 text-emerald-800" : ""}
              >
                {bookingData.paid ? t.paid : t.payAtLocation}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Reminder Settings */}
      <Card className="p-6 shadow-sm rounded-2xl border border-border max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">{t.reminderSettings}</h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="reminders" className="font-medium text-foreground">
                {t.enableReminders}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t.reminderTimes}
              </p>
            </div>
            <Switch
              id="reminders"
              checked={remindersEnabled}
              onCheckedChange={setRemindersEnabled}
            />
          </div>

          {remindersEnabled && (
            <Alert className="border-primary/20 bg-primary/5">
              <MessageSquare className="w-4 h-4 text-primary" />
              <AlertDescription className="text-primary text-sm">
                <div className="space-y-1">
                  <p>{t.reminderDescription}</p>
                  <p className="text-xs">{t.muteInfo}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 flex-wrap max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={handleAddToCalendar}
          className="flex items-center gap-2 text-primary border-primary/20 hover:bg-primary/10"
        >
          <Download className="w-4 h-4" />
          {t.addToCalendar}
        </Button>

        <Button
          variant="outline"
          onClick={handleShareLink}
          className="flex items-center gap-2 text-primary border-primary/20 hover:bg-primary/10"
        >
          <Share2 className="w-4 h-4" />
          {t.shareLink}
        </Button>

        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-8">
          <Check className="w-4 h-4" />
          {t.done}
        </Button>
      </div>

      {/* Success Messages */}
      {showSuccess && (
        <Alert className="max-w-md mx-auto border-emerald-200 bg-emerald-50">
          <Check className="w-4 h-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            {showSuccess === 'calendar' ? t.calendarDownload : t.linkCopied}
          </AlertDescription>
        </Alert>
      )}

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: Финализировать бронь POST /v1/bookings (атомарная аллокация ресурсов, SERIALIZABLE). 
        Событие booking.created отправляется в Notifications для T-24/T-2</p>
      </div>
    </div>
  );
}