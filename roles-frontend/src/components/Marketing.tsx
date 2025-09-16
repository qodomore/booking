import React, { useState } from 'react';
import { Gift, Heart, Users, Mail, MessageSquare, Target, Calendar, TrendingUp, Play, Pause, Settings, ArrowLeft, Eye, Send, Lock, Zap, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { AutoPost } from './AutoPost';

interface Campaign {
  id: string;
  name: string;
  type: 'birthday' | 'winback' | 'loyalty' | 'referral' | 'seasonal';
  status: 'active' | 'paused' | 'completed';
  targetAudience: string;
  sent: number;
  opened: number;
  converted: number;
  revenue: number;
  startDate: string;
  endDate?: string;
  description: string;
  trigger: string;
}

interface BirthdayClient {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  email?: string;
  lastVisit: string;
  totalSpent: number;
  daysUntilBirthday: number;
  campaignSent: boolean;
}

interface AudienceSegment {
  id: string;
  name: { ru: string; en: string };
  description: { ru: string; en: string };
  count: number;
  icon: string;
  rule: { ru: string; en: string };
}

interface SampleClient {
  initials: string;
  lastVisit: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'День рождения - персональные поздравления',
    type: 'birthday',
    status: 'active',
    targetAudience: 'Клиенты с ДР в течение 7 дней',
    sent: 45,
    opened: 38,
    converted: 22,
    revenue: 33000,
    startDate: '2024-01-01',
    description: 'Автоматические поздравления с персональными скидками',
    trigger: 'За 3 дня до ДР'
  },
  {
    id: '2',
    name: 'Возвращение неактивных клиентов',
    type: 'winback',
    status: 'active',
    targetAudience: 'Не посещали 60+ дней',
    sent: 128,
    opened: 89,
    converted: 34,
    revenue: 68000,
    startDate: '2024-06-01',
    description: 'Специальные предложения для возврата клиентов',
    trigger: 'Неактивность 60 дней'
  },
  {
    id: '3',
    name: 'Программа лояльности - 5 визитов',
    type: 'loyalty',
    status: 'active',
    targetAudience: 'Клиенты с 5+ визитами',
    sent: 67,
    opened: 58,
    converted: 45,
    revenue: 54000,
    startDate: '2024-05-01',
    description: 'Бонусы за лояльность',
    trigger: '5-й визит'
  },
  {
    id: '4',
    name: 'Приведи подругу - летняя акция',
    type: 'referral',
    status: 'paused',
    targetAudience: 'VIP клиенты',
    sent: 32,
    opened: 28,
    converted: 12,
    revenue: 24000,
    startDate: '2024-06-15',
    endDate: '2024-07-31',
    description: 'Скидки за приглашение новых клиентов',
    trigger: 'Ручной запуск'
  },
  {
    id: '5',
    name: 'Новогодние предложения',
    type: 'seasonal',
    status: 'completed',
    targetAudience: 'Все активные клиенты',
    sent: 245,
    opened: 198,
    converted: 87,
    revenue: 156000,
    startDate: '2023-12-20',
    endDate: '2024-01-15',
    description: 'Праздничные скидки и подарки',
    trigger: 'Праздничный период'
  }
];

const birthdayClients: BirthdayClient[] = [
  {
    id: '1',
    name: 'Анна Смирнова',
    birthDate: '1990-07-30',
    phone: '+7 (999) 123-45-67',
    email: 'anna.smirnova@mail.ru',
    lastVisit: '2024-07-20',
    totalSpent: 18000,
    daysUntilBirthday: 3,
    campaignSent: false
  },
  {
    id: '2',
    name: 'Мария Козлова',
    birthDate: '1985-08-02',
    phone: '+7 (999) 987-65-43',
    email: 'maria.kozlova@gmail.com',
    lastVisit: '2024-07-18',
    totalSpent: 16000,
    daysUntilBirthday: 6,
    campaignSent: false
  },
  {
    id: '3',
    name: 'Елена Волкова',
    birthDate: '1992-07-28',
    phone: '+7 (999) 456-78-90',
    lastVisit: '2024-07-01',
    totalSpent: 3000,
    daysUntilBirthday: 1,
    campaignSent: true
  }
];

