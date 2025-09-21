import { useState } from "react";
import { Button } from "./ui/button";
import { LanguageToggle } from "./LanguageToggle";
import { RoleCard } from "./RoleCard";
import { Loader2 } from "lucide-react";
import { cn } from "./ui/utils";

type Role = 'client' | 'owner' | null;
type Language = 'ru' | 'en';

interface OnboardingScreenProps {
  theme?: 'light' | 'dark';
}

const content = {
  ru: {
    title: 'Кто вы?',
    subtitle: 'Выберите роль, чтобы мы показали нужные экраны.',
    continueButton: 'Продолжить',
    haveAccount: 'У меня уже есть аккаунт',
    privacyText: 'Нажимая «Продолжить», вы соглашаетесь с',
    privacyLink: 'Политика конфиденциальности',
    termsLink: 'Пользовательское соглашение'
  },
  en: {
    title: 'Who are you?',
    subtitle: 'Choose your role so we can show the right screens.',
    continueButton: 'Continue',
    haveAccount: 'I already have an account',
    privacyText: 'By clicking "Continue", you agree to',
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service'
  }
};

export function OnboardingScreen({ theme = 'light' }: OnboardingScreenProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [language, setLanguage] = useState<Language>('ru');
  const [isLoading, setIsLoading] = useState(false);

  const text = content[language];

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    
    // Show success message based on selected role and language
    const roleText = selectedRole === 'client' 
      ? (language === 'ru' ? 'Клиент' : 'Client')
      : (language === 'ru' ? 'Владелец бизнеса' : 'Business Owner');
    
    alert(`${language === 'ru' ? 'Выбрана роль:' : 'Selected role:'} ${roleText}`);
  };

  return (
    <div className={cn("min-h-screen bg-background", theme === 'dark' && 'dark')}>
      <div className="mx-auto max-w-sm px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
          </div>
          <LanguageToggle 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>

        {/* Illustration placeholder */}
        <div className="h-40 bg-muted rounded-xl mb-6 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-primary/40 rounded-full" />
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center mb-8">
          <h1 className="mb-2">{text.title}</h1>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>

        {/* Role selection cards */}
        <div className="space-y-3 mb-8">
          <RoleCard
            role="client"
            isSelected={selectedRole === 'client'}
            onSelect={() => setSelectedRole('client')}
            language={language}
          />
          <RoleCard
            role="owner"
            isSelected={selectedRole === 'owner'}
            onSelect={() => setSelectedRole('owner')}
            language={language}
          />
        </div>

        {/* CTA section */}
        <div className="space-y-4 mb-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="w-full h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {text.continueButton}
              </>
            ) : (
              text.continueButton
            )}
          </Button>
          
          <Button
            variant="ghost"
            className="w-full"
          >
            {text.haveAccount}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {text.privacyText}{' '}
            <button className="text-primary underline">
              {text.privacyLink}
            </button>
            {' и '}
            <button className="text-primary underline">
              {text.termsLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}