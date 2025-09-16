import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { businessTypes, type BusinessType } from '../config/businessTypes';

interface BusinessTypeSelectorProps {
  selectedType: BusinessType;
  onTypeChange: (type: BusinessType) => void;
}

export function BusinessTypeSelector({ selectedType, onTypeChange }: BusinessTypeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleTypeSelect = (type: BusinessType) => {
    onTypeChange(type);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-200"
        >
          <span className="text-lg">{selectedType.icon}</span>
          <span className="hidden sm:inline">{selectedType.name}</span>
          <ChevronDown className="w-4 h-4 opacity-60" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Выберите тип вашего бизнеса</DialogTitle>
          <DialogDescription>
            Это поможет настроить интерфейс и терминологию под ваш вид деятельности
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {businessTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                selectedType.id === type.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTypeSelect(type)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.primaryColor.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    </div>
                  </div>
                  
                  {selectedType.id === type.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Специалисты:</span> {type.terminology.specialists}</p>
                  <p><span className="font-medium">Клиенты:</span> {type.terminology.clients}</p>
                  <p><span className="font-medium">Место:</span> {type.terminology.venue}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Примеры услуг:</p>
                  <div className="flex flex-wrap gap-1">
                    {type.defaultServices.slice(0, 3).map((service) => (
                      <span 
                        key={service} 
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                      >
                        {service}
                      </span>
                    ))}
                    {type.defaultServices.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        +{type.defaultServices.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}