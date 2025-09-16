import React from 'react';
import { Button } from './button';
import { RussianRuble } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  completed?: boolean;
}

interface StickyProgressBarProps {
  currentStep: number;
  steps: Step[];
  ctaText: string;
  onCtaClick: () => void;
  ctaDisabled?: boolean;
  className?: string;
  price?: number;
  showPrice?: boolean;
}

export function StickyProgressBar({
  currentStep,
  steps,
  ctaText,
  onCtaClick,
  ctaDisabled = false,
  className = '',
  price,
  showPrice = false
}: StickyProgressBarProps) {
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-background-solid border-t border-border 
      p-4 pb-safe-area-bottom z-50 ${className}
    `}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep || step.completed;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    transition-all duration-200
                    ${isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : isActive 
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {step.id}
                  </div>
                  <span className={`
                    text-xs font-medium transition-colors
                    ${isActive 
                      ? 'text-primary' 
                      : isCompleted 
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }
                  `}>
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    w-6 h-0.5 mx-2 mt-[-16px] transition-colors
                    ${step.id < currentStep ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* CTA Button */}
        <div className="flex items-center gap-3">
          {showPrice && price && (
            <div className="flex items-center gap-1 text-lg font-semibold">
              <RussianRuble className="h-5 w-5" />
              <span>{price.toLocaleString()}</span>
            </div>
          )}
          <Button 
            onClick={onCtaClick}
            disabled={ctaDisabled}
            className={`elegant-button ${showPrice ? 'flex-1' : 'w-full'}`}
            size="lg"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
}