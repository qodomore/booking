-- V2__add_booking_optimizations.sql
-- Вторая миграция: оптимизации производительности и дополнительные структуры
-- Автор: Booking Team
-- Дата: 2024

-- =====================================================
-- 1. ТАБЛИЦА ДЛЯ РАСПРЕДЕЛЕННЫХ БЛОКИРОВОК
-- =====================================================
-- Резервная таблица для блокировок, если Redis недоступен
CREATE TABLE IF NOT EXISTS distributed_locks (
                                                 lock_key VARCHAR(255) PRIMARY KEY,
    locked_by VARCHAR(255) NOT NULL,
    locked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    metadata JSONB DEFAULT '{}'
    );

-- Индекс для автоматической очистки истекших блокировок
CREATE INDEX idx_locks_expires_at ON distributed_locks(expires_at);

COMMENT ON TABLE distributed_locks IS 'Резервная таблица для распределенных блокировок при недоступности Redis';

-- =====================================================
-- 2. ТАБЛИЦА АУДИТА ИЗМЕНЕНИЙ
-- =====================================================
CREATE TABLE booking_audit_log (
                                   id BIGSERIAL PRIMARY KEY,
                                   booking_id UUID NOT NULL,
                                   action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'CANCEL', 'CONFIRM', etc
                                   old_values JSONB,
                                   new_values JSONB,
                                   changed_by UUID,
                                   changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   ip_address INET,
                                   user_agent TEXT,
                                   correlation_id UUID
);

-- Индексы для аудита
CREATE INDEX idx_audit_booking_id ON booking_audit_log(booking_id);
CREATE INDEX idx_audit_changed_at ON booking_audit_log(changed_at DESC);
CREATE INDEX idx_audit_action ON booking_audit_log(action);
CREATE INDEX idx_audit_changed_by ON booking_audit_log(changed_by) WHERE changed_by IS NOT NULL;

COMMENT ON TABLE booking_audit_log IS 'Аудит всех изменений бронирований для compliance и debugging';

-- =====================================================
-- 3. МАТЕРИАЛИЗОВАННОЕ ПРЕДСТАВЛЕНИЕ ДЛЯ СТАТИСТИКИ
-- =====================================================
CREATE MATERIALIZED VIEW booking_daily_stats AS
SELECT
    DATE(scheduled_at) as booking_date,
    account_id,
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(*) FILTER (WHERE status = 'no_show') as no_show_bookings,
    SUM(price) FILTER (WHERE status IN ('confirmed', 'completed')) as total_revenue,
    AVG(price) FILTER (WHERE status IN ('confirmed', 'completed')) as avg_booking_price,
    COUNT(DISTINCT client_user_id) as unique_clients
FROM bookings
GROUP BY DATE(scheduled_at), account_id;

-- Индексы для материализованного представления
CREATE UNIQUE INDEX idx_booking_daily_stats_unique ON booking_daily_stats(booking_date, account_id);
CREATE INDEX idx_booking_daily_stats_date ON booking_daily_stats(booking_date DESC);

COMMENT ON MATERIALIZED VIEW booking_daily_stats IS 'Ежедневная статистика для быстрых отчетов';

-- =====================================================
-- 4. ФУНКЦИИ ДЛЯ БИЗНЕС-ЛОГИКИ
-- =====================================================

