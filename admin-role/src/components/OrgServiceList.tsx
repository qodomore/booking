import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Service } from '../contexts/ResourceContext';

interface OrgServiceListProps {
  services: Service[];
  onServiceClick: (serviceId: string) => void;
  onMasterClick?: (masterId: string) => void;
  onOrganizationClick?: () => void;
}

export function OrgServiceList({ services, onServiceClick, onMasterClick, onOrganizationClick }: OrgServiceListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Услуги</h2>
      </div>
      <div className="space-y-2">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className="clean-card hover:shadow-md transition-all cursor-pointer"
            onClick={() => onServiceClick(service.id)}
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
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold whitespace-nowrap">
                    ₽{service.price.toLocaleString()}
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
