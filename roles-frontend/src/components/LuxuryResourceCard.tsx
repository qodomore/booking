import React from 'react';
import { User, MapPin, Wrench, Edit, Trash2, Star, X, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Resource, useResources } from '../contexts/ResourceContext';

interface LuxuryResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

export function LuxuryResourceCard({ resource, onEdit, onDelete }: LuxuryResourceCardProps) {
  const { getServicesByIds } = useResources();
  
  const getIcon = () => {
    switch (resource.type) {
      case 'specialist': return User;
      case 'slot': return MapPin;
      case 'equipment': return Wrench;
    }
  };
  
  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-500/5 border-green-500/10';
      case 'inactive': return 'text-gray-600 bg-gray-500/5 border-gray-500/10';
      case 'busy': return 'text-orange-600 bg-orange-500/5 border-orange-500/10';
      case 'vacation': return 'text-blue-600 bg-blue-500/5 border-blue-500/10';
      default: return 'text-gray-600 bg-gray-500/5 border-gray-500/10';
    }
  };
  
  const getStatusText = (status: Resource['status']) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'busy': return 'Занят';
      case 'vacation': return 'В отпуске';
      default: return 'Неизвестно';
    }
  };
  
  const getStatusDot = (status: Resource['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'busy': return 'bg-orange-500';
      case 'vacation': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const Icon = getIcon();
  const services = resource.serviceIds ? getServicesByIds(resource.serviceIds) : [];
  
  return (
    <Card className="glass-card hover:scale-[1.01] transition-all duration-300 animate-elegant-fade-in group border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/15 to-primary/8 rounded-xl flex items-center justify-center shadow-elegant border border-primary/15">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:gradient-text-elegant transition-all duration-300">
                {resource.name}
              </h3>
              <p className="text-xs text-muted-foreground capitalize font-medium">
                {resource.type === 'specialist' ? 'Специалист' : 
                 resource.type === 'slot' ? 'Слот' : 'Оборудование'}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 focus-elegant rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={() => onEdit(resource)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 focus-elegant rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={() => onDelete(resource.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Contact info for specialists */}
        {resource.type === 'specialist' && (resource.phone || resource.email) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Контакты</p>
            </div>
            <div className="space-y-1">
              {resource.phone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{resource.phone}</span>
                </div>
              )}
              {resource.email && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{resource.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services for specialists */}
        {resource.type === 'specialist' && services.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Услуги</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {services.map((service) => (
                <Badge 
                  key={service.id} 
                  variant="secondary" 
                  className="text-xs elegant-tag px-2.5 py-1"
                >
                  {service.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills for specialists (legacy support) */}
        {resource.skills && resource.skills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Навыки</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {resource.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs elegant-tag px-2.5 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {resource.capacity && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-xs text-muted-foreground">Вместимость</p>
            <span className="text-sm font-semibold text-foreground">{resource.capacity}</span>
          </div>
        )}
        
        <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(resource.status)}`}>
          <p className="text-xs text-muted-foreground">Статус</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusDot(resource.status)} ${resource.status === 'active' ? 'animate-pulse' : ''}`}></div>
            <span className="text-xs font-medium">{getStatusText(resource.status)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}