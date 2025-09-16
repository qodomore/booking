import React from 'react';
import { Sparkles, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { BusinessTypeSelector } from './BusinessTypeSelector';
import { useBusiness } from '../contexts/BusinessContext';

interface UniversalHeaderProps {
  onMenuToggle: () => void;
  currentPageTitle?: string;
  currentPageIcon?: React.ComponentType<any>;
}

export function UniversalHeader({ onMenuToggle, currentPageTitle, currentPageIcon: CurrentPageIcon }: UniversalHeaderProps) {
  const { businessType, setBusinessType } = useBusiness();

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${businessType.primaryColor.gradient} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 gradient-text">
                BusinessFlow Pro
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Управление {businessType.terminology.venue.toLowerCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <BusinessTypeSelector 
              selectedType={businessType} 
              onTypeChange={setBusinessType} 
            />
            
            <div className="px-3 py-1 bg-emerald-100/80 text-emerald-700 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
              
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-white/60 transition-all duration-200 rounded-xl" 
              onClick={onMenuToggle}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Current Page Title for Mobile */}
        {currentPageTitle && CurrentPageIcon && (
          <div className="mt-3 md:hidden">
            <div className="flex items-center gap-2">
              <CurrentPageIcon className={`w-4 h-4 text-${businessType.primaryColor.light}`} />
              <span className="text-sm font-semibold text-gray-900">{currentPageTitle}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}