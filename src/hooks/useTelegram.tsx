import { useEffect, useState, useCallback, useMemo } from 'react';

// Telegram WebApp type definitions
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        onEvent: (eventType: string, callback: (data?: any) => void) => void;
        offEvent: (eventType: string, callback: (data?: any) => void) => void;
        sendData: (data: string) => void;
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: { text?: string }, callback?: (text: string) => void) => boolean;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback?: (text: string) => void) => void;
        requestWriteAccess: (callback?: (granted: boolean) => void) => void;
        requestContact: (callback?: (granted: boolean, data?: any) => void) => void;
        invoiceUrl: string;
      };
    };
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showPopup: (params: any, callback?: (buttonId: string) => void) => void;
}

export function useTelegram() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportStableHeight, setViewportStableHeight] = useState(0);

  useEffect(() => {
    const initTelegram = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const webapp = window.Telegram.WebApp;
        setTg(webapp);
        setUser(webapp.initDataUnsafe?.user || null);
        setColorScheme(webapp.colorScheme);
        setIsExpanded(webapp.isExpanded);
        setViewportHeight(webapp.viewportHeight);
        setViewportStableHeight(webapp.viewportStableHeight);
        
        // Готовим приложение
        webapp.ready();
        webapp.expand();
        
        // Подписываемся на изменения viewport
        const handleViewportChange = () => {
          setViewportHeight(webapp.viewportHeight);
          setViewportStableHeight(webapp.viewportStableHeight);
          setIsExpanded(webapp.isExpanded);
        };
        
        // Подписываемся на изменения темы
        const handleThemeChange = () => {
          setColorScheme(webapp.colorScheme);
        };
        
        webapp.onEvent('viewportChanged', handleViewportChange);
        webapp.onEvent('themeChanged', handleThemeChange);
        
        setIsLoading(false);
        
        return () => {
          webapp.offEvent('viewportChanged', handleViewportChange);
          webapp.offEvent('themeChanged', handleThemeChange);
        };
      } else {
        // Fallback for development
        setIsLoading(false);
        setColorScheme('light');
        setViewportHeight(window.innerHeight || 600);
        setViewportStableHeight(window.innerHeight || 600);
      }
    };

    // Ждем загрузки Telegram WebApp
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        initTelegram();
      } else {
        // Пытаемся подождать немного на случай, если скрипт еще загружается
        const timeout = setTimeout(initTelegram, 100);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const showBackButton = useCallback((callback: () => void) => {
    if (tg?.BackButton) {
      tg.BackButton.onClick(callback);
      tg.BackButton.show();
    }
  }, [tg]);

  const hideBackButton = useCallback(() => {
    if (tg?.BackButton) {
      tg.BackButton.hide();
    }
  }, [tg]);

  const showMainButton = useCallback((text: string, callback: () => void) => {
    if (tg?.MainButton) {
      tg.MainButton.setText(text);
      tg.MainButton.onClick(callback);
      tg.MainButton.show();
    }
  }, [tg]);

  const hideMainButton = useCallback(() => {
    if (tg?.MainButton) {
      tg.MainButton.hide();
    }
  }, [tg]);

  const hapticFeedback = useMemo(() => ({
    light: () => tg?.HapticFeedback?.impactOccurred('light'),
    medium: () => tg?.HapticFeedback?.impactOccurred('medium'),
    heavy: () => tg?.HapticFeedback?.impactOccurred('heavy'),
    success: () => tg?.HapticFeedback?.notificationOccurred('success'),
    error: () => tg?.HapticFeedback?.notificationOccurred('error'),
    warning: () => tg?.HapticFeedback?.notificationOccurred('warning'),
    selection: () => tg?.HapticFeedback?.selectionChanged(),
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => tg?.HapticFeedback?.impactOccurred(style),
  }), [tg]);

  const showAlert = useCallback((message: string) => {
    if (tg?.showAlert) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  }, [tg]);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (tg?.showConfirm) {
        tg.showConfirm(message, resolve);
      } else {
        resolve(confirm(message));
      }
    });
  }, [tg]);

  const close = useCallback(() => {
    if (tg?.close) {
      tg.close();
    }
  }, [tg]);

  const isTelegramEnvironment = Boolean(tg);
  
  // Определяем safe area на основе viewport
  const safeAreaHeight = isExpanded ? viewportStableHeight : viewportHeight;

  const ready = useCallback(() => {
    if (tg?.ready) {
      tg.ready();
    }
  }, [tg]);

  return {
    tg,
    user,
    isLoading,
    colorScheme,
    isExpanded,
    viewportHeight,
    viewportStableHeight,
    safeAreaHeight,
    isTelegramEnvironment,
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    close,
    ready,
  };
}