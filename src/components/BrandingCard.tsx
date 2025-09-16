import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  Palette, 
  Moon, 
  Sun, 
  RotateCcw, 
  Save,
  Lock,
  Crown,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface BrandingCardProps {
  locale?: 'ru' | 'en';
  isAdmin?: boolean;
  plan?: 'free' | 'pro';
  theme?: 'blue' | 'pink' | 'green' | 'orange' | 'purple';
  onBrandingChange?: (branding: BrandingSettings) => void;
}

interface BrandingSettings {
  brandLogo?: string;
  accentColor: string;
  theme: 'light' | 'dark';
}

const texts = {
  ru: {
    title: 'Брендирование',
    description: 'Настройте логотип и цветовую схему',
    logoUpload: 'Загрузить логотип',
    logoHint: 'PNG/JPG, до 2МБ, рекомендуем 200×200px',
    accentColor: 'Акцентный цвет',
    preview: 'Предварительный просмотр',
    lightTheme: 'Светлая тема',
    darkTheme: 'Тёмная тема',
    save: 'Сохранить',
    reset: 'Сбросить',
    saved: 'Настройки брендирования сохранены',
    resetConfirm: 'Сбросить настройки брендирования к значениям по умолчанию?',
    resetSuccess: 'Настройки сброшены к значениям по умолчанию',
    lockedTitle: 'Только в Pro',
    lockedDescription: 'Брендирование доступно в тарифе Pro',
    upgrade: 'Обновить до Pro',
    removeImage: 'Удалить изображение',
    squareFormat: 'Квадратный',
    roundFormat: 'Круглый'
  },
  en: {
    title: 'Branding',
    description: 'Customize your logo and color scheme',
    logoUpload: 'Upload Logo',
    logoHint: 'PNG/JPG, up to 2MB, recommended 200×200px',
    accentColor: 'Accent Color',
    preview: 'Preview',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    save: 'Save',
    reset: 'Reset',
    saved: 'Branding settings saved',
    resetConfirm: 'Reset branding settings to default values?',
    resetSuccess: 'Settings reset to default',
    lockedTitle: 'Pro Only',
    lockedDescription: 'Branding is available in Pro plan',
    upgrade: 'Upgrade to Pro',
    removeImage: 'Remove Image',
    squareFormat: 'Square',
    roundFormat: 'Round'
  }
};

const accentColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Pink', value: '#ff6b9d' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Indigo', value: '#6366f1' }
];

