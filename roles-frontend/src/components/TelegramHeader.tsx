import React from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useResources } from '../contexts/ResourceContext';

interface TelegramHeaderProps {
  currentPageTitle?: string;
  currentPageIcon?: React.ComponentType<any>;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function TelegramHeader({ 
  currentPageTitle = 'RMS', 
  currentPageIcon: Icon,
  showBackButton = false,
  onBack
}: TelegramHeaderProps) {
  const { user, isTelegramEnvironment, hapticFeedback } = useTelegram();
  const { colorTheme } = useResources();

  // Получаем имя пользователя из Telegram
  const getUserName = () => {
    if (user) {
      return user.first_name + (user.last_name ? ` ${user.last_name}` : '');
    }
    return 'Администратор';
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  return (
    <header className="sticky top-0 glass-card border-b border-border/20 z-40 shadow-elegant">
      {/* Telegram Safe Area Top */}
      <div className="h-safe-area-top bg-transparent" />
      
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-gradient-to-br from-primary/15 to-primary/10 rounded-xl flex items-center justify-center shadow-elegant border border-primary/15">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <h1 className="gradient-text-elegant font-semibold">
                {currentPageTitle}
              </h1>
              {isTelegramEnvironment && (
                <p className="text-xs text-muted-foreground">
                  {getUserGreeting()}, {getUserName()}
                </p>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt={getUserName()}
                className="w-8 h-8 rounded-full border-2 border-primary/20"
              />
            ) : (
              <div className="w-8 h-8 hero-gradient rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {getUserName().charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}