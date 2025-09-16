import React, { useState, useMemo } from 'react';
import { Search, Settings, CalendarDays } from 'lucide-react';
import { Input } from './ui/input';
import { FilterChips, timeFilters, priceFilters } from './ui/filter-chips';
import { ServiceList } from './ui/service-card';
import { ServiceCatalogSkeleton } from './ui/skeleton';
import { useResources, Service } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';

// Extended service interface with booking data
interface ExtendedService extends Service {
  rating?: number;
  isHit?: boolean;
  discount?: number;
  nextSlots?: Array<{
    id: string;
    time: string;
    available: boolean;
  }>;
}

// Mock next slots data
const mockSlots = {
  '1': [
    { id: '1-1', time: '14:30', available: true },
    { id: '1-2', time: '16:00', available: true },
    { id: '1-3', time: '17:30', available: false },
    { id: '1-4', time: '19:00', available: true },
  ],
  '2': [
    { id: '2-1', time: '15:00', available: true },
    { id: '2-2', time: '16:30', available: true },
    { id: '2-3', time: '18:00', available: false },
  ],
  '3': [
    { id: '3-1', time: '13:00', available: true },
    { id: '3-2', time: '15:30', available: true },
    { id: '3-3', time: '17:00', available: true },
    { id: '3-4', time: '18:30', available: false },
  ],
  '4': [], // No available slots today
};

export function ServiceCatalog() {
  const { services } = useResources();
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Transform services to extended format
  const extendedServices: ExtendedService[] = useMemo(() => {
    return services.map(service => ({
      ...service,
      rating: 4.5 + Math.random() * 0.5, // Mock rating
      isHit: Math.random() > 0.7, // 30% chance to be hit
      discount: Math.random() > 0.8 ? Math.floor(Math.random() * 20 + 10) : undefined, // 20% chance for discount
      nextSlots: mockSlots[service.id as keyof typeof mockSlots] || mockSlots['1'],
    }));
  }, [services]);

  // Filter logic
  const filteredServices = useMemo(() => {
    let filtered = extendedServices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Active filters
    activeFilters.forEach(filterId => {
      switch (filterId) {
        case 'today':
          filtered = filtered.filter(service => 
            service.nextSlots && service.nextSlots.some(slot => slot.available)
          );
          break;
        case 'tomorrow':
          // Mock: all services available tomorrow
          break;
        case 'quick':
          filtered = filtered.filter(service => service.duration <= 60);
          break;
        case 'budget':
          filtered = filtered.filter(service => service.price <= 2000);
          break;
        case 'medium':
          filtered = filtered.filter(service => service.price > 2000 && service.price <= 5000);
          break;
        case 'premium':
          filtered = filtered.filter(service => service.price > 5000);
          break;
      }
    });

    return filtered;
  }, [extendedServices, searchTerm, activeFilters]);

  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filterId)) {
        newFilters.delete(filterId);
      } else {
        newFilters.add(filterId);
      }
      return newFilters;
    });
  };

  const handleServiceBook = (serviceId: string, slotId?: string) => {
    hapticFeedback.success();
    
    if (slotId) {
      // Direct booking with selected slot
      console.log('Booking service', serviceId, 'at slot', slotId);
      // Navigate to booking confirmation
    } else {
      // Navigate to booking calendar for this service
      console.log('Navigate to booking calendar for service', serviceId);
    }
  };

  const handleSlotSelect = (serviceId: string, slotId: string) => {
    setSelectedSlots(prev => ({
      ...prev,
      [serviceId]: prev[serviceId] === slotId ? '' : slotId
    }));
  };

  // Set up filters with current data
  const currentTimeFilters = timeFilters.map(filter => ({
    ...filter,
    active: activeFilters.has(filter.id),
    count: filter.id === 'today' ? 
      extendedServices.filter(s => s.nextSlots && s.nextSlots.some(slot => slot.available)).length :
      filter.id === 'quick' ?
      extendedServices.filter(s => s.duration <= 60).length :
      undefined
  }));

  const currentPriceFilters = priceFilters.map(filter => ({
    ...filter,
    active: activeFilters.has(filter.id),
    count: filter.id === 'budget' ?
      extendedServices.filter(s => s.price <= 2000).length :
      filter.id === 'medium' ?
      extendedServices.filter(s => s.price > 2000 && s.price <= 5000).length :
      filter.id === 'premium' ?
      extendedServices.filter(s => s.price > 5000).length :
      0
  }));

  if (isLoading) {
    return <ServiceCatalogSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск услуг, мастеров, категорий..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
        {searchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <button 
              onClick={() => setSearchTerm('')}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Time Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Когда записаться:</h4>
        <FilterChips
          filters={currentTimeFilters}
          onFilterToggle={handleFilterToggle}
        />
      </div>

      {/* Price Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Цена:</h4>
        <FilterChips
          filters={currentPriceFilters}
          onFilterToggle={handleFilterToggle}
          showFilterButton
          onFilterMenuOpen={() => {
            hapticFeedback.medium();
            // Open advanced filters sheet
          }}
        />
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredServices.length === extendedServices.length 
            ? `${filteredServices.length} услуг` 
            : `${filteredServices.length} из ${extendedServices.length} услуг`
          }
        </p>
        
        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Ничего не найдено</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm 
              ? `По запросу "${searchTerm}" услуг не найдено`
              : 'Попробуйте изменить фильтры'
            }
          </p>
          {activeFilters.size > 0 && (
            <button
              onClick={() => setActiveFilters(new Set())}
              className="text-sm text-primary hover:text-primary/80"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Services List */}
      {filteredServices.length > 0 && (
        <ServiceList
          services={filteredServices}
          onBook={handleServiceBook}
          onSlotSelect={handleSlotSelect}
          selectedSlots={selectedSlots}
        />
      )}
    </div>
  );
}