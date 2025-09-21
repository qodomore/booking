import { useState } from 'react';
import { CreditCard, Shield, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface PaymentStepProps {
  locale?: 'RU' | 'EN';
}

type LoadingState = 'idle' | 'loading' | 'success' | 'failed';

const translations = {
  RU: {
    title: 'Оплата услуги',
    subtitle: 'Выберите способ оплаты для завершения бронирования',
    payNow: 'Оплатить сейчас',
    confirmWithoutPayment: 'Подтвердить без оплаты',
    amount: 'К оплате',
    paymentMethod: 'Способ оплаты',
    saveReceipt: 'Сохранить квитанцию в Telegram',
    paymentSecurity: 'Оплата защищена, данные карты не сохраняются у нас',
    payButton: 'Оплатить',
    confirmButton: 'Подтвердить бронирование',
    processing: 'Обрабатываем платеж...',
    paymentSuccess: 'Оплата прошла успешно!',
    paymentFailed: 'Ошибка оплаты',
    paymentError: 'Не удалось обработать платеж. Проверьте данные карты и попробуйте снова',
    retryPayment: 'Повторить оплату',
    continueWithoutPayment: 'Продолжить без оплаты',
    cardNumber: '•••• •••• •••• 1234',
    bankCard: 'Банковская карта',
    prepaymentOptional: 'Предоплата не обязательна',
    canPayAtLocation: 'Вы можете оплатить на месте'
  },
  EN: {
    title: 'Service Payment',
    subtitle: 'Choose payment method to complete your booking',
    payNow: 'Pay now',
    confirmWithoutPayment: 'Confirm without payment',
    amount: 'Amount to pay',
    paymentMethod: 'Payment method',
    saveReceipt: 'Save receipt to Telegram',
    paymentSecurity: 'Payment is secure, card data is not stored by us',
    payButton: 'Pay',
    confirmButton: 'Confirm Booking',
    processing: 'Processing payment...',
    paymentSuccess: 'Payment successful!',
    paymentFailed: 'Payment Failed',
    paymentError: 'Unable to process payment. Please check your card details and try again',
    retryPayment: 'Retry Payment',
    continueWithoutPayment: 'Continue without payment',
    cardNumber: '•••• •••• •••• 1234',
    bankCard: 'Bank Card',
    prepaymentOptional: 'Prepayment is optional',
    canPayAtLocation: 'You can pay at the location'
  }
};

export function Step07Payment({ locale = 'RU' }: PaymentStepProps) {
  const t = translations[locale];
  const [paymentOption, setPaymentOption] = useState<'pay_now' | 'pay_later'>('pay_now');
  const [saveReceipt, setSaveReceipt] = useState(true);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const servicePrice = 2500; // Mock price

  const handlePayment = () => {
    if (paymentOption === 'pay_now') {
      setShowPaymentModal(true);
    } else {
      // Navigate to next step without payment
      setLoadingState('success');
    }
  };

  const processPayment = () => {
    setLoadingState('loading');
    setShowPaymentModal(false);
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      setLoadingState(success ? 'success' : 'failed');
    }, 3000);
  };

  const handleRetry = () => {
    setLoadingState('idle');
  };

  if (loadingState === 'loading') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.processing}</h2>
          <p className="text-muted-foreground">
            {locale === 'RU' ? 'Пожалуйста, не закрывайте страницу' : 'Please do not close this page'}
          </p>
        </div>
      </div>
    );
  }

  if (loadingState === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.paymentSuccess}</h2>
          <p className="text-muted-foreground">
            {locale === 'RU' ? 'Переходим к подтверждению записи...' : 'Proceeding to booking confirmation...'}
          </p>
        </div>
      </div>
    );
  }

  if (loadingState === 'failed') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.paymentFailed}</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">{t.paymentError}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={handleRetry} className="bg-primary hover:bg-primary/90">
            {t.retryPayment}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => {
              setPaymentOption('pay_later');
              setLoadingState('success');
            }}
            className="text-primary hover:bg-primary/10"
          >
            {t.continueWithoutPayment}
          </Button>
        </div>
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

      {/* Payment Options */}
      <div className="max-w-lg mx-auto space-y-4">
        {/* Pay Now Option */}
        <Card 
          className={`p-6 cursor-pointer transition-all ${
            paymentOption === 'pay_now' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentOption('pay_now')}
        >
          <div className="flex items-start gap-4">
            <div className="w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center mt-0.5">
              {paymentOption === 'pay_now' && (
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">{t.payNow}</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {servicePrice} ₽
                </Badge>
              </div>
              
              {paymentOption === 'pay_now' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{t.bankCard}</p>
                      <p className="text-xs text-muted-foreground">{t.cardNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="save-receipt"
                      checked={saveReceipt}
                      onCheckedChange={(checked) => setSaveReceipt(!!checked)}
                    />
                    <Label htmlFor="save-receipt" className="text-sm">
                      {t.saveReceipt}
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Pay Later Option */}
        <Card 
          className={`p-6 cursor-pointer transition-all ${
            paymentOption === 'pay_later' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentOption('pay_later')}
        >
          <div className="flex items-start gap-4">
            <div className="w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center mt-0.5">
              {paymentOption === 'pay_later' && (
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">{t.confirmWithoutPayment}</h3>
              <p className="text-sm text-muted-foreground">{t.canPayAtLocation}</p>
              
              {paymentOption === 'pay_later' && (
                <Alert className="mt-3 border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800 text-sm">
                    {t.prepaymentOptional}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Security Info */}
      <Alert className="max-w-lg mx-auto border-primary/20 bg-primary/5">
        <Shield className="w-4 h-4 text-primary" />
        <AlertDescription className="text-primary text-sm">
          {t.paymentSecurity}
        </AlertDescription>
      </Alert>

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={handlePayment}
          className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <div className="flex items-center gap-2">
            {paymentOption === 'pay_now' ? t.payButton : t.confirmButton}
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {locale === 'RU' ? 'Оплата' : 'Payment'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-foreground">{servicePrice} ₽</div>
              <p className="text-muted-foreground">
                {locale === 'RU' 
                  ? 'Демо-экран оплаты. В реальном приложении здесь будет форма банковской карты.' 
                  : 'Demo payment screen. In real app this would be a bank card form.'
                }
              </p>
            </div>
            <Button 
              onClick={processPayment}
              className="w-full h-11 bg-primary hover:bg-primary/90"
            >
              {locale === 'RU' ? 'Подтвердить оплату' : 'Confirm Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: Создавать платёж POST /v1/payments → редирект в PSP → по webhook payment.completed подтвердить бронь. 
        При безоплатном сценарии — перейти к POST /v1/bookings сразу</p>
      </div>
    </div>
  );
}