-- Функция для безопасного создания бронирования с проверкой слота
CREATE OR REPLACE FUNCTION create_booking_safe(
    p_idempotency_key VARCHAR(255),
    p_account_id UUID,
    p_slot_id UUID,
    p_client_user_id UUID,
    p_service_id UUID,
    p_price DECIMAL(10,2),
    p_duration_minutes INT,
    p_scheduled_at TIMESTAMP,
    p_client_name VARCHAR(255),
    p_client_phone VARCHAR(20),
    p_service_name VARCHAR(255),
    p_source booking_source DEFAULT 'telegram',
    p_notes TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
v_booking_id UUID;
    v_existing_id UUID;
BEGIN
    -- Проверка идемпотентности
SELECT id INTO v_existing_id
FROM bookings
WHERE idempotency_key = p_idempotency_key;

IF v_existing_id IS NOT NULL THEN
        RETURN v_existing_id;
END IF;

    -- Проверка доступности слота (будет fail благодаря unique индексу)
    IF EXISTS (
        SELECT 1 FROM bookings
        WHERE slot_id = p_slot_id
        AND status IN ('created', 'confirmed')
        FOR UPDATE
    ) THEN
        RAISE EXCEPTION 'Slot % is already booked', p_slot_id
            USING ERRCODE = '23505'; -- unique_violation
END IF;

    -- Создание бронирования
INSERT INTO bookings (
    account_id, slot_id, client_user_id, service_id,
    price, duration_minutes, scheduled_at,
    client_name, client_phone, service_name,
    source, notes, metadata, idempotency_key
) VALUES (
             p_account_id, p_slot_id, p_client_user_id, p_service_id,
             p_price, p_duration_minutes, p_scheduled_at,
             p_client_name, p_client_phone, p_service_name,
             p_source, p_notes, p_metadata, p_idempotency_key
         ) RETURNING id INTO v_booking_id;

-- Создание события в outbox
INSERT INTO outbox_events (
    aggregate_id, aggregate_type, event_type, payload
) VALUES (
             v_booking_id, 'booking', 'booking.created',
             jsonb_build_object(
                     'booking_id', v_booking_id,
                     'account_id', p_account_id,
                     'client_user_id', p_client_user_id,
                     'slot_id', p_slot_id,
                     'service_id', p_service_id,
                     'scheduled_at', p_scheduled_at,
                     'price', p_price,
                     'source', p_source
             )
         );

RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для подтверждения бронирования
CREATE OR REPLACE FUNCTION confirm_booking(
    p_booking_id UUID,
    p_confirmed_by UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
v_current_status booking_status;
    v_updated_count INT;
BEGIN
    -- Получаем текущий статус с блокировкой
SELECT status INTO v_current_status
FROM bookings
WHERE id = p_booking_id
    FOR UPDATE;

IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Booking % not found', p_booking_id;
END IF;

    IF v_current_status != 'created' THEN
        RAISE EXCEPTION 'Cannot confirm booking in status %', v_current_status
            USING ERRCODE = '22000'; -- data_exception
END IF;

    -- Обновляем статус
UPDATE bookings
SET status = 'confirmed',
    confirmed_at = CURRENT_TIMESTAMP,
    version = version + 1
WHERE id = p_booking_id
  AND status = 'created';

GET DIAGNOSTICS v_updated_count = ROW_COUNT;

IF v_updated_count > 0 THEN
        -- Создаем событие
        INSERT INTO outbox_events (
            aggregate_id, aggregate_type, event_type, payload, user_id
        ) VALUES (
            p_booking_id, 'booking', 'booking.confirmed',
            jsonb_build_object(
                'booking_id', p_booking_id,
                'confirmed_at', CURRENT_TIMESTAMP,
                'confirmed_by', p_confirmed_by
            ),
            p_confirmed_by
        );

RETURN TRUE;
END IF;

RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Функция для отмены бронирования
CREATE OR REPLACE FUNCTION cancel_booking(
    p_booking_id UUID,
    p_cancelled_by UUID DEFAULT NULL,
    p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
v_current_status booking_status;
    v_updated_count INT;
BEGIN
    -- Получаем текущий статус с блокировкой
SELECT status INTO v_current_status
FROM bookings
WHERE id = p_booking_id
    FOR UPDATE;

IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Booking % not found', p_booking_id;
END IF;

    IF v_current_status NOT IN ('created', 'confirmed') THEN
        RAISE EXCEPTION 'Cannot cancel booking in status %', v_current_status
            USING ERRCODE = '22000';
END IF;

    -- Обновляем статус
UPDATE bookings
SET status = 'cancelled',
    cancelled_at = CURRENT_TIMESTAMP,
    internal_notes = COALESCE(internal_notes || E'\n', '') ||
                     'Cancelled by: ' || COALESCE(p_cancelled_by::TEXT, 'system') ||
                     CASE WHEN p_reason IS NOT NULL THEN ' Reason: ' || p_reason ELSE '' END,
    version = version + 1
WHERE id = p_booking_id
  AND status IN ('created', 'confirmed');

GET DIAGNOSTICS v_updated_count = ROW_COUNT;

IF v_updated_count > 0 THEN
        -- Создаем событие
        INSERT INTO outbox_events (
            aggregate_id, aggregate_type, event_type, payload, user_id
        ) VALUES (
            p_booking_id, 'booking', 'booking.cancelled',
            jsonb_build_object(
                'booking_id', p_booking_id,
                'cancelled_at', CURRENT_TIMESTAMP,
                'cancelled_by', p_cancelled_by,
                'reason', p_reason
            ),
            p_cancelled_by
        );

RETURN TRUE;
END IF;

RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. ПРОЦЕДУРА ДЛЯ ОЧИСТКИ СТАРЫХ ДАННЫХ
-- =====================================================
CREATE OR REPLACE PROCEDURE cleanup_old_data(
    p_days_to_keep INT DEFAULT 90
) AS $$
BEGIN
    -- Удаляем старые события из outbox
DELETE FROM outbox_events
WHERE published_at IS NOT NULL
  AND published_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * p_days_to_keep;

-- Удаляем старые записи аудита
DELETE FROM booking_audit_log
WHERE changed_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * p_days_to_keep;

-- Удаляем истекшие блокировки
DELETE FROM distributed_locks
WHERE expires_at < CURRENT_TIMESTAMP;

-- Обновляем материализованное представление
REFRESH MATERIALIZED VIEW CONCURRENTLY booking_daily_stats;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. ПАРТИЦИОНИРОВАНИЕ (подготовка для будущего)
-- =====================================================
-- Когда объем данных вырастет, можно будет включить партиционирование
-- по scheduled_at для bookings и created_at для outbox_events

-- Пример (закомментировано, включить при необходимости):
/*
-- Преобразуем bookings в партиционированную таблицу
ALTER TABLE bookings RENAME TO bookings_old;

CREATE TABLE bookings (LIKE bookings_old INCLUDING ALL)
PARTITION BY RANGE (scheduled_at);

-- Создаем партиции на несколько месяцев
CREATE TABLE bookings_2024_01 PARTITION OF bookings
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE bookings_2024_02 PARTITION OF bookings
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- И так далее...

-- Переносим данные
INSERT INTO bookings SELECT * FROM bookings_old;
DROP TABLE bookings_old;
*/

-- =====================================================
-- 7. НАСТРОЙКИ ПРОИЗВОДИТЕЛЬНОСТИ
-- =====================================================
-- Эти команды нужно выполнить от суперпользователя БД

-- Увеличиваем статистику для важных колонок
/*
ALTER TABLE bookings ALTER COLUMN slot_id SET STATISTICS 1000;
ALTER TABLE bookings ALTER COLUMN status SET STATISTICS 1000;
ALTER TABLE bookings ALTER COLUMN scheduled_at SET STATISTICS 1000;
*/

-- =====================================================
-- ROLLBACK ПЛАН
-- =====================================================
-- DROP PROCEDURE IF EXISTS cleanup_old_data;
-- DROP FUNCTION IF EXISTS cancel_booking;
-- DROP FUNCTION IF EXISTS confirm_booking;
-- DROP FUNCTION IF EXISTS create_booking_safe;
-- DROP MATERIALIZED VIEW IF EXISTS booking_daily_stats;
-- DROP TABLE IF EXISTS booking_audit_log;
-- DROP TABLE IF EXISTS distributed_locks;