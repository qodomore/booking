import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Crown, 
  Sparkles, 
  Target, 
  MessageSquare, 
  Users, 
  Bell,
  Zap,
  Calendar,
  ChevronRight,
  Check,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

type PlanType = 'free' | 'solo' | 'pro';
type BillingPeriod = 'monthly' | 'yearly';

interface SubscriptionScreenProps {
  currentPlan?: PlanType;
  currentUsage?: {
    bookings7Days: number;
    telegramNotifications: number;
  };
  onUpgrade?: (period: BillingPeriod) => void;
  onPromoCode?: () => void;
  onBack?: () => void;
  locale?: 'ru' | 'en';
}

const benefits = [
  {
    key: 'auto_return',
    icon: Target,
    ru: 'Умное возвращение клиентов',
    en: 'Smart client return'
  },
  {
    key: 'smart_pricing',
    icon: Zap,
    ru: 'Автоматическое ценообразование',
    en: 'Automatic pricing'
  },
  {
    key: 'auto_campaigns',
    icon: Calendar,
    ru: 'Поздравления и напоминания',
    en: 'Automated greetings & reminders'
  },
  {
    key: 'ai_posts',
    icon: Sparkles,
    ru: 'Умные посты для соц.сетей (5/мес)',
    en: 'Smart social media posts (5/month)'
  },
  {
    key: 'segments',
    icon: Users,
    ru: 'Группировка клиентов',
    en: 'Client grouping'
  },
  {
    key: 'notifications',
    icon: Bell,
    ru: 'SMS и сообщения до 10 000/мес',
    en: 'SMS & messages up to 10,000/month'
  }
];

const texts = {
  ru: {
    title: 'Подписка',
    heroTitle: 'Премиум возможности',
    heroSubtitle: 'Автоматизация работы и умные инструменты для роста бизнеса',
    monthly: 'Месяц',
    yearly: 'Год',
    save: 'Экономия −15%',
    upgradeButton: 'Обновить до Pro',
    monthlyPrice: '490 ₽/мес',
    yearlyPrice: '5 000 ₽/год',
    promoCode: 'У меня есть промокод',
    autoRenewal: 'Автопродление, можно отменить в любой момент',
    terms: 'Условия использования',
    limit7Days: 'Записи за 7 дней',
    limitTelegram: 'Уведомления в Telegram',
    planBadges: {
      free: 'Free',
      solo: 'Solo Free',
      pro: 'Pro'
    }
  },
  en: {
    title: 'Subscription',
    heroTitle: 'Premium Features',
    heroSubtitle: 'Business automation and smart tools for growth',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save −15%',
    upgradeButton: 'Upgrade to Pro',
    monthlyPrice: '$6.90/month',
    yearlyPrice: '$70/year',
    promoCode: 'I have a promo code',
    autoRenewal: 'Auto-renewal, cancel anytime',
    terms: 'Terms of Service',
    limit7Days: '7-day bookings',
    limitTelegram: 'Telegram notifications',
    planBadges: {
      free: 'Free',
      solo: 'Solo Free',
      pro: 'Pro'
    }
  }
};

export function SubscriptionScreen({ 
  currentPlan = 'free',
  currentUsage = { bookings7Days: 45, telegramNotifications: 856 },
  onUpgrade,
  onPromoCode,
  onBack,
  locale = 'ru'
}: SubscriptionScreenProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const t = texts[locale];
  const isProUser = currentPlan === 'pro';
  const isFreeUser = currentPlan === 'free';
  
  // Лимиты для разных планов
  const limits = {
    free: { bookings: 100, notifications: 100 },
    solo: { bookings: Infinity, notifications: 100 },
    pro: { bookings: Infinity, notifications: 10000 }
  };
  
  const currentLimits = limits[currentPlan];
  const bookingsProgress = currentPlan === 'free' ? (currentUsage.bookings7Days / currentLimits.bookings) * 100 : 0;
  const notificationsProgress = currentPlan !== 'pro' ? (currentUsage.telegramNotifications / currentLimits.notifications) * 100 : 0;

  const handleUpgrade = async () => {
    if (isProUser) return;
    
    setIsProcessing(true);
    try {
      await onUpgrade?.(billingPeriod);
      toast.success(locale === 'ru' ? 'Подписка Pro активна!' : 'Pro subscription activated!');
    } catch (error) {
      toast.error(locale === 'ru' ? 'Ошибка при оплате' : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h1 className="text-2xl font-semibold">{t.title}</h1>
        </div>
        <Badge 
          variant={isProUser ? "default" : "secondary"}
          className={isProUser ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : ""}
        >
          {isProUser && <Crown className="w-3 h-3 mr-1" />}
          {t.planBadges[currentPlan]}
        </Badge>
      </div>

      {/* Hero Section */}
      {!isProUser && (
        <Card className="p-6 gradient-card text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6" />
              <h2 className="text-xl font-semibold">{t.heroTitle}</h2>
            </div>
            <p className="text-white/90 text-sm mb-4">{t.heroSubtitle}</p>
            
            {/* Illustration placeholder */}
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center ml-auto">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
        </Card>
      )}

      {/* Billing Toggle */}
      {!isProUser && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={billingPeriod === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
                {t.monthly}
              </span>
              <Switch
                checked={billingPeriod === 'yearly'}
                onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
              />
              <span className={billingPeriod === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
                {t.yearly}
              </span>
            </div>
            
            {billingPeriod === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                {t.save}
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Benefits List */}
      <Card className="p-6">
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isProUser 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <benefit.icon className="w-4 h-4" />
              </div>
              <span className={`flex-1 text-sm ${
                isProUser ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {benefit[locale]}
              </span>
              {isProUser ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Usage Limits for Free/Solo */}
      {!isProUser && (
        <div className="space-y-4">
          {/* 7-day bookings limit (only for Free) */}
          {isFreeUser && (
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.limit7Days}</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUsage.bookings7Days} / {currentLimits.bookings}
                  </span>
                </div>
                <Progress 
                  value={bookingsProgress} 
                  className={`h-2 ${bookingsProgress >= 80 ? 'progress-warning' : ''}`}
                />
                {bookingsProgress >= 80 && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      {locale === 'ru' 
                        ? 'Вы близки к лимиту. Обновите до Pro для безлимитной работы.'
                        : 'You\'re close to the limit. Upgrade to Pro for unlimited usage.'
                      }
                    </p>
                    <Button size="sm" variant="outline" onClick={handleUpgrade} className="text-xs">
                      {t.upgradeButton}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Telegram notifications limit */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.limitTelegram}</span>
                <span className="text-sm text-muted-foreground">
                  {currentUsage.telegramNotifications} / {currentLimits.notifications}
                </span>
              </div>
              <Progress 
                value={notificationsProgress} 
                className={`h-2 ${notificationsProgress >= 80 ? 'progress-warning' : ''}`}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Pricing CTA */}
      {!isProUser && (
        <div className="space-y-3">
          <Button 
            className="w-full h-12 elegant-button text-white font-medium"
            onClick={handleUpgrade}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {locale === 'ru' ? 'Обработка...' : 'Processing...'}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span>{t.upgradeButton}</span>
                <span className="font-semibold">
                  {billingPeriod === 'monthly' ? t.monthlyPrice : t.yearlyPrice}
                </span>
              </div>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={onPromoCode}
          >
            {t.promoCode}
          </Button>
        </div>
      )}

      {/* Legal Text */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          {t.autoRenewal}
        </p>
        <button className="text-xs text-primary hover:underline">
          {t.terms}
        </button>
      </div>
    </div>
  );
}