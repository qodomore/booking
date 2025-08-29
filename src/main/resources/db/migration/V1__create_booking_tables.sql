-- V1__create_booking_tables.sql
-- Первая миграция: создание основных таблиц для Booking Service
-- Автор: Booking Team
-- Дата: 2024

-- =====================================================
-- 1. СОЗДАНИЕ EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Для генерации UUID
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- Для эксклюзивных ограничений по времени (если понадобится)

-- =====================================================
-- 2. СОЗДАНИЕ ТИПОВ (ENUMS)
-- =====================================================

-- Статусы бронирования
CREATE TYPE booking_status AS ENUM (
    'created',    -- Создано, ожидает подтверждения
    'confirmed',  -- Подтверждено мастером/системой
    'cancelled',  -- Отменено
    'completed',  -- Визит состоялся
    'no_show'     -- Клиент не пришел
);

-- Статусы оплаты
CREATE TYPE payment_status AS ENUM (
    'unpaid',     -- Не оплачено
    'pending',    -- Ожидает оплаты
    'paid',       -- Оплачено
    'refunded',   -- Возвращено
    'failed'      -- Ошибка оплаты
);

-- Источники бронирования
CREATE TYPE booking_source AS ENUM (
    'telegram',   -- Через Telegram бота
    'web',        -- Через веб-интерфейс
    'api',        -- Через API
    'admin',      -- Создано администратором
    'import'      -- Импортировано
);

-- =====================================================
-- 3. ТАБЛИЦА BOOKINGS - Основная таблица бронирований
-- =====================================================
CREATE TABLE bookings (
    -- Первичный ключ
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Связи с другими сервисами
                          account_id UUID NOT NULL,        -- ID аккаунта мастера (из Users Service)
                          slot_id UUID NOT NULL,           -- ID слота времени (из Schedule Service)
                          client_user_id UUID NOT NULL,    -- ID клиента (из Users Service)
                          service_id UUID NOT NULL,        -- ID услуги (из Services catalog)

    -- Бизнес-поля
                          price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
                          currency VARCHAR(3) DEFAULT 'RUB',
                          duration_minutes INT NOT NULL CHECK (duration_minutes > 0),

    -- Статусы
                          status booking_status NOT NULL DEFAULT 'created',
                          payment_status payment_status NOT NULL DEFAULT 'unpaid',

    -- Источник и идемпотентность
                          source booking_source NOT NULL DEFAULT 'telegram',
                          idempotency_key VARCHAR(255) UNIQUE, -- Ключ идемпотентности для защиты от дублей

    -- Дополнительные данные
                          client_name VARCHAR(255),           -- Имя клиента (денормализовано для быстрого доступа)
                          client_phone VARCHAR(20),           -- Телефон клиента (денормализовано)
                          service_name VARCHAR(255),          -- Название услуги (денормализовано)
                          notes TEXT,                         -- Заметки от клиента
                          internal_notes TEXT,                -- Внутренние заметки мастера

    -- Метаданные
                          metadata JSONB DEFAULT '{}',        -- Дополнительные данные в JSON

    -- Временные метки
                          scheduled_at TIMESTAMP NOT NULL,    -- Запланированное время визита
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          confirmed_at TIMESTAMP,
                          cancelled_at TIMESTAMP,
                          completed_at TIMESTAMP,

    -- Оптимистичная блокировка
                          version INT NOT NULL DEFAULT 0
);

-- Комментарии к таблице и колонкам
COMMENT ON TABLE bookings IS 'Основная таблица бронирований клиентов';
COMMENT ON COLUMN bookings.idempotency_key IS 'Ключ идемпотентности для предотвращения дублирования записей';
COMMENT ON COLUMN bookings.metadata IS 'Дополнительные данные: источник трафика, UTM метки и т.д.';
COMMENT ON COLUMN bookings.version IS 'Версия для оптимистичной блокировки';

