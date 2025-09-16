import React, { useContext } from 'react';
import { Check } from 'lucide-react';
import { AppContext } from '../App';
import { Button } from './ui/button';

interface BottomActionBarProps {
  currentStep: 1 | 2 | 3;
  onContinue: () => void;
  isDisabled?: boolean;
  continueText?: string;
  className?: string;
}

export function BottomActionBar({ 
  currentStep, 
  onContinue, 
  isDisabled = false,
  continueText,
  className = ''
}: BottomActionBarProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language } = context;

  const texts = {
    ru: {
      service: 'Услуга',
      time: 'Время', 
      confirmation: 'Подтверждение',
      continue: 'Продолжить',
      confirm: 'Подтвердить',
      book: 'Забронировать'
    },
    en: {
      service: 'Service',
      time: 'Time',
      confirmation: 'Confirmation', 
      continue: 'Continue',
      confirm: 'Confirm',
      book: 'Book'
    }
  };

  const t = texts[language];

  const steps = [
    { id: 1, label: t.service },
    { id: 2, label: t.time },
    { id: 3, label: t.confirmation }
  ];

  const getButtonText = () => {
    if (continueText) return continueText;
    
    switch (currentStep) {
      case 1:
        return t.continue;
      case 2:
        return t.continue;
      case 3:
        return t.confirm;
      default:
        return t.continue;
    }
  };

  return (
    <div className={`bottom-nav-fixed ${className}`}>
      <div className="glass-panel backdrop-blur-md border-t border-border/50 px-4 py-4 pb-safe-action">
        <div className="max-w-sm mx-auto space-y-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step */}
                <div className="flex items-center gap-2">
                  {/* Step Icon */}
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
                    ${step.id < currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step.id === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {step.id < currentStep ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      step.id
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <span className={`
                    transition-colors
                    ${step.id <= currentStep 
                      ? 'text-foreground font-medium' 
                      : 'text-muted-foreground'
                    }
                  `}>
                    {step.label}
                  </span>
                </div>
                
                {/* Separator */}
                {index < steps.length - 1 && (
                  <div className={`
                    w-8 h-px transition-colors
                    ${step.id < currentStep 
                      ? 'bg-primary' 
                      : 'bg-border'
                    }
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Action Button */}
          <Button
            onClick={onContinue}
            disabled={isDisabled}
            className="w-full h-12 text-base font-medium rounded-2xl"
            size="lg"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
}