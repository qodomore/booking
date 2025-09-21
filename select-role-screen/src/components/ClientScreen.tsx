import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";

interface ClientScreenProps {
  onBack: () => void;
}

export function ClientScreen({ onBack }: ClientScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>Клиентская панель</h1>
        </div>

        {/* Quick actions */}
        <div className="space-y-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3>Записаться на услугу</h3>
                <p className="text-sm text-muted-foreground">Быстрая запись в несколько шагов</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3>Мои записи</h3>
                <p className="text-sm text-muted-foreground">Просмотр и управление записями</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3>Поиск салонов</h3>
                <p className="text-sm text-muted-foreground">Найти ближайшие салоны</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent bookings */}
        <div>
          <h2 className="mb-4">Последние записи</h2>
          <Card className="p-4">
            <div className="text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p>У вас пока нет записей</p>
              <Button className="mt-3" size="sm">
                Записаться сейчас
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}