-- =====================================================
-- 4. ТАБЛИЦА VISIT_HISTORY - История визитов
-- =====================================================
CREATE TABLE visit_history (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,

    -- Факт визита
                               visited_at TIMESTAMP NOT NULL,
                               actual_duration_minutes INT,
                               actual_price DECIMAL(10,2),

    -- Оценка и отзыв
                               rating INT CHECK (rating >= 1 AND rating <= 5),
                               review TEXT,
                               review_at TIMESTAMP,

    -- Фотографии работы (URLs)
                               photos JSONB DEFAULT '[]',

    -- Метаданные
                               metadata JSONB DEFAULT '{}',

                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE visit_history IS 'История фактических визитов клиентов';
COMMENT ON COLUMN visit_history.photos IS 'Массив URL фотографий выполненной работы';

-- =====================================================
-- 5. ТАБЛИЦА OUTBOX_EVENTS - Transactional Outbox Pattern
-- =====================================================
CREATE TABLE outbox_events (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Идентификация события
                               aggregate_id UUID NOT NULL,         -- ID сущности (booking_id)
                               aggregate_type VARCHAR(50) NOT NULL, -- Тип сущности ('booking')
                               event_type VARCHAR(100) NOT NULL,    -- Тип события ('booking.created', 'booking.confirmed', etc)

    -- Данные события
                               payload JSONB NOT NULL,              -- Полезная нагрузка события

    -- Метаданные
                               correlation_id UUID,                 -- ID для трассировки
                               causation_id UUID,                   -- ID причинного события
                               user_id UUID,                        -- Кто инициировал

    -- Статус публикации
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               published_at TIMESTAMP,              -- NULL = не опубликовано

    -- Обработка ошибок
                               retry_count INT DEFAULT 0,
                               last_error TEXT,
                               last_retry_at TIMESTAMP
);

COMMENT ON TABLE outbox_events IS 'Outbox для гарантированной доставки событий';
COMMENT ON COLUMN outbox_events.published_at IS 'NULL означает неопубликованное событие';

-- =====================================================
-- 6. СОЗДАНИЕ ИНДЕКСОВ
-- =====================================================

-- Индексы для bookings
CREATE INDEX idx_bookings_account_id ON bookings(account_id);
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_bookings_client_user_id ON bookings(client_user_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status) WHERE status IN ('created', 'confirmed');
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Составной индекс для частых запросов
CREATE INDEX idx_bookings_client_date ON bookings(client_user_id, scheduled_at DESC);
CREATE INDEX idx_bookings_account_date ON bookings(account_id, scheduled_at DESC);

-- Частичный индекс для активных бронирований
CREATE INDEX idx_bookings_active ON bookings(slot_id, status)
    WHERE status IN ('created', 'confirmed');

-- УНИКАЛЬНЫЙ частичный индекс - КРИТИЧЕСКИ ВАЖНО!
-- Гарантирует отсутствие двойных активных бронирований на один слот
CREATE UNIQUE INDEX ux_bookings_slot_active ON bookings(slot_id)
    WHERE status IN ('created', 'confirmed');

-- Индекс для идемпотентности
CREATE UNIQUE INDEX ux_bookings_idempotency ON bookings(idempotency_key)
    WHERE idempotency_key IS NOT NULL;

-- Индексы для visit_history
CREATE INDEX idx_visit_history_visited_at ON visit_history(visited_at DESC);
CREATE INDEX idx_visit_history_rating ON visit_history(rating) WHERE rating IS NOT NULL;

-- Индексы для outbox_events
CREATE INDEX idx_outbox_unpublished ON outbox_events(created_at)
    WHERE published_at IS NULL;
CREATE INDEX idx_outbox_aggregate ON outbox_events(aggregate_id, aggregate_type);
CREATE INDEX idx_outbox_correlation ON outbox_events(correlation_id)
    WHERE correlation_id IS NOT NULL;

-- Индекс для повторных попыток
CREATE INDEX idx_outbox_retry ON outbox_events(retry_count, last_retry_at)
    WHERE published_at IS NULL AND retry_count > 0;

-- =====================================================
-- 7. СОЗДАНИЕ ТРИГГЕРОВ
-- =====================================================

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visit_history_updated_at
    BEFORE UPDATE ON visit_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. ROW LEVEL SECURITY (опционально для мультитенантности)
-- =====================================================
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- Политики RLS можно добавить позже при необходимости

-- =====================================================
-- 9. НАЧАЛЬНЫЕ ДАННЫЕ (если нужны)
-- =====================================================
-- Здесь можно вставить тестовые или начальные данные

-- =====================================================
-- ROLLBACK ПЛАН
-- =====================================================
-- DROP TABLE IF EXISTS outbox_events CASCADE;
-- DROP TABLE IF EXISTS visit_history CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TYPE IF EXISTS booking_status CASCADE;
-- DROP TYPE IF EXISTS payment_status CASCADE;
-- DROP TYPE IF EXISTS booking_source CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;