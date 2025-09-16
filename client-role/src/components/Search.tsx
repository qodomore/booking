import React, { useContext, useState } from 'react';
import { Search as SearchIcon, Filter, ArrowLeft, Star, MapPin } from 'lucide-react';
import { AppContext, Service } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SafeArea, SafeAreaSection } from './SafeArea';

interface SearchProps {
  services: Service[];
}

export function Search({ services }: SearchProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, setCurrentScreen, setSelectedService } = context;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const texts = {
    ru: {
      searchPlaceholder: 'Поиск услуг...',
      filters: 'Фильтры',
      category: 'Категория',
      duration: 'Длительность',
      price: 'Цена',
      location: 'Локация',
      all: 'Все',
      beauty: 'Красота',
      auto: 'Авто',
      fitness: 'Фитнес',
      upTo60: 'до 60 мин',
      upTo90: 'до 90 мин',
      upTo120: 'до 120 мин',
      from: 'от',
      quickly: 'быстро',
      recommended: 'рекомендуем',
      results: 'результатов',
      clear: 'Очистить'
    },
    en: {
      searchPlaceholder: 'Search services...',
      filters: 'Filters',
      category: 'Category',
      duration: 'Duration',
      price: 'Price',
      location: 'Location',
      all: 'All',
      beauty: 'Beauty',
      auto: 'Auto',
      fitness: 'Fitness',
      upTo60: 'up to 60 min',
      upTo90: 'up to 90 min',
      upTo120: 'up to 120 min',
      from: 'from',
      quickly: 'quick',
      recommended: 'recommended',
      results: 'results',
      clear: 'Clear'
    }
  };

  const t = texts[language];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentScreen('service-details');
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  // Filter services based on search and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    const matchesDuration = selectedDuration === 'all' ||
                           (selectedDuration === '60' && service.duration <= 60) ||
                           (selectedDuration === '90' && service.duration <= 90) ||
                           (selectedDuration === '120' && service.duration <= 120);

    return matchesSearch && matchesCategory && matchesDuration;
  });

  const categories = [
    { value: 'all', label: t.all },
    { value: 'beauty', label: t.beauty },
    { value: 'auto', label: t.auto },
    { value: 'fitness', label: t.fitness }
  ];

  const durations = [
    { value: 'all', label: t.all },
    { value: '60', label: t.upTo60 },
    { value: '90', label: t.upTo90 },
    { value: '120', label: t.upTo120 }
  ];

  return (
    <SafeArea noPadding className="pt-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-card border-0 w-full"
                autoFocus
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-3 pb-2">
              <div className="flex gap-2 w-full">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="flex-1 h-9">
                    <SelectValue placeholder={t.category} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="flex-1 h-9">
                    <SelectValue placeholder={t.duration} />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {filteredServices.length} {t.results}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDuration('all');
                  }}
                  className="text-xs h-7 px-2"
                >
                  {t.clear}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 space-y-4 pb-6">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className="w-full cursor-pointer hover:shadow-md transition-shadow bg-card/80 backdrop-blur-sm border-0 overflow-hidden"
            onClick={() => handleServiceSelect(service)}
          >
            <div className="p-4">
              {/* Header Row with proper layout */}
              <div className="flex items-start justify-between mb-2 gap-3">
                <h3 className="flex-1 font-medium line-clamp-2 min-w-0">{service.name}</h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{service.rating}</span>
                </div>
              </div>
              
              {/* Description with proper text wrapping */}
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 w-full">
                {service.description}
              </p>
              
              {/* Provider and Price Row */}
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1 min-w-0">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{service.provider}</span>
                </div>
                
                <span className="font-medium flex-shrink-0">
                  {service.price.fixed ? `${service.price.fixed}₽` : `${t.from} ${service.price.from}₽`}
                </span>
              </div>

              {/* Bottom Row with Tags and Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                  <Badge variant="outline" className="text-xs px-2 border-border/60 bg-card/60">
                    {service.duration} мин
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 border-border/60 bg-card/60">
                    {t.quickly}
                  </Badge>
                  {service.rating && service.rating > 4.7 && (
                    <Badge variant="outline" className="text-xs px-2 border-border/60 bg-card/60">
                      {t.recommended}
                    </Badge>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-3 flex-shrink-0 border-border/60 bg-card/60 hover:bg-primary hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceSelect(service);
                  }}
                >
                  Выбрать время
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
            <p className="text-sm text-muted-foreground">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </SafeArea>
  );
}