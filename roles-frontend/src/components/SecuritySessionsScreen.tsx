import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Monitor, 
  Smartphone, 
  Tablet,
  MapPin,
  Clock,
  AlertTriangle,
  Check,
  X,
  MoreVertical,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner';

interface SecuritySessionsScreenProps {
  onBack?: () => void;
  state?: 'default' | 'empty' | 'loading' | 'success' | 'error';
  locale?: 'ru' | 'en';
}

interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

const mockSessions: Session[] = [
  {
    id: '1',
    device: 'MacBook Pro',
    browser: 'Safari 17.2',
    os: 'macOS Sonoma',
    ip: '192.168.1.100',
    location: 'Москва, Россия',
    loginTime: '2024-01-15 09:30',
    lastActive: 'только что',
    isCurrent: true,
    deviceType: 'desktop'
  },
  {
    id: '2',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari',
    os: 'iOS 17.2',
    ip: '192.168.1.101',
    location: 'Москва, Россия',
    loginTime: '2024-01-14 18:45',
    lastActive: '2 часа назад',
    isCurrent: false,
    deviceType: 'mobile'
  },
  {
    id: '3',
    device: 'Windows Desktop',
    browser: 'Chrome 120.0',
    os: 'Windows 11',
    ip: '87.250.250.242',
    location: 'Санкт-Петербург, Россия',
    loginTime: '2024-01-12 14:20',
    lastActive: '3 дня назад',
    isCurrent: false,
    deviceType: 'desktop'
  },
  {
    id: '4',
    device: 'iPad Air',
    browser: 'Mobile Safari',
    os: 'iPadOS 17.1',
    ip: '78.108.80.1',
    location: 'Казань, Россия',
    loginTime: '2024-01-10 11:15',
    lastActive: '5 дней назад',
    isCurrent: false,
    deviceType: 'tablet'
  }
];

const texts = {
  ru: {
    title: 'Безопасность и сессии',
    subtitle: 'Управление активными сессиями и безопасностью аккаунта',
    activeSessions: 'Активные сессии',
    currentSession: 'Текущая сессия',
    device: 'Устройство',
    location: 'Местоположение',
    lastActive: 'Последняя активность',
    loginTime: 'Время входа',
    terminateAll: 'Завершить все сессии',
    terminate: 'Завершить',
    terminateConfirm: 'Завершить сессию',
    terminateConfirmText: 'Вы уверены, что хотите завершить эту сессию? Пользователь будет выведен из системы.',
    terminateAllConfirm: 'Завершить все сессии',
    terminateAllConfirmText: 'Вы уверены, что хотите завершить все сессии кроме текущей? Все пользователи будут выведены из системы.',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    sessionTerminated: 'Сессия завершена',
    allSessionsTerminated: 'Все сессии завершены',
    error: 'Ошибка при завершении сессии',
    empty: 'Нет активных сессий',
    emptyDescription: 'Все сессии были завершены или истекли',
    securityTips: 'Советы по безопасности',
    tip1: 'Завершайте сессии на чужих устройствах',
    tip2: 'Проверяйте подозрительные входы',
    tip3: 'Используйте надежные пароли'
  },
  en: {
    title: 'Security & Sessions',
    subtitle: 'Manage active sessions and account security',
    activeSessions: 'Active Sessions',
    currentSession: 'Current Session',
    device: 'Device',
    location: 'Location',
    lastActive: 'Last Active',
    loginTime: 'Login Time',
    terminateAll: 'Terminate All Sessions',
    terminate: 'Terminate',
    terminateConfirm: 'Terminate Session',
    terminateConfirmText: 'Are you sure you want to terminate this session? The user will be logged out.',
    terminateAllConfirm: 'Terminate All Sessions',
    terminateAllConfirmText: 'Are you sure you want to terminate all sessions except current? All users will be logged out.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    sessionTerminated: 'Session terminated',
    allSessionsTerminated: 'All sessions terminated',
    error: 'Error terminating session',
    empty: 'No active sessions',
    emptyDescription: 'All sessions have been terminated or expired',
    securityTips: 'Security Tips',
    tip1: 'Terminate sessions on shared devices',
    tip2: 'Check for suspicious logins',
    tip3: 'Use strong passwords'
  }
};

export function SecuritySessionsScreen({ 
  onBack, 
  state = 'default',
  locale = 'ru' 
}: SecuritySessionsScreenProps) {
  const [sessions, setSessions] = useState(mockSessions);
  const [isTerminating, setIsTerminating] = useState<string | null>(null);
  const [isTerminatingAll, setIsTerminatingAll] = useState(false);

  const t = texts[locale];

  const getDeviceIcon = (deviceType: Session['deviceType']) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const terminateSession = async (sessionId: string) => {
    setIsTerminating(sessionId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      toast.success(t.sessionTerminated);
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsTerminating(null);
    }
  };

  const terminateAllSessions = async () => {
    setIsTerminatingAll(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Keep only current session
      setSessions(prev => prev.filter(session => session.isCurrent));
      toast.success(t.allSessionsTerminated);
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsTerminatingAll(false);
    }
  };

  if (state === 'empty') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t.empty}</h3>
          <p className="text-muted-foreground">{t.emptyDescription}</p>
        </div>
      </div>
    );
  }

  const activeSessions = sessions.filter(session => !session.isCurrent);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        
        {activeSessions.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                disabled={isTerminatingAll}
              >
                {isTerminatingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                {t.terminateAll}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.terminateAllConfirm}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.terminateAllConfirmText}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={terminateAllSessions}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {t.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Current Session */}
      {sessions.find(session => session.isCurrent) && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">{t.currentSession}</h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'ru' ? 'Эта сессия сейчас активна' : 'This session is currently active'}
              </p>
            </div>
          </div>
          
          {(() => {
            const currentSession = sessions.find(session => session.isCurrent)!;
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(currentSession.deviceType)}
                  <div>
                    <div className="font-medium">{currentSession.device}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentSession.browser} • {currentSession.os}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{currentSession.location}</div>
                    <div className="text-sm text-muted-foreground">{currentSession.ip}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm">{t.loginTime}</div>
                    <div className="text-sm text-muted-foreground">{currentSession.loginTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5" />
                  <div>
                    <div className="text-sm">{t.lastActive}</div>
                    <div className="text-sm text-muted-foreground">{currentSession.lastActive}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>
      )}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <Card>
          <div className="p-6 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t.activeSessions}
              <Badge variant="secondary">{activeSessions.length}</Badge>
            </h3>
          </div>
          
          <div className="divide-y">
            <AnimatePresence>
              {activeSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(session.deviceType)}
                        <div>
                          <div className="font-medium">{session.device}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.browser} • {session.os}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{session.location}</div>
                          <div className="text-sm text-muted-foreground">{session.ip}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">{session.lastActive}</div>
                          <div className="text-xs text-muted-foreground">
                            {t.loginTime}: {session.loginTime}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                            disabled={isTerminating === session.id}
                          >
                            {isTerminating === session.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t.terminateConfirm}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t.terminateConfirmText}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => terminateSession(session.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t.confirm}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      )}

      {/* Security Tips */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t.securityTips}</h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• {t.tip1}</li>
              <li>• {t.tip2}</li>
              <li>• {t.tip3}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}