import React from 'react';
import { Clock, ChevronRight, Building2, UserCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Service } from '../contexts/ResourceContext';

interface ClientServiceCardProps {
  service: Service;
  onServiceClick: (serviceId: string) => void;
  onMasterClick?: () => void;
  onOrganizationClick?: () => void;
  showNavigationLinks?: boolean;
}

export function ClientServiceCard({ 
  service, 
  onServiceClick, 
  onMasterClick, 
  onOrganizationClick,
  showNavigationLinks = true
}: ClientServiceCardProps) {
  return (
    <Card 
      className="clean-card hover:shadow-md transition-all"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
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

        {/* Navigation Links */}
        {showNavigationLinks && (
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            {onMasterClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMasterClick();
                }}
                className="flex-1 h-auto py-2 px-3 justify-start"
              >
                <UserCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">О мастере</span>
              </Button>
            )}
            {onOrganizationClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOrganizationClick();
                }}
                className="flex-1 h-auto py-2 px-3 justify-start"
              >
                <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Об организации</span>
              </Button>
            )}
          </div>
        )}

        {/* Book Button */}
        <Button 
          className="w-full mt-3 elegant-button" 
          onClick={() => onServiceClick(service.id)}
        >
          Записаться
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
