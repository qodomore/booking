import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { ServiceDetails } from './components/ServiceDetails';
import { TimeSelection } from './components/TimeSelection';
import { BookingConfirmation } from './components/BookingConfirmation';
import { BookingSuccess } from './components/BookingSuccess';
import { BookingDetails } from './components/BookingDetails';
import { MyBookings } from './components/MyBookings';
import { Settings } from './components/Settings';
import { Offers } from './components/Offers';
import { Review } from './components/Review';
import { RescheduleCancel } from './components/RescheduleCancel';
import { BusinessProfile } from './components/BusinessProfile';
import { Inbox } from './components/Inbox';
import { BottomNavigation } from './components/BottomNavigation';


export type Screen = 
  | 'home' 
  | 'search' 
  | 'service-details' 
  | 'time-selection' 
  | 'confirmation' 
  | 'success' 
  | 'booking-details' 
  | 'my-bookings' 
  | 'settings' 
  | 'offers' 
  | 'review' 
  | 'reschedule-cancel'
  | 'business-profile'
  | 'inbox';

export type Language = 'ru' | 'en';
export type Theme = 'light' | 'dark';

export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  workingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  image?: string;
  rating?: number;
  reviewCount?: number;
  categories: string[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'person' | 'room' | 'equipment';
  description?: string;
  image?: string;
  businessId: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: { from?: number; fixed?: number };
  duration: number;
  category: string;
  provider: string;
  location?: string;
  image?: string;
  rating?: number;
  businessId?: string;
  resourceIds?: string[];
}

export interface Booking {
  id: string;
  service: Service;
  date: string;
  time: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price: number;
}

export interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  notifications: {
    marketing: boolean;
    mute: boolean;
  };
  setNotifications: (notifications: any) => void;
  hasUnreadMessages: boolean;
  setHasUnreadMessages: (hasUnread: boolean) => void;
  selectedBusiness: Business | null;
  setSelectedBusiness: (business: Business | null) => void;
  businessResources: Resource[];
  setBusinessResources: (resources: Resource[]) => void;
  businessServices: Service[];
  setBusinessServices: (services: Service[]) => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

// Mock hot slots data
const mockHotSlots = [
  {
    id: 'slot-1',
    date: '15 сентября',
    time: '14:30',
    service: {
      name: 'Маникюр классический',
      duration: 90
    },
    resource: 'Анна Петрова',
    provider: 'Салон красоты "Элит"',
    price: 1500
  },
  {
    id: 'slot-2',
    date: '15 сентября',
    time: '16:00',
    service: {
      name: 'Шиномонтаж R16-R18',
      duration: 60
    },
    resource: 'Автомеханик Сергей',
    provider: 'АвтоСервис 24',
    price: 2000
  },
  {
    id: 'slot-3',
    date: '16 сентября',
    time: '10:00',
    service: {
      name: 'Персональная тренировка',
      duration: 60
    },
    resource: 'Тренер Михаил',
    provider: 'Фитнес-клуб "Титан"',
    price: 3000
  },
  {
    id: 'slot-4',
    date: '16 сентября',
    time: '11:30',
    service: {
      name: 'Маникюр классический',
      duration: 90
    },
    resource: 'Анна Петрова',
    provider: 'Салон красоты "Элит"',
    price: 1500
  },
  {
    id: 'slot-5',
    date: '17 сентября',
    time: '09:00',
    service: {
      name: 'Персональная тренировка',
      duration: 60
    },
    resource: 'Тренер Михаил',
    provider: 'Фитнес-клуб "Титан"',
    price: 3000
  }
];

// Mock data
const mockBusinesses: Business[] = [
  {
    id: 'business-1',
    name: 'Салон красоты "Элит"',
    description: 'Премиальный салон красоты с полным спектром услуг. Работаем с 2010 года.',
    address: 'ул. Тверская, 15',
    phone: '+7 (495) 123-45-67',
    email: 'info@elit-salon.ru',
    workingHours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '20:00' }
    },
    rating: 4.8,
    reviewCount: 127,
    categories: ['beauty', 'nails', 'hair']
  }
];

