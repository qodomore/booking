import React, { useState } from "react";
import { MessageSquare, Mail, Phone, Eye, Edit3, Copy, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  channels: ('telegram' | 'sms' | 'whatsapp' | 'email')[];
  content: {
    telegram?: string;
    sms?: string;
    whatsapp?: string;
    email?: {
      subject: string;
      body: string;
    };
  };
  variables: string[];
  effectiveness?: string;
  usage?: number;
}

const mockTemplates: MessageTemplate[] = [
  {
    id: 'return-discount',
    name: 'Скидка на возврат',
    category: 'Возврат клиентов',
    channels: ['telegram', 'sms', 'whatsapp'],
    content: {
      telegram: `Привет, {имя}! 🌟\n\nСкучаем по тебе! Специально для тебя скидка {скидка}% на {услуга}.\n\nЗапишись до {дата} и получи скидку 💫`,
      sms: `{имя}, скучаем! Скидка {скидка}% на {услуга} до {дата}. Запись: {ссылка}`,
      whatsapp: `Привет, {имя}! 👋\n\nДавно тебя не видели! Дарим скидку {скидка}% на твою любимую {услуга}.\n\nДействует до {дата} ⏰`
    },
    variables: ['имя', 'скидка', 'услуга', 'дата', 'ссылка'],
    effectiveness: '78%',
    usage: 245
  },
  {
    id: 'appointment-reminder',
    name: 'Напоминание о записи',
    category: 'Напоминания',
    channels: ['telegram', 'sms', 'whatsapp', 'email'],
    content: {
      telegram: `{имя}, напоминаем о записи:\n\n📅 {дата}\n🕐 {время}\n👩‍💼 Мастер: {мастер}\n🏠 {адрес}`,
      sms: `{имя}, завтра в {время} запись к {мастер}. Адрес: {адрес}`,
      whatsapp: `Привет, {имя}! 📅\n\nНапоминаю о записи завтра в {время} к мастеру {мастер}.\n\nДо встречи! ✨`,
      email: {
        subject: 'Напоминание о записи на {дата}',
        body: `Здравствуйте, {имя}!\n\nНапоминаем вам о предстоящей записи:\n\nДата: {дата}\nВремя: {время}\nМастер: {мастер}\nАдрес: {адрес}\n\nДо встречи!`
      }
    },
    variables: ['имя', 'дата', 'время', 'мастер', 'адрес'],
    effectiveness: '92%',
    usage: 1523
  },
  {
    id: 'vip-offer',
    name: 'VIP предложение',
    category: 'VIP клиенты',
    channels: ['telegram', 'whatsapp', 'email'],
    content: {
      telegram: `{имя}, у нас есть эксклюзивное предложение! 💎\n\n✨ {услуга}\n🎁 Специальная цена: {цена}\n\nТолько для наших VIP клиентов!`,
      whatsapp: `Эксклюзив для тебя, {имя}! 👑\n\nПредлагаем попробовать новую {услуга} по специальной цене {цена}.\n\nЗаинтересовалась? Пиши! 💌`,
      email: {
        subject: 'Эксклюзивное предложение для {имя}',
        body: `Дорогая {имя}!\n\nУ нас появилась новая услуга - {услуга}, и мы хотим предложить её вам первой!\n\nСпециальная цена для VIP клиентов: {цена}\n\nЗаписывайтесь скорее!`
      }
    },
    variables: ['имя', 'услуга', 'цена'],
    effectiveness: '85%',
    usage: 89
  }
];

const channelIcons = {
  telegram: MessageSquare,
  whatsapp: MessageSquare,
  sms: Phone,
  email: Mail
};

const channelColors = {
  telegram: 'text-blue-600 bg-blue-50',
  whatsapp: 'text-green-600 bg-green-50',
  sms: 'text-purple-600 bg-purple-50',
  email: 'text-gray-600 bg-gray-50'
};

const getPreviewDevice = (channel: string) => {
  if (channel === 'email') return 'desktop';
  return 'mobile';
};

