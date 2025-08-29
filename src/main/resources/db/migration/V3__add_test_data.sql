-- V3__add_test_data.sql
-- Третья миграция: тестовые данные для разработки и тестирования
-- Автор: Booking Team
-- Дата: 2024
-- ВНИМАНИЕ: Эта миграция должна применяться только в dev/test окружении!

-- =====================================================
-- ПРОВЕРКА ОКРУЖЕНИЯ
-- =====================================================
DO $$
BEGIN
    -- Раскомментируйте для продакшена, чтобы предотвратить выполнение
    -- IF current_setting('app.environment', true) = 'production' THEN
    --     RAISE EXCEPTION 'Test data migration cannot run in production environment';
    -- END IF;
END $$;

-- =====================================================
-- 1. ТЕСТОВЫЕ ДАННЫЕ ДЛЯ BOOKINGS
-- =====================================================

-- Тестовые UUID для консистентности
-- В реальности эти ID приходят из других сервисов
DO $$
DECLARE
    -- Мастера (account_id)
master1_id UUID := '11111111-1111-1111-1111-111111111111';
    master2_id UUID := '22222222-2222-2222-2222-222222222222';
    master3_id UUID := '33333333-3333-3333-3333-333333333333';

    -- Клиенты (client_user_id)
    client1_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    client2_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    client3_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    client4_id UUID := 'dddddddd-dddd-dddd-dddd-dddddddddddd';

    -- Услуги (service_id)
    service1_id UUID := 'e1111111-1111-1111-1111-111111111111'; -- Маникюр
    service2_id UUID := 'e2222222-2222-2222-2222-222222222222'; -- Педикюр
    service3_id UUID := 'e3333333-3333-3333-3333-333333333333'; -- Стрижка
    service4_id UUID := 'e4444444-4444-4444-4444-444444444444'; -- Окрашивание

    -- Слоты (slot_id)
    slot_id UUID;
    booking_id UUID;
    i INT;
BEGIN
    -- Создаем бронирования на последние 30 дней и следующие 30 дней
FOR i IN -30..30 LOOP
        -- Мастер 1, утренние слоты
        slot_id := uuid_generate_v4();

        -- Подтвержденное бронирование
        IF i < -5 THEN
            INSERT INTO bookings (
                id, account_id, slot_id, client_user_id, service_id,
                price, currency, duration_minutes, status, payment_status,
                source, scheduled_at, client_name, client_phone, service_name,
                idempotency_key, created_at, confirmed_at
            ) VALUES (
                uuid_generate_v4(), master1_id, slot_id,
                CASE (i % 4)
                    WHEN 0 THEN client1_id
                    WHEN 1 THEN client2_id
                    WHEN 2 THEN client3_id
                    ELSE client4_id
                END,
                CASE (i % 2)
                    WHEN 0 THEN service1_id
                    ELSE service2_id
                END,
                CASE (i % 2)
                    WHEN 0 THEN 2500.00
                    ELSE 3500.00
                END,
                'RUB',
                CASE (i % 2)
                    WHEN 0 THEN 60
                    ELSE 90
                END,
                'completed', -- Прошедшие записи помечаем как completed
                'paid',
                CASE (i % 3)
                    WHEN 0 THEN 'telegram'
                    WHEN 1 THEN 'web'
                    ELSE 'api'
                END,
                CURRENT_DATE + INTERVAL '1 day' * i + INTERVAL '10 hours',
                CASE (i % 4)
                    WHEN 0 THEN 'Анна Иванова'
                    WHEN 1 THEN 'Мария Петрова'
                    WHEN 2 THEN 'Елена Сидорова'
                    ELSE 'Ольга Козлова'
                END,
                CASE (i % 4)
                    WHEN 0 THEN '+79001234567'
                    WHEN 1 THEN '+79002345678'
                    WHEN 2 THEN '+79003456789'
                    ELSE '+79004567890'
                END,
                CASE (i % 2)
                    WHEN 0 THEN 'Маникюр с покрытием'
                    ELSE 'Педикюр классический'
                END,
                'test-' || master1_id || '-' || i || '-morning',
                CURRENT_DATE + INTERVAL '1 day' * i - INTERVAL '2 days',
                CURRENT_DATE + INTERVAL '1 day' * i - INTERVAL '1 day'
            ) RETURNING id INTO booking_id;

            -- Добавляем историю визита для завершенных
