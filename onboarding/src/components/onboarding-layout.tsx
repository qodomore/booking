import { ReactNode } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showSkip?: boolean;
  locale?: 'RU' | 'EN';
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  nextLabel,
  nextDisabled = false,
  showSkip = false,
  locale = 'RU'
}: OnboardingLayoutProps) {
  const progressPercent = (currentStep / totalSteps) * 100;
  
  const labels = {
    RU: {
      step: 'Шаг',
      of: 'из',
      back: 'Назад',
      next: 'Далее',
      skip: 'Пропустить',
      finish: 'Завершить'
    },
    EN: {
      step: 'Step',
      of: 'of',
      back: 'Back',
      next: 'Next',
      skip: 'Skip',
      finish: 'Finish'
    }
  };

  const t = labels[locale];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-14">
      {/* Main Container - 960px width, centered */}
      <div className="w-full max-w-[960px] mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {t.step} {currentStep} {t.of} {totalSteps}
            </div>
          </div>
          <Progress value={progressPercent} className="h-[6px]" />
        </div>

        {/* Main Content Card */}
        <Card className="p-10 mb-10 border border-border shadow-sm rounded-2xl">
          {children}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onPrev}
            disabled={currentStep === 1}
            className="flex items-center gap-3 h-11 px-4 text-primary hover:bg-primary/10"
          >
            <ChevronLeft className="w-6 h-6" />
            {t.back}
          </Button>

          <div className="flex items-center gap-4">
            {showSkip && (
              <Button 
                variant="ghost" 
                onClick={onSkip}
                className="text-primary hover:bg-primary/10"
              >
                {t.skip}
              </Button>
            )}
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="flex items-center gap-3 h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {nextLabel || (currentStep === totalSteps ? t.finish : t.next)}
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}