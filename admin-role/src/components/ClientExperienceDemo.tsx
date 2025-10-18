import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ClientServiceCard } from './ClientServiceCard';
import { OrganizationScreen } from './OrganizationScreen';
import { MasterScreen } from './MasterScreen';
import { useResources } from '../contexts/ResourceContext';

interface ClientExperienceDemoProps {
  onBack?: () => void;
}

export function ClientExperienceDemo({ onBack }: ClientExperienceDemoProps) {
  const { services } = useResources();
  const [currentView, setCurrentView] = useState<'catalog' | 'organization' | 'master'>('catalog');

  const activeServices = services.filter(s => s.isActive).slice(0, 3);

  const handleBack = () => {
    if (currentView === 'catalog') {
      onBack?.();
    } else {
      setCurrentView('catalog');
    }
  };

  // Catalog view
  if (currentView === 'catalog') {
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
            <h1 className="text-lg">Каталог услуг</h1>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="mb-4">
              <h2 className="text-xl mb-2">Выберите услугу</h2>
              <p className="text-sm text-muted-foreground">
                Нажмите на ссылки "О мастере" или "Об организации" для навигации
              </p>
            </div>

            {activeServices.map((service) => (
              <ClientServiceCard
                key={service.id}
                service={service}
                onServiceClick={(serviceId) => {
                  console.log('Booking service:', serviceId);
                }}
                onMasterClick={() => setCurrentView('master')}
                onOrganizationClick={() => setCurrentView('organization')}
                showNavigationLinks={true}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Organization view
  if (currentView === 'organization') {
    return (
      <OrganizationScreen
        isEnabled={true}
        onBack={handleBack}
        onServiceSelect={(serviceId) => {
          console.log('Service selected:', serviceId);
        }}
      />
    );
  }

  // Master view
  if (currentView === 'master') {
    return (
      <MasterScreen
        isEnabled={true}
        onBack={handleBack}
        onServiceSelect={(serviceId) => {
          console.log('Service selected:', serviceId);
        }}
        onBooking={(masterId, slotId) => {
          console.log('Booking:', masterId, slotId);
        }}
      />
    );
  }

  return null;
}
