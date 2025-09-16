import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Star,
  Eye,
  Rocket,
  Info,
  Crown,
  Zap
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar } from './ui/avatar';
import { toast } from 'sonner@2.0.3';

interface PromoPremiumProps {
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro';
  inventoryStatus?: 'ok' | 'low' | 'none';
  onCampaignCreate?: (campaign: CampaignSettings) => void;
}

interface CampaignSettings {
  region: string;
  mode: 'cpc' | 'weekly';
  budget: number;
  dateFrom: Date;
  dateTo: Date;
}

const texts = {
  ru: {
    title: 'Премиум-размещение',
    description: 'Продвигайте свой бизнес в каталоге',
    region: 'Город/район',
    mode: 'Режим продвижения',
    budget: 'Бюджет',
    period: 'Период кампании',
    launchCampaign: 'Запустить продвижение',
    preview: 'Предпросмотр',
    limitedInventory: 'Ограниченный инвентарь',
    proDiscount: '−15% для Pro',
    modeWeekly: 'Неделя',
    modeCPC: 'CPC',
    regions: {
      moscow_center: 'Москва (Центр)',
      moscow_south: 'Москва (Юг)',
      moscow_north: 'Москва (Север)',
      spb_center: 'СПб (Центр)',
      spb_vasilievsky: 'СПб (Васильевский остров)'
    },
    budgetLabels: {
      weekly: 'руб/неделя',
      cpc: 'руб/клик'
    },
    campaignCreated: 'Кампания создана и запущена',
    validationError: 'Выберите все параметры кампании',
    noInventory: 'Слоты в этом районе закончились. Попробуйте другой период/район.',
    previewTitle: 'Предпросмотр размещения',
    businessName: 'Салон красоты "Элегант"',
    businessDescription: 'Профессиональные услуги красоты в центре города',
    rating: '4.8',
    bookNow: 'Записаться',
    promoted: 'Реклама'
  },
  en: {
    title: 'Premium placement',
    description: 'Promote your business in catalog',
    region: 'City/district',
    mode: 'Promotion mode',
    budget: 'Budget',
    period: 'Campaign period',
    launchCampaign: 'Launch campaign',
    preview: 'Preview',
    limitedInventory: 'Limited inventory',
    proDiscount: '−15% for Pro',
    modeWeekly: 'Weekly',
    modeCPC: 'CPC',
    regions: {
      moscow_center: 'Moscow (Center)',
      moscow_south: 'Moscow (South)',
      moscow_north: 'Moscow (North)',
      spb_center: 'SPb (Center)',
      spb_vasilievsky: 'SPb (Vasilievsky Island)'
    },
    budgetLabels: {
      weekly: '$/week',
      cpc: '$/click'
    },
    campaignCreated: 'Campaign created and launched',
    validationError: 'Select all campaign parameters',
    noInventory: 'Slots in this area are sold out. Try another period/area.',
    previewTitle: 'Placement preview',
    businessName: 'Beauty Salon "Elegant"',
    businessDescription: 'Professional beauty services in city center',
    rating: '4.8',
    bookNow: 'Book now',
    promoted: 'Promoted'
  }
};

const budgetRanges = {
  weekly: { min: 1000, max: 15000, step: 500 },
  cpc: { min: 50, max: 500, step: 25 }
};

