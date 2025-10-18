import React, { useState } from 'react';
import { Check, ChevronDown, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

export interface Master {
  id: string;
  name: string;
  avatar?: string;
  skillBadge?: string;
  availableSlots?: number;
}

interface MasterPickerProps {
  masters: Master[];
  selectedMaster: Master | null;
  onSelectMaster: (master: Master | null) => void;
  language: 'ru' | 'en';
  isLoading?: boolean;
}

export function MasterPicker({
  masters,
  selectedMaster,
  onSelectMaster,
  language,
  isLoading = false,
}: MasterPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const texts = {
    ru: {
      master: 'Мастер',
      anyMaster: 'Любой мастер',
      search: 'Поиск мастера...',
      slots: 'слотов',
    },
    en: {
      master: 'Master',
      anyMaster: 'Any master',
      search: 'Search master...',
      slots: 'slots',
    },
  };

  const t = texts[language];

  const filteredMasters = masters.filter((master) =>
    master.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (master: Master | null) => {
    onSelectMaster(master);
    setOpen(false);
    setSearchQuery('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="px-4 mb-4">
      <label className="block text-sm font-medium mb-2">{t.master}</label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto py-3 px-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90"
            disabled={isLoading}
          >
            {selectedMaster ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedMaster.avatar} alt={selectedMaster.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(selectedMaster.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedMaster.name}</span>
                  {selectedMaster.skillBadge && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedMaster.skillBadge}
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{t.anyMaster}</span>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {/* Any Master Option */}
            <div
              className="relative flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSelect(null)}
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t.anyMaster}</div>
              </div>
              {!selectedMaster && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>

            {/* Separator */}
            <div className="h-px bg-border/50 my-1" />

            {/* Masters List */}
            {filteredMasters.length === 0 && !searchQuery && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {language === 'ru' ? 'Нет доступных мастеров' : 'No masters available'}
              </div>
            )}
            
            {filteredMasters.map((master) => (
              <div
                key={master.id}
                className="relative flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSelect(master)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={master.avatar} alt={master.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(master.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium truncate">{master.name}</span>
                    {master.skillBadge && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {master.skillBadge}
                      </Badge>
                    )}
                  </div>
                  {master.availableSlots !== undefined && (
                    <div className="text-xs text-muted-foreground">
                      {master.availableSlots} {t.slots}
                    </div>
                  )}
                </div>
                {selectedMaster?.id === master.id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
            ))}

            {filteredMasters.length === 0 && searchQuery && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {language === 'ru' ? 'Мастер не найден' : 'No master found'}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
