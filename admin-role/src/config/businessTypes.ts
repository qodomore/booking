export interface BusinessType {
  id: string;
  name: string;
  icon: string;
  primaryColor: {
    light: string;
    dark: string;
    gradient: string;
  };
  terminology: {
    specialist: string;
    specialists: string;
    service: string;
    services: string;
    client: string;
    clients: string;
    appointment: string;
    appointments: string;
    venue: string;
  };
  defaultServices: string[];
  specializations: string[];
}

export const businessTypes: BusinessType[] = [
  {
    id: 'universal',
    name: 'Универсальный бизнес',
    icon: '⚡',
    primaryColor: {
      light: 'blue-500',
      dark: 'blue-400',
      gradient: 'from-blue-500 to-indigo-500'
    },
    terminology: {
      specialist: 'Ресурс',
      specialists: 'Ресурсы',
      service: 'Предложение',
      services: 'Предложения',
      client: 'Клиент',
      clients: 'Клиенты',
      appointment: 'Бронирование',
      appointments: 'Бронирования',
      venue: 'Площадка'
    },
    defaultServices: [
      'Консультация',
      'Основная услуга',
      'Дополнительная услуга',
      'Комплексное предложение',
      'Индивидуальная работа',
      'Групповое мероприятие',
      'Экспресс-формат'
    ],
    specializations: [
      'Консультирование',
      'Основные услуги',
      'Дополнительные услуги',
      'VIP обслуживание',
      'Групповые форматы',
      'Специализированные услуги'
    ]
  },
  {
    id: 'beauty',
    name: 'Салон красоты',
    icon: '✨',
    primaryColor: {
      light: 'purple-500',
      dark: 'purple-400',
      gradient: 'from-purple-500 to-pink-500'
    },
    terminology: {
      specialist: 'Мастер',
      specialists: 'Мастера',
      service: 'Услуга',
      services: 'Услуги',
      client: 'Клиент',
      clients: 'Клиенты',
      appointment: 'Запись',
      appointments: 'Записи',
      venue: 'Салон'
    },
    defaultServices: [
      'Маникюр классический',
      'Педикюр',
      'Стрижка женская',
      'Окрашивание волос',
      'Укладка',
      'Чистка лица',
      'Массаж лица'
    ],
    specializations: [
      'Ногтевой сервис',
      'Парикмахерские услуги',
      'Косметология',
      'Массаж',
      'Перманентный макияж',
      'Ресницы и брови'
    ]
  },
  {
    id: 'dental',
    name: 'Стоматология',
    icon: '🦷',
    primaryColor: {
      light: 'blue-500',
      dark: 'blue-400',
      gradient: 'from-blue-500 to-cyan-500'
    },
    terminology: {
      specialist: 'Врач',
      specialists: 'Врачи',
      service: 'Процедура',
      services: 'Процедуры',
      client: 'Пациент',
      clients: 'Пациенты',
      appointment: 'Прием',
      appointments: 'Приемы',
      venue: 'Клиника'
    },
    defaultServices: [
      'Консультация',
      'Лечение кариеса',
      'Профессиональная чистка',
      'Удаление зуба',
      'Установка пломбы',
      'Отбеливание',
      'Протезирование'
    ],
    specializations: [
      'Терапевтическая стоматология',
      'Хирургическая стоматология',
      'Ортопедия',
      'Ортодонтия',
      'Пародонтология',
      'Детская стоматология'
    ]
  },
  {
    id: 'fitness',
    name: 'Фитнес-центр',
    icon: '💪',
    primaryColor: {
      light: 'orange-500',
      dark: 'orange-400',
      gradient: 'from-orange-500 to-red-500'
    },
    terminology: {
      specialist: 'Тренер',
      specialists: 'Тренеры',
      service: 'Занятие',
      services: 'Занятия',
      client: 'Клиент',
      clients: 'Клиенты',
      appointment: 'Тренировка',
      appointments: 'Тренировки',
      venue: 'Фитнес-центр'
    },
    defaultServices: [
      'Персональная тренировка',
      'Групповое занятие',
      'Йога',
      'Пилатес',
      'Кроссфит',
      'Консультация по питанию',
      'Массаж спортивный'
    ],
    specializations: [
      'Силовые тренировки',
      'Кардио тренировки',
      'Групповые программы',
      'Йога и стретчинг',
      'Спортивное питание',
      'Реабилитация'
    ]
  },
  {
    id: 'auto',
    name: 'Автосервис',
    icon: '🚗',
    primaryColor: {
      light: 'gray-600',
      dark: 'gray-400',
      gradient: 'from-gray-600 to-blue-600'
    },
    terminology: {
      specialist: 'Мастер',
      specialists: 'Мастера',
      service: 'Услуга',
      services: 'Услуги',
      client: 'Клиент',
      clients: 'Клиенты',
      appointment: 'Запись',
      appointments: 'Записи',
      venue: 'Автосервис'
    },
    defaultServices: [
      'Техническое обслуживание',
      'Замена масла',
      'Диагностика',
      'Ремонт двигателя',
      'Шиномонтаж',
      'Мойка автомобиля',
      'Кузовной ремонт'
    ],
    specializations: [
      'Двигатель и трансмиссия',
      'Электроника',
      'Кузовные работы',
      'Шины и диски',
      'Диагностика',
      'Детейлинг'
    ]
  },
  {
    id: 'vet',
    name: 'Ветеринарная клиника',
    icon: '🐾',
    primaryColor: {
      light: 'green-500',
      dark: 'green-400',
      gradient: 'from-green-500 to-teal-500'
    },
    terminology: {
      specialist: 'Ветеринар',
      specialists: 'Ветеринары',
      service: 'Процедура',
      services: 'Процедуры',
      client: 'Владелец',
      clients: 'Владельцы',
      appointment: 'Прием',
      appointments: 'Приемы',
      venue: 'Клиника'
    },
    defaultServices: [
      'Консультация',
      'Вакцинация',
      'Осмотр',
      'Лечение',
      'Хирургическая операция',
      'Груминг',
      'Стерилизация'
    ],
    specializations: [
      'Терапия',
      'Хирургия',
      'Дерматология',
      'Кардиология',
      'Онкология',
      'Офтальмология'
    ]
  },
  {
    id: 'repair',
    name: 'Мастерская',
    icon: '🔧',
    primaryColor: {
      light: 'yellow-600',
      dark: 'yellow-400',
      gradient: 'from-yellow-600 to-orange-500'
    },
    terminology: {
      specialist: 'Мастер',
      specialists: 'Мастера',
      service: 'Ремонт',
      services: 'Ремонты',
      client: 'Клиент',
      clients: 'Клиенты',
      appointment: 'Заказ',
      appointments: 'Заказы',
      venue: 'Мастерская'
    },
    defaultServices: [
      'Диагностика',
      'Ремонт экрана',
      'Замена батареи',
      'Чистка от пыли',
      'Восстановление данных',
      'Настройка ПО',
      'Профилактика'
    ],
    specializations: [
      'Мобильные устройства',
      'Компьютеры и ноутбуки',
      'Бытовая техника',
      'Электроника',
      'Программное обеспечение',
      'Восстановление данных'
    ]
  }
];

export const getBusinessType = (id: string): BusinessType => {
  return businessTypes.find(type => type.id === id) || businessTypes[0];
};

export const getBusinessTerminology = (businessTypeId: string) => {
  const businessType = getBusinessType(businessTypeId);
  return businessType.terminology;
};