INSERT INTO visit_history (
    booking_id, visited_at, actual_duration_minutes,
    actual_price, rating, review
) VALUES (
             booking_id,
             CURRENT_DATE + INTERVAL '1 day' * i + INTERVAL '10 hours',
             CASE (i % 2) WHEN 0 THEN 60 ELSE 90 END,
             CASE (i % 2) WHEN 0 THEN 2500.00 ELSE 3500.00 END,
             4 + (i % 2), -- Рейтинг 4 или 5
             CASE (i % 3)
                 WHEN 0 THEN 'Отличный мастер, всё понравилось!'
                 WHEN 1 THEN 'Хорошая работа, приду ещё'
                 ELSE NULL
                 END
         );

-- Текущие и будущие бронирования
ELSIF i >= -5 AND i <= 15 THEN
            INSERT INTO bookings (
                account_id, slot_id, client_user_id, service_id,
                price, currency, duration_minutes, status, payment_status,
                source, scheduled_at, client_name, client_phone, service_name,
                idempotency_key, notes
            ) VALUES (
                master1_id, slot_id,
                CASE (i % 4)
                    WHEN 0 THEN client1_id
                    WHEN 1 THEN client2_id
                    WHEN 2 THEN client3_id
                    ELSE client4_id
                END,
                CASE (i % 2)
                    WHEN 0 THEN service3_id
                    ELSE service4_id
                END,
                CASE (i % 2)
                    WHEN 0 THEN 1500.00
                    ELSE 5000.00
                END,
                'RUB',
                CASE (i % 2)
                    WHEN 0 THEN 45
                    ELSE 120
                END,
                CASE
                    WHEN i % 10 = 0 THEN 'cancelled'
                    WHEN i < 0 THEN 'confirmed'
                    WHEN i % 3 = 0 THEN 'created'
                    ELSE 'confirmed'
                END,
                CASE
                    WHEN i % 10 = 0 THEN 'unpaid'
                    WHEN i % 5 = 0 THEN 'pending'
                    ELSE 'paid'
                END,
                'telegram',
                CURRENT_DATE + INTERVAL '1 day' * i + INTERVAL '14 hours',
                CASE (i % 4)
                    WHEN 0 THEN 'Светлана Волкова'
                    WHEN 1 THEN 'Татьяна Морозова'
                    WHEN 2 THEN 'Наталья Новикова'
                    ELSE 'Юлия Соколова'
                END,
                CASE (i % 4)
                    WHEN 0 THEN '+79005678901'
                    WHEN 1 THEN '+79006789012'
                    WHEN 2 THEN '+79007890123'
                    ELSE '+79008901234'
                END,
                CASE (i % 2)
                    WHEN 0 THEN 'Стрижка женская'
                    ELSE 'Окрашивание в один тон'
                END,
                'test-' || master1_id || '-' || i || '-afternoon',
                CASE
                    WHEN i % 5 = 0 THEN 'Клиент просил напомнить за день'
                    WHEN i % 7 = 0 THEN 'Аллергия на некоторые средства'
                    ELSE NULL
                END
            );
END IF;

        -- Мастер 2, вечерние слоты (меньше данных)
        IF i % 2 = 0 AND i BETWEEN -10 AND 10 THEN
            slot_id := uuid_generate_v4();

INSERT INTO bookings (
    account_id, slot_id, client_user_id, service_id,
    price, currency, duration_minutes, status, payment_status,
    source, scheduled_at, client_name, client_phone, service_name,
    idempotency_key, metadata
) VALUES (
             master2_id, slot_id,
             CASE (i % 3)
                 WHEN 0 THEN client1_id
                 WHEN 1 THEN client3_id
                 ELSE client4_id
                 END,
             service1_id,
             3000.00, 'RUB', 75,
             CASE
                 WHEN i < -2 THEN 'completed'
                 WHEN i % 4 = 0 THEN 'created'
                 ELSE 'confirmed'
                 END,
             'unpaid',
             'web',
             CURRENT_DATE + INTERVAL '1 day' * i + INTERVAL '18 hours',
             'Екатерина Белова',
             '+79009012345',
             'Маникюр + дизайн',
             'test-' || master2_id || '-' || i || '-evening',
             jsonb_build_object(
                     'utm_source', 'instagram',
                     'utm_medium', 'stories',
                     'referral_code', 'INST2024'
             )
         );
END IF;
END LOOP;

    -- Добавляем несколько бронирований с конфликтами (для тестирования)
    -- Эти должны быть отклонены системой из-за unique constraint

    -- Также добавим запись для тестирования идемпотентности
