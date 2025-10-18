import React, { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { OrgHeader } from './OrgHeader';
import { OrgServiceList } from './OrgServiceList';
import { useResources } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';

interface OrganizationScreenProps {
  organizationId?: string;
  isEnabled?: boolean; // Flag from business settings
  onBack?: () => void;
  onServiceSelect?: (serviceId: string) => void;
}

// Mock organization data
const mockOrganization = {
  id: 'org-1',
  name: 'Студия красоты "Элеганс"',
  rating: 4.8,
  reviewCount: 127,
  description: 'Современная студия красоты с профессиональными мастерами и премиальным сервисом. Мы заботимся о вашей красоте и комфорте.',
  address: 'г. Москва, ул. Тверская, д. 15, офис 301',
  phone: '+7 (495) 123-45-67',
  email: 'info@elegance-studio.ru',
  hours: {
    mon: '09:00 - 21:00',
    tue: '09:00 - 21:00',
    wed: '09:00 - 21:00',
    thu: '09:00 - 21:00',
    fri: '09:00 - 21:00',
    sat: '10:00 - 20:00',
    sun: '10:00 - 18:00',
  },
  images: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=450&fit=crop',
  ],
};

export function OrganizationScreen({ 
  organizationId,
  isEnabled = true,
  onBack,
  onServiceSelect,
}: OrganizationScreenProps) {
  const { services, hapticFeedback } = useTelegram();
  const { services: allServices } = useResources();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleBack = () => {
    hapticFeedback?.light();
    onBack?.();
  };

  const handleServiceClick = (serviceId: string) => {
    hapticFeedback?.light();
    setSelectedService(serviceId);
    onServiceSelect?.(serviceId);
  };

  const handleBookClick = () => {
    hapticFeedback?.medium();
    // Navigate to service selection flow
    onServiceSelect?.(allServices[0]?.id || '');
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
            <h1 className="text-lg">Об организации</h1>
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
          <h1 className="text-lg">Об организации</h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Organization Header */}
          <OrgHeader
            name={mockOrganization.name}
            rating={mockOrganization.rating}
            reviewCount={mockOrganization.reviewCount}
            description={mockOrganization.description}
            address={mockOrganization.address}
            phone={mockOrganization.phone}
            email={mockOrganization.email}
            hours={mockOrganization.hours}
            images={mockOrganization.images}
            onBookClick={handleBookClick}
          />

          {/* Services List */}
          <OrgServiceList
            services={allServices.filter(s => s.isActive)}
            onServiceClick={handleServiceClick}
          />
        </div>
      </div>
    </div>
  );
}