export function PromoPremium({ 
  locale = 'ru', 
  plan = 'free',
  inventoryStatus = 'ok',
  onCampaignCreate 
}: PromoPremiumProps) {
  const t = texts[locale];
  
  const [campaign, setCampaign] = useState<Partial<CampaignSettings>>({
    mode: 'weekly',
    budget: 3000
  });
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTo, setDateTo] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const budgetRange = budgetRanges[campaign.mode || 'weekly'];
  const budgetLabel = t.budgetLabels[campaign.mode || 'weekly'];
  const discountMultiplier = plan === 'pro' ? 0.85 : 1;
  const finalBudget = Math.round((campaign.budget || 0) * discountMultiplier);

  const handleModeChange = (newMode: 'cpc' | 'weekly') => {
    const newRange = budgetRanges[newMode];
    setCampaign(prev => ({ 
      ...prev, 
      mode: newMode,
      budget: newRange.min + Math.floor((newRange.max - newRange.min) / 3)
    }));
  };

  const handleBudgetChange = (value: number[]) => {
    setCampaign(prev => ({ ...prev, budget: value[0] }));
  };

  const handleLaunchCampaign = () => {
    // Validation
    if (!campaign.region || !campaign.mode || !campaign.budget) {
      toast.error(t.validationError);
      return;
    }

    // Check inventory
    if (inventoryStatus === 'none') {
      toast.error(t.noInventory);
      return;
    }

    // Create campaign
    const fullCampaign: CampaignSettings = {
      region: campaign.region!,
      mode: campaign.mode!,
      budget: finalBudget,
      dateFrom,
      dateTo
    };

    onCampaignCreate?.(fullCampaign);
    toast.success(t.campaignCreated);
  };

  const CompanyPreviewCard = () => (
    <div className="p-4 bg-card border border-border rounded-lg space-y-4">
      {/* Promoted badge */}
      <div className="flex justify-between items-start">
        <Badge variant="secondary" className="text-xs">
          <Zap className="w-3 h-3 mr-1" />
          {t.promoted}
        </Badge>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{t.rating}</span>
        </div>
      </div>

      {/* Company info */}
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">Э</span>
          </div>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm">{t.businessName}</h3>
          <p className="text-xs text-muted-foreground mt-1">{t.businessDescription}</p>
        </div>
      </div>

      {/* Action button */}
      <Button className="w-full elegant-button" size="sm">
        {t.bookNow}
      </Button>
    </div>
  );

  return (
    <>
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t.title}</h3>
            <p className="text-xs text-muted-foreground">{t.description}</p>
          </div>
        </div>

        {/* Inventory status banner */}
        {inventoryStatus === 'none' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-muted rounded-lg border-l-4 border-l-destructive"
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs text-muted-foreground">{t.noInventory}</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-5">
          {/* Region Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t.region}
            </Label>
            <Select
              value={campaign.region}
              onValueChange={(value) => setCampaign(prev => ({ ...prev, region: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.region} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.regions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t.mode}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={campaign.mode === 'cpc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleModeChange('cpc')}
                className={campaign.mode === 'cpc' ? 'elegant-button' : ''}
              >
                {t.modeCPC}
              </Button>
              <Button
                variant={campaign.mode === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleModeChange('weekly')}
                className={campaign.mode === 'weekly' ? 'elegant-button' : ''}
              >
                {t.modeWeekly}
              </Button>
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t.budget}</Label>
              <div className="flex items-center gap-2">
                {plan === 'pro' && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    <Crown className="w-3 h-3 mr-1" />
                    {t.proDiscount}
                  </Badge>
                )}
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {finalBudget.toLocaleString()} {budgetLabel}
                  </div>
                  {plan === 'pro' && campaign.budget && campaign.budget !== finalBudget && (
                    <div className="text-xs text-muted-foreground line-through">
                      {campaign.budget.toLocaleString()} {budgetLabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Slider
              value={[campaign.budget || budgetRange.min]}
              onValueChange={handleBudgetChange}
              min={budgetRange.min}
              max={budgetRange.max}
              step={budgetRange.step}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{budgetRange.min.toLocaleString()}</span>
              <span>{budgetRange.max.toLocaleString()}</span>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {t.period}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">От</Label>
                <input
                  type="date"
                  value={dateFrom.toISOString().split('T')[0]}
                  onChange={(e) => setDateFrom(new Date(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">До</Label>
                <input
                  type="date"
                  value={dateTo.toISOString().split('T')[0]}
                  onChange={(e) => setDateTo(new Date(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input"
                />
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {inventoryStatus === 'low' && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                <Info className="w-3 h-3 mr-1" />
                {t.limitedInventory}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t.preview}
            </Button>
            
            <Button
              size="sm"
              onClick={handleLaunchCampaign}
              disabled={inventoryStatus === 'none' || !campaign.region || !campaign.mode}
              className="flex-1 elegant-button"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {t.launchCampaign}
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">{t.previewTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Так будет выглядеть ваша карточка в каталоге:
            </p>
            <CompanyPreviewCard />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}