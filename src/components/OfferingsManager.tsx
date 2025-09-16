import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Grid3X3,
  List,
  ChevronDown,
  Package,
  Repeat,
  Users,
  SquarePlus,
  Boxes
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Card, CardContent } from "./ui/card";
import { OfferingCard, type Offering } from "./ui/offering-card";

// Типы предложений с нейтральными иконками
const offeringTypes = [
  { id: 'service', label: 'Услуга', icon: Boxes, emoji: '🧩' },
  { id: 'rental', label: 'Аренда', icon: Package, emoji: '📦' },
  { id: 'class', label: 'Класс', icon: Users, emoji: '👥' },
  { id: 'subscription', label: 'Подписка', icon: Repeat, emoji: '🔁' },
  { id: 'addon', label: 'Доп. опция', icon: SquarePlus, emoji: '➕' }
];

const mockOfferings: Offering[] = [
  {
    id: 1,
    name: "Базовая консультация",
    description: "Стандартная консультация по основным вопросам",
    type: "service",
    price: 1500,
    duration: 60,
    currency: "₽",
    status: "active",
    category: "Консультации",
    updatedAt: "12 авг",
    ordersCount: 238,
    hasImage: false
  },
  {
    id: 2,
    name: "Помещение А-101",
    description: "Просторное помещение с естественным освещением",
    type: "rental",
    price: 800,
    duration: 60,
    currency: "₽",
    unit: "час",
    status: "active",
    category: "Помещения",
    updatedAt: "10 авг",
    ordersCount: 89,
    hasImage: true
  },
  {
    id: 3,
    name: "Групповое занятие",
    description: "Занятие в группе до 12 человек",
    type: "class",
    price: 2000,
    duration: 90,
    currency: "₽",
    capacity: 12,
    status: "active",
    category: "Групповые",
    updatedAt: "8 авг",
    ordersCount: 156,
    hasImage: false
  },
  {
    id: 4,
    name: "Месячная подписка",
    description: "Безлимитный доступ на месяц",
    type: "subscription",
    price: 5000,
    currency: "₽",
    status: "active",
    category: "Подписки",
    updatedAt: "5 авг",
    ordersCount: 67,
    hasImage: false
  },
  {
    id: 5,
    name: "Дополнительное оборудование",
    description: "Специализированное оборудование к основной услуге",
    type: "addon",
    price: 500,
    currency: "₽",
    status: "draft",
    category: "Опции",
    updatedAt: "3 авг",
    ordersCount: 23,
    hasImage: false,
    prepayment: true,
    prepaymentPercent: 30
  }
];

