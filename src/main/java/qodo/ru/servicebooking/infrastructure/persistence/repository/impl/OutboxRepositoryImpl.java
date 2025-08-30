package qodo.ru.servicebooking.infrastructure.persistence.repository.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSON;
import org.jooq.Table;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import qodo.ru.servicebooking.domain.entity.OutboxEvent;
import qodo.ru.servicebooking.infrastructure.persistence.repository.OutboxRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.jooq.impl.DSL.*;


/**
 * jOOQ реализация репозитория Outbox событий.
 *
 * Ключевые особенности:
 * - FOR UPDATE SKIP LOCKED для конкурентной обработки
 * - Exponential backoff для retry логики
 * - Batch операции для производительности
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class OutboxRepositoryImpl implements OutboxRepository {

    private final DSLContext dsl;

    // Таблица outbox_events
    private static final Table<Record> OUTBOX_EVENTS = table("outbox_events");

    // Поля таблицы
    private static final Field<UUID> ID = field("id", UUID.class);
    private static final Field<UUID> AGGREGATE_ID = field("aggregate_id", UUID.class);
    private static final Field<String> AGGREGATE_TYPE = field("aggregate_type", String.class);
    private static final Field<String> EVENT_TYPE = field("event_type", String.class);
    private static final Field<JSON> PAYLOAD = field("payload", JSON.class);
    private static final Field<UUID> CORRELATION_ID = field("correlation_id", UUID.class);
    private static final Field<UUID> CAUSATION_ID = field("causation_id", UUID.class);
    private static final Field<UUID> USER_ID = field("user_id", UUID.class);
    private static final Field<LocalDateTime> CREATED_AT = field("created_at", LocalDateTime.class);
    private static final Field<LocalDateTime> PUBLISHED_AT = field("published_at", LocalDateTime.class);
    private static final Field<Integer> RETRY_COUNT = field("retry_count", Integer.class);
    private static final Field<String> LAST_ERROR = field("last_error", String.class);
    private static final Field<LocalDateTime> LAST_RETRY_AT = field("last_retry_at", LocalDateTime.class);

    @Override
    @Transactional
    public OutboxEvent save(OutboxEvent event) {
        log.debug("Saving outbox event: type={}, aggregateId={}",
                event.getEventType(), event.getAggregateId());

        UUID eventId = event.getId() != null ? event.getId() : UUID.randomUUID();

        dsl.insertInto(OUTBOX_EVENTS)
                .set(ID, eventId)
                .set(AGGREGATE_ID, event.getAggregateId())
                .set(AGGREGATE_TYPE, event.getAggregateType())
                .set(EVENT_TYPE, event.getEventType())
                .set(PAYLOAD, JSON.json(toJson(event.getPayload())))
                .set(CORRELATION_ID, event.getCorrelationId())
                .set(CAUSATION_ID, event.getCausationId())
                .set(USER_ID, event.getUserId())
                .set(CREATED_AT, event.getCreatedAt())
                .set(RETRY_COUNT, 0)
                .execute();

        event.setId(eventId);
        log.info("Saved outbox event: id={}, type={}", eventId, event.getEventType());
        return event;
    }

    @Override
    @Transactional
    public List<OutboxEvent> findUnpublishedForProcessing(int limit) {
        log.debug("Finding unpublished events for processing, limit: {}", limit);

        // Используем FOR UPDATE SKIP LOCKED для конкурентной обработки
        // Это позволяет нескольким инстансам обрабатывать события параллельно
        List<OutboxEvent> events = dsl.selectFrom(OUTBOX_EVENTS)
                .where(PUBLISHED_AT.isNull())
                .and(RETRY_COUNT.eq(0)) // Только новые события, не retry
                .orderBy(CREATED_AT.asc())
                .limit(limit)
                .forUpdate()
                .skipLocked() // КРИТИЧЕСКИ ВАЖНО: пропускаем заблокированные записи
                .fetch()
                .map(this::mapToOutboxEvent);

        log.debug("Found {} unpublished events for processing", events.size());
        return events;
    }

    @Override
    @Transactional
    public List<OutboxEvent> findForRetry(int limit) {
        log.debug("Finding events for retry, limit: {}", limit);

        LocalDateTime now = LocalDateTime.now();

        // Находим события, которые:
        // 1. Не опубликованы
        // 2. Имеют retry_count > 0
        // 3. Прошло достаточно времени с последней попытки (exponential backoff)
        List<OutboxEvent> events = dsl.selectFrom(OUTBOX_EVENTS)
                .where(PUBLISHED_AT.isNull())
                .and(RETRY_COUNT.gt(0))
                .and(RETRY_COUNT.lt(5)) // Максимум 5 попыток
                .and(
                        // Exponential backoff: 2^retry_count секунд
                        LAST_RETRY_AT.isNull().or(
                                LAST_RETRY_AT.lt(
                                        now.minusSeconds(
                                                DSL.power(2, RETRY_COUNT).cast(Long.class)
                                        )
                                )
                        )
                )
                .orderBy(LAST_RETRY_AT.asc().nullsFirst())
                .limit(limit)
                .forUpdate()
                .skipLocked()
                .fetch()
                .map(this::mapToOutboxEvent);

        log.debug("Found {} events for retry", events.size());
        return events;
    }

    @Override
    @Transactional
    public boolean markAsPublished(UUID eventId) {
        log.debug("Marking event as published: {}", eventId);

        int updated = dsl.update(OUTBOX_EVENTS)
                .set(PUBLISHED_AT, LocalDateTime.now())
                .set(LAST_ERROR, (String) null)
                .where(ID.eq(eventId))
                .and(PUBLISHED_AT.isNull())
                .execute();

        boolean success = updated > 0;
        if (success) {
            log.info("Successfully marked event as published: {}", eventId);
        } else {
            log.warn("Event not found or already published: {}", eventId);
        }

        return success;
    }

    @Override
    @Transactional
    public int markAsPublishedBatch(List<UUID> eventIds) {
        if (eventIds.isEmpty()) {
            return 0;
        }

        log.debug("Marking {} events as published", eventIds.size());

        int updated = dsl.update(OUTBOX_EVENTS)
                .set(PUBLISHED_AT, LocalDateTime.now())
                .set(LAST_ERROR, (String) null)
                .where(ID.in(eventIds))
                .and(PUBLISHED_AT.isNull())
                .execute();

        log.info("Successfully marked {} events as published", updated);
        return updated;
    }

    @Override
    @Transactional
    public boolean recordFailure(UUID eventId, String error) {
        log.debug("Recording failure for event: {}, error: {}", eventId, error);

        // Получаем текущий retry_count
        Integer currentRetryCount = dsl.select(RETRY_COUNT)
                .from(OUTBOX_EVENTS)
                .where(ID.eq(eventId))
                .fetchOne(RETRY_COUNT);

        if (currentRetryCount == null) {
            log.warn("Event not found: {}", eventId);
            return false;
        }

        int newRetryCount = currentRetryCount + 1;

        int updated = dsl.update(OUTBOX_EVENTS)
                .set(RETRY_COUNT, newRetryCount)
                .set(LAST_ERROR, error != null && error.length() > 500
                        ? error.substring(0, 500)
                        : error)
                .set(LAST_RETRY_AT, LocalDateTime.now())
                .where(ID.eq(eventId))
                .execute();

        if (updated > 0) {
            if (newRetryCount >= 5) {
                log.error("Event {} exceeded max retry attempts (5), manual intervention required", eventId);
            } else {
                log.warn("Recorded failure for event {}, retry count: {}", eventId, newRetryCount);
            }
        }

        return updated > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OutboxEvent> findByAggregate(UUID aggregateId, String aggregateType) {
        log.debug("Finding events for aggregate: {} of type: {}", aggregateId, aggregateType);

        return dsl.selectFrom(OUTBOX_EVENTS)
                .where(AGGREGATE_ID.eq(aggregateId))
                .and(AGGREGATE_TYPE.eq(aggregateType))
                .orderBy(CREATED_AT.asc())
                .fetch()
                .map(this::mapToOutboxEvent);
    }

    @Override
    @Transactional
    public int deleteOldPublished(LocalDateTime publishedBefore) {
        log.debug("Deleting old published events before: {}", publishedBefore);

        int deleted = dsl.deleteFrom(OUTBOX_EVENTS)
                .where(PUBLISHED_AT.isNotNull())
                .and(PUBLISHED_AT.lt(publishedBefore))
                .execute();

        log.info("Deleted {} old published events", deleted);
        return deleted;
    }

    @Override
    @Transactional(readOnly = true)
    public OutboxStatistics getStatistics() {
        log.debug("Getting outbox statistics");

        var stats = dsl.select(
                        count(),
                        count().filterWhere(PUBLISHED_AT.isNull()),
                        count().filterWhere(PUBLISHED_AT.isNotNull()),
                        count().filterWhere(RETRY_COUNT.ge(5)), // Failed (exceeded max retries)
                        count().filterWhere(
                                PUBLISHED_AT.isNull()
                                        .and(RETRY_COUNT.gt(0))
                                        .and(RETRY_COUNT.lt(5))
                        ),
                        avg(RETRY_COUNT),
                        min(CREATED_AT).filterWhere(PUBLISHED_AT.isNull())
                )
                .from(OUTBOX_EVENTS)
                .fetchOne();

        return new OutboxStatistics(
                stats.value1() != null ? stats.value1() : 0L,
                stats.value2() != null ? stats.value2() : 0L,
                stats.value3() != null ? stats.value3() : 0L,
                stats.value4() != null ? stats.value4() : 0L,
                stats.value5() != null ? stats.value5() : 0L,
                stats.value6() != null ? stats.value6().doubleValue() : 0.0,
                stats.value7()
        );
    }

    /**
     * Маппинг Record в OutboxEvent.
     */
    private OutboxEvent mapToOutboxEvent(Record record) {
        return OutboxEvent.builder()
                .id(record.get(ID))
                .aggregateId(record.get(AGGREGATE_ID))
                .aggregateType(record.get(AGGREGATE_TYPE))
                .eventType(record.get(EVENT_TYPE))
                .payload(parseJsonToMap(record.get(PAYLOAD)))
                .correlationId(record.get(CORRELATION_ID))
                .causationId(record.get(CAUSATION_ID))
                .userId(record.get(USER_ID))
                .createdAt(record.get(CREATED_AT))
                .publishedAt(record.get(PUBLISHED_AT))
                .retryCount(record.get(RETRY_COUNT))
                .lastError(record.get(LAST_ERROR))
                .lastRetryAt(record.get(LAST_RETRY_AT))
                .build();
    }

    /**
     * Преобразование Map в JSON строку.
     */
    private String toJson(Map<String, Object> map) {
        // TODO: Использовать Jackson ObjectMapper
        return map != null ? map.toString() : "{}";
    }

    /**
     * Парсинг JSON в Map.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonToMap(JSON json) {
        if (json == null || json.data() == null) {
            return new HashMap<>();
        }
        // TODO: Использовать Jackson ObjectMapper
        try {
            return (Map<String, Object>) json.data();
        } catch (Exception e) {
            log.warn("Failed to parse JSON payload", e);
            return new HashMap<>();
        }
    }
}
