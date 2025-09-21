import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { BarChart3, Calendar, Settings, Users, ArrowLeft } from "lucide-react";

interface OwnerScreenProps {
  onBack: () => void;
}

export function OwnerScreen({ onBack }: OwnerScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>Панель владельца</h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-lg font-semibold">24</div>
              <div className="text-xs text-muted-foreground">Клиенты</div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="text-lg font-semibold">8</div>
              <div className="text-xs text-muted-foreground">Записи сегодня</div>
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3>Расписание</h3>
                <p className="text-sm text-muted-foreground">Управление записями и слотами</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3>Услуги и цены</h3>
                <p className="text-sm text-muted-foreground">Настройка прайс-листа</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3>Аналитика</h3>
                <p className="text-sm text-muted-foreground">Отчеты и статистика</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's schedule */}
        <div>
          <h2 className="mb-4">Сегодняшние записи</h2>
          <div className="space-y-2">
            <Card className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Анна Петрова</div>
                  <div className="text-sm text-muted-foreground">Стрижка</div>
                </div>
                <div className="text-sm text-muted-foreground">14:00</div>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Мария Иванова</div>
                  <div className="text-sm text-muted-foreground">Окрашивание</div>
                </div>
                <div className="text-sm text-muted-foreground">16:30</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}