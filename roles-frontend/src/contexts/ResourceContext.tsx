import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // в минутах
  price: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Bundle {
  id: string;
  name: string;
  serviceIds: string[];
  priceMode: 'sum' | 'discount' | 'fixed';
  priceDiscountPct?: number;
  priceFixed?: number;
  durationMode: 'sum' | 'custom';
  durationCustomMin?: number;
  resourceRules: {
    sameHuman: boolean;
    roomTypeId?: string;
    equipmentIds?: string[];
    concurrency: 'serial' | 'parallel';
  };
  isActive: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  telegramNick?: string;
  telegramUsername?: string; // Добавляем отдельное поле для @username
  preferredContact: 'phone' | 'email' | 'telegram' | 'whatsapp';
  notes?: string;
  lastVisit?: Date;
  totalVisits: number;
  totalSpent: number;
}

export interface Resource {
  id: string;
  name: string;
  type: 'specialist' | 'slot' | 'equipment';
  availability: {
    [key: string]: boolean;
  };
  skills?: string[];
  serviceIds?: string[]; // ID услуг, которые может выполнять специалист
  capacity?: number;
  status: 'active' | 'inactive' | 'busy' | 'vacation';
  phone?: string;
  email?: string;
}

export type ColorTheme = 'blue' | 'pink' | 'green' | 'orange' | 'purple';

