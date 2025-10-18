import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MasterHeader } from './MasterHeader';
import { MasterAvailability } from './MasterAvailability';
import { useResources, Service } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';

interface MasterScreenProps {
  masterId?: string;
  isEnabled?: boolean; // Flag from business settings
  onBack?: () => void;
  onServiceSelect?: (serviceId: string) => void;
  onBooking?: (masterId: string, slotId: string) => void;
}

// Mock master data
const mockMaster = {
  id: 'master-1',
  name: 'Анна Смирнова',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  specializations: ['Маникюр', 'Педикюр', 'Nail-арт'],
  bio: 'Сертифицированный мастер маникюра с опытом работы более 5 лет. Специализируюсь на современных техниках nail-арта и уходовых процедурах.',
  rating: 4.9,
  reviewCount: 89,
  serviceIds: ['1', '2', '3'], // IDs of services this master provides
  availableSlots: [
    { id: 'slot-1', date: new Date().toISOString(), time: '14:00', available: true },
    { id: 'slot-2', date: new Date().toISOString(), time: '16:00', available: true },
    { id: 'slot-3', date: new Date().toISOString(), time: '18:00', available: true },
    { id: 'slot-4', date: new Date(Date.now() + 86400000).toISOString(), time: '10:00', available: true },
    { id: 'slot-5', date: new Date(Date.now() + 86400000).toISOString(), time: '12:00', available: true },
    { id: 'slot-6', date: new Date(Date.now() + 86400000).toISOString(), time: '15:00', available: true },
    { id: 'slot-7', date: new Date(Date.now() + 172800000).toISOString(), time: '11:00', available: true },
  ],
};

export function MasterScreen({ 
  masterId,
  isEnabled = true,
  onBack,
  onServiceSelect,
  onBooking,
}: MasterScreenProps) {
  const { hapticFeedback } = useTelegram();
  const { services: allServices } = useResources();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Filter services for this master
  const masterServices = allServices.filter(
    service => mockMaster.serviceIds.includes(service.id) && service.isActive
  );

  const handleBack = () => {
    hapticFeedback?.light();
    onBack?.();
  };

  const handleSlotClick = (slotId: string) => {
    hapticFeedback?.light();
    setSelectedSlot(slotId);
  };

  const handleBookClick = () => {
    hapticFeedback?.medium();
    if (selectedSlot) {
      onBooking?.(mockMaster.id, selectedSlot);
    } else {
      // If no slot selected, just navigate to booking flow
      onServiceSelect?.(masterServices[0]?.id || '');
    }
  };

  const handleServiceClick = (serviceId: string) => {
    hapticFeedback?.light();
    onServiceSelect?.(serviceId);
  };

  // Stub state when feature is disabled
  if (!isEnabled) {
    return (
      <div className="min-h-screen page-background">
        <div className="ambient-ellipse-c" />
        <div className="noise-overlay" />
        
        <div className="relative z-10 h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg">О мастере</h1>
          </div>

          {/* Stub Content */}
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="clean-card max-w-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg mb-2">Страница недоступна</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Эта страница отключена в настройках вашего бизнеса
                </p>
                <Button variant="outline" onClick={handleBack} className="w-full">
                  Вернуться назад
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="min-h-screen page-background">
      <div className="ambient-ellipse-c" />
      <div className="noise-overlay" />
      
      <div className="relative z-10 min-h-screen pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg">О мастере</h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Master Header */}
          <MasterHeader
            name={mockMaster.name}
            avatar={mockMaster.avatar}
            specializations={mockMaster.specializations}
            bio={mockMaster.bio}
            rating={mockMaster.rating}
            reviewCount={mockMaster.reviewCount}
            onBookClick={handleBookClick}
          />

          {/* Available Slots */}
          <MasterAvailability
            slots={mockMaster.availableSlots}
            onSlotClick={handleSlotClick}
            selectedSlot={selectedSlot || undefined}
          />

          {/* Master Services */}
          <div className="space-y-3">
            <h2 className="text-lg">Услуги мастера</h2>
            <div className="space-y-2">
              {masterServices.map((service) => (
                <Card 
                  key={service.id}
                  className="clean-card hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleServiceClick(service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 line-clamp-1">{service.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration} мин</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold whitespace-nowrap">
                          ₽{service.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
