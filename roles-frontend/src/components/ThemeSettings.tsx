import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Palette, 
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useResources } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';
import { ThemeSelector } from './ThemeSelector';
import { toast } from 'sonner@2.0.3';

interface ThemeSettingsProps {
  onBack: () => void;
}

export function ThemeSettings({ onBack }: ThemeSettingsProps) {
  const { darkMode, toggleDarkMode, colorTheme, setColorTheme } = useResources();
  const { hapticFeedback, isTelegramEnvironment, user } = useTelegram();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleThemeToggle = () => {
    if (hapticFeedback) {
      hapticFeedback.medium();
    }
    toggleDarkMode();
  };

  const handleResetToDefaults = () => {
    if (hapticFeedback) {
      hapticFeedback.light();
    }
    
    // Сброс к значениям по умолчанию
    setColorTheme('blue');
    
    // Показываем уведомление
    toast.success('Настройки сброшены к значениям по умолчанию');
    
    setShowResetDialog(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Темы и оформление</h2>
            <p className="text-sm text-muted-foreground">Настройка внешнего вида приложения</p>
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <h3 className="font-medium">Темная тема</h3>
              <p className="text-sm text-muted-foreground">
                Переключить тему оформления
              </p>
            </div>
          </div>
          <Switch 
            checked={darkMode} 
            onCheckedChange={handleThemeToggle}
          />
        </div>
        
        {isTelegramEnvironment && (
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Тема автоматически синхронизируется с настройками Telegram
            </p>
          </div>
        )}
      </Card>

      {/* Color Theme Selector */}
      <Card className="p-4">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Цветовая тема</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Выберите основную цветовую схему приложения
          </p>
        </div>
        <ThemeSelector />
      </Card>

      {/* Theme Preview */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Предварительный просмотр</h3>
        
        <div className="space-y-3">
          {/* Preview Card */}
          <div className="cream-card p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Пример карточки</div>
                <div className="text-sm text-muted-foreground">Демонстрация выбранной темы</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="elegant-button">
                Основная кнопка
              </Button>
              <Button size="sm" variant="outline">
                Вторичная кнопка
              </Button>
            </div>
          </div>

          {/* Gradient Example */}
          <div className="gradient-card p-4 rounded-lg text-white">
            <div className="font-medium mb-2">Градиентная карточка</div>
            <div className="text-sm opacity-90">
              Пример использования градиентов в выбранной теме
            </div>
          </div>

          {/* Stats Example */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Записей сегодня</div>
              <div className="text-lg font-semibold">12</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Доход</div>
              <div className="text-lg font-semibold">8,450₽</div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Advanced Settings */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Дополнительные настройки</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Анимации</div>
              <div className="text-sm text-muted-foreground">Включить плавные переходы</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Эффекты размытия</div>
              <div className="text-sm text-muted-foreground">Стеклянные эффекты для карточек</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Амбиентный фон</div>
              <div className="text-sm text-muted-foreground">Динамические градиенты на фоне</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Reset to Defaults */}
      <Card className="p-4">
        <h3 className="font-medium mb-2">Сброс настроек</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Вернуть все настройки оформления к значениям по умолчанию
        </p>
        
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full"
            >
              Сбросить к значениям по умолчанию
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Сброс настроек темы</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие вернет все настройки оформления к значениям по умолчанию. 
                Текущая цветовая схема и настройки анимаций будут сброшены.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetToDefaults}>
                Сбросить настройки
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </motion.div>
  );
}