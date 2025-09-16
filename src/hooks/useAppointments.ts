import { useState, useCallback } from 'react';
import { Appointment, AppointmentUpdate, Client } from '../types/appointment';
import { useTelegram } from './useTelegram';

// Mock data для демонстрации
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Анна Петрова',
    phone: '+7 (999) 123-45-67',
    email: 'anna@example.com',
    notes: 'VIP клиент, предпочитает утренние часы для процедур. Любит натуральные оттенки в окрашивании.'
  },
  {
    id: '2',
    name: 'Мария Иванова',
    phone: '+7 (999) 234-56-78',
    email: 'maria@example.com',
    notes: 'Регулярный клиент, записывается каждые 2 недели.'
  },
  {
    id: '3',
    name: 'Елена Сидорова',
    phone: '+7 (999) 345-67-89',
    email: 'elena@example.com',
    notes: 'Новый клиент, требует дополнительной консультации.'
  },
  {
    id: 'client-1',
    name: 'Мария Смирнова',
    phone: '+7 (999) 123-45-67',
    email: 'maria@example.com'
  },
  {
    id: 'client-2',
    name: 'Елена Петрова',
    phone: '+7 (999) 234-56-78',
    email: 'elena@example.com'
  },
  {
    id: 'client-3',
    name: 'Светлана Иванова',
    phone: '+7 (999) 345-67-89'
  },
  {
    id: 'client-4',
    name: 'Анна Козлова',
    phone: '+7 (999) 456-78-90'
  },
  {
    id: 'client-5',
    name: 'Ольга Сидорова',
    phone: '+7 (999) 567-89-01'
  },
  {
    id: 'client-6',
    name: 'Марина Белова',
    phone: '+7 (999) 678-90-12'
  },
  {
    id: 'client-7',
    name: 'Татьяна Морозова',
    phone: '+7 (999) 789-01-23'
  }
];

