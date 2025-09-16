import React, { useContext } from 'react';
import { AppContext } from '../App';

export function ProgressBar() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, currentScreen } = context;

  const texts = {
    ru: {
      service: 'Услуга',
      time: 'Время',
      confirmation: 'Подтверждение'
    },
    en: {
      service: 'Service',
      time: 'Time',
      confirmation: 'Confirmation'
    }
  };

  const t = texts[language];

  // Determine current step based on screen
  const getCurrentStep = () => {
    switch (currentScreen) {
      case 'home':
      case 'search':
      case 'service-details':
        return 1;
      case 'time-selection':
        return 2;
      case 'confirmation':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getCurrentStep();

  return (
    <div className="bg-card border-t border-border p-4">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            1
          </div>
          <span className={currentStep >= 1 ? 'text-foreground' : ''}>{t.service}</span>
        </div>
        <div className={`w-4 h-px ${currentStep >= 2 ? 'bg-primary' : 'bg-border'}`}></div>
        <div className="flex items-center gap-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            2
          </div>
          <span className={currentStep >= 2 ? 'text-foreground' : ''}>{t.time}</span>
        </div>
        <div className={`w-4 h-px ${currentStep >= 3 ? 'bg-primary' : 'bg-border'}`}></div>
        <div className="flex items-center gap-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            3
          </div>
          <span className={currentStep >= 3 ? 'text-foreground' : ''}>{t.confirmation}</span>
        </div>
      </div>
    </div>
  );
}