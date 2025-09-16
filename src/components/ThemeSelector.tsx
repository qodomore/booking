import React from 'react';
import { Palette, Check } from 'lucide-react';
import { useResources, ColorTheme } from '../contexts/ResourceContext';
import { useTelegram } from '../hooks/useTelegram';

const themes = [
  {
    id: 'blue' as ColorTheme,
    name: 'Океан',
    description: 'Спокойные голубые тона',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#eff6ff'
    }
  },
  {
    id: 'pink' as ColorTheme,
    name: 'Сакура',
    description: 'Нежные розовые тона',
    colors: {
      primary: '#ff6b9d',
      secondary: '#c471ed',
      accent: '#fef5f8'
    }
  },
  {
    id: 'green' as ColorTheme,
    name: 'Природа',
    description: 'Свежие зеленые тона',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#ecfdf5'
    }
  },
  {
    id: 'orange' as ColorTheme,
    name: 'Энергия',
    description: 'Теплые оранжевые тона',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fff7ed'
    }
  },
  {
    id: 'purple' as ColorTheme,
    name: 'Элегантность',
    description: 'Роскошные фиолетовые тона',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#f5f3ff'
    }
  }
];

export function ThemeSelector() {
  const { colorTheme, setColorTheme } = useResources();
  const { hapticFeedback } = useTelegram();

  const handleThemeChange = (themeId: ColorTheme) => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    setColorTheme(themeId);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`relative p-3 rounded-xl border-2 transition-all duration-300 group ${
              colorTheme === theme.id
                ? 'border-primary bg-primary/5 shadow-elegant scale-105'
                : 'border-border hover:border-primary/30 bg-card hover:scale-102'
            }`}
            title={`${theme.name} - ${theme.description}`}
          >
            {/* Theme Color Preview Stack */}
            <div className="flex flex-col gap-1">
              <div 
                className="w-full h-4 rounded-lg border border-white/20 shadow-sm"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="w-3/4 h-3 rounded-lg border border-white/20 shadow-sm mx-auto"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div 
                className="w-1/2 h-2 rounded-lg border border-white/20 shadow-sm mx-auto"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>
            
            {/* Theme Name */}
            <p className={`text-xs mt-2 leading-none font-medium ${
              colorTheme === theme.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {theme.name}
            </p>
            
            {/* Selection Indicator */}
            {colorTheme === theme.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Current Theme Description */}
      <div className="text-center">
        <p className="text-sm font-medium">
          {themes.find(t => t.id === colorTheme)?.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {themes.find(t => t.id === colorTheme)?.description}
        </p>
      </div>
    </div>
  );
}