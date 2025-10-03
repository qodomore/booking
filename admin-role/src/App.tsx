import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar,
  Users,
  BarChart3,
  Settings,
  Bell,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

// Import UI components
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Import custom components
import { TelegramHeader } from './components/TelegramHeader';
import { TelegramBottomNavigation } from './components/TelegramBottomNavigation';
import { CalendarGridFinal } from './components/CalendarGridFinal';
import { BookingDetailsDrawer } from './components/BookingDetailsDrawer';
import { CreateBookingDrawer } from './components/CreateBookingDrawer';
import { ClientPage } from './components/ClientPage';
import { Statistics } from './components/Statistics';
import { ServiceManagement } from './components/ServiceManagement';
import { ResourceManagement } from './components/ResourceManagement';
import { SettingsBottomSheet } from './components/SettingsBottomSheet';
import { AICenter } from './components/AICenter';
import { SmartPricing } from './components/SmartPricing';
import { Marketing } from './components/Marketing';
import { NotificationSettings } from './components/NotificationSettings';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { ClientDatabase } from './components/ClientDatabase';
import { PublicCatalog } from './components/PublicCatalog';
import { ThemeSettings } from './components/ThemeSettings';
import { GapsToday } from './components/GapsToday';
import { ICSFeeds } from './components/ICSFeeds';
import { InsightsRail } from './components/InsightsRail';
import { BrandingCard } from './components/BrandingCard';
import { PromoPremium } from './components/PromoPremium';

// Import Toaster
import { Toaster } from './components/ui/sonner';

// Import new screens
import { CreateAccountScreen } from './components/CreateAccountScreen';
import { CreateLocationScreen } from './components/CreateLocationScreen';
import { ConnectTelegramScreen } from './components/ConnectTelegramScreen';
import { TeamDashboardScreen } from './components/TeamDashboardScreen';
import { SecuritySessionsScreen } from './components/SecuritySessionsScreen';
import { WalletOverviewScreen } from './components/WalletOverviewScreen';
import { BillingHistoryScreen } from './components/BillingHistoryScreen';
import { LocaleSettingsScreen } from './components/LocaleSettingsScreen';
import { ScheduleTimeOffScreen } from './components/ScheduleTimeOffScreen';
import { DemoScreen } from './components/DemoScreen';
import { BookingConfirmationDemo } from './components/BookingConfirmationDemo';
import { UpsellHintTest } from './components/UpsellHintTest';

// Import contexts
import { BusinessProvider } from './contexts/BusinessContext';
import { ResourceProvider } from './contexts/ResourceContext';

// Import hooks
import { useTelegram } from './hooks/useTelegram';