const mockAppointments: Appointment[] = [
  // Анна Петрова - ID: 1
  {
    id: '1',
    client: mockClients[0], // Анна Петрова
    resourceId: '1',
    title: 'Стрижка + укладка',
    start: '2024-12-07T10:00:00.000Z',
    end: '2024-12-07T11:30:00.000Z',
    status: 'CONFIRMED',
    price: 3500,
    color: '#3b82f6',
    notes: 'Клиент предпочитает короткие стрижки'
  },
  {
    id: 'anna-1',
    client: mockClients[0], // Анна Петрова
    resourceId: '1',
    title: 'Окрашивание корней',
    start: '2024-11-20T14:00:00.000Z',
    end: '2024-11-20T16:30:00.000Z',
    status: 'CONFIRMED',
    price: 4500,
    color: '#8b5cf6',
    notes: 'Тонирование в натуральный блонд'
  },
  {
    id: 'anna-2',
    client: mockClients[0], // Анна Петрова
    resourceId: '1',
    title: 'Стрижка',
    start: '2024-11-01T11:00:00.000Z',
    end: '2024-11-01T12:00:00.000Z',
    status: 'CONFIRMED',
    price: 2500,
    color: '#10b981',
    notes: 'Легкая коррекция длины'
  },
  // Мария Иванова - ID: 2
  {
    id: 'maria-1',
    client: mockClients[1], // Мария Иванова
    resourceId: '2',
    title: 'Маникюр + гель-лак',
    start: '2024-12-05T15:30:00.000Z',
    end: '2024-12-05T17:00:00.000Z',
    status: 'CONFIRMED',
    price: 3000,
    color: '#f97316',
    notes: 'Классический красный цвет'
  },
  {
    id: 'maria-2',
    client: mockClients[1], // Мария Иванова
    resourceId: '2',
    title: 'Педикюр',
    start: '2024-11-15T13:00:00.000Z',
    end: '2024-11-15T14:30:00.000Z',
    status: 'CONFIRMED',
    price: 2800,
    color: '#06b6d4'
  },
  // Елена Сидорова - ID: 3
  {
    id: 'elena-1',
    client: mockClients[2], // Елена Сидорова
    resourceId: '3',
    title: 'Консультация косметолога',
    start: '2024-12-02T16:00:00.000Z',
    end: '2024-12-02T17:00:00.000Z',
    status: 'CONFIRMED',
    price: 1500,
    color: '#84cc16',
    notes: 'Первичный осмотр, составление плана ухода'
  },
  // Остальные клиенты
  {
    id: '2',
    client: mockClients[4], // Ольга Сидорова 
    resourceId: '1',
    title: 'Окрашивание',
    start: '2024-12-07T13:00:00.000Z',
    end: '2024-12-07T15:30:00.000Z',
    status: 'CONFIRMED',
    price: 8500,
    color: '#8b5cf6'
  },
  {
    id: '3',
    client: mockClients[5], // Марина Белова
    resourceId: '1',
    title: 'Стрижка',
    start: '2024-12-07T16:00:00.000Z',
    end: '2024-12-07T17:00:00.000Z',
    status: 'CONFIRMED',
    price: 2000,
    color: '#10b981'
  },
  {
    id: '4',
    client: mockClients[6], // Татьяна Морозова
    resourceId: '2',
    title: 'Маникюр + дизайн',
    start: '2024-12-07T11:00:00.000Z',
    end: '2024-12-07T12:30:00.000Z',
    status: 'PENDING',
    price: 3500,
    color: '#eab308'
  },
  {
    id: '5',
    client: mockClients[7], // Анна Козлова
    resourceId: '2',
    title: 'Педикюр',
    start: '2024-12-07T14:30:00.000Z',
    end: '2024-12-07T16:00:00.000Z',
    status: 'CONFIRMED',
    price: 3000,
    color: '#f97316'
  },
  {
    id: '6',
    client: mockClients[8], // Ольга Сидорова
    resourceId: '3',
    title: 'Массаж лица',
    start: '2024-12-07T10:30:00.000Z',
    end: '2024-12-07T11:30:00.000Z',
    status: 'CONFIRMED',
    price: 2500,
    color: '#06b6d4'
  },
  {
    id: '7',
    client: mockClients[9], // Марина Белова
    resourceId: '3',
    title: 'Чистка лица',
    start: '2024-12-07T14:00:00.000Z',
    end: '2024-12-07T15:30:00.000Z',
    status: 'PENDING',
    price: 4000,
    color: '#84cc16',
    notes: 'Первое посещение, провести консультацию'
  },
  {
    id: '8',
    client: mockClients[0], // Анна Петрова - еще одна запись
    resourceId: '1',
    title: 'Маникюр',
    start: '2024-12-07T08:30:00.000Z',
    end: '2024-12-07T09:30:00.000Z',
    status: 'COMPLETED',
    price: 2500,
    color: '#10b981',
    notes: 'Услуга выполнена успешно'
  }
];

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { hapticFeedback } = useTelegram();

  // Симуляция API запроса
  const simulateApiCall = useCallback(function<T>(fn: () => T, delay = 500): Promise<T> {
    setIsLoading(true);
    setError(null);
    
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Симуляция случайных ошибок (5% вероятность)
          if (Math.random() < 0.05) {
            throw new Error('Ошибка сети');
          }
          const result = fn();
          resolve(result);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
          setError(errorMessage);
          reject(new Error(errorMessage));
        } finally {
          setIsLoading(false);
        }
      }, delay);
    });
  }, []);

  // Получить запись по ID
  const getAppointment = useCallback(async (id: string): Promise<Appointment | null> => {
    return await simulateApiCall(() => {
      const appointment = appointments.find(apt => apt.id === id);
      return appointment || null;
    });
  }, [appointments, simulateApiCall]);

  // Получить клиента по ID
  const getClient = useCallback(async (id: string): Promise<Client | null> => {
    return await simulateApiCall(() => {
      const client = mockClients.find(c => c.id === id);
      return client || null;
    });
  }, [simulateApiCall]);

  // Обновить запись
  const updateAppointment = useCallback(async (
    id: string, 
    updates: AppointmentUpdate
  ): Promise<Appointment> => {
    return await simulateApiCall(() => {
      const appointmentIndex = appointments.findIndex(apt => apt.id === id);
      if (appointmentIndex === -1) {
        throw new Error('Запись не найдена');
      }

      const currentAppointment = appointments[appointmentIndex];
      
      // Валидация времени
      if (updates.start && updates.end) {
        const start = new Date(updates.start);
        const end = new Date(updates.end);
        
        if (start >= end) {
          throw new Error('Время начала должно быть раньше времени окончания');
        }

        // Проверка пересечений с другими записями
        const hasConflict = appointments.some(apt => {
          if (apt.id === id) return false; // Исключаем текущую запись
          if (updates.resourceId && apt.resourceId !== updates.resourceId) return false;
          if (!updates.resourceId && apt.resourceId !== currentAppointment.resourceId) return false;

          const aptStart = new Date(apt.start);
          const aptEnd = new Date(apt.end);
          
          return (start < aptEnd && end > aptStart);
        });

        if (hasConflict) {
          throw new Error('Конфликт времени: этот слот уже занят');
        }
      }

      // Обновляем запись
      const updatedAppointment = {
        ...currentAppointment,
        ...updates
      };

      setAppointments(prev => {
        const newAppointments = [...prev];
        newAppointments[appointmentIndex] = updatedAppointment;
        return newAppointments;
      });

      hapticFeedback.success();
      return updatedAppointment;
    });
  }, [appointments, simulateApiCall, hapticFeedback]);

  // Отменить запись
  const cancelAppointment = useCallback(async (id: string): Promise<void> => {
    return await simulateApiCall(() => {
      const appointmentIndex = appointments.findIndex(apt => apt.id === id);
      if (appointmentIndex === -1) {
        throw new Error('Запись не найдена');
      }

      setAppointments(prev => {
        const newAppointments = [...prev];
        newAppointments[appointmentIndex] = {
          ...newAppointments[appointmentIndex],
          status: 'CANCELLED'
        };
        return newAppointments;
      });

      hapticFeedback.medium();
    });
  }, [appointments, simulateApiCall, hapticFeedback]);

  // Валидация перемещения записи
  const validateMove = useCallback((
    appointmentId: string,
    newStart: string,
    newEnd: string,
    newResourceId?: string
  ): { isValid: boolean; error?: string } => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
      return { isValid: false, error: 'Запись не найдена' };
    }

    if (appointment.status === 'CANCELLED') {
      return { isValid: false, error: 'Нельзя перемещать отмененные записи' };
    }

    const start = new Date(newStart);
    const end = new Date(newEnd);

    if (start >= end) {
      return { isValid: false, error: 'Неверное время' };
    }

    // Проверка рабочих часов (9:00 - 18:00)
    const startHour = start.getHours();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();

    if (startHour < 9 || startHour >= 18 || endHour > 18 || (endHour === 18 && endMinute > 0)) {
      return { isValid: false, error: 'Время должно быть в рабочих часах (9:00-18:00)' };
    }

    // Проверка конфликтов
    const targetResourceId = newResourceId || appointment.resourceId;
    const hasConflict = appointments.some(apt => {
      if (apt.id === appointmentId) return false;
      if (apt.resourceId !== targetResourceId) return false;

      const aptStart = new Date(apt.start);
      const aptEnd = new Date(apt.end);
      
      return (start < aptEnd && end > aptStart);
    });

    if (hasConflict) {
      return { isValid: false, error: 'Конфликт времени: этот слот уже занят' };
    }

    return { isValid: true };
  }, [appointments]);

  // Создать новую запись
  const createAppointment = useCallback(async (appointmentData: {
    clientName: string;
    clientPhone: string;
    resourceId: string;
    title: string;
    start: string;
    end: string;
    price: number;
    notes?: string;
  }): Promise<Appointment> => {
    return await simulateApiCall(() => {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        name: appointmentData.clientName,
        phone: appointmentData.clientPhone
      };

      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        client: newClient,
        resourceId: appointmentData.resourceId,
        title: appointmentData.title,
        start: appointmentData.start,
        end: appointmentData.end,
        status: 'CONFIRMED',
        price: appointmentData.price,
        color: '#3b82f6',
        notes: appointmentData.notes
      };

      // Проверка конфликтов
      const start = new Date(newAppointment.start);
      const end = new Date(newAppointment.end);
      
      const hasConflict = appointments.some(apt => {
        if (apt.resourceId !== newAppointment.resourceId) return false;
        const aptStart = new Date(apt.start);
        const aptEnd = new Date(apt.end);
        return (start < aptEnd && end > aptStart);
      });

      if (hasConflict) {
        throw new Error('Конфликт времени: этот слот уже занят');
      }

      setAppointments(prev => [...prev, newAppointment]);
      hapticFeedback.success();
      return newAppointment;
    });
  }, [appointments, simulateApiCall, hapticFeedback]);

  return {
    appointments,
    isLoading,
    error,
    getAppointment,
    getClient,
    updateAppointment,
    cancelAppointment,
    createAppointment,
    validateMove,
    clearError: () => setError(null)
  };
}