const mockResources: Resource[] = [
  {
    id: 'resource-1',
    name: 'Анна Петрова',
    type: 'person',
    description: 'Мастер маникюра с опытом 5 лет',
    businessId: 'business-1'
  },
  {
    id: 'resource-2',
    name: 'Кабинет №1',
    type: 'room',
    description: 'Просторный кабинет для маникюра',
    businessId: 'business-1'
  }
];

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Маникюр классический',
    description: 'Профессиональный уход за ногтями с покрытием гель-лак',
    price: { from: 1500 },
    duration: 90,
    category: 'beauty',
    provider: 'Салон красоты "Элит"',
    location: 'ул. Тверская, 15',
    rating: 4.8,
    businessId: 'business-1',
    resourceIds: ['resource-1', 'resource-2']
  },
  {
    id: '2',
    name: 'Шиномонтаж R16-R18',
    description: 'Замена летних шин на зимние, балансировка',
    price: { fixed: 2000 },
    duration: 60,
    category: 'auto',
    provider: 'АвтоСервис 24',
    location: 'ш. Энтузиастов, 42',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Персональная тренировка',
    description: 'Индивидуальное занятие с тренером по фитнесу',
    price: { fixed: 3000 },
    duration: 60,
    category: 'fitness',
    provider: 'Фитнес-клуб "Титан"',
    location: 'пр. Мира, 100',
    rating: 4.9
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [language, setLanguage] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('light');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessResources, setBusinessResources] = useState<Resource[]>([]);
  const [businessServices, setBusinessServices] = useState<Service[]>([]);
  const [notifications, setNotifications] = useState({
    marketing: false,
    mute: false
  });
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true); // Default to true to show notification dot initially

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Handle URL parameters for business profile
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get('business_id');
    
    if (businessId) {
      const business = mockBusinesses.find(b => b.id === businessId);
      if (business) {
        setSelectedBusiness(business);
        setBusinessServices(mockServices.filter(s => s.businessId === businessId));
        setBusinessResources(mockResources.filter(r => r.businessId === businessId));
        setCurrentScreen('business-profile');
      }
    }
  }, []);

  const contextValue: AppContextType = {
    currentScreen,
    setCurrentScreen,
    language,
    setLanguage,
    theme,
    setTheme,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    currentBooking,
    setCurrentBooking,
    bookings,
    setBookings,
    notifications,
    setNotifications,
    selectedBusiness,
    setSelectedBusiness,
    businessResources,
    setBusinessResources,
    businessServices,
    setBusinessServices,
    hasUnreadMessages,
    setHasUnreadMessages
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home services={mockServices} />;
      case 'search':
        return <Search services={mockServices} />;
      case 'service-details':
        return selectedService ? <ServiceDetails service={selectedService} /> : <Home services={mockServices} />;
      case 'time-selection':
        return selectedService ? <TimeSelection service={selectedService} /> : <Home services={mockServices} />;
      case 'confirmation':
        return <BookingConfirmation />;
      case 'success':
        return <BookingSuccess />;
      case 'booking-details':
        return currentBooking ? <BookingDetails booking={currentBooking} /> : <MyBookings />;
      case 'my-bookings':
        return <MyBookings />;
      case 'settings':
        return <Settings />;
      case 'offers':
        return <Offers />;
      case 'review':
        return currentBooking ? <Review booking={currentBooking} /> : <MyBookings />;
      case 'reschedule-cancel':
        return currentBooking ? <RescheduleCancel booking={currentBooking} /> : <MyBookings />;
      case 'business-profile':
        return selectedBusiness ? <BusinessProfile /> : <Home services={mockServices} />;
      case 'inbox':
        return <Inbox />;
      default:
        return <Home services={mockServices} />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-bg-base ambient-bg noise-texture relative overflow-hidden">
        {/* Main Content */}
        <div className="relative z-10 w-full max-w-sm mx-auto min-h-screen bg-background/80 backdrop-blur-sm">
          <div className={`h-screen overflow-y-auto overflow-x-hidden ${
            currentScreen === 'success' 
              ? 'pb-4' 
              : ['service-details', 'time-selection', 'confirmation', 'reschedule-cancel'].includes(currentScreen)
              ? 'pb-4'
              : 'pb-20'
          }`}>
            {renderScreen()}
          </div>
        </div>

        {/* Bottom Navigation - Fixed outside of content container - Hide on booking flow screens */}
        {!['service-details', 'time-selection', 'confirmation'].includes(currentScreen) && 
         ['home', 'search', 'my-bookings', 'settings', 'offers', 'business-profile', 'booking-details', 'review', 'reschedule-cancel', 'inbox'].includes(currentScreen) && (
          <BottomNavigation />
        )}
        
        <Toaster />
      </div>
    </AppContext.Provider>
  );
}