export function BrandingCard({ 
  locale = 'ru', 
  isAdmin = true, 
  plan = 'free',
  theme = 'blue',
  onBrandingChange 
}: BrandingCardProps) {
  const t = texts[locale];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [branding, setBranding] = useState<BrandingSettings>({
    brandLogo: undefined,
    accentColor: '#3b82f6',
    theme: 'light'
  });
  
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [logoFormat, setLogoFormat] = useState<'square' | 'round'>('round');
  const [hasChanges, setHasChanges] = useState(false);
  
  const isLocked = isAdmin && plan !== 'pro';

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(locale === 'ru' ? 'Файл слишком большой (максимум 2МБ)' : 'File too large (max 2MB)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBranding(prev => ({ ...prev, brandLogo: result }));
        setHasChanges(true);
        onBrandingChange?.({ ...branding, brandLogo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccentColorChange = (color: string) => {
    if (isLocked) return;
    
    setBranding(prev => ({ ...prev, accentColor: color }));
    setHasChanges(true);
    onBrandingChange?.({ ...branding, accentColor: color });
  };

  const handleSave = () => {
    if (isLocked) return;
    
    toast.success(t.saved);
    setHasChanges(false);
  };

  const handleReset = () => {
    if (isLocked) return;
    
    if (window.confirm(t.resetConfirm)) {
      const defaultBranding: BrandingSettings = {
        brandLogo: undefined,
        accentColor: '#3b82f6',
        theme: 'light'
      };
      setBranding(defaultBranding);
      setHasChanges(false);
      onBrandingChange?.(defaultBranding);
      toast.success(t.resetSuccess);
    }
  };

  const handleRemoveLogo = () => {
    if (isLocked) return;
    
    setBranding(prev => ({ ...prev, brandLogo: undefined }));
    setHasChanges(true);
    onBrandingChange?.({ ...branding, brandLogo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const HeaderPreview = ({ isDark }: { isDark: boolean }) => {
    const bgColor = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const borderColor = isDark ? '#334155' : '#e2e8f0';
    
    return (
      <div 
        className="w-full p-3 rounded-lg border"
        style={{ 
          backgroundColor: bgColor, 
          borderColor: borderColor,
          color: textColor
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding.brandLogo ? (
              <div 
                className={`w-8 h-8 bg-cover bg-center border ${logoFormat === 'round' ? 'rounded-full' : 'rounded-md'}`}
                style={{ 
                  backgroundImage: `url(${branding.brandLogo})`,
                  borderColor: borderColor
                }}
              />
            ) : (
              <div 
                className={`w-8 h-8 flex items-center justify-center ${logoFormat === 'round' ? 'rounded-full' : 'rounded-md'}`}
                style={{ 
                  backgroundColor: `${branding.accentColor}20`,
                  border: `1px solid ${branding.accentColor}40`
                }}
              >
                <ImageIcon className="w-4 h-4" style={{ color: branding.accentColor }} />
              </div>
            )}
            <span className="text-sm font-medium">Управление бизнесом</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 text-xs rounded-md transition-colors"
              style={{ 
                backgroundColor: branding.accentColor,
                color: '#ffffff'
              }}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLocked) {
    return (
      <Card className="p-4 opacity-60 relative">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Lock className="w-6 h-6 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{t.lockedTitle}</p>
              <p className="text-xs text-muted-foreground">{t.lockedDescription}</p>
            </div>
            <Button size="sm" className="elegant-button">
              <Crown className="w-3 h-3 mr-1" />
              {t.upgrade}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t.title}</h3>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
          <Palette className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{t.title}</h3>
          <p className="text-xs text-muted-foreground">{t.description}</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Logo Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t.logoUpload}</Label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLogoFormat('square')}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  logoFormat === 'square' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t.squareFormat}
              </button>
              <button
                type="button"
                onClick={() => setLogoFormat('round')}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  logoFormat === 'round' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t.roundFormat}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              {branding.brandLogo ? (
                <div className="relative group">
                  <div 
                    className={`w-16 h-16 bg-cover bg-center border-2 border-border ${logoFormat === 'round' ? 'rounded-full' : 'rounded-lg'}`}
                    style={{ backgroundImage: `url(${branding.brandLogo})` }}
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div 
                  className={`w-16 h-16 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${logoFormat === 'round' ? 'rounded-full' : 'rounded-lg'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-3 h-3 mr-2" />
                {branding.brandLogo ? 'Изменить' : t.logoUpload}
              </Button>
              <p className="text-xs text-muted-foreground">{t.logoHint}</p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Accent Color Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t.accentColor}</Label>
          <div className="grid grid-cols-4 gap-2">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentColorChange(color.value)}
                className={`w-full h-10 rounded-lg border-2 transition-all ${
                  branding.accentColor === color.value
                    ? 'border-foreground scale-95'
                    : 'border-border hover:scale-95'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t.preview}</Label>
            <div className="flex items-center gap-2">
              <Sun className={`w-4 h-4 ${previewTheme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Switch
                checked={previewTheme === 'dark'}
                onCheckedChange={(checked) => setPreviewTheme(checked ? 'dark' : 'light')}
              />
              <Moon className={`w-4 h-4 ${previewTheme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg">
            <HeaderPreview isDark={previewTheme === 'dark'} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            {t.reset}
          </Button>
          
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
            className="elegant-button"
          >
            <Save className="w-3 h-3 mr-2" />
            {t.save}
          </Button>
        </div>
      </div>
    </Card>
  );
}