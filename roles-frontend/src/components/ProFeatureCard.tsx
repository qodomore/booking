import React from 'react';
import { motion } from 'motion/react';
import { Crown, Lock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useSubscription } from './SubscriptionProvider';
import { LockOverlay } from './PaywallModal';

interface ProFeatureCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  feature: string;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'outline';
}

export function ProFeatureCard({
  title,
  description,
  icon: Icon = Zap,
  feature,
  children,
  className = '',
  size = 'md',
  variant = 'default'
}: ProFeatureCardProps) {
  const { hasProFeature, showPaywall, subscription, locale } = useSubscription();
  
  const isLocked = !hasProFeature(feature);
  const isPro = subscription.currentPlan === 'pro';
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClasses = {
    default: 'clean-card',
    gradient: 'gradient-card text-white',
    outline: 'border-2 border-dashed border-primary/30 bg-primary/5'
  };

  const upgradeText = locale === 'ru' ? 'Разблокировать с Pro' : 'Unlock with Pro';
  const proFeatureText = locale === 'ru' ? 'Pro функция' : 'Pro Feature';

  if (isLocked && variant === 'outline') {
    // Special locked state for outline variant
    return (
      <Card className={`${sizeClasses[size]} ${className} border-2 border-dashed border-primary/30 bg-primary/5 relative overflow-hidden`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-medium">{title}</h3>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 dark:from-purple-900 dark:to-blue-900 dark:text-purple-300">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <Button 
            onClick={() => showPaywall('pro_feature')}
            className="elegant-button"
            size={size === 'lg' ? 'default' : 'sm'}
          >
            {upgradeText}
          </Button>
          
          {children && (
            <div className="opacity-50 mt-4">
              {children}
            </div>
          )}
        </motion.div>
      </Card>
    );
  }

  return (
    <LockOverlay
      isLocked={isLocked}
      onUpgrade={() => showPaywall('pro_feature')}
      message={proFeatureText}
      locale={locale}
    >
      <Card className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} relative`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                variant === 'gradient' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${variant === 'gradient' ? 'text-white' : ''}`}>
                    {title}
                  </h3>
                  {isPro && (
                    <Badge 
                      variant="secondary" 
                      className={variant === 'gradient' 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 dark:from-purple-900 dark:to-blue-900 dark:text-purple-300'
                      }
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
                
                <p className={`text-sm ${
                  variant === 'gradient' 
                    ? 'text-white/90' 
                    : 'text-muted-foreground'
                }`}>
                  {description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          {children && (
            <div className="space-y-4">
              {children}
            </div>
          )}
        </div>
      </Card>
    </LockOverlay>
  );
}

// Compact feature list item
interface ProFeatureItemProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  feature: string;
  onClick?: () => void;
}

export function ProFeatureItem({
  title,
  description,
  icon: Icon = Zap,
  feature,
  onClick
}: ProFeatureItemProps) {
  const { hasProFeature, showPaywall, locale } = useSubscription();
  
  const isLocked = !hasProFeature(feature);

  const handleClick = () => {
    if (isLocked) {
      showPaywall('pro_feature');
    } else {
      onClick?.();
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isLocked 
          ? 'border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10' 
          : 'clean-card hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isLocked 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {isLocked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{title}</span>
            {isLocked && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                Pro
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        
        {!isLocked && (
          <div className="w-5 h-5 text-muted-foreground">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Pro feature banner for empty states
interface ProFeatureBannerProps {
  title: string;
  description: string;
  feature: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function ProFeatureBanner({
  title,
  description,
  feature,
  icon: Icon = Crown
}: ProFeatureBannerProps) {
  const { hasProFeature, showPaywall, locale } = useSubscription();
  
  if (hasProFeature(feature)) {
    return null;
  }

  const upgradeText = locale === 'ru' ? 'Подключить Pro' : 'Upgrade to Pro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 space-y-4 border-2 border-dashed border-primary/30 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10"
    >
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
        <Icon className="w-8 h-8" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
      </div>
      
      <Button 
        onClick={() => showPaywall('pro_feature')}
        className="elegant-button"
      >
        {upgradeText}
      </Button>
    </motion.div>
  );
}