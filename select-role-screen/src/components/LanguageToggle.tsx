import { Button } from "./ui/button";

interface LanguageToggleProps {
  currentLanguage: 'ru' | 'en';
  onLanguageChange: (language: 'ru' | 'en') => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center bg-accent rounded-lg p-1 border border-border">
      <Button
        variant={currentLanguage === 'ru' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          "h-8 px-3 rounded-md text-sm font-medium",
          currentLanguage === 'ru' 
            ? "bg-primary text-primary-foreground shadow-none" 
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        onClick={() => onLanguageChange('ru')}
      >
        RU
      </Button>
      <Button
        variant={currentLanguage === 'en' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          "h-8 px-3 rounded-md text-sm font-medium",
          currentLanguage === 'en' 
            ? "bg-primary text-primary-foreground shadow-none" 
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        onClick={() => onLanguageChange('en')}
      >
        EN
      </Button>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}