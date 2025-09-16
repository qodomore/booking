import React from "react";
import { ArrowLeft, MoreHorizontal, Volume2, VolumeX } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface ClientHeaderProps {
  onBack?: () => void;
  clientName: string;
  notificationsEnabled: boolean;
  businessType: string;
  businessTypes: Array<{ id: string; label: string }>;
  onBusinessTypeChange: (type: string) => void;
  onMenuClick?: () => void;
}

export function ClientHeader({
  onBack,
  clientName,
  notificationsEnabled,
  businessType,
  businessTypes,
  onBusinessTypeChange,
  onMenuClick
}: ClientHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1>Клиент</h1>
              <div className="text-sm text-muted-foreground">{clientName}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification Status */}
            <Badge variant="outline" className="gap-1">
              {notificationsEnabled ? (
                <>
                  <Volume2 className="h-3 w-3" />
                  Включены
                </>
              ) : (
                <>
                  <VolumeX className="h-3 w-3" />
                  Выключены
                </>
              )}
            </Badge>
            
            {/* Business Type Selector */}
            <Select value={businessType} onValueChange={onBusinessTypeChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}