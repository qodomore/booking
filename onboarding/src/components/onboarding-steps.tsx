import { useState } from 'react';
import { OnboardingLayout } from './onboarding-layout';
import { Step01Welcome } from './onboarding/step-01-welcome';

import { Step03Organization } from './onboarding/step-03-organization';
import { Step04Services } from './onboarding/step-04-services';
import { Step05BusinessProfile } from './onboarding/step-05-business-profile';
import { Step06LocationsHours } from './onboarding/step-06-locations-hours';
import { Step07ServicesPricing } from './onboarding/step-07-services-pricing';
import { Step08Subscription } from './onboarding/step-08-subscription';
import { Step09AISetup } from './onboarding/step-09-ai-setup';
import { Step10Summary } from './onboarding/step-10-summary';

interface OnboardingStepsProps {
  locale?: 'RU' | 'EN';
}

export function OnboardingSteps({ locale = 'RU' }: OnboardingStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const totalSteps = 9;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Skip subscription step (7)
    if (currentStep === 7) {
      setSubscriptionActive(false);
      setCurrentStep(8);
    }
  };

  const handleSubscriptionChange = (active: boolean) => {
    setSubscriptionActive(active);
    if (active && currentStep === 7) {
      // Auto-advance to AI setup when subscription is activated
      setTimeout(() => setCurrentStep(8), 1000);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step01Welcome locale={locale} />;
      case 2:
        return <Step03Organization locale={locale} />;
      case 3:
        return <Step04Services locale={locale} />;
      case 4:
        return <Step05BusinessProfile locale={locale} />;
      case 5:
        return <Step06LocationsHours locale={locale} />;
      case 6:
        return <Step07ServicesPricing locale={locale} subscriptionActive={subscriptionActive} />;
      case 7:
        return <Step08Subscription locale={locale} onSubscriptionChange={handleSubscriptionChange} />;
      case 8:
        return <Step09AISetup locale={locale} subscriptionActive={subscriptionActive} />;
      case 9:
        return <Step10Summary locale={locale} subscriptionActive={subscriptionActive} />;

      default:
        return <Step01Welcome locale={locale} />;
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
      showSkip={currentStep === 7}
      locale={locale}
    >
      {renderStepContent()}
    </OnboardingLayout>
  );
}