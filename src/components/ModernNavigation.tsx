import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ModernNavigationProps {
  items: NavigationItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

export function ModernNavigation({ items, activeItem, onItemClick }: ModernNavigationProps) {
  return (
    <nav className="flex items-center justify-around px-3 py-4">
      {items.slice(0, 5).map((item) => {
        const isActive = activeItem === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-b from-primary/20 to-primary/10 text-primary shadow-premium border border-primary/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-all duration-300 ${
              isActive 
                ? 'bg-primary/10 shadow-sm' 
                : 'group-hover:bg-muted/50'
            }`}>
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
            </div>
            <span className={`text-xs font-medium truncate max-w-[60px] ${
              isActive ? 'font-semibold' : ''
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}