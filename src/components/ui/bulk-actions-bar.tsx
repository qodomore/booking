import React from "react";
import { Archive, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { Separator } from "./separator";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  className?: string;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkArchive,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  className
}: BulkActionsBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className={`glass-card fixed bottom-24 left-4 right-4 mx-auto max-w-4xl z-50 ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {selectedCount} выбрано
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkActivate}
              className="gap-2"
            >
              <ToggleRight className="h-4 w-4" />
              Активировать
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkDeactivate}
              className="gap-2"
            >
              <ToggleLeft className="h-4 w-4" />
              Отключить
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkArchive}
              className="gap-2"
            >
              <Archive className="h-4 w-4" />
              Архивировать
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkDelete}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Удалить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Хук для управления массовым выбором
export function useBulkSelection<T extends { id: string | number }>(items: T[]) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set());

  const isSelected = (id: string | number) => selectedIds.has(id);
  
  const isAllSelected = selectedIds.size === items.length && items.length > 0;
  
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < items.length;

  const toggleItem = (id: string | number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const getSelectedItems = () => {
    return items.filter(item => selectedIds.has(item.id));
  };

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    toggleItem,
    toggleAll,
    clearSelection,
    getSelectedItems
  };
}