const audienceSegments: AudienceSegment[] = [
  {
    id: 'churn-risk',
    name: { ru: 'На грани оттока', en: 'At Risk of Churn' },
    description: { ru: 'Клиенты, которые могут уйти к конкурентам', en: 'Clients who might switch to competitors' },
    count: 47,
    icon: '⚠️',
    rule: { ru: 'Не посещали 45+ дней, снижение частоты на 50%', en: 'No visits 45+ days, frequency down 50%' }
  },
  {
    id: 'vip',
    name: { ru: 'VIP', en: 'VIP' },
    description: { ru: 'Самые ценные клиенты с высоким LTV', en: 'Most valuable clients with high LTV' },
    count: 23,
    icon: '👑',
    rule: { ru: 'Потратили 50k+ ₽, 10+ визитов за год', en: 'Spent 50k+ ₽, 10+ visits per year' }
  },
  {
    id: 'long-absent',
    name: { ru: 'Давно не были', en: 'Long Absent' },
    description: { ru: 'Клиенты, отсутствующие более 3 месяцев', en: 'Clients absent for 3+ months' },
    count: 89,
    icon: '😴',
    rule: { ru: 'Последний визит 90+ дней назад', en: 'Last visit 90+ days ago' }
  },
  {
    id: 'morning-lovers',
    name: { ru: 'Любят утро', en: 'Morning Lovers' },
    description: { ru: 'Предпочитают записи до 12:00', en: 'Prefer appointments before 12:00' },
    count: 156,
    icon: '🌅',
    rule: { ru: '80%+ записей до 12:00, 5+ визитов', en: '80%+ bookings before 12:00, 5+ visits' }
  },
  {
    id: 'price-sensitive',
    name: { ru: 'Чувствительны к цене', en: 'Price Sensitive' },
    description: { ru: 'Реагируют на скидки и акции', en: 'Respond to discounts and promotions' },
    count: 134,
    icon: '💰',
    rule: { ru: 'Используют скидки 70%+ визитов, средний чек <2000₽', en: 'Use discounts 70%+ visits, avg check <2000₽' }
  }
];

const sampleClients: { [key: string]: SampleClient[] } = {
  'churn-risk': [
    { initials: 'АС', lastVisit: '15 мая' },
    { initials: 'МП', lastVisit: '22 мая' },
    { initials: 'ЕВ', lastVisit: '8 мая' }
  ],
  'vip': [
    { initials: 'ИК', lastVisit: '3 дня назад' },
    { initials: 'НЛ', lastVisit: '1 неделя назад' },
    { initials: 'ТР', lastVisit: 'вчера' }
  ],
  'long-absent': [
    { initials: 'ОМ', lastVisit: '12 марта' },
    { initials: 'СГ', lastVisit: '8 февраля' },
    { initials: 'ЛД', lastVisit: '25 марта' }
  ],
  'morning-lovers': [
    { initials: 'КА', lastVisit: '2 дня назад' },
    { initials: 'ВС', lastVisit: '5 дней назад' },
    { initials: 'ПЕ', lastVisit: 'на прошлой неделе' }
  ],
  'price-sensitive': [
    { initials: 'БН', lastVisit: '4 дня назад' },
    { initials: 'УТ', lastVisit: '1 неделя назад' },
    { initials: 'ЗЯ', lastVisit: '3 дня назад' }
  ]
};

interface MarketingProps {
  onBack?: () => void;
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro';
  sendQuotaLeft?: number;
}

