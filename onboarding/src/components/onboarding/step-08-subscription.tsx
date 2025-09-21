import { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  CreditCard, 
  Shield, 
  Sparkles,
  BarChart3,
  MessageSquare,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';

interface SubscriptionStepProps {
  locale?: 'RU' | 'EN';
  onSubscriptionChange?: (active: boolean) => void;
}

type SubscriptionState = 'idle' | 'processing' | 'paid' | 'failed';

const translations = {
  RU: {
    title: 'Подписка и оплата',
    subtitle: 'Выберите тарифный план, который подходит вашему бизнесу',
    
    // Plans
    basicPlan: 'Базовый',
    basicPlanSubtitle: 'Для старта',
    basicPrice: 'Бесплатно',
    basicPriceDescription: 'Навсегда',
    
    proPlan: 'Маркетинг + AI',
    proPlanSubtitle: 'Для роста бизнеса',
    proPrice: '299 ₽',
    proPriceDescription: 'в месяц',
    proPriceDescriptionAnnual: 'в месяц (при оплате за год)',
    
    // Billing periods
    monthly: 'Месяц',
    yearly: 'Год',
    yearlyDiscount: '-15%',
    
    // Features
    basicFeatures: [
      'Запись клиентов через бота',
      'Напоминания T-24 и T-2',
      'Базовая статистика',
      'До 100 записей в месяц',
      'Поддержка в чате'
    ],
    proFeatures: [
      'Все из базового тарифа',
      'AI-удержание клиентов',
      'AI-копирайтер (5 постов/мес)',
      'Смарт-цены и рекомендации',
      'Тихие рассылки (до 500/мес)',
      'Расширенная аналитика',
      'Приоритетная поддержка',
      'Интеграции с CRM'
    ],
    
    // Actions
    currentPlan: 'Текущий план',
    choosePlan: 'Выбрать план',
    upgradePlan: 'Оформить подписку',
    stayBasic: 'Остаться на базовом',
    skipForNow: 'Пропустить',
    
    // Payment
    paymentMethod: 'Способ оплаты',
    bankCard: 'Банковская карта',
    yookassa: 'ЮKassa',
    tinkoff: 'Тинькофф',
    autoRenewal: 'Автопродление',
    autoRenewalDescription: 'Подписка будет продлеваться автоматически',
    
    // Processing states
    processing: 'Обрабатываем платеж...',
    processingDescription: 'Пожалуйста, не закрывайте страницу',
    paymentSuccess: 'Оплата прошла успешно!',
    subscriptionActive: 'Подписка активна до',
    paymentFailed: 'Ошибка оплаты',
    paymentFailedDescription: 'Не удалось обработать платеж. Проверьте данные карты',
    retryPayment: 'Повторить оплату',
    
    // Security
    securePayment: 'Безопасная оплата',
    securePaymentDescription: 'Данные карты защищены и не сохраняются',
    
    // Demo disclaimer
    demoTitle: 'Демо-режим',
    demoDescription: 'Это демонстрационный экран оплаты. В реальном приложении здесь будет интеграция с платежной системой.'
  },
  EN: {
    title: 'Subscription & Billing',
    subtitle: 'Choose a pricing plan that fits your business',
    
    // Plans
    basicPlan: 'Basic',
    basicPlanSubtitle: 'To get started',
    basicPrice: 'Free',
    basicPriceDescription: 'Forever',
    
    proPlan: 'Marketing + AI',
    proPlanSubtitle: 'For business growth',
    proPrice: '$9',
    proPriceDescription: 'per month',
    proPriceDescriptionAnnual: 'per month (billed annually)',
    
    // Billing periods
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearlyDiscount: '-15%',
    
    // Features
    basicFeatures: [
      'Client booking via bot',
      'T-24 and T-2 reminders',
      'Basic analytics',
      'Up to 100 bookings/month',
      'Chat support'
    ],
    proFeatures: [
      'Everything in Basic',
      'AI client retention',
      'AI copywriter (5 posts/month)',
      'Smart pricing & recommendations',
      'Silent campaigns (up to 500/month)',
      'Advanced analytics',
      'Priority support',
      'CRM integrations'
    ],
    
    // Actions
    currentPlan: 'Current plan',
    choosePlan: 'Choose plan',
    upgradePlan: 'Upgrade to Pro',
    stayBasic: 'Stay on Basic',
    skipForNow: 'Skip for now',
    
    // Payment
    paymentMethod: 'Payment Method',
    bankCard: 'Bank Card',
    yookassa: 'YooKassa',
    tinkoff: 'Tinkoff',
    autoRenewal: 'Auto-renewal',
    autoRenewalDescription: 'Subscription will renew automatically',
    
    // Processing states
    processing: 'Processing payment...',
    processingDescription: 'Please do not close this page',
    paymentSuccess: 'Payment successful!',
    subscriptionActive: 'Subscription active until',
    paymentFailed: 'Payment Failed',
    paymentFailedDescription: 'Unable to process payment. Please check your card details',
    retryPayment: 'Retry Payment',
    
    // Security
    securePayment: 'Secure Payment',
    securePaymentDescription: 'Card data is protected and not stored',
    
    // Demo disclaimer
    demoTitle: 'Demo Mode',
    demoDescription: 'This is a demo payment screen. In real app this would integrate with payment systems.'
  }
};

export function Step08Subscription({ locale = 'RU', onSubscriptionChange }: SubscriptionStepProps) {
  const t = translations[locale];
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
  const [paymentMethod, setPaymentMethod] = useState('yookassa');
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>('idle');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const proPrice = billingPeriod === 'monthly' ? 299 : Math.round(299 * 0.85);
  const proPriceUSD = billingPeriod === 'monthly' ? 9 : Math.round(9 * 0.85);

  const handleUpgrade = () => {
    if (selectedPlan === 'pro') {
      setShowPaymentDialog(true);
    }
  };

  const processPayment = () => {
    setSubscriptionState('processing');
    setShowPaymentDialog(false);
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setSubscriptionState('paid');
        onSubscriptionChange?.(true);
      } else {
        setSubscriptionState('failed');
      }
    }, 3000);
  };

  const handleRetry = () => {
    setSubscriptionState('idle');
  };

  const handleSkip = () => {
    onSubscriptionChange?.(false);
    // Navigate to next step
  };

  // Processing state
  if (subscriptionState === 'processing') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.processing}</h2>
          <p className="text-muted-foreground">{t.processingDescription}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (subscriptionState === 'paid') {
    const activeUntil = new Date();
    activeUntil.setMonth(activeUntil.getMonth() + (billingPeriod === 'yearly' ? 12 : 1));
    
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.paymentSuccess}</h2>
          <p className="text-muted-foreground">
            {t.subscriptionActive} {activeUntil.toLocaleDateString(locale === 'RU' ? 'ru-RU' : 'en-US')}
          </p>
        </div>
        <Alert className="max-w-md mx-auto border-emerald-200 bg-emerald-50">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            {locale === 'RU' 
              ? 'Теперь доступны все AI-функции и расширенные возможности!'
              : 'All AI features and advanced capabilities are now available!'
            }
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Failed state
  if (subscriptionState === 'failed') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground">{t.paymentFailed}</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">{t.paymentFailedDescription}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={handleRetry} className="bg-primary hover:bg-primary/90">
            {t.retryPayment}
          </Button>
          <Button variant="ghost" onClick={handleSkip} className="text-primary hover:bg-primary/10">
            {t.stayBasic}
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

      {/* Billing Period Toggle */}
      <div className="flex justify-center">
        <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}>
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
            <TabsTrigger value="yearly" className="relative">
              {t.yearly}
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs">
                {t.yearlyDiscount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <Card className={`p-8 shadow-sm rounded-2xl border transition-all ${
            selectedPlan === 'basic' 
              ? 'border-primary bg-primary/5' 
              : 'border-border'
          }`}>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-medium text-foreground mb-1">{t.basicPlan}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.basicPlanSubtitle}</p>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">{t.basicPrice}</div>
                  <div className="text-sm text-muted-foreground">{t.basicPriceDescription}</div>
                </div>
              </div>

              <div className="space-y-3">
                {t.basicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={selectedPlan === 'basic' ? 'default' : 'outline'}
                onClick={() => setSelectedPlan('basic')}
                className="w-full"
              >
                {selectedPlan === 'basic' ? t.currentPlan : t.choosePlan}
              </Button>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className={`p-8 shadow-sm rounded-2xl border transition-all relative ${
            selectedPlan === 'pro' 
              ? 'border-primary bg-primary/5' 
              : 'border-border'
          }`}>
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
              <Crown className="w-3 h-3 mr-1" />
              {locale === 'RU' ? 'Популярный' : 'Popular'}
            </Badge>
            
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-medium text-foreground mb-1">{t.proPlan}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.proPlanSubtitle}</p>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    {locale === 'RU' ? `${proPrice} ₽` : `$${proPriceUSD}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {billingPeriod === 'yearly' ? t.proPriceDescriptionAnnual : t.proPriceDescription}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {t.proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      {index === 0 ? (
                        <Check className="w-3 h-3 text-primary" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={selectedPlan === 'pro' ? 'default' : 'outline'}
                onClick={() => setSelectedPlan('pro')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {selectedPlan === 'pro' ? t.upgradePlan : t.choosePlan}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Method (only if Pro selected) */}
      {selectedPlan === 'pro' && (
        <Card className="p-6 shadow-sm rounded-2xl border border-border max-w-2xl mx-auto">
          <div className="space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t.paymentMethod}
            </h3>
            
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yookassa" id="yookassa" />
                <Label htmlFor="yookassa" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span>{t.yookassa}</span>
                    <Badge variant="outline">{t.bankCard}</Badge>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tinkoff" id="tinkoff" />
                <Label htmlFor="tinkoff" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span>{t.tinkoff}</span>
                    <Badge variant="outline">{t.bankCard}</Badge>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                id="auto-renewal"
                checked={autoRenewal}
                onCheckedChange={(checked) => setAutoRenewal(!!checked)}
              />
              <Label htmlFor="auto-renewal" className="text-sm">
                <div>
                  <p className="font-medium">{t.autoRenewal}</p>
                  <p className="text-muted-foreground">{t.autoRenewalDescription}</p>
                </div>
              </Label>
            </div>
          </div>
        </Card>
      )}

      {/* Security Info */}
      <Alert className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
        <Shield className="w-4 h-4 text-primary" />
        <AlertDescription className="text-primary">
          <div className="space-y-1">
            <p className="font-medium">{t.securePayment}</p>
            <p className="text-sm">{t.securePaymentDescription}</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        {selectedPlan === 'pro' ? (
          <>
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="text-primary hover:bg-primary/10"
            >
              {t.skipForNow}
            </Button>
            <Button
              onClick={handleUpgrade}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              <Crown className="w-4 h-4 mr-2" />
              {t.upgradePlan}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleSkip}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            {t.stayBasic}
          </Button>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {locale === 'RU' ? 'Оплата' : 'Payment'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">{t.demoTitle}</p>
                  <p>{t.demoDescription}</p>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-foreground">
                {locale === 'RU' ? `${proPrice} ₽` : `$${proPriceUSD}`}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t.proPlan}</p>
                <p>
                  {billingPeriod === 'yearly' ? t.proPriceDescriptionAnnual : t.proPriceDescription}
                </p>
              </div>
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
        <p>DEV: POST /v1/subscriptions &#123;plan_code&#125; → /v1/payments; Webhook payment.completed активирует подписку; 
        хранить subscription_status, next_billing_at</p>
      </div>
    </div>
  );
}