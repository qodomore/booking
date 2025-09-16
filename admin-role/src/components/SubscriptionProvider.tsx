import React, { createContext, useContext, useState, useEffect } from 'react';
import { PaywallModal } from './PaywallModal';
import { LimitNotification, useLimitToasts } from './LimitNotifications';

type PlanType = 'free' | 'solo' | 'pro';
type BillingPeriod = 'monthly' | 'yearly';

interface UsageLimits {
  bookings7Days: number;
  telegramNotifications: number;
  smsBalance: number;
}

interface SubscriptionState {
  currentPlan: PlanType;
  billingPeriod: BillingPeriod | null;
  expiresAt: Date | null;
  usage: UsageLimits;
  isLoading: boolean;
}

interface SubscriptionContextType {
  // State
  subscription: SubscriptionState;
  
  // Plan limits
  limits: {
    bookings: number;
    notifications: number;
  };
  
  // Permissions
  canCreateBooking: boolean;
  canSendNotification: boolean;
  hasProFeature: (feature: string) => boolean;
  
  // Actions
  upgrade: (period: BillingPeriod) => Promise<void>;
  downgrade: () => Promise<void>;
  checkLimits: () => void;
  
  // Paywall
  showPaywall: (type: 'booking_limit' | 'notification_limit' | 'pro_feature', customMessage?: string) => void;
  hidePaywall: () => void;
  
  // Usage tracking
  incrementBookings: () => void;
  incrementNotifications: () => void;
  
  // Settings
  locale: 'ru' | 'en';
  setLocale: (locale: 'ru' | 'en') => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

interface SubscriptionProviderProps {
  children: React.ReactNode;
  initialPlan?: PlanType;
  initialLocale?: 'ru' | 'en';
}

export function SubscriptionProvider({ 
  children, 
  initialPlan = 'free',
  initialLocale = 'ru'
}: SubscriptionProviderProps) {
  const [locale, setLocale] = useState<'ru' | 'en'>(initialLocale);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    currentPlan: initialPlan,
    billingPeriod: null,
    expiresAt: null,
    usage: {
      bookings7Days: 0,
      telegramNotifications: 0,
      smsBalance: 1000
    },
    isLoading: false
  });

  const [paywallState, setPaywallState] = useState<{
    isOpen: boolean;
    type: 'booking_limit' | 'notification_limit' | 'pro_feature';
    customMessage?: string;
  }>({
    isOpen: false,
    type: 'pro_feature'
  });

  const toasts = useLimitToasts(locale);

  // Plan limits configuration
  const planLimits = {
    free: { bookings: 100, notifications: 100 },
    solo: { bookings: Infinity, notifications: 100 },
    pro: { bookings: Infinity, notifications: 10000 }
  };

  const limits = planLimits[subscription.currentPlan];

  // Permission checks
  const canCreateBooking = subscription.currentPlan !== 'free' || subscription.usage.bookings7Days < limits.bookings;
  const canSendNotification = subscription.currentPlan === 'pro' || subscription.usage.telegramNotifications < limits.notifications;

  const proFeatures = [
    'auto_return',
    'smart_pricing', 
    'auto_campaigns',
    'ai_posts',
    'segments',
    'advanced_analytics',
    'custom_branding',
    'api_access',
    'priority_support'
  ];

  const hasProFeature = (feature: string) => {
    return subscription.currentPlan === 'pro' || !proFeatures.includes(feature);
  };

  // Actions
  const upgrade = async (period: BillingPeriod) => {
    setSubscription(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const expiresAt = new Date();
      if (period === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }
      
      setSubscription(prev => ({
        ...prev,
        currentPlan: 'pro',
        billingPeriod: period,
        expiresAt,
        isLoading: false
      }));

      // Close paywall if open
      hidePaywall();
      
    } catch (error) {
      setSubscription(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const downgrade = async () => {
    setSubscription(prev => ({
      ...prev,
      currentPlan: 'free',
      billingPeriod: null,
      expiresAt: null
    }));
  };

  const checkLimits = () => {
    const { bookings7Days, telegramNotifications } = subscription.usage;
    
    // Check booking limits for free plan
    if (subscription.currentPlan === 'free') {
      const bookingProgress = bookings7Days / limits.bookings;
      
      if (bookingProgress >= 1.0) {
        // Limit reached - show error paywall
        showPaywall('booking_limit');
      } else if (bookingProgress >= 0.8) {
        // Warning threshold - show toast
        toasts.showBookingWarning(bookings7Days, limits.bookings, () => showPaywall('pro_feature'));
      }
    }
    
    // Check notification limits for non-pro plans
    if (subscription.currentPlan !== 'pro') {
      const notificationProgress = telegramNotifications / limits.notifications;
      
      if (notificationProgress >= 1.0) {
        toasts.showNotificationError(
          () => showPaywall('pro_feature'),
          () => console.log('Open notification settings')
        );
      } else if (notificationProgress >= 0.8) {
        toasts.showNotificationWarning(
          telegramNotifications,
          limits.notifications,
          () => showPaywall('pro_feature'),
          () => console.log('Open notification settings')
        );
      }
    }
  };

  const showPaywall = (type: typeof paywallState.type, customMessage?: string) => {
    setPaywallState({
      isOpen: true,
      type,
      customMessage
    });
  };

  const hidePaywall = () => {
    setPaywallState(prev => ({ ...prev, isOpen: false }));
  };

  const incrementBookings = () => {
    setSubscription(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        bookings7Days: prev.usage.bookings7Days + 1
      }
    }));
  };

  const incrementNotifications = () => {
    setSubscription(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        telegramNotifications: prev.usage.telegramNotifications + 1
      }
    }));
  };

  // Check limits when usage changes
  useEffect(() => {
    checkLimits();
  }, [subscription.usage, subscription.currentPlan]);

  // Load subscription data on mount
  useEffect(() => {
    const loadSubscription = async () => {
      setSubscription(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Simulate loading from API/storage
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with real API call
        const mockUsage = {
          bookings7Days: Math.floor(Math.random() * 120),
          telegramNotifications: Math.floor(Math.random() * 150),
          smsBalance: 850
        };
        
        setSubscription(prev => ({
          ...prev,
          usage: mockUsage,
          isLoading: false
        }));
      } catch (error) {
        setSubscription(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadSubscription();
  }, []);

  const contextValue: SubscriptionContextType = {
    subscription,
    limits,
    canCreateBooking,
    canSendNotification,
    hasProFeature,
    upgrade,
    downgrade,
    checkLimits,
    showPaywall,
    hidePaywall,
    incrementBookings,
    incrementNotifications,
    locale,
    setLocale
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
      
      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallState.isOpen}
        onClose={hidePaywall}
        onUpgrade={() => showPaywall('pro_feature')} // This would open subscription screen
        type={paywallState.type}
        locale={locale}
        customMessage={paywallState.customMessage}
      />
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Higher-order component for protecting Pro features
export function withProFeature<P extends object>(
  Component: React.ComponentType<P>,
  feature: string,
  fallbackMessage?: string
) {
  return function ProtectedComponent(props: P) {
    const { hasProFeature, showPaywall, locale } = useSubscription();
    
    if (!hasProFeature(feature)) {
      const message = fallbackMessage || (locale === 'ru' 
        ? 'Эта функция доступна только в Pro версии'
        : 'This feature is only available in Pro version'
      );
      
      return (
        <div className="p-8 text-center space-y-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button 
            onClick={() => showPaywall('pro_feature')}
            className="elegant-button"
          >
            {locale === 'ru' ? 'Разблокировать с Pro' : 'Unlock with Pro'}
          </Button>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}