import React, { useState } from 'react';
import { Brain, Sparkles, MessageSquare, TrendingUp, Users, FileText, Wand2, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface RetentionInsight {
  id: string;
  clientName: string;
  riskLevel: 'high' | 'medium' | 'low';
  lastVisit: string;
  recommendation: string;
  probability: number;
}

interface ContentSuggestion {
  id: string;
  type: 'social' | 'email' | 'sms' | 'promotion';
  title: string;
  content: string;
  engagement: number;
  target: string;
}

const retentionInsights: RetentionInsight[] = [
  {
    id: '1',
    clientName: 'Анна Смирнова',
    riskLevel: 'high',
    lastVisit: '2024-05-15',
    recommendation: 'Предложите персональную скидку 15% на следующий визит. Клиент предпочитает вечернее время.',
    probability: 85
  },
  {
    id: '2',
    clientName: 'Мария Козлова',
    riskLevel: 'medium',
    lastVisit: '2024-06-20',
    recommendation: 'Отправьте напоминание о новых трендах в окрашивании. Клиент интересуется модными техниками.',
    probability: 65
  },
  {
    id: '3',
    clientName: 'Елена Волкова',
    riskLevel: 'low',
    lastVisit: '2024-07-01',
    recommendation: 'Регулярный клиент. Предложите программу лояльности или реферальную программу.',
    probability: 25
  }
];

const contentSuggestions: ContentSuggestion[] = [
  {
    id: '1',
    type: 'social',
    title: 'Instagram пост - Летние тренды',
    content: '🌞 Летние тренды в маникюре 2024! ✨\n\nЯркие неоновые оттенки, минималистичный дизайн и натуральные текстуры - все это ждет вас в нашем салоне!\n\n📞 Записывайтесь прямо сейчас\n#маникюр #летнийтренд #красота',
    engagement: 92,
    target: 'Женщины 25-35 лет'
  },
  {
    id: '2',
    type: 'email',
    title: 'Email рассылка - Персональное предложение',
    content: 'Привет, [Имя]!\n\nСоскучились по вашим визитам! У нас есть специальное предложение именно для вас:\n\n🎁 Скидка 20% на любую услуга до конца месяца\n🌟 Бонусная консультация по уходу\n\nЗаписывайтесь по ссылке или звоните нам!',
    engagement: 78,
    target: 'Неактивные клиенты'
  },
  {
    id: '3',
    type: 'sms',
    title: 'SMS напоминание',
    content: 'Привет! Напоминаем о записи завтра в 15:00 к мастеру Анне. Если планы изменились, предупредите за 2 часа. До встречи! 💅',
    engagement: 95,
    target: 'Записанные клиенты'
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Акция "Приведи подругу"',
    content: 'АКЦИЯ "ПРИВЕДИ ПОДРУГУ" 👯‍♀️\n\nПриведите подругу - получите скидку 30% на следующий визит! \nПодруга получает скидку 20% на первый визит.\n\nВыгодно всем! 💝\n\nДействует до конца месяца.',
    engagement: 88,
    target: 'VIP клиенты'
  }
];

export function AITools() {
  const [selectedRetentionFilter, setSelectedRetentionFilter] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState(5);

  const getRiskColor = (risk: RetentionInsight['riskLevel']) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: ContentSuggestion['type']) => {
    switch (type) {
      case 'social': return '📱';
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'promotion': return '🎁';
      default: return '📄';
    }
  };

  const filteredRetentionInsights = retentionInsights.filter(insight => {
    if (selectedRetentionFilter === 'all') return true;
    return insight.riskLevel === selectedRetentionFilter;
  });

  const filteredContentSuggestions = contentSuggestions.filter(suggestion => {
    if (selectedContentType === 'all') return true;
    return suggestion.type === selectedContentType;
  });

  const handleGenerateContent = async () => {
    if (remainingGenerations <= 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const prompts = [
        "🌟 НОВИНКА В НАШЕМ САЛОНЕ! 🌟\n\nВстречайте революционную процедуру восстановления волос с использованием кератина премиум-класса!\n\n✨ Результат после первой процедуры\n🕐 Экономия времени на укладке\n💫 Здоровые и блестящие волосы\n\nЗаписывайтесь прямо сейчас! Количество мест ограничено.\n\n#салонкрасоты #кератин #волосы",
        
        "💅 МАНИКЮР-МАРАФОН НА ВЫХОДНЫХ! 💅\n\nСуббота и воскресенье - дни идеального маникюра!\n\n🎯 Экспресс-маникюр за 45 минут\n🌈 Новая коллекция гель-лаков\n💎 Дизайн от топ-мастеров\n\nБронируйте время заранее!\n\n#маникюр #выходные #красота",
        
        "🎉 ДЕНЬ РОЖДЕНИЯ САЛОНА - МЕСЯЦ ПОДАРКОВ! 🎉\n\nВесь июль дарим скидки и сюрпризы:\n\n📅 Понедельник - скидка 20% на стрижки\n💆‍♀️ Среда - массаж лица в подарок\n💅 Пятница - дизайн ногтей бесплатно\n\nПрисоединяйтесь к празднику красоты!"
      ];
      
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setGeneratedContent(randomPrompt);
      setRemainingGenerations(prev => prev - 1);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">AI Инструменты</h2>
          <p className="text-gray-500 mt-1 text-sm">Искусственный интеллект для роста бизнеса</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Sparkles className="w-3 h-3" />
            AI Premium
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="retention" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="retention" className="flex items-center gap-2 text-xs md:text-sm">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">AI Retention</span>
            <span className="sm:hidden">Retention</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2 text-xs md:text-sm">
            <FileText className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">AI Копирайтер</span>
            <span className="sm:hidden">Контент</span>
          </TabsTrigger>
        </TabsList>

        {/* AI Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Summary Cards */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900">3</p>
                    <p className="text-xs md:text-sm text-gray-500">Клиенты в зоне риска</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900">85%</p>
                    <p className="text-xs md:text-sm text-gray-500">Точность прогноза</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900">12</p>
                    <p className="text-xs md:text-sm text-gray-500">Клиентов вернулось</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedRetentionFilter} onValueChange={setSelectedRetentionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Уровень риска" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все клиенты</SelectItem>
                <SelectItem value="high">Высокий риск</SelectItem>
                <SelectItem value="medium">Средний риск</SelectItem>
                <SelectItem value="low">Низкий риск</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Retention Insights */}
          <div className="space-y-4">
            {filteredRetentionInsights.map(insight => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-gray-900">{insight.clientName}</h3>
                        <Badge className={getRiskColor(insight.riskLevel)}>
                          {insight.riskLevel === 'high' ? 'Высокий риск' :
                           insight.riskLevel === 'medium' ? 'Средний риск' : 'Низкий риск'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Последний визит:</strong> {new Date(insight.lastVisit).toLocaleDateString('ru-RU')}
                        </p>
                        <p className="text-sm text-gray-700">{insight.recommendation}</p>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-gray-500">Вероятность ухода:</span>
                          <Progress value={insight.probability} className="flex-1 max-w-32" />
                          <span className="text-xs font-medium">{insight.probability}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Написать
                      </Button>
                      <Button size="sm">
                        Применить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Copywriter Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Usage Counter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Копирайтер</h3>
                    <p className="text-sm text-gray-500">Генерация контента для маркетинга</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">Осталось генераций в этом месяце:</p>
                  <p className="text-xl font-semibold text-gray-900">{remainingGenerations}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Генератор контента</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Тип контента" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Социальные сети</SelectItem>
                    <SelectItem value="email">Email рассылка</SelectItem>
                    <SelectItem value="sms">SMS уведомления</SelectItem>
                    <SelectItem value="promotion">Акции и предложения</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Целевая аудитория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новые клиенты</SelectItem>
                    <SelectItem value="regular">Постоянные клиенты</SelectItem>
                    <SelectItem value="vip">VIP клиенты</SelectItem>
                    <SelectItem value="inactive">Неактивные клиенты</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleGenerateContent}
                  disabled={isGenerating || remainingGenerations <= 0}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Генерирую...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Генерировать
                    </>
                  )}
                </Button>
              </div>
              
              {generatedContent && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Сгенерированный контент:</h4>
                  <Textarea 
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    rows={8}
                    className="bg-white"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      Копировать
                    </Button>
                    <Button size="sm">
                      Использовать
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Suggestions Filter */}
          <div className="flex gap-4">
            <Select value={selectedContentType} onValueChange={setSelectedContentType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Тип контента" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="social">Социальные сети</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="promotion">Акции</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Suggestions */}
          <div className="grid gap-4">
            {filteredContentSuggestions.map(suggestion => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getContentTypeIcon(suggestion.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                          <p className="text-sm text-gray-500">Целевая аудитория: {suggestion.target}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          Эффективность: {suggestion.engagement}%
                        </Badge>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {suggestion.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Редактировать
                    </Button>
                    <Button size="sm">
                      Использовать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}