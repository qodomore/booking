import React from "react";
import { Switch } from "./switch";
import { Label } from "./label";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Phone, 
  Settings, 
  Clock, 
  User, 
  Heart,
  Volume2,
  VolumeX
} from "lucide-react";

interface PreferencesSwitchRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function PreferencesSwitchRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  icon: Icon,
  disabled = false,
  variant = 'default',
  className = ''
}: PreferencesSwitchRowProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between py-2 ${className}`}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <Label htmlFor={id} className="text-sm cursor-pointer">
            {label}
          </Label>
        </div>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-4 border rounded-lg space-y-3 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            )}
            <div>
              <Label htmlFor={id} className="font-medium cursor-pointer">
                {label}
              </Label>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <div>
          <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}

// Группа настроек уведомлений
interface NotificationPreferencesProps {
  preferences: {
    marketingConsent: boolean;
    quietNotifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    telegramNotifications: boolean;
    whatsappNotifications: boolean;
  };
  onPreferenceChange: (key: string, value: boolean) => void;
  businessType?: 'beauty' | 'fitness' | 'auto' | 'education';
}

export function NotificationPreferences({
  preferences,
  onPreferenceChange,
  businessType = 'beauty'
}: NotificationPreferencesProps) {
  const getLabels = () => {
    switch (businessType) {
      case 'beauty':
        return {
          marketing: 'Акции и новые процедуры',
          quiet: 'Тихие напоминания о записи'
        };
      case 'fitness':
        return {
          marketing: 'Новые программы и акции',
          quiet: 'Тихие напоминания о тренировках'
        };
      case 'auto':
        return {
          marketing: 'Сезонные акции и услуги',
          quiet: 'Тихие напоминания о ТО'
        };
      case 'education':
        return {
          marketing: 'Новые курсы и программы',
          quiet: 'Тихие напоминания о занятиях'
        };
      default:
        return {
          marketing: 'Маркетинг-сообщения',
          quiet: 'Тихие уведомления'
        };
    }
  };

  const labels = getLabels();

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Настройки уведомлений
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Marketing Consent */}
        <PreferencesSwitchRow
          id="marketing-consent"
          label={labels.marketing}
          description="Получать информацию о скидках и новинках"
          checked={preferences.marketingConsent}
          onCheckedChange={(checked) => onPreferenceChange('marketingConsent', checked)}
          icon={MessageSquare}
        />
        
        {/* Quiet Notifications */}
        <PreferencesSwitchRow
          id="quiet-notifications"
          label={labels.quiet}
          description="Отправлять без звука в рабочие часы"
          checked={preferences.quietNotifications}
          onCheckedChange={(checked) => onPreferenceChange('quietNotifications', checked)}
          icon={preferences.quietNotifications ? VolumeX : Volume2}
        />
        
        {/* Channel Preferences */}
        <div className="pt-2 border-t">
          <Label className="text-xs text-muted-foreground mb-3 block">
            Каналы уведомлений:
          </Label>
          
          <div className="space-y-2">
            <PreferencesSwitchRow
              id="telegram-notifications"
              label="Telegram"
              checked={preferences.telegramNotifications}
              onCheckedChange={(checked) => onPreferenceChange('telegramNotifications', checked)}
              icon={MessageSquare}
              variant="compact"
            />
            
            <PreferencesSwitchRow
              id="sms-notifications"
              label="SMS"
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) => onPreferenceChange('smsNotifications', checked)}
              icon={Phone}
              variant="compact"
            />
            
            <PreferencesSwitchRow
              id="email-notifications"
              label="Email"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => onPreferenceChange('emailNotifications', checked)}
              icon={Mail}
              variant="compact"
            />
            
            <PreferencesSwitchRow
              id="whatsapp-notifications"
              label="WhatsApp"
              checked={preferences.whatsappNotifications}
              onCheckedChange={(checked) => onPreferenceChange('whatsappNotifications', checked)}
              icon={MessageSquare}
              variant="compact"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Группа предпочтений клиента
interface ClientPreferencesProps {
  preferences: {
    preferredTimes: string[];
    preferredResources: string[];
    specialRequests: string[];
  };
  availableTimes: string[];
  availableResources: string[];
  onAddPreference: (type: 'time' | 'resource' | 'request', value: string) => void;
  onRemovePreference: (type: 'time' | 'resource' | 'request', value: string) => void;
}

export function ClientPreferences({
  preferences,
  availableTimes,
  availableResources,
  onAddPreference,
  onRemovePreference
}: ClientPreferencesProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Предпочтения клиента
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preferred Times */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Удобное время:</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.preferredTimes.map(time => (
              <Badge 
                key={time}
                variant="secondary" 
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => onRemovePreference('time', time)}
              >
                {time} ×
              </Badge>
            ))}
            {preferences.preferredTimes.length === 0 && (
              <span className="text-sm text-muted-foreground">Не указано</span>
            )}
          </div>
        </div>
        
        {/* Preferred Resources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Предпочитаемые мастера:</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.preferredResources.map(resource => (
              <Badge 
                key={resource}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => onRemovePreference('resource', resource)}
              >
                {resource} ×
              </Badge>
            ))}
            {preferences.preferredResources.length === 0 && (
              <span className="text-sm text-muted-foreground">Не указано</span>
            )}
          </div>
        </div>
        
        {/* Special Requests */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Особые пожелания:</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.specialRequests.map(request => (
              <Badge 
                key={request}
                variant="outline"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => onRemovePreference('request', request)}
              >
                {request} ×
              </Badge>
            ))}
            {preferences.specialRequests.length === 0 && (
              <span className="text-sm text-muted-foreground">Нет пожеланий</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}