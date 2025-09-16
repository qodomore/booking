import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  Filter,
  Search,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  ArrowLeft,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/calendar';
import { toast } from 'sonner';

interface BillingHistoryScreenProps {
  onBack?: () => void;
  state?: 'default' | 'empty' | 'loading' | 'success' | 'error';
  locale?: 'ru' | 'en';
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  type: 'subscription' | 'messages' | 'leads' | 'features';
  method: 'card' | 'bank' | 'crypto' | 'wallet';
  description: string;
  invoiceUrl?: string;
  transactionId?: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    date: '2024-01-15T10:30:00Z',
    amount: 490,
    status: 'success',
    type: 'subscription',
    method: 'card',
    description: 'Pro подписка - месяц',
    invoiceUrl: '#',
    transactionId: 'TXN_123456789'
  },
  {
    id: '2',
    date: '2024-01-10T14:22:00Z',
    amount: 150,
    status: 'success',
    type: 'messages',
    method: 'wallet',
    description: 'SMS уведомления (500 шт)',
    transactionId: 'TXN_123456788'
  },
  {
    id: '3',
    date: '2024-01-05T09:15:00Z',
    amount: 990,
    status: 'failed',
    type: 'features',
    method: 'card',
    description: 'Дополнительные мастера (3 шт)',
    transactionId: 'TXN_123456787'
  },
  {
    id: '4',
    date: '2023-12-15T16:45:00Z',
    amount: 490,
    status: 'success',
    type: 'subscription',
    method: 'bank',
    description: 'Pro подписка - месяц',
    invoiceUrl: '#',
    transactionId: 'TXN_123456786'
  },
  {
    id: '5',
    date: '2023-12-01T11:30:00Z',
    amount: 75,
    status: 'pending',
    type: 'leads',
    method: 'crypto',
    description: 'Лиды из рекламы (25 шт)',
    transactionId: 'TXN_123456785'
  }
];

const texts = {
  ru: {
    title: 'История платежей',
    subtitle: 'Все транзакции и счета',
    search: 'Поиск платежей...',
    filter: 'Фильтр',
    export: 'Экспорт',
    date: 'Дата',
    amount: 'Сумма',
    status: 'Статус',
    type: 'Тип',
    method: 'Способ',
    description: 'Описание',
    actions: 'Действия',
    download: 'Скачать счёт',
    success: 'Успешно',
    failed: 'Ошибка',
    pending: 'В обработке',
    refunded: 'Возврат',
    subscription: 'Подписка',
    messages: 'Сообщения',
    leads: 'Лиды',
    features: 'Функции',
    card: 'Карта',
    bank: 'Банк',
    crypto: 'Крипто',
    wallet: 'Кошелёк',
    allTypes: 'Все типы',
    allStatuses: 'Все статусы',
    allMethods: 'Все способы',
    empty: 'Нет платежей',
    emptyDescription: 'Платежи появятся здесь после первой оплаты',
    transactionId: 'ID транзакции',
    copyId: 'Скопировать ID',
    invoiceDownloaded: 'Счёт скачан',
    idCopied: 'ID скопирован'
  },
  en: {
    title: 'Payment History',
    subtitle: 'All transactions and invoices',
    search: 'Search payments...',
    filter: 'Filter',
    export: 'Export',
    date: 'Date',
    amount: 'Amount',
    status: 'Status',
    type: 'Type',
    method: 'Method',
    description: 'Description',
    actions: 'Actions',
    download: 'Download invoice',
    success: 'Success',
    failed: 'Failed',
    pending: 'Pending',
    refunded: 'Refunded',
    subscription: 'Subscription',
    messages: 'Messages',
    leads: 'Leads',
    features: 'Features',
    card: 'Card',
    bank: 'Bank',
    crypto: 'Crypto',
    wallet: 'Wallet',
    allTypes: 'All types',
    allStatuses: 'All statuses',
    allMethods: 'All methods',
    empty: 'No payments',
    emptyDescription: 'Payments will appear here after your first purchase',
    transactionId: 'Transaction ID',
    copyId: 'Copy ID',
    invoiceDownloaded: 'Invoice downloaded',
    idCopied: 'ID copied'
  }
};

