import React, { useContext } from 'react';
import { ArrowLeft, Phone, Mail, Globe, Clock, Star, MapPin, Users, Calendar, Share2 } from 'lucide-react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

export function BusinessProfile() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    selectedBusiness, 
    businessServices, 
    businessResources, 
    setCurrentScreen, 
    setSelectedService,
    language 
  } = context;

  if (!selectedBusiness) return null;

  const texts = {
    ru: {
      back: 'Назад',
      share: 'Поделиться',
      linkCopied: 'Ссылка скопирована',
      services: 'Услуги',
      resources: 'Ресурсы',
      workingHours: 'Часы работы',
      contact: 'Контакты',
      book: 'Записаться',
      from: 'от',
      rub: '₽',
      min: 'мин',
      reviews: 'отзывов',
      days: {
        monday: 'Понедельник',
        tuesday: 'Вторник', 
        wednesday: 'Среда',
        thursday: 'Четверг',
        friday: 'Пятница',
        saturday: 'Суббота',
        sunday: 'Воскресенье'
      },
      resourceTypes: {
        person: 'Мастер',
        room: 'Кабинет',
        equipment: 'Оборудование'
      }
    },
    en: {
      back: 'Back',
      share: 'Share',
      linkCopied: 'Link copied',
      services: 'Services',
      resources: 'Resources',
      workingHours: 'Working Hours',
      contact: 'Contact',
      book: 'Book',
      from: 'from',
      rub: '₽',
      min: 'min',
      reviews: 'reviews',
      days: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday', 
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      },
      resourceTypes: {
        person: 'Specialist',
        room: 'Room',
        equipment: 'Equipment'
      }
    }
  };

  const t = texts[language];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentScreen('service-details');
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?business_id=${selectedBusiness.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t.linkCopied);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const formatWorkingHours = (hours: any) => {
    if (hours.closed) return language === 'ru' ? 'Закрыто' : 'Closed';
    return `${hours.open} - ${hours.close}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentScreen('home')}
            className="p-1 h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="truncate">{selectedBusiness.name}</h1>
            {selectedBusiness.rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{selectedBusiness.rating}</span>
                {selectedBusiness.reviewCount && (
                  <span>({selectedBusiness.reviewCount} {t.reviews})</span>
                )}
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="p-1 h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Business Info */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 space-y-4">
            {selectedBusiness.image && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={selectedBusiness.image} 
                  alt={selectedBusiness.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h2 className="mb-2">{selectedBusiness.name}</h2>
              <p className="text-muted-foreground mb-3">{selectedBusiness.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedBusiness.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{selectedBusiness.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <div>
          <h3 className="mb-3">{t.services}</h3>
          <div className="space-y-3">
            {businessServices.map((service) => (
              <Card key={service.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="mb-1">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{service.duration} {t.min}</span>
                        </div>
                        {service.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-base">
                          {service.price.fixed ? (
                            <span>{service.price.fixed} {t.rub}</span>
                          ) : (
                            <span>{t.from} {service.price.from} {t.rub}</span>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleServiceSelect(service)}
                          className="shrink-0"
                        >
                          {t.book}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        {businessResources.length > 0 && (
          <div>
            <h3 className="mb-3">{t.resources}</h3>
            <div className="grid gap-3">
              {businessResources.map((resource) => (
                <Card key={resource.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {resource.type === 'person' ? (
                          <Users className="h-5 w-5" />
                        ) : resource.type === 'room' ? (
                          <MapPin className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm">{resource.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {t.resourceTypes[resource.type]}
                          </Badge>
                        </div>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Working Hours */}
        <div>
          <h3 className="mb-3">{t.workingHours}</h3>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                {Object.entries(selectedBusiness.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{t.days[day as keyof typeof t.days]}</span>
                    <span className={hours.closed ? 'text-muted-foreground' : ''}>
                      {formatWorkingHours(hours)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-3">{t.contact}</h3>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${selectedBusiness.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedBusiness.phone}
                </a>
              </div>
              
              {selectedBusiness.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${selectedBusiness.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedBusiness.email}
                  </a>
                </div>
              )}

              {selectedBusiness.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={selectedBusiness.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedBusiness.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}