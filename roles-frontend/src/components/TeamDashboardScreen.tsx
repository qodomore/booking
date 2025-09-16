import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  MoreVertical,
  Crown,
  Shield,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';

// codeRef: TeamInviteDialog.tsx
interface TeamDashboardScreenProps {
  onBack?: () => void;
  state?: 'default' | 'empty' | 'loading' | 'success' | 'error';
  subscription?: 'active' | 'inactive';
  role?: 'owner' | 'admin' | 'staff';
  locale?: 'ru' | 'en';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'owner' | 'admin' | 'staff';
  status: 'active' | 'invited' | 'disabled';
  avatar?: string;
  invitedAt?: string;
  lastActive?: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Анна Петрова',
    email: 'anna@example.com',
    phone: '+7 (999) 123-45-67',
    role: 'owner',
    status: 'active',
    lastActive: '2 мин назад'
  },
  {
    id: '2',
    name: 'Михаил Иванов',
    email: 'mikhail@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '1 час назад'
  },
  {
    id: '3',
    name: 'Елена Сидорова',
    email: 'elena@example.com',
    phone: '+7 (999) 765-43-21',
    role: 'staff',
    status: 'invited',
    invitedAt: '2 дня назад'
  }
];

const texts = {
  ru: {
    title: 'Команда',
    subtitle: 'Управление сотрудниками и ролями',
    inviteUser: 'Пригласить',
    searchPlaceholder: 'Поиск по имени или email...',
    filter: 'Фильтр',
    name: 'Имя',
    role: 'Роль',
    status: 'Статус',
    actions: 'Действия',
    lastActive: 'Активность',
    owner: 'Владелец',
    admin: 'Администратор',
    staff: 'Сотрудник',
    active: 'Активен',
    invited: 'Приглашен',
    disabled: 'Отключен',
    edit: 'Редактировать',
    disable: 'Отключить',
    remove: 'Удалить',
    resendInvite: 'Отправить повторно',
    empty: 'Пока нет сотрудников',
    emptyDescription: 'Пригласите первого сотрудника для совместной работы',
    inviteDialog: {
      title: 'Пригласить сотрудника',
      email: 'Email',
      emailPlaceholder: 'ivan@example.com',
      phone: 'Телефон',
      phonePlaceholder: '+7 (999) 123-45-67',
      telegram: 'Telegram',
      telegramPlaceholder: '@username',
      role: 'Роль',
      roleDescription: 'Выберите уровень доступа',
      ownerRole: 'Владелец - полный доступ',
      adminRole: 'Администратор - управление без настроек',
      staffRole: 'Сотрудник - базовые операции',
      send: 'Отправить приглашение',
      sending: 'Отправка...',
      cancel: 'Отмена'
    },
    inviteSuccess: 'Приглашение отправлено!',
    inviteError: 'Ошибка отправки приглашения'
  },
  en: {
    title: 'Team',
    subtitle: 'Manage staff and roles',
    inviteUser: 'Invite',
    searchPlaceholder: 'Search by name or email...',
    filter: 'Filter',
    name: 'Name',
    role: 'Role',
    status: 'Status',
    actions: 'Actions',
    lastActive: 'Activity',
    owner: 'Owner',
    admin: 'Administrator',
    staff: 'Staff',
    active: 'Active',
    invited: 'Invited',
    disabled: 'Disabled',
    edit: 'Edit',
    disable: 'Disable',
    remove: 'Remove',
    resendInvite: 'Resend',
    empty: 'No team members yet',
    emptyDescription: 'Invite your first team member to collaborate',
    inviteDialog: {
      title: 'Invite Team Member',
      email: 'Email',
      emailPlaceholder: 'ivan@example.com',
      phone: 'Phone',
      phonePlaceholder: '+1 (555) 123-4567',
      telegram: 'Telegram',
      telegramPlaceholder: '@username',
      role: 'Role',
      roleDescription: 'Select access level',
      ownerRole: 'Owner - full access',
      adminRole: 'Administrator - manage without settings',
      staffRole: 'Staff - basic operations',
      send: 'Send Invitation',
      sending: 'Sending...',
      cancel: 'Cancel'
    },
    inviteSuccess: 'Invitation sent!',
    inviteError: 'Error sending invitation'
  }
};