INSERT INTO bookings (
    account_id, slot_id, client_user_id, service_id,
    price, currency, duration_minutes, status,
    source, scheduled_at, client_name, client_phone, service_name,
    idempotency_key
) VALUES (
             master3_id, uuid_generate_v4(), client1_id, service1_id,
             2000.00, 'RUB', 60, 'created',
             'api', CURRENT_TIMESTAMP + INTERVAL '1 day',
             'Тест Идемпотентности', '+79990000000', 'Тестовая услуга',
             'idempotency-test-key-12345'
         );
END $$;

-- =====================================================
-- 2. ТЕСТОВЫЕ СОБЫТИЯ В OUTBOX
-- =====================================================

-- Добавляем неопубликованные события для тестирования OutboxPublisher
INSERT INTO outbox_events (
    aggregate_id, aggregate_type, event_type, payload,
    correlation_id, created_at
)
SELECT
    id,
    'booking',
    CASE
        WHEN status = 'created' THEN 'booking.created'
        WHEN status = 'confirmed' THEN 'booking.confirmed'
        WHEN status = 'cancelled' THEN 'booking.cancelled'
        ELSE 'booking.updated'
        END,
    jsonb_build_object(
            'booking_id', id,
            'account_id', account_id,
            'client_user_id', client_user_id,
            'scheduled_at', scheduled_at,
            'status', status,
            'price', price
    ),
    uuid_generate_v4(),
    created_at + INTERVAL '1 second'
FROM bookings
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '2 days'
    LIMIT 10;

-- Добавляем события с ошибками для тестирования retry логики
INSERT INTO outbox_events (
    aggregate_id, aggregate_type, event_type, payload,
    retry_count, last_error, last_retry_at
) VALUES
      (
          uuid_generate_v4(), 'booking', 'booking.failed_test',
          '{"test": "error_simulation"}'::jsonb,
          3, 'Connection timeout to RabbitMQ', CURRENT_TIMESTAMP - INTERVAL '5 minutes'
      ),
      (
          uuid_generate_v4(), 'booking', 'booking.retry_test',
          '{"test": "retry_simulation"}'::jsonb,
          1, 'Temporary network error', CURRENT_TIMESTAMP - INTERVAL '30 minutes'
      );

-- =====================================================
-- 3. ТЕСТОВЫЕ БЛОКИРОВКИ
-- =====================================================

-- Добавляем истекшие блокировки для тестирования cleanup
INSERT INTO distributed_locks (lock_key, locked_by, locked_at, expires_at) VALUES
                                                                               ('booking:slot:expired-111', 'instance-1', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
                                                                               ('booking:slot:expired-222', 'instance-2', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Активная блокировка
INSERT INTO distributed_locks (lock_key, locked_by, locked_at, expires_at) VALUES
    ('booking:slot:active-333', 'instance-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 seconds');

-- =====================================================
-- 4. ОБНОВЛЕНИЕ МАТЕРИАЛИЗОВАННОГО ПРЕДСТАВЛЕНИЯ
-- =====================================================
REFRESH MATERIALIZED VIEW booking_daily_stats;

-- =====================================================
-- 5. ВЫВОД СТАТИСТИКИ
-- =====================================================
DO $$
DECLARE
v_total_bookings INT;
    v_confirmed INT;
    v_created INT;
    v_cancelled INT;
    v_events INT;
BEGIN
SELECT COUNT(*) INTO v_total_bookings FROM bookings;
SELECT COUNT(*) INTO v_confirmed FROM bookings WHERE status = 'confirmed';
SELECT COUNT(*) INTO v_created FROM bookings WHERE status = 'created';
SELECT COUNT(*) INTO v_cancelled FROM bookings WHERE status = 'cancelled';
SELECT COUNT(*) INTO v_events FROM outbox_events WHERE published_at IS NULL;

RAISE NOTICE '=== Test Data Created Successfully ===';
    RAISE NOTICE 'Total bookings: %', v_total_bookings;
    RAISE NOTICE 'Confirmed: %', v_confirmed;
    RAISE NOTICE 'Created: %', v_created;
    RAISE NOTICE 'Cancelled: %', v_cancelled;
    RAISE NOTICE 'Unpublished events: %', v_events;
    RAISE NOTICE '=====================================';
END $$;

-- =====================================================
-- ROLLBACK ПЛАН
-- =====================================================
-- TRUNCATE TABLE visit_history CASCADE;
-- TRUNCATE TABLE outbox_events CASCADE;
-- TRUNCATE TABLE distributed_locks CASCADE;
-- TRUNCATE TABLE bookings CASCADE;
-- REFRESH MATERIALIZED VIEW booking_daily_stats;