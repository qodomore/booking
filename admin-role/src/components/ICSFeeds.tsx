import React, { useState } from 'react';
import { Calendar, Copy, RefreshCw, Lock, Zap, Info, Check, AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner';

interface ICSFeed {
  id: string;
  resourceName: string;
  resourceType: string;
  url: string;
  active: boolean;
}

interface ICSFeedsProps {
  locale?: 'ru' | 'en';
  plan?: 'free' | 'pro';
  isAdmin?: boolean;
  theme?: string;
}

const mockFeeds: ICSFeed[] = [
  {
    id: '1',
    resourceName: 'Анна Смирнова',
    resourceType: 'Мастер маникюра',
    url: 'https://api.business.app/ics/feed/anna-smirnova-abc123def456',
    active: true
  },
  {
    id: '2',
    resourceName: 'Кабинет №1',
    resourceType: 'Помещение',
    url: 'https://api.business.app/ics/feed/room-1-xyz789ghi012',
    active: true
  },
  {
    id: '3',
    resourceName: 'Мария Козлова',
    resourceType: 'Мастер педикюра',
    url: 'https://api.business.app/ics/feed/maria-kozlova-jkl345mno678',
    active: true
  },
  {
    id: '4',
    resourceName: 'Кабинет VIP',
    resourceType: 'Помещение',
    url: 'https://api.business.app/ics/feed/vip-room-pqr901stu234',
    active: false
  }
];

export function ICSFeeds({ locale = 'ru', plan = 'free', isAdmin = true, theme = 'blue' }: ICSFeedsProps) {
  const [feeds, setFeeds] = useState<ICSFeed[]>(mockFeeds);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Text content
  const text = {
    ru: {
      title: 'Календарные фиды (ICS)',
      subtitle: 'Интеграция с внешними календарями',
      infoTooltip: 'Подписка в Google/Apple Calendar. Изменения делайте в приложении.',
      resourceColumn: 'Ресурс',
      urlColumn: 'URL фида',
      actionsColumn: 'Действия',
      copy: 'Копировать',
      regenerate: 'Сгенерировать',
      readOnly: 'Read-only',
      active: 'Активен',
      inactive: 'Неактивен',
      copied: 'Скопировано',
      confirmTitle: 'Сгенерировать новый URL?',
      confirmDescription: 'Старый URL перестанет работать. Все подписки на календарь нужно будет обновить.',
      confirmCancel: 'Отмена',
      confirmRegenerate: 'Сгенерировать',
      newUrlCreated: 'Создан новый адрес',
      proFeature: 'Доступно в Pro',
      unlockPro: 'Разблокировать Pro',
      proDescription: 'Синхронизация с внешними календарями увеличивает эффективность планирования на 40%',
      howToUse: 'Как использовать',
      instructionsTitle: 'Подключение к календарю',
      instructionsIntro: 'ICS-фиды позволяют видеть записи из нашего приложения в вашем любимом календаре. Выберите инструкцию для вашего календаря:',
      googleCalendar: 'Google Calendar',
      appleCalendar: 'Apple Calendar',
      outlookCalendar: 'Outlook',
      googleSteps: [
        'Скопируйте URL фида для нужного ресурса',
        'Откройте Google Calendar на компьютере',
        'Нажмите "+" рядом с "Другие календари" слева',
        'Выберите "Добавить по URL"',
        'Вставьте скопированный URL и нажмите "Добавить"',
        'Календарь появится в списке через несколько минут'
      ],
      appleSteps: [
        'Скопируйте URL фида для нужного ресурса',
        'Откройте приложение Календарь на Mac/iPhone/iPad',
        'В меню выберите "Файл" → "Новая подписка на календарь"',
        'Вставьте скопированный URL',
        'Нажмите "Подписаться" и настройте параметры',
        'Календарь синхронизируется автоматически'
      ],
      outlookSteps: [
        'Скопируйте URL фида для нужного ресурса',
        'Откройте Outlook Calendar',
        'Нажмите "Добавить календарь" → "Подписка из Интернета"',
        'Вставьте URL в поле "Ссылка на календарь"',
        'Введите имя и нажмите "Импорт"',
        'Подписка будет обновляться автоматически'
      ],
      importantNote: 'Важно',
      importantText: 'Календарь доступен только для чтения. Все изменения вносите в нашем приложении — они автоматически появятся в подписанном календаре.'
    },
    en: {
      title: 'Calendar feeds (ICS)',
      subtitle: 'Integration with external calendars',
      infoTooltip: 'Subscription in Google/Apple Calendar. Make changes in the app.',
      resourceColumn: 'Resource',
      urlColumn: 'Feed URL',
      actionsColumn: 'Actions',
      copy: 'Copy',
      regenerate: 'Regenerate',
      readOnly: 'Read-only',
      active: 'Active',
      inactive: 'Inactive',
      copied: 'Copied',
      confirmTitle: 'Generate new URL?',
      confirmDescription: 'The old URL will stop working. All calendar subscriptions will need to be updated.',
      confirmCancel: 'Cancel',
      confirmRegenerate: 'Regenerate',
      newUrlCreated: 'Created new address',
      proFeature: 'Available in Pro',
      unlockPro: 'Unlock Pro',
      proDescription: 'Synchronization with external calendars increases planning efficiency by 40%',
      howToUse: 'How to use',
      instructionsTitle: 'Calendar connection',
      instructionsIntro: 'ICS feeds allow you to see bookings from our app in your favorite calendar. Choose instructions for your calendar:',
      googleCalendar: 'Google Calendar',
      appleCalendar: 'Apple Calendar',
      outlookCalendar: 'Outlook',
      googleSteps: [
        'Copy the feed URL for the desired resource',
        'Open Google Calendar on your computer',
        'Click "+" next to "Other calendars" on the left',
        'Select "From URL"',
        'Paste the copied URL and click "Add calendar"',
        'Calendar will appear in the list within a few minutes'
      ],
      appleSteps: [
        'Copy the feed URL for the desired resource',
        'Open Calendar app on Mac/iPhone/iPad',
        'In menu select "File" → "New Calendar Subscription"',
        'Paste the copied URL',
        'Click "Subscribe" and configure settings',
        'Calendar will sync automatically'
      ],
      outlookSteps: [
        'Copy the feed URL for the desired resource',
        'Open Outlook Calendar',
        'Click "Add calendar" → "Subscribe from web"',
        'Paste URL in "Link to calendar" field',
        'Enter name and click "Import"',
        'Subscription will update automatically'
      ],
      importantNote: 'Important',
      importantText: 'Calendar is read-only. Make all changes in our app — they will automatically appear in the subscribed calendar.'
    }
  };

  const t = text[locale];

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.copied);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(t.copied);
    }
  };

  const handleRegenerate = (feedId: string) => {
    setRegeneratingId(feedId);
    
    // Simulate API call
    setTimeout(() => {
      setFeeds(prev => prev.map(feed => 
        feed.id === feedId 
          ? { ...feed, url: `${feed.url.split('-').slice(0, -1).join('-')}-${Math.random().toString(36).substr(2, 9)}` }
          : feed
      ));
      
      setRegeneratingId(null);
      toast.success(t.newUrlCreated);
    }, 1500);
  };

  const getResourceTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('помещение') || type.toLowerCase().includes('кабинет') || type.toLowerCase().includes('room')) {
      return '🏠';
    }
    return '👤';
  };

  const isLocked = !isAdmin || plan !== 'pro';

  return (
    <TooltipProvider>
      <Card className={isLocked ? 'relative' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t.title}
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-64">{t.infoTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </CardHeader>
        
        <CardContent>
          {!isLocked ? (
            <div className="space-y-4">
              {/* Instructions Collapsible */}
              <Collapsible open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-auto p-3 hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      <span className="font-medium">{t.howToUse}</span>
                    </div>
                    {isInstructionsOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">{t.instructionsTitle}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{t.instructionsIntro}</p>
                      </div>

                      {/* Google Calendar Instructions */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-lg">📅</span>
                          </div>
                          <h5 className="font-medium">{t.googleCalendar}</h5>
                        </div>
                        <ol className="space-y-1.5 ml-10 text-sm text-muted-foreground">
                          {t.googleSteps.map((step, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="font-medium text-foreground min-w-[20px]">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Apple Calendar Instructions */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-lg">🍎</span>
                          </div>
                          <h5 className="font-medium">{t.appleCalendar}</h5>
                        </div>
                        <ol className="space-y-1.5 ml-10 text-sm text-muted-foreground">
                          {t.appleSteps.map((step, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="font-medium text-foreground min-w-[20px]">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Outlook Instructions */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-lg">📧</span>
                          </div>
                          <h5 className="font-medium">{t.outlookCalendar}</h5>
                        </div>
                        <ol className="space-y-1.5 ml-10 text-sm text-muted-foreground">
                          {t.outlookSteps.map((step, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="font-medium text-foreground min-w-[20px]">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Important Note */}
                      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{t.importantNote}</p>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">{t.importantText}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-3 py-2 text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-3">{t.resourceColumn}</div>
                <div className="col-span-4">{t.urlColumn}</div>
                <div className="col-span-5 text-right">{t.actionsColumn}</div>
              </div>

              {/* Feed Rows */}
              <div className="space-y-2">
                {feeds.map(feed => (
                  <div key={feed.id} className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    {/* Resource Info */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg flex-shrink-0">{getResourceTypeIcon(feed.resourceType)}</span>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{feed.resourceName}</div>
                          <div className="text-xs text-muted-foreground truncate">{feed.resourceType}</div>
                        </div>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div className="col-span-4">
                      <Input
                        value={feed.url}
                        readOnly
                        className="text-xs font-mono h-9"
                        title={feed.url}
                      />
                    </div>

                    {/* Actions */}
                    <div className="col-span-5">
                      <div className="flex items-center justify-end gap-2">
                        <Badge variant={feed.active ? 'default' : 'secondary'} className="text-xs whitespace-nowrap">
                          {feed.active ? t.active : t.inactive}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(feed.url)}
                          className="h-8 whitespace-nowrap"
                        >
                          <Copy className="w-3 h-3 mr-1.5" />
                          {t.copy}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={regeneratingId === feed.id}
                              className="h-8 whitespace-nowrap"
                            >
                              {regeneratingId === feed.id ? (
                                <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3 h-3 mr-1.5" />
                              )}
                              {t.regenerate}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                {t.confirmTitle}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t.confirmDescription}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t.confirmCancel}</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRegenerate(feed.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                {t.confirmRegenerate}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Read-only Badge Info */}
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {t.readOnly}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.infoTooltip}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Locked State */
            <div className="relative">
              {/* Blurred preview */}
              <div className="filter blur-sm pointer-events-none space-y-4">
                <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-4">{t.resourceColumn}</div>
                  <div className="col-span-5">{t.urlColumn}</div>
                  <div className="col-span-3">{t.actionsColumn}</div>
                </div>

                <div className="space-y-3">
                  {feeds.slice(0, 2).map(feed => (
                    <div key={feed.id} className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg">
                      <div className="col-span-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getResourceTypeIcon(feed.resourceType)}</span>
                          <div>
                            <div className="font-medium">{feed.resourceName}</div>
                            <div className="text-xs text-muted-foreground">{feed.resourceType}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-5">
                        <div className="h-8 bg-muted rounded" />
                      </div>
                      <div className="col-span-3">
                        <div className="flex gap-2">
                          <div className="h-8 w-16 bg-muted rounded" />
                          <div className="h-8 w-20 bg-muted rounded" />
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
                  <h3 className="font-semibold">{t.proFeature}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t.proDescription}
                  </p>
                </div>
                <Button className="elegant-button">
                  <Zap className="w-4 h-4 mr-2" />
                  {t.unlockPro}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}