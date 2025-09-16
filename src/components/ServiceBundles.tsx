import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Clock, RussianRuble, ChevronDown, ChevronUp, Lock, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { BundleEditor } from './BundleEditor';
import { useResources, Bundle } from '../contexts/ResourceContext';

interface ServiceBundlesProps {
  currentServiceId?: string;
  userRole: 'admin' | 'client';
  plan: 'free' | 'pro';
  locale: 'ru' | 'en';
}

const texts = {
  ru: {
    title: 'Комплексы (связки услуг)',
    subtitle: 'Группируйте услуги в готовые наборы для апселла и пакетной продажи',
    createBundle: 'Создать комплект',
    emptyTitle: 'Создайте первый комплекс',
    emptyDesc: 'Это увеличит средний чек и ускорит выбор',
    teaser: 'Пример комплекса',
    teaserDesc: 'Полный уход за волосами',
    teaserServices: 'Стрижка + Окрашивание + Укладка',
    teaserPrice: '4 500 ₽',
    teaserDuration: '3 ч 30 мин',
    teaserDiscount: '−15%',
    unlockPro: 'Разблокировать Pro',
    deleteConfirm: 'Удалить комплекс?',
    minutes: 'мин',
    hours: 'ч'
  },
  en: {
    title: 'Bundles (service sets)',
    subtitle: 'Group services into preset bundles for upsell and packages',
    createBundle: 'Create Bundle',
    emptyTitle: 'Create your first bundle',
    emptyDesc: 'Boosts AOV and speeds selection',
    teaser: 'Example Bundle',
    teaserDesc: 'Complete hair care',
    teaserServices: 'Cut + Color + Style',
    teaserPrice: '$45',
    teaserDuration: '3h 30m',
    teaserDiscount: '−15%',
    unlockPro: 'Unlock Pro',
    deleteConfirm: 'Delete bundle?',
    minutes: 'min',
    hours: 'h'
  }
};

export function ServiceBundles({
  currentServiceId,
  userRole = 'admin',
  plan = 'free',
  locale = 'ru'
}: ServiceBundlesProps) {
  const { bundles, services, removeBundle, calculateBundlePrice, calculateBundleDuration } = useResources();
  const t = texts[locale];
  const isLocked = userRole === 'admin' && plan !== 'pro';

  const [isOpen, setIsOpen] = useState(false);
  const [isBundleEditorOpen, setIsBundleEditorOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  // Получаем комплексы, связанные с текущей услугой
  const relevantBundles = currentServiceId 
    ? bundles.filter(bundle => bundle.serviceIds.includes(currentServiceId))
    : bundles;

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins === 0 ? `${hours} ${t.hours}` : `${hours} ${t.hours} ${mins} ${t.minutes}`;
    }
    return `${minutes} ${t.minutes}`;
  };

  const formatPrice = (price: number) => {
    return `₽${price.toLocaleString()}`;
  };

  const getServiceNames = (serviceIds: string[]) => {
    const serviceNames = serviceIds
      .map(id => services.find(s => s.id === id)?.name)
      .filter(Boolean);
    
    if (serviceNames.length <= 3) {
      return serviceNames.join(' + ');
    }
    
    return `${serviceNames.slice(0, 2).join(' + ')} +${serviceNames.length - 2}`;
  };

  const handleCreateBundle = () => {
    if (isLocked) return;
    setEditingBundle(null);
    setIsBundleEditorOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    if (isLocked) return;
    setEditingBundle(bundle);
    setIsBundleEditorOpen(true);
  };

  const handleDeleteBundle = (bundleId: string) => {
    if (isLocked) return;
    if (confirm(t.deleteConfirm)) {
      removeBundle(bundleId);
    }
  };

  const getRuleBadges = (bundle: Bundle) => {
    const badges = [];
    
    if (bundle.resourceRules.sameHuman) {
      badges.push('Один мастер');
    }
    
    if (bundle.resourceRules.concurrency === 'serial') {
      badges.push('По очереди');
    } else {
      badges.push('Параллельно');
    }
    
    return badges;
  };

  const getTeaserBundle = () => (
    <Card className="opacity-60">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-primary" />
              <h4 className="font-medium">{t.teaser}</h4>
              <Badge variant="secondary" className="text-xs">{t.teaserDiscount}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{t.teaserServices}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{t.teaserDuration}</span>
              </div>
              <div className="flex items-center gap-1">
                <RussianRuble className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium">{t.teaserPrice}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-50">
            <Lock className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="clean-card">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t.title}</h3>
                  {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                {relevantBundles.length > 0 && (
                  <Badge variant="secondary">{relevantBundles.length}</Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div className="flex-1" />
              <Button
                size="sm"
                onClick={handleCreateBundle}
                disabled={isLocked}
                className={isLocked ? '' : 'elegant-button'}
                variant={isLocked ? 'secondary' : 'default'}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.createBundle}
              </Button>
            </div>

            {/* Pro Feature Lock */}
            {isLocked && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{t.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{t.subtitle}</p>
                    </div>
                    
                    {/* Teaser Example */}
                    {getTeaserBundle()}
                    
                    <Button className="elegant-button">
                      {t.unlockPro}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bundle List */}
            {!isLocked && (
              <div className="space-y-3">
                {relevantBundles.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{t.emptyTitle}</h4>
                        <p className="text-sm text-muted-foreground">{t.emptyDesc}</p>
                      </div>
                      <Button onClick={handleCreateBundle} className="elegant-button">
                        <Plus className="h-4 w-4 mr-2" />
                        {t.createBundle}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  relevantBundles.map(bundle => {
                    const bundlePrice = calculateBundlePrice(bundle);
                    const bundleDuration = calculateBundleDuration(bundle);
                    const ruleBadges = getRuleBadges(bundle);

                    return (
                      <Card key={bundle.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="h-4 w-4 text-primary" />
                                <h4 className="font-medium">{bundle.name}</h4>
                                {bundle.priceMode === 'discount' && bundle.priceDiscountPct && (
                                  <Badge variant="secondary" className="text-xs">
                                    −{bundle.priceDiscountPct}%
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {getServiceNames(bundle.serviceIds)}
                              </p>
                              
                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{formatDuration(bundleDuration)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <RussianRuble className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm font-medium">{formatPrice(bundlePrice)}</span>
                                </div>
                              </div>
                              
                              {ruleBadges.length > 0 && (
                                <div className="flex gap-2">
                                  {ruleBadges.map(badge => (
                                    <Badge key={badge} variant="outline" className="text-xs">
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditBundle(bundle)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBundle(bundle.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>

      {/* Bundle Editor */}
      <BundleEditor
        isOpen={isBundleEditorOpen}
        onClose={() => {
          setIsBundleEditorOpen(false);
          setEditingBundle(null);
        }}
        bundle={editingBundle}
        currentServiceId={currentServiceId}
        userRole={userRole}
        plan={plan}
        locale={locale}
      />
    </Collapsible>
  );
}