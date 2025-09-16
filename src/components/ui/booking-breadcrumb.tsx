import React from 'react';
import { ChevronRight, Scissors, Clock, CheckCircle } from 'lucide-react';

interface BreadcrumbStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  completed?: boolean;
  active?: boolean;
}

interface BookingBreadcrumbProps {
  currentStep: 'service' | 'time' | 'confirmation';
  selectedService?: string;
  selectedTime?: string;
  className?: string;
}

export function BookingBreadcrumb({ 
  currentStep, 
  selectedService, 
  selectedTime,
  className = '' 
}: BookingBreadcrumbProps) {
  const steps: BreadcrumbStep[] = [
    {
      id: 'service',
      label: selectedService || 'Выбор услуги',
      icon: Scissors,
      completed: !!selectedService,
      active: currentStep === 'service'
    },
    {
      id: 'time',
      label: selectedTime || 'Выбор времени',
      icon: Clock,
      completed: !!selectedTime,
      active: currentStep === 'time'
    },
    {
      id: 'confirmation',
      label: 'Подтверждение',
      icon: CheckCircle,
      completed: false,
      active: currentStep === 'confirmation'
    }
  ];

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;
        
        return (
          <React.Fragment key={step.id}>
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              flex-shrink-0 transition-all duration-200
              ${step.completed 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : step.active 
                  ? 'bg-accent text-accent-foreground border border-border'
                  : 'text-muted-foreground'
              }
            `}>
              <Icon className={`h-4 w-4 ${
                step.completed ? 'text-primary' : step.active ? 'text-foreground' : 'text-muted-foreground'
              }`} />
              <span className="truncate max-w-[120px]">{step.label}</span>
            </div>
            
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}