export function Marketing({ onBack, locale = 'ru', plan = 'free', sendQuotaLeft = 100 }: MarketingProps) {
  const [campaignsData, setCampaignsData] = useState<Campaign[]>(campaigns);
  const [birthdayClientsData, setBirthdayClientsData] = useState<BirthdayClient[]>(birthdayClients);
  const [selectedCampaignType, setSelectedCampaignType] = useState('all');
  
  // Segments state
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [isAudiencePreviewOpen, setIsAudiencePreviewOpen] = useState(false);
  const [isMessageTemplateOpen, setIsMessageTemplateOpen] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [messageSubject, setMessageSubject] = useState('');

  // Text content
  const text = {
    ru: {
      audienceSegments: 'Сегменты аудитории',
      startCampaign: 'Запустить кампанию',
      preview: 'Предпросмотр',
      audiencePreview: 'Предпросмотр аудитории',
      messageTemplate: 'Шаблон сообщения',
      recipients: 'получателей',
      sampleClients: 'Примеры клиентов',
      lastVisit: 'Последний визит',
      sendTest: 'Отправить тест',
      send: 'Отправить',
      quotaWarning: 'Лимит сообщений исчерпан',
      quotaLeft: 'Осталось сообщений',
      proFeature: 'Доступно в Pro',
      unlockPro: 'Разблокировать Pro',
      sentSuccess: 'Отправлено',
      clients: 'клиентам',
      selectSegments: 'Выберите сегменты для таргетинга',
      subject: 'Тема сообщения',
      message: 'Текст сообщения',
      placeholders: 'Используйте: {имя}, {услуга}, {скидка}',
      segmentRule: 'Правило сегмента'
    },
    en: {
      audienceSegments: 'Audience Segments',
      startCampaign: 'Start Campaign',
      preview: 'Preview',
      audiencePreview: 'Audience Preview',
      messageTemplate: 'Message Template',
      recipients: 'recipients',
      sampleClients: 'Sample Clients',
      lastVisit: 'Last Visit',
      sendTest: 'Send Test',
      send: 'Send',
      quotaWarning: 'Message limit exhausted',
      quotaLeft: 'Messages left',
      proFeature: 'Available in Pro',
      unlockPro: 'Unlock Pro',
      sentSuccess: 'Sent to',
      clients: 'clients',
      selectSegments: 'Select segments for targeting',
      subject: 'Message Subject',
      message: 'Message Text',
      placeholders: 'Use: {name}, {service}, {discount}',
      segmentRule: 'Segment Rule'
    }
  };

  const t = text[locale];

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'winback': return '💝';
      case 'loyalty': return '⭐';
      case 'referral': return '👥';
      case 'seasonal': return '🎄';
      default: return '📧';
    }
  };

  const getCampaignTypeLabel = (type: Campaign['type']) => {
    switch (type) {
      case 'birthday': return 'День рождения';
      case 'winback': return 'Возврат клиентов';
      case 'loyalty': return 'Лояльность';
      case 'referral': return 'Реферальная';
      case 'seasonal': return 'Сезонная';
      default: return 'Общая';
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaignsData(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
  };

  const sendBirthdayCampaign = (clientId: string) => {
    setBirthdayClientsData(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, campaignSent: true }
        : client
    ));
  };

  // Segment functions
  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const getAudienceCount = () => {
    return selectedSegments.reduce((total, segmentId) => {
      const segment = audienceSegments.find(s => s.id === segmentId);
      return total + (segment?.count || 0);
    }, 0);
  };

  const handlePreview = () => {
    if (selectedSegments.length === 0) {
      toast.error(locale === 'ru' ? 'Выберите хотя бы один сегмент' : 'Select at least one segment');
      return;
    }
    setIsAudiencePreviewOpen(true);
  };

  const handleStartCampaign = () => {
    if (selectedSegments.length === 0) {
      toast.error(locale === 'ru' ? 'Выберите хотя бы один сегмент' : 'Select at least one segment');
      return;
    }
    setIsMessageTemplateOpen(true);
  };

  const handleSendCampaign = (isTest = false) => {
    const audienceCount = getAudienceCount();
    
    if (sendQuotaLeft === 0) {
      toast.error(t.quotaWarning);
      return;
    }
    
    if (!isTest && sendQuotaLeft < audienceCount) {
      toast.error(locale === 'ru' 
        ? `Недостаточно квоты. Нужно: ${audienceCount}, доступно: ${sendQuotaLeft}`
        : `Insufficient quota. Need: ${audienceCount}, available: ${sendQuotaLeft}`
      );
      return;
    }

    const count = isTest ? 1 : audienceCount;
    toast.success(`${t.sentSuccess} ${count} ${t.clients}`);
    
    setIsMessageTemplateOpen(false);
    setIsAudiencePreviewOpen(false);
    setSelectedSegments([]);
    setMessageTemplate('');
    setMessageSubject('');
  };

  const filteredCampaigns = campaignsData.filter(campaign => {
    if (selectedCampaignType === 'all') return true;
    return campaign.type === selectedCampaignType;
  });

  const totalRevenue = campaignsData.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const totalSent = campaignsData.reduce((sum, campaign) => sum + campaign.sent, 0);
  const totalConverted = campaignsData.reduce((sum, campaign) => sum + campaign.converted, 0);
  const averageConversion = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Маркетинг и кампании</h2>
            <p className="text-gray-500 mt-1">Автоматизированные маркетинговые кампании</p>
          </div>
        </div>
        
        <Button className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Создать кампанию
        </Button>
      </div>

      {/* Audience Segments Card */}
      {plan === 'pro' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t.audienceSegments}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {audienceSegments.map(segment => (
                <div key={segment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedSegments.includes(segment.id)}
                      onCheckedChange={() => handleSegmentToggle(segment.id)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{segment.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{segment.name[locale]}</span>
                          <Badge variant="secondary" className="text-xs">
                            {segment.count}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm" 
                            className="p-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(segment.rule[locale]);
                            }}
                          >
                            <Info className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{segment.description[locale]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {sendQuotaLeft === 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.quotaWarning}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-sm text-muted-foreground">
                {t.quotaLeft}: <span className="font-medium">{sendQuotaLeft}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={selectedSegments.length === 0}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t.preview}
                </Button>
                <Button 
                  onClick={handleStartCampaign}
                  disabled={selectedSegments.length === 0 || sendQuotaLeft === 0}
                  className="elegant-button"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t.startCampaign}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t.audienceSegments}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Blurred preview */}
              <div className="filter blur-sm pointer-events-none">
                <div className="space-y-3">
                  {audienceSegments.slice(0, 3).map(segment => (
                    <div key={segment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox />
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{segment.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{segment.name[locale]}</span>
                              <Badge variant="secondary" className="text-xs">
                                {segment.count}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center space-y-4">
                <Lock className="w-12 h-12 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">{t.proFeature}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {locale === 'ru' 
                      ? 'Получите доступ к сегментации аудитории и таргетированным кампаниям для повышения эффективности маркетинга.'
                      : 'Get access to audience segmentation and targeted campaigns to improve marketing efficiency.'
                    }
                  </p>
                </div>
                <Button className="elegant-button">
                  <Zap className="w-4 h-4 mr-2" />
                  {t.unlockPro}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* AutoPost Section */}
      <AutoPost 
        locale={locale}
        plan={plan}
        quotaLeft={sendQuotaLeft}
        isAdmin={true}
      />
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {(totalRevenue / 1000).toFixed(0)}k ₽
                </p>
                <p className="text-sm text-gray-500">Доход от кампаний</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{totalSent}</p>
                <p className="text-sm text-gray-500">Сообщений отправлено</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{totalConverted}</p>
                <p className="text-sm text-gray-500">Конверсий</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{averageConversion.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Средняя конверсия</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Активные кампании</TabsTrigger>
          <TabsTrigger value="birthday">Дни рождения</TabsTrigger>
          <TabsTrigger value="winback">Win-back</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          {/* Filter */}
          <div className="flex gap-4">
            <Select value={selectedCampaignType} onValueChange={setSelectedCampaignType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Тип кампании" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все кампании</SelectItem>
                <SelectItem value="birthday">Дни рождения</SelectItem>
                <SelectItem value="winback">Возврат клиентов</SelectItem>
                <SelectItem value="loyalty">Лояльность</SelectItem>
                <SelectItem value="referral">Реферальные</SelectItem>
                <SelectItem value="seasonal">Сезонные</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {filteredCampaigns.map(campaign => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-3xl">{getCampaignIcon(campaign.type)}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status === 'active' ? 'Активна' :
                             campaign.status === 'paused' ? 'Приостановлена' : 'Завершена'}
                          </Badge>
                          <Badge variant="outline">{getCampaignTypeLabel(campaign.type)}</Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{campaign.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Отправлено</p>
                            <p className="font-semibold text-gray-900">{campaign.sent}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Открыто</p>
                            <p className="font-semibold text-gray-900">
                              {campaign.opened} ({((campaign.opened / campaign.sent) * 100).toFixed(0)}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Конверсии</p>
                            <p className="font-semibold text-gray-900">
                              {campaign.converted} ({((campaign.converted / campaign.sent) * 100).toFixed(0)}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Доход</p>
                            <p className="font-semibold text-gray-900">
                              {(campaign.revenue / 1000).toFixed(0)}k ₽
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <span>Конверсия: {((campaign.converted / campaign.sent) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(campaign.converted / campaign.sent) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCampaignStatus(campaign.id)}
                        disabled={campaign.status === 'completed'}
                      >
                        {campaign.status === 'active' ? (
                          <><Pause className="w-4 h-4 mr-1" /> Пауза</>
                        ) : (
                          <><Play className="w-4 h-4 mr-1" /> Запуск</>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Birthday Tab */}
        <TabsContent value="birthday" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎂 Ближайшие дни рождения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {birthdayClientsData.map(client => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>ДР: {new Date(client.birthDate).toLocaleDateString(locale)}</span>
                          <span>Потрачено: {client.totalSpent.toLocaleString()} ₽</span>
                          <span>Последний визит: {new Date(client.lastVisit).toLocaleDateString(locale)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600">{client.daysUntilBirthday}</p>
                        <p className="text-xs text-gray-500">
                          {client.daysUntilBirthday === 0 ? 'Сегодня!' :
                           client.daysUntilBirthday === 1 ? 'Завтра' : 'дней'}
                        </p>
                      </div>
                      
                      {client.campaignSent ? (
                        <Badge className="bg-green-100 text-green-800">Отправлено</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => sendBirthdayCampaign(client.id)}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Поздравить
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Win-back Tab */}
        <TabsContent value="winback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💝 Win-back кампания
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Текущая кампания</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Автоматическая отправка предложений клиентам, которые не посещал салон более 60 дней
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600">Целевая аудитория</p>
                        <p className="font-semibold text-blue-900">24 клиента</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Скидка</p>
                        <p className="font-semibold text-blue-900">20%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Автоматическая отправка</span>
                    <Switch defaultChecked />
                  </div>
                  
                  <Button className="w-full">
                    Запустить кампанию сейчас
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Результаты Win-back</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Отправлено сообщений</p>
                      <p className="text-sm text-gray-500">За последние 30 дней</p>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">128</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Вернулось клиентов</p>
                      <p className="text-sm text-green-600">Конверсия 26.6%</p>
                    </div>
                    <p className="text-xl font-semibold text-green-900">34</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">Дополнительный доход</p>
                      <p className="text-sm text-purple-600">От вернувшихся клиентов</p>
                    </div>
                    <p className="text-xl font-semibold text-purple-900">68k ₽</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Эффективность по типам кампаний</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['birthday', 'winback', 'loyalty', 'referral'].map(type => {
                    const typeCampaigns = campaignsData.filter(c => c.type === type);
                    const totalRevenue = typeCampaigns.reduce((sum, c) => sum + c.revenue, 0);
                    const totalSent = typeCampaigns.reduce((sum, c) => sum + c.sent, 0);
                    const totalConverted = typeCampaigns.reduce((sum, c) => sum + c.converted, 0);
                    const conversion = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCampaignIcon(type as Campaign['type'])}</span>
                          <div>
                            <p className="font-medium text-gray-900">{getCampaignTypeLabel(type as Campaign['type'])}</p>
                            <p className="text-sm text-gray-500">
                              {totalSent} отправлено, {totalConverted} конверсий
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{conversion.toFixed(1)}%</p>
                          <p className="text-sm text-gray-500">{(totalRevenue / 1000).toFixed(0)}k ₽</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI маркетинговых кампаний</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600 mb-2">385%</p>
                    <p className="text-gray-600">Общий ROI маркетинга</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-xl font-semibold text-gray-900">89k ₽</p>
                      <p className="text-sm text-gray-500">Затраты на маркетинг</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-xl font-semibold text-gray-900">343k ₽</p>
                      <p className="text-sm text-gray-500">Доход от кампаний</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Audience Preview Bottom Sheet */}
      <Sheet open={isAudiencePreviewOpen} onOpenChange={setIsAudiencePreviewOpen}>
        <SheetContent side="bottom" className="max-h-[80vh]">
          <SheetHeader>
            <SheetTitle>{t.audiencePreview}</SheetTitle>
            <SheetDescription>
              {getAudienceCount()} {t.recipients}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            {/* Selected segments */}
            <div>
              <h4 className="font-medium mb-3">Выбранные сегменты:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSegments.map(segmentId => {
                  const segment = audienceSegments.find(s => s.id === segmentId);
                  return segment ? (
                    <Badge key={segmentId} variant="secondary" className="flex items-center gap-1">
                      <span>{segment.icon}</span>
                      <span>{segment.name[locale]}</span>
                      <span className="opacity-70">({segment.count})</span>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
            
            <Separator />
            
            {/* Sample clients */}
            <div>
              <h4 className="font-medium mb-3">{t.sampleClients}:</h4>
              <div className="space-y-3">
                {selectedSegments.slice(0, 3).map(segmentId => {
                  const segment = audienceSegments.find(s => s.id === segmentId);
                  const clients = sampleClients[segmentId] || [];
                  
                  return segment ? (
                    <div key={segmentId} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{segment.icon}</span>
                        <span className="text-sm font-medium">{segment.name[locale]}</span>
                      </div>
                      <div className="flex gap-2">
                        {clients.slice(0, 3).map((client, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium">{client.initials}</span>
                            </div>
                            <span className="text-muted-foreground">{t.lastVisit}: {client.lastVisit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
            <Separator />
            
            {/* Quota warning */}
            {sendQuotaLeft < getAudienceCount() && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {locale === 'ru' 
                      ? `Недостаточно квоты. Нужно: ${getAudienceCount()}, доступно: ${sendQuotaLeft}`
                      : `Insufficient quota. Need: ${getAudienceCount()}, available: ${sendQuotaLeft}`
                    }
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAudiencePreviewOpen(false)}
                className="flex-1"
              >
                {locale === 'ru' ? 'Закрыть' : 'Close'}
              </Button>
              <Button 
                onClick={handleStartCampaign}
                disabled={sendQuotaLeft === 0 || sendQuotaLeft < getAudienceCount()}
                className="flex-1 elegant-button"
              >
                <Send className="w-4 h-4 mr-2" />
                {t.startCampaign}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Message Template Bottom Sheet */}
      <Sheet open={isMessageTemplateOpen} onOpenChange={setIsMessageTemplateOpen}>
        <SheetContent side="bottom" className="max-h-[90vh]">
          <SheetHeader>
            <SheetTitle>{t.messageTemplate}</SheetTitle>
            <SheetDescription>
              {getAudienceCount()} {t.recipients}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            {/* Message form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">{t.subject}</Label>
                <Input
                  id="subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder={locale === 'ru' ? 'Персональное предложение' : 'Personal offer'}
                />
              </div>
              
              <div>
                <Label htmlFor="message">{t.message}</Label>
                <Textarea
                  id="message"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder={locale === 'ru' 
                    ? 'Привет, {имя}! У нас есть специальное предложение на {услуга} со скидкой {скидка}%'
                    : 'Hello, {name}! We have a special offer for {service} with {discount}% discount'
                  }
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t.placeholders}
                </p>
              </div>
            </div>
            
            <Separator />
            
            {/* Template preview */}
            <div>
              <h4 className="font-medium mb-2">{locale === 'ru' ? 'Предпросмотр' : 'Preview'}:</h4>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="border-b pb-2 mb-2">
                  <p className="font-medium text-sm">
                    {messageSubject || (locale === 'ru' ? 'Персональное предложение' : 'Personal offer')}
                  </p>
                </div>
                <div className="text-sm">
                  {messageTemplate ? 
                    messageTemplate
                      .replace('{имя}', 'Анна')
                      .replace('{name}', 'Anna')
                      .replace('{услуга}', 'Маникюр')
                      .replace('{service}', 'Manicure')
                      .replace('{скидка}', '20')
                      .replace('{discount}', '20')
                    : (locale === 'ru' 
                      ? 'Привет, Анна! У нас есть специальное предложение на Маникюр со скидкой 20%'
                      : 'Hello, Anna! We have a special offer for Manicure with 20% discount'
                    )
                  }
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Selected segments summary */}
            <div>
              <h4 className="font-medium mb-2">{locale === 'ru' ? 'Отправить в сегменты' : 'Send to segments'}:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSegments.map(segmentId => {
                  const segment = audienceSegments.find(s => s.id === segmentId);
                  return segment ? (
                    <Badge key={segmentId} variant="outline" className="text-xs">
                      {segment.icon} {segment.name[locale]} ({segment.count})
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsMessageTemplateOpen(false)}
                className="flex-1"
              >
                {locale === 'ru' ? 'Отменить' : 'Cancel'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleSendCampaign(true)}
                disabled={!messageTemplate && !messageSubject}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t.sendTest}
              </Button>
              <Button 
                onClick={() => handleSendCampaign(false)}
                disabled={sendQuotaLeft === 0 || sendQuotaLeft < getAudienceCount() || (!messageTemplate && !messageSubject)}
                className="flex-1 elegant-button"
              >
                <Send className="w-4 h-4 mr-2" />
                {t.send}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}