function MainApp() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [activeSettingsPage, setActiveSettingsPage] = useState(null);
  
  // New screen states with navigation stack
  const [navigationStack, setNavigationStack] = useState<string[]>(['main']);
  const currentScreen = navigationStack[navigationStack.length - 1];

  // Debug logging
  useEffect(() => {
    console.log('Active settings page changed to:', activeSettingsPage);
  }, [activeSettingsPage]);

  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  useEffect(() => {
    console.log('Navigation stack:', navigationStack);
    console.log('Current screen:', currentScreen);
  }, [navigationStack, currentScreen]);

  const { hapticFeedback, showAlert, ready } = useTelegram();



  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking);
    setIsBookingDetailsOpen(true);
  };

  const handleCreateBooking = () => {
    setIsBookingDrawerOpen(true);
  };

  const handleNotificationsSettings = () => {
    if (hapticFeedback?.light) hapticFeedback.light();
    showAlert('Настройки уведомлений:\n\n✓ Push-уведомления включены\n✓ Email-уведомления включены\n✓ SMS-уведомления отключены\n\nДля изменения настроек обратитесь в поддержку.');
  };

  const handleSubscriptionSettings = () => {
    if (hapticFeedback?.light) hapticFeedback.light();
    setActiveSettingsPage('subscription');
  };

  const handleSettingsNavigation = (page: string) => {
    console.log('Navigation to:', page);
    if (hapticFeedback?.light) hapticFeedback.light();
    setActiveSettingsPage(page);
  };

  const handleBackToSettings = () => {
    console.log('Back to settings');
    if (hapticFeedback?.light) hapticFeedback.light();
    setActiveSettingsPage(null);
  };

  // Get page title based on active tab and settings page
  const getPageTitle = () => {
    // If in settings subpage, show that title
    if (activeSettingsPage === 'ai-center') return 'Интеллектуальный центр';
    if (activeSettingsPage === 'smart-pricing') return 'Автоценообразование';
    if (activeSettingsPage === 'analytics') return 'Аналитика и отчёты';
    if (activeSettingsPage === 'notifications') return 'Уведомления';
    if (activeSettingsPage === 'client-database') return 'База клиентов';
    if (activeSettingsPage === 'public-catalog') return 'Публичный каталог';
    if (activeSettingsPage === 'subscription') return 'Управление подпиской';
    if (activeSettingsPage === 'theme-settings') return 'Темы и оформление';
    
    // Otherwise show tab title
    if (activeTab === 'calendar') return 'Календарь';
    if (activeTab === 'resources') return 'Ресурсы';
    if (activeTab === 'services') return 'Услуги';
    if (activeTab === 'marketing') return 'Маркетинг';
    if (activeTab === 'settings') return 'Настройки';
    
    return 'Управление бизнесом';
  };

  // New screen navigation handlers with stack
  const handleNavigateToScreen = (screen: string) => {
    if (hapticFeedback?.light) hapticFeedback.light();
    setNavigationStack(prev => [...prev, screen]);
  };

  const handleBackToMain = () => {
    if (hapticFeedback?.light) hapticFeedback.light();
    setNavigationStack(['main']);
  };

  const handleBackToPrevious = () => {
    if (hapticFeedback?.light) hapticFeedback.light();
    setNavigationStack(prev => {
      if (prev.length <= 1) return ['main'];
      return prev.slice(0, -1);
    });
  };

  // Handle insights navigation
  const handleInsightsNavigation = (route: string, filters?: any) => {
    if (hapticFeedback?.light) hapticFeedback.light();
    
    // Navigate to different tabs/sections based on route
    switch (route) {
      case 'marketing':
        setActiveTab('marketing');
        // Store filters in state or pass to Marketing component
        break;
      case 'smart-pricing':
        setActiveSettingsPage('smart-pricing');
        setActiveTab('settings');
        break;
      case 'notifications':
        setActiveSettingsPage('notifications');
        setActiveTab('settings');
        break;
      default:
        console.log('Unknown route:', route, 'with filters:', filters);
    }
  };

  useEffect(() => {
    // Initialize Telegram WebApp
    if (ready) {
      ready();
    }
  }, [ready]);

  return (
    <div className="min-h-screen bg-background page-background">
      {/* Ambient ellipse elements */}
      <div className="ambient-ellipse-c"></div>
      <div className="noise-overlay"></div>
      
      <div className="relative z-1 page-content">
        {/* Conditional Screen Rendering */}
        {currentScreen === 'onboarding-account' && (
          <CreateAccountScreen 
            onNext={() => handleNavigateToScreen('onboarding-location')}
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'onboarding-location' && (
          <CreateLocationScreen 
            onNext={() => handleNavigateToScreen('onboarding-telegram')}
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'onboarding-telegram' && (
          <ConnectTelegramScreen 
            onNext={handleBackToPrevious}
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'team' && (
          <TeamDashboardScreen 
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'security' && (
          <SecuritySessionsScreen 
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'wallet' && (
          <WalletOverviewScreen 
            onBack={handleBackToPrevious}
            onViewTransactions={() => handleNavigateToScreen('billing')}
            locale="ru"
          />
        )}
        
        {currentScreen === 'billing' && (
          <BillingHistoryScreen 
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'locale' && (
          <LocaleSettingsScreen 
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'schedule' && (
          <ScheduleTimeOffScreen 
            onBack={handleBackToPrevious}
            locale="ru"
          />
        )}
        
        {currentScreen === 'demo' && (
          <DemoScreen 
            onBack={handleBackToPrevious}
            onNavigate={handleNavigateToScreen}
            locale="ru"
          />
        )}
        
        {currentScreen === 'booking-confirmation' && (
          <BookingConfirmationDemo 
            onBack={handleBackToPrevious}
          />
        )}
        
        {currentScreen === 'upsell-hint-test' && (
          <UpsellHintTest />
        )}

        {/* Main App Content */}
        {currentScreen === 'main' && (
          <>
            {/* Header */}
            <TelegramHeader 
              title={getPageTitle()}
              showBackButton={activeSettingsPage !== null}
              onBack={activeSettingsPage ? handleBackToSettings : undefined}
              onMenuClick={() => setIsSettingsOpen(true)}
              onNotificationClick={() => {}}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-20 pt-4 overflow-x-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation - Hidden but required for Tabs to work */}
            <TabsList className="sr-only">
              <TabsTrigger value="calendar">Календарь</TabsTrigger>
              <TabsTrigger value="resources">Ресурсы</TabsTrigger>
              <TabsTrigger value="services">Услуги</TabsTrigger>
              <TabsTrigger value="marketing">Маркетинг</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="calendar" className="space-y-4 max-w-full">
              {/* Search and Filters */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск записей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateBooking}
                  className="elegant-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать
                </Button>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="p-4 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button variant="outline" size="sm">
                          Сегодня
                        </Button>
                        <Button variant="outline" size="sm">
                          Завтра
                        </Button>
                        <Button variant="outline" size="sm">
                          Эта неделя
                        </Button>
                        <Button variant="outline" size="sm">
                          Все мастера
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Free Slots Today - Under Filters */}
              <GapsToday
                locale="ru"
                sendQuotaLeft={45}
                plan="free"
                onSlotBook={(slot) => {
                  if (hapticFeedback?.light) hapticFeedback.light();
                  // Handle slot booking - could open booking drawer with pre-filled data
                  console.log('Booking slot:', slot);
                }}
              />

              {/* Calendar */}
              <CalendarGridFinal
                onBookingSelect={handleBookingSelect}
                onCreateBooking={handleCreateBooking}
                searchQuery={searchQuery}
              />
            </TabsContent>

            <TabsContent value="resources" className="max-w-full">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Управление ресурсами</h2>
                  <Button size="sm" onClick={() => handleNavigateToScreen('schedule')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Расписание
                  </Button>
                </div>

                {/* Insights Rail - AI recommendations */}
                <InsightsRail
                  locale="ru"
                  plan="free" // Change to "pro" to test full features
                  theme="blue"
                  onNavigate={handleInsightsNavigation}
                />

                {/* Управление ресурсами */}
                <ResourceManagement />
              </div>
            </TabsContent>

            <TabsContent value="services" className="max-w-full">
              <div className="space-y-6 max-w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Управление услугами</h2>
                </div>

                {/* AI Assistant */}
                <div className="max-w-full">
                  <button 
                    onClick={() => {
                      if (hapticFeedback?.light) hapticFeedback.light();
                      handleSettingsNavigation('ai-center');
                      setActiveTab('settings');
                    }}
                    className="w-full p-4 rounded-xl bg-card border-2 border-border text-left transition-all duration-200 hover:border-primary hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground mb-0.5">AI Ассистент</div>
                        <div className="text-xs text-muted-foreground leading-snug">Помощник записи</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Управление услугами */}
                <ServiceManagement />
              </div>
            </TabsContent>



            <TabsContent value="marketing" className="max-w-full">
              <Marketing 
                locale="ru"
                plan="pro" // Change to "free" to test locked features
                sendQuotaLeft={25}
              />
            </TabsContent>



            <TabsContent value="settings">
              {activeSettingsPage ? (
                <>
                  {activeSettingsPage === 'ai-center' && (
                    <AICenter onBack={handleBackToSettings} />
                  )}
                  {activeSettingsPage === 'smart-pricing' && (
                    <SmartPricing onBack={handleBackToSettings} />
                  )}
                  {activeSettingsPage === 'analytics' && (
                    <Statistics 
                      onBack={handleBackToSettings}
                      onOpenSmartPricing={() => {
                        setActiveSettingsPage('smart-pricing');
                        if (hapticFeedback?.light) hapticFeedback.light();
                      }}
                    />
                  )}
                  {activeSettingsPage === 'notifications' && (
                    <NotificationSettings onBack={handleBackToSettings} />
                  )}
                  {activeSettingsPage === 'client-database' && (
                    <ClientDatabase onBack={handleBackToSettings} />
                  )}
                  {activeSettingsPage === 'public-catalog' && (
                    <PublicCatalog onBack={handleBackToSettings} />
                  )}
                  {activeSettingsPage === 'subscription' && (
                    <SubscriptionScreen onBack={handleBackToSettings} />
                  )}
                  {activeSettingsPage === 'theme-settings' && (
                    <ThemeSettings onBack={handleBackToSettings} />
                  )}
                </>
              ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Настройки</h2>
                </div>

                {/* Внешний вид */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Внешний вид</h3>
                  
                  {/* Branding Card */}
                  <BrandingCard
                    locale="ru"
                    isAdmin={true}
                    plan="free" // Change to "pro" to test full features
                    theme="blue"
                    onBrandingChange={(branding) => {
                      console.log('Branding changed:', branding);
                      // Handle branding changes here
                    }}
                  />
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSettingsNavigation('theme-settings')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Темы и оформление</p>
                        <p className="text-xs text-muted-foreground">Цветовая схема и темная тема</p>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleNavigateToScreen('locale')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Язык интерфейса</p>
                        <p className="text-xs text-muted-foreground">Локализация системы</p>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Интеллектуальные инструменты */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Интеллектуальные инструменты</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSettingsNavigation('analytics')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Аналитика и отчёты</p>
                        <p className="text-xs text-muted-foreground">Статистика и диаграммы</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSettingsNavigation('ai-center')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Интеллектуальный центр</p>
                        <p className="text-xs text-muted-foreground">Анализ данных и автоматизация</p>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSettingsNavigation('smart-pricing')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Автоценообразование</p>
                        <p className="text-xs text-muted-foreground">Динамическая настройка цен</p>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Клиенты и коммуникации */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Клиенты и коммуникации</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSettingsNavigation('notifications')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Уведомления</p>
                        <p className="text-xs text-muted-foreground">SMS, Telegram, WhatsApp</p>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSettingsNavigation('client-database')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">База клиентов</p>
                        <p className="text-xs text-muted-foreground">История и аналитика</p>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Контент и предложения */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Контент и предложения</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSettingsNavigation('public-catalog')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Публичный каталог</p>
                        <p className="text-xs text-muted-foreground">Витрина предложений</p>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Продвижение */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Продвижение</h3>
                  
                  {/* Premium Placement Component */}
                  <PromoPremium
                    locale="ru"
                    plan="free" // Change to "pro" to test discount
                    inventoryStatus="ok" // Change to "low" or "none" to test inventory states
                    onCampaignCreate={(campaign) => {
                      console.log('Campaign created:', campaign);
                      // Handle campaign creation here
                    }}
                  />
                </div>

                {/* Интеграции */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Интеграции</h3>
                  
                  {/* ICS Feeds Component */}
                  <ICSFeeds 
                    locale="ru"
                    plan="pro" // Change to "free" to test locked features
                    isAdmin={true}
                    theme="blue"
                  />
                </div>

                {/* Команда */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Команда</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleNavigateToScreen('team')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Управление командой</p>
                        <p className="text-xs text-muted-foreground">Роли и приглашения</p>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Подписка и биллинг */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Подписка и биллинг</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={handleSubscriptionSettings}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Управление подпиской</p>
                        <p className="text-xs text-muted-foreground">Тарифы и возможности</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleNavigateToScreen('wallet')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Кошелёк</p>
                        <p className="text-xs text-muted-foreground">Баланс и транзакции</p>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Безопасность */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Безопасность</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleNavigateToScreen('security')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Сессии и безопаснось</p>
                        <p className="text-xs text-muted-foreground">Активные устройства</p>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Онбординг (для демо) */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Демо</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleNavigateToScreen('demo')}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Все новые экраны</p>
                        <p className="text-xs text-muted-foreground">Демонстрация функций</p>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              )}
            </TabsContent>
          </Tabs>
            </div>

            {/* Bottom Navigation */}
            <TelegramBottomNavigation
              activeItem={activeTab}
              onItemClick={setActiveTab}
            />

            {/* Drawers and Modals */}
            <CreateBookingDrawer
              isOpen={isBookingDrawerOpen}
              onClose={() => setIsBookingDrawerOpen(false)}
              onBookingCreated={() => {
                setIsBookingDrawerOpen(false);
                // Refresh calendar or show success message
              }}
            />

            <BookingDetailsDrawer
              isOpen={isBookingDetailsOpen}
              onClose={() => setIsBookingDetailsOpen(false)}
              booking={selectedBooking}
            />

            <SettingsBottomSheet
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />

            {/* Toast Notifications */}
            <Toaster />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BusinessProvider>
      <ResourceProvider>
        <MainApp />
      </ResourceProvider>
    </BusinessProvider>
  );
}