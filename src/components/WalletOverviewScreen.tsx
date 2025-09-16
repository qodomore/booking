import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Banknote,
  TrendingUp,
  Eye,
  EyeOff,
  Copy,
  ArrowLeft,
  Loader2,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface WalletOverviewScreenProps {
  onBack?: () => void;
  onViewTransactions?: () => void;
  state?: 'default' | 'empty' | 'loading' | 'success' | 'error';
  locale?: 'ru' | 'en';
}

interface QuickAmount {
  value: number;
  label: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'crypto';
  name: string;
  icon: string;
  fee?: string;
}

const quickAmounts: QuickAmount[] = [
  { value: 1000, label: '1 000 ₽' },
  { value: 3000, label: '3 000 ₽' },
  { value: 5000, label: '5 000 ₽' },
  { value: 10000, label: '10 000 ₽' }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    name: 'Банковская карта',
    icon: '💳',
    fee: '2.9%'
  },
  {
    id: 'bank',
    type: 'bank',
    name: 'Банковский перевод',
    icon: '🏦',
    fee: '0%'
  },
  {
    id: 'crypto',
    type: 'crypto',
    name: 'Криптовалюта',
    icon: '₿',
    fee: '1.5%'
  }
];

const texts = {
  ru: {
    title: 'Кошелёк',
    subtitle: 'Баланс и управление средствами',
    balance: 'Баланс',
    hideBalance: 'Скрыть баланс',
    showBalance: 'Показать баланс',
    topUp: 'Пополнить',
    withdraw: 'Вывести',
    transactions: 'Транзакции',
    quickTopUp: 'Быстрое пополнение',
    customAmount: 'Другая сумма',
    amountPlaceholder: 'Введите сумму',
    paymentMethod: 'Способ оплаты',
    fee: 'Комиссия',
    total: 'К доплате',
    proceed: 'Продолжить',
    processing: 'Обработка...',
    cancel: 'Отмена',
    recentActivity: 'Последние операции',
    viewAll: 'Показать все',
    income: 'Доход',
    expense: 'Расход',
    topUpSuccess: 'Кошелёк пополнен!',
    topUpError: 'Ошибка пополнения',
    copyAddress: 'Скопировать адрес',
    walletAddress: 'Адрес кошелька',
    bankDetails: 'Реквизиты для перевода',
    requirements: 'Обязательные поля',
    minAmount: 'Минимальная сумма: 100 ₽'
  },
  en: {
    title: 'Wallet',
    subtitle: 'Balance and funds management',
    balance: 'Balance',
    hideBalance: 'Hide balance',
    showBalance: 'Show balance',
    topUp: 'Top Up',
    withdraw: 'Withdraw',
    transactions: 'Transactions',
    quickTopUp: 'Quick Top Up',
    customAmount: 'Custom amount',
    amountPlaceholder: 'Enter amount',
    paymentMethod: 'Payment method',
    fee: 'Fee',
    total: 'Total',
    proceed: 'Proceed',
    processing: 'Processing...',
    cancel: 'Cancel',
    recentActivity: 'Recent activity',
    viewAll: 'View all',
    income: 'Income',
    expense: 'Expense',
    topUpSuccess: 'Wallet topped up!',
    topUpError: 'Top up error',
    copyAddress: 'Copy address',
    walletAddress: 'Wallet address',
    bankDetails: 'Bank transfer details',
    requirements: 'Required fields',
    minAmount: 'Minimum amount: $10'
  }
};

const mockTransactions = [
  {
    id: '1',
    type: 'income',
    title: 'Оплата услуги',
    description: 'Маникюр - Анна П.',
    amount: 2500,
    date: '15 мин назад'
  },
  {
    id: '2',
    type: 'expense',
    title: 'Комиссия за SMS',
    description: 'Уведомления клиентам',
    amount: -150,
    date: '2 часа назад'
  },
  {
    id: '3',
    type: 'income',
    title: 'Пополнение кошелька',
    description: 'Банковская карта',
    amount: 5000,
    date: 'Вчера'
  }
];

