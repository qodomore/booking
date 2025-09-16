import React from 'react';
import {
  Brain,
  Banknote,
  Gift,
  MessageSquare,
  BookOpen,
  Palette,
  Moon,
  Sun,
  Settings,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useResources } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';
import { ThemeSelector } from './ThemeSelector';

interface SettingsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const settingsGroups = [
  {
    title: 'Интеллектуальные инструменты',
    items: [
      {
        id: 'ai',
        label: 'Интеллектуальный центр',
        icon: Brain,
        description: 'Анализ данных и автоматизация',
      },
      {
        id: 'pricing',
        label: 'Автоценообразование',
        icon: Banknote,
        description: 'Динамическая настройка цен',
      },
    ]
  },
  {
    title: 'Клиенты и коммуникации',
    items: [
      {
        id: 'marketing',
        label: 'Промо-кампании',
        icon: Gift,
        description: 'Акции и специальные предложения',
      },
      {
        id: 'notifications',
        label: 'Уведомления',
        icon: Bell,
        description: 'SMS, Telegram, WhatsApp',
      },
      {
        id: 'history',
        label: 'База клиентов',
        icon: MessageSquare,
        description: 'История и аналитика',
      },
    ]
  },
  {
    title: 'Контент и предложения',
    items: [
      {
        id: 'catalog',
        label: 'Публичный каталог',
        icon: BookOpen,
        description: 'Витрина предложений',
      },
    ]
  }
];

export function SettingsBottomSheet({ isOpen, onClose, onNavigate }: SettingsBottomSheetProps) {
  const { darkMode, toggleDarkMode, colorTheme } = useResources();
  const { hapticFeedback, isTelegramEnvironment, user } = useTelegram();

  const handleItemClick = (itemId: string) => {
    hapticFeedback.light();
    onNavigate(itemId);
    onClose();
  };

  const handleThemeToggle = () => {
    hapticFeedback.medium();
    toggleDarkMode();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] max-h-[600px] rounded-t-3xl border-t border-border/20 glass-card p-0"
      >
        <SheetHeader className="p-6 border-b border-border/20">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/15 to-primary/10 rounded-xl flex items-center justify-center shadow-elegant border border-primary/15">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="gradient-text-elegant">Настройки</span>
              {isTelegramEnvironment && user && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.username ? `@${user.username}` : user.first_name}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Theme Settings */}
          <div className="p-6 border-b border-border/20">
            <h3 className="font-semibold mb-4">Внешний вид</h3>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Темная тема</p>
                  <p className="text-xs text-muted-foreground">
                    {isTelegramEnvironment ? 'Синхронизировано с Telegram' : 'Переключить тему'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={handleThemeToggle}
                disabled={isTelegramEnvironment}
              />
            </div>

            {/* Color Theme Selector */}
            <div className="flex items-center gap-3 mb-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">Цветовая тема</p>
            </div>
            <ThemeSelector />
          </div>

          {/* Settings Groups */}
          <div className="p-6 space-y-6">
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => handleItemClick(item.id)}
                        className="w-full flex items-center justify-between p-4 h-auto rounded-xl hover:bg-muted/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version Info */}
        <div className="p-6 border-t border-border/20">
          <div className="cream-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center shadow-sm">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">RMS</p>
                <p className="text-xs text-muted-foreground">v2.1.0</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Универсальная система управления бизнесом
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}