import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface CriteriaOption {
  value: string;
  label: { ru: string; en: string };
}

interface Subcriterion {
  name: { ru: string; en: string };
  options: CriteriaOption[];
}

interface CriteriaCategory {
  id: string;
  name: { ru: string; en: string };
  icon: string;
  subcriteria: { [key: string]: Subcriterion };
}

interface SegmentCriteriaBuilderProps {
  locale: 'ru' | 'en';
  selectedCategories: string[];
  criteriaValues: { [key: string]: any };
  onAddCategory: (categoryId: string) => void;
  onRemoveCategory: (categoryId: string) => void;
  onCriteriaValueChange: (key: string, value: string) => void;
}

export const SegmentCriteriaBuilder: React.FC<SegmentCriteriaBuilderProps> = ({
  locale,
  selectedCategories,
  criteriaValues,
  onAddCategory,
  onRemoveCategory,
  onCriteriaValueChange
}) => {
  const criteriaCategories: { [key: string]: CriteriaCategory } = {
    client: {
      id: 'client',
      name: { ru: 'Клиент', en: 'Client' },
      icon: '👤',
      subcriteria: {
        age: {
          name: { ru: 'Возраст', en: 'Age' },
          options: [
            { value: '18-25', label: { ru: '18-25 лет', en: '18-25 years' } },
            { value: '26-35', label: { ru: '26-35 лет', en: '26-35 years' } },
            { value: '36-45', label: { ru: '36-45 лет', en: '36-45 years' } },
            { value: '46-60', label: { ru: '46-60 лет', en: '46-60 years' } },
            { value: '60+', label: { ru: '60+ лет', en: '60+ years' } }
          ]
        },
        gender: {
          name: { ru: 'Пол', en: 'Gender' },
          options: [
            { value: 'male', label: { ru: 'Мужской', en: 'Male' } },
            { value: 'female', label: { ru: 'Женский', en: 'Female' } },
            { value: 'other', label: { ru: 'Другой', en: 'Other' } }
          ]
        },
        city: {
          name: { ru: 'Город', en: 'City' },
          options: [
            { value: 'moscow', label: { ru: 'Москва', en: 'Moscow' } },
            { value: 'spb', label: { ru: 'Санкт-Петербург', en: 'St. Petersburg' } },
            { value: 'other', label: { ru: 'Другие города', en: 'Other cities' } }
          ]
        },
        registrationDate: {
          name: { ru: 'Дата регистрации', en: 'Registration Date' },
          options: [
            { value: '7d', label: { ru: 'Последние 7 дней', en: 'Last 7 days' } },
            { value: '30d', label: { ru: 'Последние 30 дней', en: 'Last 30 days' } },
            { value: '90d', label: { ru: 'Последние 90 дней', en: 'Last 90 days' } },
            { value: '180d', label: { ru: 'Более 180 дней', en: 'More than 180 days' } }
          ]
        }
      }
    },
    visits: {
      id: 'visits',
      name: { ru: 'История визитов', en: 'Visit History' },
      icon: '📅',
      subcriteria: {
        lastVisit: {
          name: { ru: 'Последний визит', en: 'Last Visit' },
          options: [
            { value: '7d', label: { ru: 'Менее 7 дней', en: '<7 days' } },
            { value: '30d', label: { ru: 'Более 30 дней', en: '>30 days' } },
            { value: '60d', label: { ru: 'Более 60 дней', en: '>60 days' } },
            { value: '90d', label: { ru: 'Более 90 дней', en: '>90 days' } },
            { value: '180d', label: { ru: 'Более 180 дней', en: '>180 days' } }
          ]
        },
        visitCount: {
          name: { ru: 'Количество визитов', en: 'Visit Count' },
          options: [
            { value: '1-3', label: { ru: '1-3 визита', en: '1-3 visits' } },
            { value: '4-9', label: { ru: '4-9 визитов', en: '4-9 visits' } },
            { value: '10-19', label: { ru: '10-19 визитов', en: '10-19 visits' } },
            { value: '20+', label: { ru: '20+ визитов', en: '20+ visits' } }
          ]
        },
        frequency: {
          name: { ru: 'Частота визитов', en: 'Visit Frequency' },
          options: [
            { value: 'weekly', label: { ru: 'Еженедельно', en: 'Weekly' } },
            { value: 'monthly', label: { ru: 'Ежемесячно', en: 'Monthly' } },
            { value: 'quarterly', label: { ru: 'Раз в квартал', en: 'Quarterly' } },
            { value: 'rare', label: { ru: 'Редко', en: 'Rare' } }
          ]
        }
      }
    },
    finance: {
      id: 'finance',
      name: { ru: 'Финансы', en: 'Finance' },
      icon: '💰',
      subcriteria: {
        totalSpent: {
          name: { ru: 'Общая сумма', en: 'Total Spent' },
          options: [
            { value: '0-5000', label: { ru: '0-5K₽', en: '0-5K₽' } },
            { value: '5000-20000', label: { ru: '5-20K₽', en: '5-20K₽' } },
            { value: '20000-50000', label: { ru: '20-50K₽', en: '20-50K₽' } },
            { value: '50000+', label: { ru: '50K₽+', en: '50K₽+' } }
          ]
        },
        avgSpent: {
          name: { ru: 'Средний чек', en: 'Avg Spent' },
          options: [
            { value: '0-1000', label: { ru: '0-1K₽', en: '0-1K₽' } },
            { value: '1000-3000', label: { ru: '1-3K₽', en: '1-3K₽' } },
            { value: '3000-5000', label: { ru: '3-5K₽', en: '3-5K₽' } },
            { value: '5000+', label: { ru: '5K₽+', en: '5K₽+' } }
          ]
        },
        maxSpent: {
          name: { ru: 'Максимальный чек', en: 'Max Spent' },
          options: [
            { value: '0-3000', label: { ru: '0-3K₽', en: '0-3K₽' } },
            { value: '3000-10000', label: { ru: '3-10K₽', en: '3-10K₽' } },
            { value: '10000+', label: { ru: '10K₽+', en: '10K₽+' } }
          ]
        }
      }
    },
    location: {
      id: 'location',
      name: { ru: 'Точки оказания услуг', en: 'Locations' },
      icon: '📍',
      subcriteria: {
        specificLocation: {
          name: { ru: 'Конкретная точка', en: 'Specific Location' },
          options: [
            { value: 'location-1', label: { ru: 'Филиал на Тверской', en: 'Tverskaya Branch' } },
            { value: 'location-2', label: { ru: 'Филиал на Арбате', en: 'Arbat Branch' } },
            { value: 'location-3', label: { ru: 'Филиал на Кутузовском', en: 'Kutuzovsky Branch' } }
          ]
        },
        locationCity: {
          name: { ru: 'Город точки', en: 'City' },
          options: [
            { value: 'moscow', label: { ru: 'Москва', en: 'Moscow' } },
            { value: 'spb', label: { ru: 'Санкт-Петербург', en: 'St. Petersburg' } }
          ]
        }
      }
    },
    services: {
      id: 'services',
      name: { ru: 'Услуги', en: 'Services' },
      icon: '✂️',
      subcriteria: {
        specificService: {
          name: { ru: 'Конкретная услуга', en: 'Specific Service' },
          options: [
            { value: 'service-1', label: { ru: 'Консультация', en: 'Consultation' } },
            { value: 'service-2', label: { ru: 'Базовая услуга', en: 'Basic Service' } },
            { value: 'service-3', label: { ru: 'Премиум услуга', en: 'Premium Service' } }
          ]
        },
        serviceCategory: {
          name: { ru: 'Категория услуг', en: 'Service Category' },
          options: [
            { value: 'cat-1', label: { ru: 'Консультации', en: 'Consultations' } },
            { value: 'cat-2', label: { ru: 'Основные услуги', en: 'Main Services' } },
            { value: 'cat-3', label: { ru: 'Дополнительные услуги', en: 'Additional Services' } }
          ]
        },
        serviceFrequency: {
          name: { ru: 'Частота использования', en: 'Usage Frequency' },
          options: [
            { value: 'regular', label: { ru: 'Регулярно', en: 'Regular' } },
            { value: 'occasional', label: { ru: 'Иногда', en: 'Occasional' } },
            { value: 'rare', label: { ru: 'Редко', en: 'Rare' } }
          ]
        }
      }
    },
    behavior: {
      id: 'behavior',
      name: { ru: 'Поведение', en: 'Behavior' },
      icon: '🎯',
      subcriteria: {
        cancellations: {
          name: { ru: 'Отмены записей', en: 'Cancellations' },
          options: [
            { value: 'none', label: { ru: 'Без отмен', en: 'No cancellations' } },
            { value: '1-2', label: { ru: '1-2 отмены', en: '1-2 cancellations' } },
            { value: '3+', label: { ru: '3+ отмен', en: '3+ cancellations' } }
          ]
        },
        noShows: {
          name: { ru: 'Неявки', en: 'No-shows' },
          options: [
            { value: 'none', label: { ru: 'Без неявок', en: 'No no-shows' } },
            { value: '1-2', label: { ru: '1-2 неявки', en: '1-2 no-shows' } },
            { value: '3+', label: { ru: '3+ неявок', en: '3+ no-shows' } }
          ]
        },
        reviews: {
          name: { ru: 'Отзывы', en: 'Reviews' },
          options: [
            { value: 'positive', label: { ru: 'Положительные', en: 'Positive' } },
            { value: 'neutral', label: { ru: 'Нейтральные', en: 'Neutral' } },
            { value: 'negative', label: { ru: 'Отрицательные', en: 'Negative' } },
            { value: 'none', label: { ru: 'Без отзывов', en: 'No reviews' } }
          ]
        },
        referrals: {
          name: { ru: 'Рекомендации', en: 'Referrals' },
          options: [
            { value: 'yes', label: { ru: 'Приводил друзей', en: 'Brought friends' } },
            { value: 'no', label: { ru: 'Не приводил', en: 'No referrals' } }
          ]
        }
      }
    }
  };

  const availableCategories = Object.values(criteriaCategories).filter(
    cat => !selectedCategories.includes(cat.id)
  );

  return (
    <div className="space-y-4">
      {/* Add Category Button */}
      {availableCategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-base">{locale === 'ru' ? 'Добавить критерий' : 'Add Criteria'}</Label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(category => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => onAddCategory(category.id)}
                className="h-auto py-2 px-3"
              >
                <span className="mr-2">{category.icon}</span>
                <span className="text-sm">{category.name[locale]}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Categories with Subcriteria */}
      {selectedCategories.length > 0 && (
        <div className="space-y-3">
          {selectedCategories.map(categoryId => {
            const category = criteriaCategories[categoryId];
            if (!category) return null;

            return (
              <div key={categoryId} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name[locale]}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCategory(categoryId)}
                    className="h-7 w-7 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Subcriteria */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(category.subcriteria).map(([subKey, subcriterion]) => {
                    const criteriaKey = `${categoryId}-${subKey}`;
                    return (
                      <div key={subKey} className="space-y-2">
                        <Label htmlFor={criteriaKey} className="text-sm">
                          {subcriterion.name[locale]}
                        </Label>
                        <Select
                          value={criteriaValues[criteriaKey] || ''}
                          onValueChange={(value) => onCriteriaValueChange(criteriaKey, value)}
                        >
                          <SelectTrigger id={criteriaKey}>
                            <SelectValue placeholder={locale === 'ru' ? 'Выберите' : 'Select'} />
                          </SelectTrigger>
                          <SelectContent>
                            {subcriterion.options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label[locale]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {selectedCategories.length === 0 && (
        <div className="p-6 border-2 border-dashed rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            {locale === 'ru' 
              ? 'Добавьте критерии для фильтрации аудитории' 
              : 'Add criteria to filter audience'}
          </p>
        </div>
      )}
    </div>
  );
};
