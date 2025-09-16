import React, { useContext } from 'react';
import { Home, Search, Calendar, Settings, Tag, MessageSquare } from 'lucide-react';
import { AppContext } from '../App';
import { Button } from './ui/button';

export function BottomNavigation() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { currentScreen, setCurrentScreen, language, hasUnreadMessages } = context;

  const navItems = [
    { id: 'home', icon: Home, label: language === 'ru' ? 'Главная' : 'Home' },
    { id: 'search', icon: Search, label: language === 'ru' ? 'Поиск' : 'Search' },
    { id: 'inbox', icon: MessageSquare, label: language === 'ru' ? 'Чат' : 'Chat' },
    { id: 'my-bookings', icon: Calendar, label: language === 'ru' ? 'Записи' : 'Bookings' },
    { id: 'settings', icon: Settings, label: language === 'ru' ? 'Настройки' : 'Settings' },
  ];

  // Don't show navigation on certain screens
  const hideNavScreens = ['booking-details', 'review', 'reschedule-cancel'];
  if (hideNavScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <div className="bottom-nav-fixed">
      <div className="glass-panel px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentScreen(item.id as any)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {/* Notification dot for inbox */}
                  {item.id === 'inbox' && hasUnreadMessages && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-danger-500 rounded-full" />
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}