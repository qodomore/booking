import React from 'react';
import { Menu, Moon, Sun, Settings, User } from 'lucide-react';
import { Button } from './ui/button';
import { useResources } from '../contexts/ResourceContext';

interface ModernHeaderProps {
  onMenuToggle: () => void;
  currentPageTitle?: string;
  currentPageIcon?: React.ComponentType<{ className?: string }>;
}

export function ModernHeader({ onMenuToggle, currentPageTitle = "Dashboard", currentPageIcon: Icon }: ModernHeaderProps) {
  const { darkMode, toggleDarkMode } = useResources();

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden hover:bg-muted/50 focus-elegant"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-elegant border border-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-foreground gradient-text-elegant text-lg">
                  {currentPageTitle}
                </h1>
                <p className="text-xs text-muted-foreground font-normal">
                  Система управления ресурсами
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:bg-muted/50 focus-elegant rounded-xl"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 focus-elegant rounded-xl"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center ml-2 shadow-elegant">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}