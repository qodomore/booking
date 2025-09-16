import React from "react";
import { AlertTriangle, TrendingDown, Brain, Send, Eye, MessageSquare, Target, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Progress } from "./progress";
import { ReasonChipGroup } from "./reason-chip";

interface AIRiskCardProps {
  riskLevel: 'low' | 'medium' | 'high';
  riskPercentage: number;
  factors: string[];
  recommendation?: string;
  confidence?: number;
  onViewRecommendation?: () => void;
  onSendRecommendation?: () => void;
  onDismiss?: () => void;
  businessType?: 'beauty' | 'fitness' | 'auto' | 'education';
  variant?: 'default' | 'detailed' | 'compact';
  className?: string;
}

const riskStyles = {
  low: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    progress: 'text-green-600',
    label: 'Низкий риск'
  },
  medium: {
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    progress: 'text-orange-600',
    label: 'Средний риск'
  },
  high: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    progress: 'text-red-600',
    label: 'Высокий риск'
  }
};

const businessLabels = {
  beauty: {
    title: 'Риск потери клиента',
    description: 'Вероятность, что клиент не вернется за процедурами'
  },
  fitness: {
    title: 'Риск отписки',
    description: 'Вероятность отмены абонемента'
  },
  auto: {
    title: 'Риск ухода к конкурентам',
    description: 'Вероятность смены автосервиса'
  },
  education: {
    title: 'Риск отчисления',
    description: 'Вероятность прекращения обучения'
  }
};

export function AIRiskCard({
  riskLevel,
  riskPercentage,
  factors,
  recommendation,
  confidence,
  onViewRecommendation,
  onSendRecommendation,
  onDismiss,
  businessType = 'beauty',
  variant = 'default',
  className = ''
}: AIRiskCardProps) {
  const riskConfig = riskStyles[riskLevel];
  const businessConfig = businessLabels[businessType];

  if (variant === 'compact') {
    return (
      <Card className={`glass-card ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-5 w-5 ${riskConfig.color}`} />
              <div>
                <Badge className={`${riskConfig.bg} ${riskConfig.color} ${riskConfig.border} border text-xs`}>
                  {riskConfig.label}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  {riskPercentage}% вероятность
                </div>
              </div>
            </div>
            {onViewRecommendation && (
              <Button variant="outline" size="sm" onClick={onViewRecommendation}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={`glass-card ${riskConfig.border} border ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {businessConfig.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{businessConfig.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Risk Level and Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={`${riskConfig.bg} ${riskConfig.color} ${riskConfig.border} border`}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {riskConfig.label}
              </Badge>
              <div className="text-right">
                <span className={`text-lg font-semibold ${riskConfig.progress}`}>
                  {riskPercentage}%
                </span>
                <div className="text-xs text-muted-foreground">вероятность</div>
              </div>
            </div>
            
            <Progress 
              value={riskPercentage} 
              className="h-2"
              style={{
                '--progress-foreground': riskConfig.progress.replace('text-', 'rgb(var(--color-')
              } as React.CSSProperties}
            />
          </div>

          {/* AI Confidence */}
          {confidence !== undefined && (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Точность модели</span>
              </div>
              <span className="text-sm font-semibold">{confidence}%</span>
            </div>
          )}

          {/* Risk Factors */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Основные факторы:</span>
            </div>
            <ReasonChipGroup 
              reasons={factors}
              maxVisible={3}
              size="sm"
              variant="subtle"
            />
          </div>

          {/* Recommendation Preview */}
          {recommendation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    Рекомендация AI
                  </div>
                  <p className="text-sm text-blue-700 line-clamp-2">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {onSendRecommendation && (
              <Button onClick={onSendRecommendation} className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Применить
              </Button>
            )}
            {onViewRecommendation && (
              <Button 
                variant="outline" 
                onClick={onViewRecommendation}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Подробнее
              </Button>
            )}
          </div>

          {/* Dismiss Option */}
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="w-full text-muted-foreground"
            >
              Скрыть до следующего анализа
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Вероятност�� ухода
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Risk Level and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={`${riskConfig.bg} ${riskConfig.color} ${riskConfig.border} border`}>
              {riskConfig.label}
            </Badge>
            <span className={`text-sm font-semibold ${riskConfig.progress}`}>
              {riskPercentage}%
            </span>
          </div>
          <Progress 
            value={riskPercentage} 
            className="h-2"
          />
        </div>
        
        {/* Risk Factors */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Причины:</span>
          <ReasonChipGroup 
            reasons={factors}
            maxVisible={2}
            size="sm"
          />
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={onViewRecommendation || onSendRecommendation}
          className="w-full gap-2"
        >
          <Send className="h-4 w-4" />
          Рекомендация
        </Button>
      </CardContent>
    </Card>
  );
}

// Компонент с деталями риска и рекомендациями
interface RiskAnalysisProps {
  analysis: {
    riskLevel: 'low' | 'medium' | 'high';
    riskPercentage: number;
    factors: Array<{
      factor: string;
      impact: number;
      description?: string;
    }>;
    recommendations: Array<{
      id: string;
      title: string;
      description: string;
      channel: 'telegram' | 'sms' | 'whatsapp' | 'email';
      template: string;
      expectedEffect: string;
      confidence: number;
    }>;
    modelInfo: {
      accuracy: number;
      lastUpdated: string;
      dataPoints: number;
    };
  };
  onApplyRecommendation?: (recommendationId: string) => void;
  businessType?: 'beauty' | 'fitness' | 'auto' | 'education';
}

export function RiskAnalysis({
  analysis,
  onApplyRecommendation,
  businessType = 'beauty'
}: RiskAnalysisProps) {
  const riskConfig = riskStyles[analysis.riskLevel];
  const businessConfig = businessLabels[businessType];

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Анализ риска ухода
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {businessConfig.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${riskConfig.progress}`}>
                {analysis.riskPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Вероятность ухода</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {analysis.modelInfo.accuracy}%
              </div>
              <div className="text-sm text-muted-foreground">Точность модели</div>
            </div>
          </div>
          
          <Progress value={analysis.riskPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Factors */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Факторы риска</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.factors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div>
                <div className="font-medium text-sm">{factor.factor}</div>
                {factor.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {factor.description}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">{factor.impact}%</div>
                <div className="text-xs text-muted-foreground">влияние</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.recommendations.map((rec) => (
            <div key={rec.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h6 className="font-medium">{rec.title}</h6>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  {rec.channel}
                </Badge>
              </div>
              
              <div className="bg-muted/30 p-3 rounded text-sm">
                {rec.template}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Ожидаемый эффект: <span className="font-medium">{rec.expectedEffect}</span>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onApplyRecommendation?.(rec.id)}
                >
                  Применить
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}