export function BillingHistoryScreen({ 
  onBack, 
  state = 'default',
  locale = 'ru' 
}: BillingHistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [payments] = useState(mockPayments);

  const t = texts[locale];

  const formatCurrency = (amount: number) => {
    if (locale === 'ru') {
      return new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'RUB',
        minimumFractionDigits: 0
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <X className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'refunded':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank':
        return <Building className="w-4 h-4" />;
      case 'crypto':
        return <span className="text-sm">₿</span>;
      case 'wallet':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || payment.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesMethod = selectedMethod === 'all' || payment.method === selectedMethod;
    
    return matchesSearch && matchesType && matchesStatus && matchesMethod;
  });

  const downloadInvoice = (payment: Payment) => {
    // Simulate invoice download
    toast.success(t.invoiceDownloaded);
  };

  const copyTransactionId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(t.idCopied);
  };

  const exportData = () => {
    // Simulate data export
    toast.success(locale === 'ru' ? 'Экспорт начат' : 'Export started');
  };

  if (state === 'empty') {
    return (
      <div className="max-w-6xl mx-auto p-6">
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
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t.empty}</h3>
          <p className="text-muted-foreground">{t.emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
        
        <Button onClick={exportData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {t.export}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t.type} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTypes}</SelectItem>
                <SelectItem value="subscription">{t.subscription}</SelectItem>
                <SelectItem value="messages">{t.messages}</SelectItem>
                <SelectItem value="leads">{t.leads}</SelectItem>
                <SelectItem value="features">{t.features}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses}</SelectItem>
                <SelectItem value="success">{t.success}</SelectItem>
                <SelectItem value="failed">{t.failed}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="refunded">{t.refunded}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t.method} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allMethods}</SelectItem>
                <SelectItem value="card">{t.card}</SelectItem>
                <SelectItem value="bank">{t.bank}</SelectItem>
                <SelectItem value="crypto">{t.crypto}</SelectItem>
                <SelectItem value="wallet">{t.wallet}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">{t.date}</th>
                <th className="text-left p-4 font-medium">{t.description}</th>
                <th className="text-left p-4 font-medium">{t.type}</th>
                <th className="text-left p-4 font-medium">{t.method}</th>
                <th className="text-left p-4 font-medium">{t.status}</th>
                <th className="text-right p-4 font-medium">{t.amount}</th>
                <th className="text-right p-4 font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredPayments.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{formatDate(payment.date)}</div>
                        {payment.transactionId && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{payment.transactionId}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyTransactionId(payment.transactionId!)}
                              className="h-auto p-0.5"
                            >
                              <span className="sr-only">{t.copyId}</span>
                              📋
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="font-medium">{payment.description}</div>
                    </td>
                    
                    <td className="p-4">
                      <Badge variant="outline">
                        {payment.type === 'subscription' && t.subscription}
                        {payment.type === 'messages' && t.messages}
                        {payment.type === 'leads' && t.leads}
                        {payment.type === 'features' && t.features}
                      </Badge>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.method)}
                        <span className="text-sm">
                          {payment.method === 'card' && t.card}
                          {payment.method === 'bank' && t.bank}
                          {payment.method === 'crypto' && t.crypto}
                          {payment.method === 'wallet' && t.wallet}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">
                          {payment.status === 'success' && t.success}
                          {payment.status === 'failed' && t.failed}
                          {payment.status === 'pending' && t.pending}
                          {payment.status === 'refunded' && t.refunded}
                        </span>
                      </Badge>
                    </td>
                    
                    <td className="p-4 text-right">
                      <div className="font-medium">{formatCurrency(payment.amount)}</div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex justify-end">
                        {payment.invoiceUrl && payment.status === 'success' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadInvoice(payment)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {locale === 'ru' ? 'Нет платежей по заданным критериям' : 'No payments match the criteria'}
          </div>
        )}
      </Card>
    </div>
  );
}