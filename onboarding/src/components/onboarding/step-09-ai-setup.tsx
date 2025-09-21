import { useState } from 'react';
import { 
  Brain, 
  MessageSquare, 
  DollarSign, 
  Send, 
  Lock, 
  Sparkles, 
  Users, 
  BarChart3,
  Settings,
  Crown,
  Zap
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

interface AISetupStepProps {
  locale?: 'RU' | 'EN';
  subscriptionActive?: boolean;
}

const translations = {
  RU: {
    title: 'Интеллектуальные функции',
    subtitle: 'Настройте AI-возможности для автоматизации и роста бизнеса',
    subscriptionRequired: 'Требуется подписка "Маркетинг + AI"',
    subscriptionRequiredDescription: 'Для доступа к AI-функциям необходимо активировать подписку',
    activateSubscription: 'Активировать подписку',
    
    // AI Retention
    retentionTitle: 'AI-удержание клиентов',
    retentionDescription: 'Умная система возврата клиентов с персонализированными сообщениями',
    retentionEnabled: 'Включить AI-удержание',
    retentionIntensity: 'Интенсивность',
    retentionStandard: 'Стандарт',
    retentionAggressive: 'Агрессивно',
    retentionPreview: 'Привет! 👋 Заметили, что вы давно не были у нас. Хотели бы предложить скидку 15% на вашу любимую услугу "Стрижка". Запишетесь?',
    retentionQuota: 'До 50 сообщений в месяц',
    
    // AI Copywriter
    copywriterTitle: 'AI-копирайтер',
    copywriterDescription: 'Автоматическое создание постов для социальных сетей',
    copywriterQuota: 'До 5 постов в месяц',
    generateExample: 'Сгенерировать пример',
    copywriterTone: 'Тон сообщений',
    toneFriendly: 'Дружелюбный',
    toneProfessional: 'Профессиональный',
    toneBold: 'Смелый',
    examplePost: '✨ Новая неделя — время позаботиться о себе! \n\nЗапишитесь на стрижку к нашим мастерам и получите идеальный образ для новых свершений. \n\n📅 Свободные места есть уже завтра!\n#красота #стрижка #салон',
    
    // Smart Pricing
    smartPricingTitle: 'Смарт-цены',
    smartPricingDescription: 'Динамическое ценообразование на основе загрузки и спроса',
    smartPricingEnabled: 'Включить рекомендации цен',
    priceChangeLimit: 'Предел изменения цены',
    requireApproval: 'Требовать подтверждение мастером',
    
    // Silent Campaigns
    campaignsTitle: 'Тихие рассылки',
    campaignsDescription: 'Ненавязчивые напоминания и предложения клиентам',
    campaignsQuota: 'До 500 сообщений в месяц',
    setupSegments: 'Настроить сегменты',
    
    // Settings
    saveSettings: 'Сохранить настройки',
    resetSettings: 'Сбросить к умолчаниям',
    
    // AI Preview examples
    aiExamples: {
      retention: 'Привет, Анна! 🌟 Соскучились по вас в нашем салоне. Как насчет освежить стрижку? Подарим скидку 20% на любую услугу до конца недели!',
      copywriter: '💫 Время для перемен!\n\nНовый сезон — новый образ! Наши стилисты создадут для вас идеальную стрижку, которая подчеркнет вашу индивидуальность.\n\n📞 Запись по телефону или в боте\n#стиль #красота #новыйобраз'
    }
  },
  EN: {
    title: 'Intelligent Features',
    subtitle: 'Set up AI capabilities for automation and business growth',
    subscriptionRequired: '"Marketing + AI" subscription required',
    subscriptionRequiredDescription: 'AI features require an active subscription to unlock',
    activateSubscription: 'Activate Subscription',
    
    // AI Retention
    retentionTitle: 'AI Client Retention',
    retentionDescription: 'Smart customer win-back system with personalized messages',
    retentionEnabled: 'Enable AI Retention',
    retentionIntensity: 'Intensity',
    retentionStandard: 'Standard',
    retentionAggressive: 'Aggressive',
    retentionPreview: 'Hi! 👋 We noticed you haven\'t visited us in a while. Would you like a 15% discount on your favorite "Haircut" service? Book now!',
    retentionQuota: 'Up to 50 messages per month',
    
    // AI Copywriter
    copywriterTitle: 'AI Copywriter',
    copywriterDescription: 'Automatic social media post generation',
    copywriterQuota: 'Up to 5 posts per month',
    generateExample: 'Generate Example',
    copywriterTone: 'Message Tone',
    toneFriendly: 'Friendly',
    toneProfessional: 'Professional',
    toneBold: 'Bold',
    examplePost: '✨ New week — time to take care of yourself! \n\nBook a haircut with our masters and get the perfect look for new achievements. \n\n📅 Available slots tomorrow!\n#beauty #haircut #salon',
    
    // Smart Pricing
    smartPricingTitle: 'Smart Pricing',
    smartPricingDescription: 'Dynamic pricing based on utilization and demand',
    smartPricingEnabled: 'Enable price recommendations',
    priceChangeLimit: 'Price change limit',
    requireApproval: 'Require master approval',
    
    // Silent Campaigns
    campaignsTitle: 'Silent Campaigns',
    campaignsDescription: 'Unobtrusive reminders and offers to clients',
    campaignsQuota: 'Up to 500 messages per month',
    setupSegments: 'Setup Segments',
    
    // Settings
    saveSettings: 'Save Settings',
    resetSettings: 'Reset to Defaults',
    
    // AI Preview examples
    aiExamples: {
      retention: 'Hi Anna! 🌟 We miss you at our salon. How about refreshing your haircut? We\'ll give you 20% off any service until the end of the week!',
      copywriter: '💫 Time for change!\n\nNew season — new look! Our stylists will create the perfect haircut that highlights your individuality.\n\n📞 Book by phone or bot\n#style #beauty #newlook'
    }
  }
};

export function Step09AISetup({ locale = 'RU', subscriptionActive = false }: AISetupStepProps) {
  const t = translations[locale];
  const [aiSettings, setAISettings] = useState({
    retention: {
      enabled: false,
      intensity: 'standard' as 'standard' | 'aggressive'
    },
    copywriter: {
      tone: 'friendly' as 'friendly' | 'professional' | 'bold'
    },
    smartPricing: {
      enabled: false,
      changeLimit: 30,
      requireApproval: true
    }
  });

  const [generatedExample, setGeneratedExample] = useState('');

  const handleRetentionToggle = (enabled: boolean) => {
    setAISettings(prev => ({
      ...prev,
      retention: { ...prev.retention, enabled }
    }));
  };

  const handleSmartPricingToggle = (enabled: boolean) => {
    setAISettings(prev => ({
      ...prev,
      smartPricing: { ...prev.smartPricing, enabled }
    }));
  };

  const handleGenerateExample = () => {
    setGeneratedExample(t.aiExamples.copywriter);
  };

  const handlePriceLimitChange = (value: number[]) => {
    setAISettings(prev => ({
      ...prev,
      smartPricing: { ...prev.smartPricing, changeLimit: value[0] }
    }));
  };

  // Locked state when subscription is inactive
  if (!subscriptionActive) {
    return (
      <div className="space-y-7">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-foreground mb-4">{t.title}</h1>
          <p className="text-muted-foreground max-w-[720px] mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Locked State */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 shadow-sm rounded-2xl border border-border text-center relative overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm z-10" />
            
            {/* Content */}
            <div className="relative z-20 space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-foreground">{t.subscriptionRequired}</h2>
                <p className="text-muted-foreground">{t.subscriptionRequiredDescription}</p>
              </div>

              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                <Crown className="w-4 h-4 mr-2" />
                {t.activateSubscription}
              </Button>
            </div>

            {/* Background AI Features Preview */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-2 gap-4 p-8">
                <div className="space-y-2">
                  <Brain className="w-6 h-6" />
                  <div className="h-2 bg-muted rounded" />
                  <div className="h-2 bg-muted rounded w-3/4" />
                </div>
                <div className="space-y-2">
                  <Sparkles className="w-6 h-6" />
                  <div className="h-2 bg-muted rounded" />
                  <div className="h-2 bg-muted rounded w-2/3" />
                </div>
                <div className="space-y-2">
                  <DollarSign className="w-6 h-6" />
                  <div className="h-2 bg-muted rounded w-4/5" />
                  <div className="h-2 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <Send className="w-6 h-6" />
                  <div className="h-2 bg-muted rounded" />
                  <div className="h-2 bg-muted rounded w-3/5" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-foreground mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-[720px] mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* AI Retention */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">{t.retentionTitle}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t.retentionDescription}</p>
                  <Badge variant="outline" className="text-xs">
                    {t.retentionQuota}
                  </Badge>
                </div>
              </div>
              <Switch
                checked={aiSettings.retention.enabled}
                onCheckedChange={handleRetentionToggle}
              />
            </div>

            {aiSettings.retention.enabled && (
              <div className="space-y-4 pl-16">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t.retentionIntensity}</Label>
                  <Select 
                    value={aiSettings.retention.intensity} 
                    onValueChange={(value: 'standard' | 'aggressive') => 
                      setAISettings(prev => ({
                        ...prev,
                        retention: { ...prev.retention, intensity: value }
                      }))
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t.retentionStandard}</SelectItem>
                      <SelectItem value="aggressive">{t.retentionAggressive}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {locale === 'RU' ? 'Пример сообщения' : 'Message Example'}
                  </Label>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-foreground">{t.aiExamples.retention}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* AI Copywriter */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">{t.copywriterTitle}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t.copywriterDescription}</p>
                <Badge variant="outline" className="text-xs">
                  {t.copywriterQuota}
                </Badge>
              </div>
            </div>

            <div className="pl-16 space-y-4">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t.copywriterTone}</Label>
                  <Select 
                    value={aiSettings.copywriter.tone} 
                    onValueChange={(value: 'friendly' | 'professional' | 'bold') => 
                      setAISettings(prev => ({
                        ...prev,
                        copywriter: { ...prev.copywriter, tone: value }
                      }))
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">{t.toneFriendly}</SelectItem>
                      <SelectItem value="professional">{t.toneProfessional}</SelectItem>
                      <SelectItem value="bold">{t.toneBold}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleGenerateExample}
                  className="mt-6 text-primary border-primary/20 hover:bg-primary/10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t.generateExample}
                </Button>
              </div>

              {generatedExample && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {locale === 'RU' ? 'Сгенерированный пост' : 'Generated Post'}
                  </Label>
                  <Textarea
                    value={generatedExample}
                    onChange={(e) => setGeneratedExample(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Smart Pricing */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">{t.smartPricingTitle}</h3>
                  <p className="text-sm text-muted-foreground">{t.smartPricingDescription}</p>
                </div>
              </div>
              <Switch
                checked={aiSettings.smartPricing.enabled}
                onCheckedChange={handleSmartPricingToggle}
              />
            </div>

            {aiSettings.smartPricing.enabled && (
              <div className="space-y-4 pl-16">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {t.priceChangeLimit}: ±{aiSettings.smartPricing.changeLimit}%
                  </Label>
                  <Slider
                    value={[aiSettings.smartPricing.changeLimit]}
                    onValueChange={handlePriceLimitChange}
                    max={50}
                    min={10}
                    step={5}
                    className="w-64"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="require-approval"
                    checked={aiSettings.smartPricing.requireApproval}
                    onChange={(e) => 
                      setAISettings(prev => ({
                        ...prev,
                        smartPricing: { ...prev.smartPricing, requireApproval: e.target.checked }
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="require-approval" className="text-sm">
                    {t.requireApproval}
                  </Label>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Silent Campaigns */}
        <Card className="p-8 shadow-sm rounded-2xl border border-border">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">{t.campaignsTitle}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t.campaignsDescription}</p>
                  <Badge variant="outline" className="text-xs">
                    {t.campaignsQuota}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                className="text-primary border-primary/20 hover:bg-primary/10"
              >
                <Users className="w-4 h-4 mr-2" />
                {t.setupSegments}
              </Button>
            </div>

            <div className="pl-16">
              <Alert className="border-violet-200 bg-violet-50">
                <BarChart3 className="w-4 h-4 text-violet-600" />
                <AlertDescription className="text-violet-800 text-sm">
                  {locale === 'RU' 
                    ? 'Сегментация клиентов и настройка кампаний будут доступны после завершения онбординга'
                    : 'Client segmentation and campaign setup will be available after onboarding completion'
                  }
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            className="text-muted-foreground border-border hover:bg-muted"
          >
            <Settings className="w-4 h-4 mr-2" />
            {t.resetSettings}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            <Zap className="w-4 h-4 mr-2" />
            {t.saveSettings}
          </Button>
        </div>
      </div>

      {/* Dev Notes (hidden in production) */}
      <div className="hidden" data-dev-notes>
        <p>DEV: PATCH /v1/ai/settings &#123;retention, copywriter, pricing&#125;; квоты copywriter/рассылок хранить в Redis; 
        минимум логов в AI DB</p>
      </div>
    </div>
  );
}