export interface ResourceContextType {
  resources: Resource[];
  services: Service[];
  bundles: Bundle[];
  clients: Client[];
  addResource: (resource: Omit<Resource, 'id'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  removeResource: (id: string) => void;
  getResourcesByType: (type: Resource['type']) => Resource[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  removeService: (id: string) => void;
  getServicesByIds: (ids: string[]) => Service[];
  addBundle: (bundle: Omit<Bundle, 'id'>) => void;
  updateBundle: (id: string, updates: Partial<Bundle>) => void;
  removeBundle: (id: string) => void;
  getBundlesByServiceId: (serviceId: string) => Bundle[];
  calculateBundlePrice: (bundle: Bundle) => number;
  calculateBundleDuration: (bundle: Bundle) => number;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  removeClient: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

const defaultServices: Service[] = [
  {
    id: '1',
    name: 'Классический маникюр',
    description: 'Обработка кутикулы, придание формы ногтям, полировка',
    duration: 60,
    price: 1500,
    category: 'Маникюр',
    isActive: true,
  },
  {
    id: '2',
    name: 'Гель-лак',
    description: 'Покрытие ногтей стойким гель-лаком',
    duration: 30,
    price: 800,
    category: 'Покрытие',
    isActive: true,
  },
  {
    id: '3',
    name: 'Женская стрижка',
    description: 'Стрижка волос любой сложности',
    duration: 90,
    price: 2500,
    category: 'Стрижка',
    isActive: true,
  },
  {
    id: '4',
    name: 'Окрашивание волос',
    description: 'Окрашивание в один тон или сложные техники',
    duration: 180,
    price: 4500,
    category: 'Окрашивание',
    isActive: true,
  },
];

const defaultBundles: Bundle[] = [
  {
    id: '1',
    name: 'Полный маникюр',
    serviceIds: ['1', '2'],
    priceMode: 'discount',
    priceDiscountPct: 15,
    durationMode: 'sum',
    resourceRules: {
      sameHuman: true,
      concurrency: 'serial',
    },
    isActive: true,
  },
  {
    id: '2',
    name: 'Полный уход за волосами',
    serviceIds: ['3', '4'],
    priceMode: 'discount',
    priceDiscountPct: 10,
    durationMode: 'custom',
    durationCustomMin: 240,
    resourceRules: {
      sameHuman: true,
      concurrency: 'serial',
    },
    isActive: true,
  },
];

const defaultClients: Client[] = [
  {
    id: '1',
    name: 'Анна Смирнова',
    phone: '+7 (999) 123-45-67',
    email: 'anna@example.com',
    telegramNick: '@anna_s',
    telegramUsername: 'anna_s',
    preferredContact: 'telegram',
    totalVisits: 12,
    totalSpent: 25000,
    lastVisit: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Елена Козлова',
    phone: '+7 (888) 987-65-43',
    email: 'elena.kozlova@mail.ru',
    telegramUsername: 'elena_kozlova',
    preferredContact: 'phone',
    totalVisits: 8,
    totalSpent: 18500,
    lastVisit: new Date('2024-01-10'),
  },
];

const defaultResources: Resource[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    type: 'specialist',
    availability: {
      'monday': true,
      'tuesday': true,
      'wednesday': true,
      'thursday': true,
      'friday': true,
      'saturday': false,
      'sunday': false,
    },
    skills: ['Маникюр', 'Педикюр', 'Гель-лак'],
    serviceIds: ['1', '2'],
    status: 'active',
    phone: '+7 (900) 123-45-67',
    email: 'anna.ivanova@salon.com',
  },
  {
    id: '2',
    name: 'Мария Петрова',
    type: 'specialist',
    availability: {
      'monday': true,
      'tuesday': true,
      'wednesday': false,
      'thursday': true,
      'friday': true,
      'saturday': true,
      'sunday': false,
    },
    skills: ['Стрижка', 'Окрашивание', 'Укладка'],
    serviceIds: ['3', '4'],
    status: 'active',
    phone: '+7 (900) 987-65-43',
    email: 'maria.petrova@salon.com',
  },
  {
    id: '3',
    name: 'Кабинет №1',
    type: 'slot',
    availability: {
      'monday': true,
      'tuesday': true,
      'wednesday': true,
      'thursday': true,
      'friday': true,
      'saturday': true,
      'sunday': false,
    },
    capacity: 1,
    status: 'active',
  },
  {
    id: '4',
    name: 'Кабинет №2',
    type: 'slot',
    availability: {
      'monday': true,
      'tuesday': true,
      'wednesday': true,
      'thursday': true,
      'friday': true,
      'saturday': false,
      'sunday': false,
    },
    capacity: 1,
    status: 'active',
  },
];

export function ResourceProvider({ children }: { children: ReactNode }) {
  const { colorScheme, isLoading: telegramLoading } = useTelegram();
  const [resources, setResources] = useState<Resource[]>(defaultResources);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [bundles, setBundles] = useState<Bundle[]>(defaultBundles);
  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('blue');

  const addResource = (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
    };
    setResources(prev => [...prev, newResource]);
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === id ? { ...resource, ...updates } : resource
      )
    );
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const getResourcesByType = (type: Resource['type']) => {
    return resources.filter(resource => resource.type === type);
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, ...updates } : service
      )
    );
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    // Также удаляем услугу из всех специалистов
    setResources(prev => 
      prev.map(resource => ({
        ...resource,
        serviceIds: resource.serviceIds?.filter(serviceId => serviceId !== id)
      }))
    );
  };

  const getServicesByIds = (ids: string[]) => {
    return services.filter(service => ids.includes(service.id));
  };

  const addBundle = (bundle: Omit<Bundle, 'id'>) => {
    const newBundle: Bundle = {
      ...bundle,
      id: Date.now().toString(),
    };
    setBundles(prev => [...prev, newBundle]);
  };

  const updateBundle = (id: string, updates: Partial<Bundle>) => {
    setBundles(prev => 
      prev.map(bundle => 
        bundle.id === id ? { ...bundle, ...updates } : bundle
      )
    );
  };

  const removeBundle = (id: string) => {
    setBundles(prev => prev.filter(bundle => bundle.id !== id));
  };

  const getBundlesByServiceId = (serviceId: string) => {
    return bundles.filter(bundle => bundle.serviceIds.includes(serviceId));
  };

  const calculateBundlePrice = (bundle: Bundle) => {
    if (bundle.priceMode === 'sum') {
      return bundle.serviceIds.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service?.price || 0);
      }, 0);
    } else if (bundle.priceMode === 'discount') {
      const total = bundle.serviceIds.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service?.price || 0);
      }, 0);
      return total * (1 - (bundle.priceDiscountPct || 0) / 100);
    } else if (bundle.priceMode === 'fixed') {
      return bundle.priceFixed || 0;
    }
    return 0;
  };

  const calculateBundleDuration = (bundle: Bundle) => {
    if (bundle.durationMode === 'sum') {
      return bundle.serviceIds.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service?.duration || 0);
      }, 0);
    } else if (bundle.durationMode === 'custom') {
      return bundle.durationCustomMin || 0;
    }
    return 0;
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  const removeClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const setColorTheme = (theme: ColorTheme) => {
    // Remove all theme classes
    document.documentElement.classList.remove('theme-blue', 'theme-pink', 'theme-green', 'theme-orange', 'theme-purple');
    // Add new theme class
    document.documentElement.classList.add(`theme-${theme}`);
    setColorThemeState(theme);
  };

  // Set initial theme
  useEffect(() => {
    // Set default blue theme
    document.documentElement.classList.add(`theme-${colorTheme}`);
    
    // Apply initial dark mode state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorTheme]);

  // Apply dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const value: ResourceContextType = {
    resources,
    services,
    bundles,
    clients,
    addResource,
    updateResource,
    removeResource,
    getResourcesByType,
    addService,
    updateService,
    removeService,
    getServicesByIds,
    addBundle,
    updateBundle,
    removeBundle,
    getBundlesByServiceId,
    calculateBundlePrice,
    calculateBundleDuration,
    addClient,
    updateClient,
    removeClient,
    darkMode,
    toggleDarkMode,
    colorTheme,
    setColorTheme,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
}