export function TemplatePreview() {
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0].id);
  const [selectedChannel, setSelectedChannel] = useState<'telegram' | 'sms' | 'whatsapp' | 'email'>('telegram');
  const [previewMode, setPreviewMode] = useState<'preview' | 'edit'>('preview');

  const currentTemplate = mockTemplates.find(t => t.id === selectedTemplate) || mockTemplates[0];
  const availableChannels = currentTemplate.channels;

  // Ensure selected channel is available for current template
  React.useEffect(() => {
    if (!availableChannels.includes(selectedChannel)) {
      setSelectedChannel(availableChannels[0]);
    }
  }, [selectedTemplate, availableChannels, selectedChannel]);

  const renderPreview = () => {
    const content = currentTemplate.content[selectedChannel];
    
    if (!content) return null;

    const isEmail = selectedChannel === 'email';
    const emailContent = content as { subject: string; body: string };
    
    return (
      <div className={`${getPreviewDevice(selectedChannel) === 'mobile' ? 'max-w-xs mx-auto' : 'max-w-lg'}`}>
        {/* Mobile Preview */}
        {getPreviewDevice(selectedChannel) === 'mobile' && (
          <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Phone Header */}
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  {React.createElement(channelIcons[selectedChannel], { className: "h-3 w-3" })}
                </div>
                <span className="text-xs font-medium">
                  {selectedChannel === 'telegram' ? 'Telegram' :
                   selectedChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                </span>
              </div>
              
              {/* Message Content */}
              <div className="p-4 min-h-32">
                <div className={`
                  inline-block p-3 rounded-2xl max-w-full text-sm leading-relaxed
                  ${selectedChannel === 'telegram' ? 'bg-blue-500 text-white' :
                    selectedChannel === 'whatsapp' ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-900'}
                `}>
                  {typeof content === 'string' 
                    ? content.split('\n').map((line, i) => (
                        <div key={i}>{line || '\u00A0'}</div>
                      ))
                    : content
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop/Email Preview */}
        {getPreviewDevice(selectedChannel) === 'desktop' && isEmail && (
          <div className="bg-white border rounded-lg shadow-sm">
            {/* Email Header */}
            <div className="border-b p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">Тема: {emailContent.subject}</div>
              </div>
            </div>
            
            {/* Email Body */}
            <div className="p-4">
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {emailContent.body}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVariables = () => {
    return (
      <div className="space-y-2">
        <h6 className="text-xs font-medium text-muted-foreground">Переменные:</h6>
        <div className="flex flex-wrap gap-1">
          {currentTemplate.variables.map((variable) => (
            <Badge key={variable} variant="outline" className="text-xs">
              {`{${variable}}`}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Шаблоны сообщений</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Копировать
            </Button>
            <Button variant="outline" size="sm">
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Шаблон:</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{template.name}</span>
                    {template.effectiveness && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {template.effectiveness}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Channel Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Канал:</label>
          <Tabs value={selectedChannel} onValueChange={(value) => setSelectedChannel(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              {availableChannels.map((channel) => {
                const Icon = channelIcons[channel];
                return (
                  <TabsTrigger key={channel} value={channel} className="gap-1">
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline capitalize">{channel}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">Предпросмотр:</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode(previewMode === 'preview' ? 'edit' : 'preview')}
              className="h-6 px-2 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              {previewMode === 'preview' ? 'Редактировать' : 'Предпросмотр'}
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/20">
            {renderPreview()}
          </div>
        </div>

        {/* Variables */}
        {renderVariables()}

        {/* Template Stats */}
        {(currentTemplate.effectiveness || currentTemplate.usage) && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            {currentTemplate.effectiveness && (
              <div className="text-center">
                <div className="text-sm font-semibold text-green-600">
                  {currentTemplate.effectiveness}
                </div>
                <div className="text-xs text-muted-foreground">Эффективность</div>
              </div>
            )}
            {currentTemplate.usage && (
              <div className="text-center">
                <div className="text-sm font-semibold">{currentTemplate.usage}</div>
                <div className="text-xs text-muted-foreground">Использований</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Компонент для списка шаблонов
interface TemplateListProps {
  templates: MessageTemplate[];
  onSelectTemplate?: (templateId: string) => void;
  onEditTemplate?: (templateId: string) => void;
  onUseTemplate?: (templateId: string, channel: string) => void;
  className?: string;
}

export function TemplateList({
  templates,
  onSelectTemplate,
  onEditTemplate,
  onUseTemplate,
  className = ''
}: TemplateListProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {templates.map((template) => (
        <Card key={template.id} className="glass-card hover:shadow-elegant transition-all duration-300 cursor-pointer">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h6 className="font-medium text-sm truncate">{template.name}</h6>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                  {template.effectiveness && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      {template.effectiveness}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {template.channels.map((channel) => {
                  const Icon = channelIcons[channel];
                  const colorClass = channelColors[channel];
                  return (
                    <div key={channel} className={`p-1 rounded ${colorClass}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}