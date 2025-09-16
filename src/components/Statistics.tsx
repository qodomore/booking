import React, { useState } from 'react';
import { BarChart3, TrendingUp, Banknote, Users, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GapsToday } from './GapsToday';
import { DemandPricingHeatmap } from './DemandPricingHeatmap';

interface StatsData {
  period: string;
  revenue: number;
  clients: number;
  appointments: number;
  averageCheck: number;
}

const monthlyData: StatsData[] = [
  { period: 'Янв', revenue: 85000, clients: 45, appointments: 120, averageCheck: 1400 },
  { period: 'Фев', revenue: 92000, clients: 52, appointments: 135, averageCheck: 1450 },
  { period: 'Мар', revenue: 78000, clients: 48, appointments: 118, averageCheck: 1350 },
  { period: 'Апр', revenue: 105000, clients: 58, appointments: 145, averageCheck: 1520 },
  { period: 'Май', revenue: 112000, clients: 62, appointments: 158, averageCheck: 1580 },
  { period: 'Июн', revenue: 98000, clients: 55, appointments: 142, averageCheck: 1480 },
  { period: 'Июл', revenue: 125000, clients: 68, appointments: 172, averageCheck: 1620 }
];

const weeklyData = [
  { period: 'Пн', revenue: 15000, clients: 8, appointments: 22 },
  { period: 'Вт', revenue: 18000, clients: 12, appointments: 28 },
  { period: 'Ср', revenue: 22000, clients: 15, appointments: 32 },
  { period: 'Чт', revenue: 20000, clients: 13, appointments: 30 },
  { period: 'Пт', revenue: 25000, clients: 18, appointments: 38 },
  { period: 'Сб', revenue: 28000, clients: 20, appointments: 42 },
  { period: 'Вс', revenue: 12000, clients: 6, appointments: 18 }
];

const serviceData = [
  { name: 'Маникюр', value: 35, revenue: 420000, color: '#8884d8' },
  { name: 'Стрижка', value: 25, revenue: 300000, color: '#82ca9d' },
  { name: 'Окрашивание', value: 20, revenue: 240000, color: '#ffc658' },
  { name: 'Педикюр', value: 15, revenue: 180000, color: '#ff7300' },
  { name: 'Массаж', value: 5, revenue: 60000, color: '#ff0000' }
];

const masterData = [
  { name: 'Анна Иванова', clients: 245, revenue: 350000, appointments: 285, rating: 4.8 },
  { name: 'Мария Петрова', clients: 180, revenue: 520000, appointments: 210, rating: 4.9 },
  { name: 'Елена Сидорова', clients: 95, revenue: 180000, appointments: 125, rating: 4.7 }
];

const timeSlotData = [
  { time: '09:00-10:00', bookings: 12 },
  { time: '10:00-11:00', bookings: 18 },
  { time: '11:00-12:00', bookings: 22 },
  { time: '12:00-13:00', bookings: 15 },
  { time: '13:00-14:00', bookings: 8 },
  { time: '14:00-15:00', bookings: 20 },
  { time: '15:00-16:00', bookings: 25 },
  { time: '16:00-17:00', bookings: 28 },
  { time: '17:00-18:00', bookings: 24 },
  { time: '18:00-19:00', bookings: 16 },
  { time: '19:00-20:00', bookings: 10 }
];

interface StatisticsProps {
  onOpenSmartPricing?: () => void;
  onBack?: () => void;
}

export function Statistics({ onOpenSmartPricing, onBack }: StatisticsProps = {}) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [testPlan, setTestPlan] = useState<'free' | 'pro'>('free'); // For testing
  
  const currentData = selectedPeriod === 'week' ? weeklyData : monthlyData;
  
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalClients = currentData.reduce((sum, item) => sum + item.clients, 0);
  const totalAppointments = currentData.reduce((sum, item) => sum + item.appointments, 0);
  const averageCheck = totalRevenue / totalAppointments;

  const previousPeriodRevenue = totalRevenue * 0.85; // Mock previous period
  const revenueGrowth = ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Статистика и аналитика</h2>
            <p className="text-gray-500 mt-1 text-sm">Подробная аналитика работы салона</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Badge 
            variant={testPlan === 'free' ? 'destructive' : 'default'}
            className="cursor-pointer"
            onClick={() => setTestPlan(testPlan === 'free' ? 'pro' : 'free')}
          >
            План: {testPlan === 'free' ? 'Free' : 'Pro'}
          </Badge>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">За неделю</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Общий доход</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">
                  {(totalRevenue / 1000).toFixed(0)}k ₽
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                  <span className="text-xs md:text-sm text-green-600">+{revenueGrowth.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Клиенты</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">{totalClients}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm text-blue-600">+12%</span>
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Записи</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">{totalAppointments}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                  <span className="text-xs md:text-sm text-purple-600">+8%</span>
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Средний чек</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">
                  {Math.round(averageCheck).toLocaleString()} ₽
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                  <span className="text-xs md:text-sm text-orange-600">+5%</span>
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Card - Load and Pricing Analysis */}
      <DemandPricingHeatmap
        locale="ru"
        plan={testPlan} // Change to "pro" to unlock
        onApplyPrice={(context) => {
          console.log('Apply price context:', context);
          if (onOpenSmartPricing) {
            onOpenSmartPricing();
          }
        }}
      />

      {/* Free Slots Today - Dashboard Section */}
      <GapsToday
        locale="ru"
        sendQuotaLeft={45}
        plan="free"
        onSlotBook={(slot) => {
          console.log('Dashboard - Booking slot:', slot);
          // Handle slot booking from dashboard
        }}
      />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Динамика дохода</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} ₽`, 'Доход']} />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Services Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Распределение по услугам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Slots Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Загруженность по времени</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSlotData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Записей']} />
                <Bar dataKey="bookings" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Clients and Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Клиенты и записи</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clients" stroke="#8884d8" name="Клиенты" />
                <Line type="monotone" dataKey="appointments" stroke="#82ca9d" name="Записи" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Masters Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Эффективность мастеров</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {masterData.map((master, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{master.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">★ {master.rating}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{master.clients}</p>
                      <p className="text-gray-500">Клиентов</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="font-medium">{(master.revenue / 1000).toFixed(0)}k ₽</p>
                      <p className="text-gray-500">Доход</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="font-medium">{master.appointments}</p>
                      <p className="text-gray-500">Записей</p>
                    </div>
                  </div>
                </div>
                
                {/* Performance Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Эффективность</span>
                    <span>{Math.round((master.revenue / 600000) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((master.revenue / 600000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Анализ услуг</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceData.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: service.color }}
                  ></div>
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.value}% от общего объема</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {(service.revenue / 1000).toFixed(0)}k ₽
                  </p>
                  <p className="text-sm text-gray-500">доход</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}