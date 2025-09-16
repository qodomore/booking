import React from "react";
import { X } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";

interface FilterChip {
  id: string;
  label: string;
  value: string;
  type: 'type' | 'status' | 'category';
}

interface OfferingFiltersProps {
  activeFilters: FilterChip[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export function OfferingFilters({ 
  activeFilters, 
  onRemoveFilter, 
  onClearAll 
}: OfferingFiltersProps) {
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Фильтры:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className="gap-1 pr-1 hover:bg-accent"
        >
          {filter.label}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-destructive/20"
            onClick={() => onRemoveFilter(filter.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          Сбросить все
        </Button>
      )}
    </div>
  );
}

// Утилитарные функции для работы с фильтрами
export const createTypeFilter = (type: string, label: string): FilterChip => ({
  id: `type-${type}`,
  label: `Тип: ${label}`,
  value: type,
  type: 'type'
});

export const createStatusFilter = (status: string, label: string): FilterChip => ({
  id: `status-${status}`,
  label: `Статус: ${label}`,
  value: status,
  type: 'status'
});

export const createCategoryFilter = (category: string, label: string): FilterChip => ({
  id: `category-${category}`,
  label: `Категория: ${label}`,
  value: category,
  type: 'category'
});