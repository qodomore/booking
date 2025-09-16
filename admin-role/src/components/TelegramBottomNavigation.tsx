import React from 'react';
import { Calendar, Users, Settings, Grid3X3, Mail } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

interface TelegramBottomNavigationProps {
  items: NavigationItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

const mainNavItems = [
  { id: 'calendar', label: 'Календарь', icon: Calendar },
  { id: 'resources', label: 'Ресурсы', icon: Users },
  { id: 'services', label: 'Услуги', icon: Grid3X3 },
  { id: 'marketing', label: 'Маркетинг', icon: Mail },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export function TelegramBottomNavigation({ activeItem, onItemClick }: Omit<TelegramBottomNavigationProps, 'items'>) {
  const { hapticFeedback, safeAreaHeight, viewportStableHeight } = useTelegram();

  const handleItemClick = (itemId: string) => {
    if (hapticFeedback?.light) {
      hapticFeedback.light();
    }
    onItemClick(itemId);
  };

  // Добавляем отступ для безопасной зоны внизу
  const bottomPadding = Math.max(0, viewportStableHeight - safeAreaHeight);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/20 z-50 shadow-elegant"
      style={{
        paddingBottom: `${bottomPadding}px`,
      }}
    >
      {/* Telegram Safe Area визуальный индикатор */}
      {bottomPadding > 0 && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-background"
          style={{ height: `${bottomPadding}px` }}
        />
      )}
      
      <div className="grid grid-cols-5 items-center px-1 py-2">
        {mainNavItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1 rounded-md transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/15 shadow-sm' 
                  : 'hover:bg-muted/30'
              }`}>
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
              </div>
              <span className={`text-xs mt-0.5 leading-none ${
                isActive ? 'font-semibold text-primary' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}