export function OfferingsManager() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [sortBy, setSortBy] = useState("name");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredOfferings = mockOfferings.filter(offering => {
    const matchesSearch = offering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offering.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || offering.type === typeFilter;
    const matchesStatus = statusFilter === "all" || offering.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: mockOfferings.length,
    active: mockOfferings.filter(o => o.status === 'active').length,
    drafts: mockOfferings.filter(o => o.status === 'draft').length,
    archived: mockOfferings.filter(o => o.status === 'archived').length
  };

  const handleEdit = (offering: Offering) => {
    console.log('Edit offering:', offering);
  };

  const handleDuplicate = (offering: Offering) => {
    console.log('Duplicate offering:', offering);
  };

  const handleArchive = (offering: Offering) => {
    console.log('Archive offering:', offering);
  };

  const handleDelete = (offering: Offering) => {
    console.log('Delete offering:', offering);
  };

  const handleStatusChange = (offering: Offering, newStatus: boolean) => {
    console.log('Status change:', offering, newStatus);
  };

  const AddOfferingDialog = () => {
    const [selectedType, setSelectedType] = useState<string>("");
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      capacity: "",
      prepayment: false,
      prepaymentPercent: "30",
      forBooking: true,
      currency: "₽"
    });

    const getTypeConfig = (typeId: string) => {
      return offeringTypes.find(t => t.id === typeId) || offeringTypes[0];
    };

    return (
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить позицию</DialogTitle>
            <DialogDescription>
              Создайте новую позицию для вашего каталога предложений
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {!selectedType ? (
              <>
                <p className="text-sm text-muted-foreground">Выберите тип позиции:</p>
                <div className="grid grid-cols-2 gap-3">
                  {offeringTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant="outline"
                        className="h-20 flex flex-col gap-2 hover:bg-accent/50"
                        onClick={() => setSelectedType(type.id)}
                      >
                        <IconComponent className="h-6 w-6" />
                        <span>{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </>
            ) : (
              <form className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedType("")}
                  >
                    ← Назад
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Тип: {getTypeConfig(selectedType).label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Введите название"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultations">Консультации</SelectItem>
                        <SelectItem value="rentals">Помещения</SelectItem>
                        <SelectItem value="classes">Групповые</SelectItem>
                        <SelectItem value="subscriptions">Подписки</SelectItem>
                        <SelectItem value="addons">Опции</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Короткое описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Краткое описание позиции"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="1500"
                      />
                      <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="₽">₽</SelectItem>
                          <SelectItem value="$">$</SelectItem>
                          <SelectItem value="€">€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(selectedType === 'service' || selectedType === 'rental') && (
                    <div className="space-y-2">
                      <Label htmlFor="duration">Длительность (мин)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="60"
                      />
                    </div>
                  )}

                  {selectedType === 'class' && (
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Вместимость</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                        placeholder="12"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="prepayment" 
                    checked={formData.prepayment}
                    onCheckedChange={(checked) => setFormData({...formData, prepayment: checked})}
                  />
                  <Label htmlFor="prepayment">Предоплата</Label>
                  {formData.prepayment && (
                    <Input
                      type="number"
                      value={formData.prepaymentPercent}
                      onChange={(e) => setFormData({...formData, prepaymentPercent: e.target.value})}
                      className="w-20 ml-2"
                      min="1"
                      max="100"
                    />
                  )}
                  {formData.prepayment && <span className="text-sm">%</span>}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="forBooking" 
                    checked={formData.forBooking}
                    onCheckedChange={(checked) => setFormData({...formData, forBooking: checked})}
                  />
                  <Label htmlFor="forBooking">Используется для записи</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    Сохранить
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Сохранить как черновик
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1>Предложения</h1>
        <p className="text-muted-foreground">
          Каталог позиций вашего бизнеса
        </p>
      </div>

      {/* Top Bar */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Найти позицию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="service">Услуги</SelectItem>
                  <SelectItem value="rental">Аренда</SelectItem>
                  <SelectItem value="class">Классы</SelectItem>
                  <SelectItem value="subscription">Подписки</SelectItem>
                  <SelectItem value="addon">Доп. опции</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="draft">Черновики</SelectItem>
                  <SelectItem value="archived">Архив</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">По алфавиту</SelectItem>
                  <SelectItem value="price">По цене</SelectItem>
                  <SelectItem value="duration">По длительности</SelectItem>
                  <SelectItem value="updated">По дате изменения</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить позицию
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {offeringTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <DropdownMenuItem 
                      key={type.id}
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {type.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Stats Strip */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground px-1">
        <span>Всего: <strong className="text-foreground">{stats.total}</strong></span>
        <span>•</span>
        <span>Активные: <strong className="text-foreground">{stats.active}</strong></span>
        <span>•</span>
        <span>Черновики: <strong className="text-foreground">{stats.drafts}</strong></span>
        <span>•</span>
        <span>Архив: <strong className="text-foreground">{stats.archived}</strong></span>
      </div>

      {/* Offerings List/Grid */}
      {filteredOfferings.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
          : "space-y-3"
        }>
          {filteredOfferings.map((offering) => (
            <OfferingCard 
              key={offering.id} 
              offering={offering} 
              variant={viewMode}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/30 flex items-center justify-center">
              <Grid3X3 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2">Здесь появятся ваши предложения</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Добавьте первую позицию: услугу, аренду, класс или подписку.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить позицию
            </Button>
          </CardContent>
        </Card>
      )}

      <AddOfferingDialog />
    </div>
  );
}