export function TeamDashboardScreen({ 
  onBack, 
  state = 'default',
  subscription = 'active',
  role = 'owner',
  locale = 'ru' 
}: TeamDashboardScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    phone: '',
    telegram: '',
    role: 'staff'
  });
  const [isInviting, setIsInviting] = useState(false);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);

  const t = texts[locale];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'staff':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'staff':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'invited':
        return <Clock className="w-4 h-4" />;
      case 'disabled':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'invited':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'disabled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInvite = async () => {
    if (!inviteForm.email) {
      toast.error(locale === 'ru' ? 'Введите email' : 'Enter email');
      return;
    }

    setIsInviting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new member to list
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteForm.email.split('@')[0],
        email: inviteForm.email,
        phone: inviteForm.phone,
        role: inviteForm.role as 'owner' | 'admin' | 'staff',
        status: 'invited',
        invitedAt: 'только что'
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      setIsInviteDialogOpen(false);
      setInviteForm({ email: '', phone: '', telegram: '', role: 'staff' });
      toast.success(t.inviteSuccess);
    } catch (error) {
      toast.error(t.inviteError);
    } finally {
      setIsInviting(false);
    }
  };

  if (state === 'empty') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t.empty}</h3>
          <p className="text-muted-foreground mb-6">{t.emptyDescription}</p>
          <Button onClick={() => setIsInviteDialogOpen(true)} className="elegant-button">
            <Plus className="w-4 h-4 mr-2" />
            {t.inviteUser}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="elegant-button">
              <Plus className="w-4 h-4 mr-2" />
              {t.inviteUser}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.inviteDialog.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.inviteDialog.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.inviteDialog.emailPlaceholder}
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t.inviteDialog.phone}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t.inviteDialog.phonePlaceholder}
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              {/* Telegram */}
              <div className="space-y-2">
                <Label htmlFor="telegram">
                  {t.inviteDialog.telegram}
                </Label>
                <Input
                  id="telegram"
                  placeholder={t.inviteDialog.telegramPlaceholder}
                  value={inviteForm.telegram}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, telegram: e.target.value }))}
                />
              </div>

              {/* Role */}
              <div className="space-y-3">
                <Label>{t.inviteDialog.role}</Label>
                <p className="text-sm text-muted-foreground">{t.inviteDialog.roleDescription}</p>
                <RadioGroup 
                  value={inviteForm.role} 
                  onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owner" id="owner" />
                    <Label htmlFor="owner" className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      {t.inviteDialog.ownerRole}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      {t.inviteDialog.adminRole}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="staff" id="staff" />
                    <Label htmlFor="staff" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      {t.inviteDialog.staffRole}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsInviteDialogOpen(false)}
                  className="flex-1"
                >
                  {t.inviteDialog.cancel}
                </Button>
                <Button 
                  onClick={handleInvite}
                  disabled={isInviting}
                  className="flex-1 elegant-button"
                >
                  {isInviting ? t.inviteDialog.sending : t.inviteDialog.send}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.role} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{locale === 'ru' ? 'Все роли' : 'All roles'}</SelectItem>
              <SelectItem value="owner">{t.owner}</SelectItem>
              <SelectItem value="admin">{t.admin}</SelectItem>
              <SelectItem value="staff">{t.staff}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{locale === 'ru' ? 'Все статусы' : 'All statuses'}</SelectItem>
              <SelectItem value="active">{t.active}</SelectItem>
              <SelectItem value="invited">{t.invited}</SelectItem>
              <SelectItem value="disabled">{t.disabled}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Team Members Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">{t.name}</th>
                <th className="text-left p-4 font-medium">{t.role}</th>
                <th className="text-left p-4 font-medium">{t.status}</th>
                <th className="text-left p-4 font-medium">{t.lastActive}</th>
                <th className="text-right p-4 font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                          {member.phone && (
                            <div className="text-sm text-muted-foreground">{member.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1">
                          {member.role === 'owner' && t.owner}
                          {member.role === 'admin' && t.admin}
                          {member.role === 'staff' && t.staff}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(member.status)}>
                        {getStatusIcon(member.status)}
                        <span className="ml-1">
                          {member.status === 'active' && t.active}
                          {member.status === 'invited' && t.invited}
                          {member.status === 'disabled' && t.disabled}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {member.lastActive || member.invitedAt}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>{t.edit}</DropdownMenuItem>
                            {member.status === 'invited' && (
                              <DropdownMenuItem>{t.resendInvite}</DropdownMenuItem>
                            )}
                            {member.status !== 'disabled' && (
                              <DropdownMenuItem>{t.disable}</DropdownMenuItem>
                            )}
                            {member.role !== 'owner' && (
                              <DropdownMenuItem className="text-red-600">
                                {t.remove}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {locale === 'ru' ? 'Нет участников по заданным критериям' : 'No members match the criteria'}
          </div>
        )}
      </Card>
    </div>
  );
}