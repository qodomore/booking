import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface Step02TelegramProps {
  locale?: 'RU' | 'EN';
}

type ConnectionStatus = 'not_connected' | 'connecting' | 'connected' | 'error';

export function Step02Telegram({ locale = 'RU' }: Step02TelegramProps) {
  const [status, setStatus] = useState<ConnectionStatus>('not_connected');
  const [botToken, setBotToken] = useState('');

  const content = {
    RU: {
      title: 'Подключите Telegram Mini-App',
      subtitle: 'Создайте бота и подключите Mini-App для ваших клиентов',
      steps: {
        create: 'Создать бота через @BotFather',
        token: 'Скопировать токен бота',
        connect: 'Подключить к Qodo'
      },
      botToken: 'Токен бота',
      tokenPlaceholder: 'Вставьте токен от @BotFather',
      connect: 'Подключить',
      connecting: 'Подключение...',
      connected: 'Подключено успешно!',
      error: 'Ошибка подключения. Проверьте токен.',
      instructions: 'Откройте @BotFather в Telegram и создайте нового бота',
      example: 'Пример: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz'
    },
    EN: {
      title: 'Connect Telegram Mini-App',
      subtitle: 'Create a bot and connect Mini-App for your clients',
      steps: {
        create: 'Create bot via @BotFather',
        token: 'Copy bot token',
        connect: 'Connect to Qodo'
      },
      botToken: 'Bot Token',
      tokenPlaceholder: 'Paste token from @BotFather',
      connect: 'Connect',
      connecting: 'Connecting...',
      connected: 'Connected successfully!',
      error: 'Connection error. Check your token.',
      instructions: 'Open @BotFather in Telegram and create a new bot',
      example: 'Example: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz'
    }
  };

  const t = content[locale];

  const handleConnect = async () => {
    if (!botToken.trim()) return;
    
    setStatus('connecting');
    
    // Simulate API call
    setTimeout(() => {
      if (botToken.includes(':')) {
        setStatus('connected');
      } else {
        setStatus('error');
      }
    }, 2000);
  };

  const copyExample = () => {
    navigator.clipboard.writeText('123456789:ABCdefGHIjklMNOpqrsTUVwxyz');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(t.steps).map(([key, step], index) => (
          <div key={key} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
              {index + 1}
            </div>
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>

      {/* Connection Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="botToken">{t.botToken}</Label>
            <Input
              id="botToken"
              placeholder={t.tokenPlaceholder}
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              disabled={status === 'connecting' || status === 'connected'}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t.example}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyExample}
                className="h-auto p-1"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {status === 'not_connected' && (
            <Button 
              onClick={handleConnect}
              disabled={!botToken.trim()}
              className="w-full"
            >
              {t.connect}
            </Button>
          )}

          {status === 'connecting' && (
            <Button disabled className="w-full">
              {t.connecting}
            </Button>
          )}

          {status === 'connected' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {t.connected}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {t.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            {t.instructions}
          </div>
        </div>
      </div>
    </div>
  );
}