export function WalletOverviewScreen({ 
  onBack, 
  onViewTransactions,
  state = 'default',
  locale = 'ru' 
}: WalletOverviewScreenProps) {
  const [balance] = useState(12750);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const getAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const getFee = () => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    if (!method?.fee) return 0;
    
    const amount = getAmount();
    const feePercent = parseFloat(method.fee.replace('%', ''));
    return Math.round(amount * feePercent / 100);
  };

  const getTotal = () => {
    return getAmount() + getFee();
  };

  const handleTopUp = async () => {
    const amount = getAmount();
    
    if (amount < 100) {
      toast.error(locale === 'ru' ? 'Минимальная сумма 100 ₽' : 'Minimum amount $10');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error(locale === 'ru' ? 'Выберите способ оплаты' : 'Select payment method');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(t.topUpSuccess);
      setIsTopUpDialogOpen(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setSelectedPaymentMethod('');
    } catch (error) {
      toast.error(t.topUpError);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(locale === 'ru' ? 'Скопировано!' : 'Copied!');
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
            <Wallet className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {locale === 'ru' ? 'Кошелёк пуст' : 'Wallet is empty'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {locale === 'ru' ? 'Пополните кошелёк для начала работы' : 'Top up your wallet to get started'}
          </p>
          <Button onClick={() => setIsTopUpDialogOpen(true)} className="elegant-button">
            <Plus className="w-4 h-4 mr-2" />
            {t.topUp}
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
      </div>

      {/* Balance Card */}
      <Card className="p-6 gradient-card text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">{t.balance}</h3>
                <p className="text-white/80 text-sm">
                  {locale === 'ru' ? 'Доступно для вывода' : 'Available for withdrawal'}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-white hover:bg-white/20"
            >
              {isBalanceVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="text-3xl font-semibold mb-1">
              {isBalanceVisible ? formatCurrency(balance) : '••••••'}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>
                {locale === 'ru' ? '+12% за месяц' : '+12% this month'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.topUp}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.topUp}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Quick amounts */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t.quickTopUp}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount.value}
                          variant={selectedAmount === amount.value ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAmount(amount.value);
                            setCustomAmount('');
                          }}
                          className="h-12"
                        >
                          {amount.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom amount */}
                  <div>
                    <Label htmlFor="customAmount">{t.customAmount}</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder={t.amountPlaceholder}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t.minAmount}</p>
                  </div>
                  
                  {/* Payment method */}
                  <div>
                    <Label>{t.paymentMethod}</Label>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder={locale === 'ru' ? 'Выберите способ' : 'Select method'} />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              <span>{method.icon}</span>
                              <span>{method.name}</span>
                              {method.fee && (
                                <Badge variant="secondary" className="text-xs ml-auto">
                                  {t.fee}: {method.fee}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Summary */}
                  {getAmount() > 0 && selectedPaymentMethod && (
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{locale === 'ru' ? 'Сумма' : 'Amount'}</span>
                        <span>{formatCurrency(getAmount())}</span>
                      </div>
                      {getFee() > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{t.fee}</span>
                          <span>{formatCurrency(getFee())}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>{t.total}</span>
                        <span>{formatCurrency(getTotal())}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Payment details */}
                  {selectedPaymentMethod === 'bank' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium mb-2">{t.bankDetails}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Получатель:</span>
                          <span>ООО "Кодо Букинг"</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Счёт:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">40817810099910004312</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard('40817810099910004312')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>БИК:</span>
                          <span>044525225</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPaymentMethod === 'crypto' && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <h4 className="font-medium mb-2">{t.walletAddress}</h4>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-background rounded text-xs font-mono break-all">
                          bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsTopUpDialogOpen(false)} className="flex-1">
                      {t.cancel}
                    </Button>
                    <Button 
                      onClick={handleTopUp}
                      disabled={getAmount() < 100 || !selectedPaymentMethod || isProcessing}
                      className="flex-1 elegant-button"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.processing}
                        </div>
                      ) : (
                        t.proceed
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              {t.withdraw}
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{t.recentActivity}</h3>
            <Button variant="ghost" size="sm" onClick={onViewTransactions}>
              {t.viewAll}
            </Button>
          </div>
        </div>
        
        <div className="divide-y">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.title}</div>
                  <div className="text-sm text-muted-foreground">{transaction.description}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </div>
                <div className="text-sm text-muted-foreground">{transaction.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}