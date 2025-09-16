import React, { useState } from 'react';
import { Calendar, Copy, RefreshCw, Lock, Zap, Info, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
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
      regenerate: 'Сгенерировать заново',
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
      proDescription: 'Синхронизация с внешними календарями увеличивает эффективность планирования на 40%'
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
      proDescription: 'Synchronization with external calendars increases planning efficiency by 40%'
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
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-4">{t.resourceColumn}</div>
                <div className="col-span-5">{t.urlColumn}</div>
                <div className="col-span-3">{t.actionsColumn}</div>
              </div>

              {/* Feed Rows */}
              <div className="space-y-3">
                {feeds.map(feed => (
                  <div key={feed.id} className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    {/* Resource Info */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getResourceTypeIcon(feed.resourceType)}</span>
                        <div>
                          <div className="font-medium">{feed.resourceName}</div>
                          <div className="text-xs text-muted-foreground">{feed.resourceType}</div>
                        </div>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div className="col-span-5">
                      <div className="flex items-center gap-2">
                        <Input
                          value={feed.url}
                          readOnly
                          className="text-xs font-mono"
                          title={feed.url}
                        />
                        <Badge variant={feed.active ? 'default' : 'secondary'} className="text-xs whitespace-nowrap">
                          {feed.active ? t.active : t.inactive}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(feed.url)}
                          className="h-8"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {t.copy}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={regeneratingId === feed.id}
                              className="h-8"
                            >
                              {regeneratingId === feed.id ? (
                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3 h-3 mr-1" />
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
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Badge variant="secondary" className="text-xs">
                  {t.readOnly}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {t.infoTooltip}
                </p>
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