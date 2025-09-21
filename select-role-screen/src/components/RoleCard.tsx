import { Card } from "./ui/card";
import { Check, User, Settings } from "lucide-react";
import { cn } from "./ui/utils";

interface RoleCardProps {
  role: 'client' | 'owner';
  isSelected: boolean;
  onSelect: () => void;
  language: 'ru' | 'en';
}

const roleData = {
  client: {
    ru: {
      title: 'Клиент',
      description: 'Запись в 1–3 шага, перенос/отмена, напоминания.'
    },
    en: {
      title: 'Client',
      description: 'Book in 1–3 taps, reschedule/cancel, reminders.'
    }
  },
  owner: {
    ru: {
      title: 'Владелец бизнеса',
      description: 'Расписание, услуги и цены, аналитика, маркетинг + AI.'
    },
    en: {
      title: 'Business Owner',
      description: 'Schedule, services & pricing, analytics, marketing + AI.'
    }
  }
};

export function RoleCard({ role, isSelected, onSelect, language }: RoleCardProps) {
  const data = roleData[role][language];
  const Icon = role === 'client' ? User : Settings;

  return (
    <Card 
      className={cn(
        "relative p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)]",
        "active:scale-[0.98]",
        isSelected 
          ? "bg-card border border-primary shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)]" 
          : "bg-card border border-border hover:bg-accent"
      )}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          isSelected 
            ? "bg-primary/10 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 space-y-1">
          <h3 className="font-medium text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </Card>
  );
}