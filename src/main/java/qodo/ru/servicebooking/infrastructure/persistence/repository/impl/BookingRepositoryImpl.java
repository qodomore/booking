package qodo.ru.servicebooking.infrastructure.persistence.repository.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSON;
import org.jooq.Table;
import org.jooq.UpdateSetMoreStep;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import qodo.ru.servicebooking.domain.entity.Booking;
import qodo.ru.servicebooking.domain.enums.BookingSource;
import qodo.ru.servicebooking.domain.enums.BookingStatus;
import qodo.ru.servicebooking.domain.enums.PaymentStatus;
import qodo.ru.servicebooking.infrastructure.persistence.repository.BookingRepository;

import java.lang.Record;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.jooq.impl.DSL.avg;
import static org.jooq.impl.DSL.count;
import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.sum;
import static org.jooq.impl.DSL.table;

/**
 * jOOQ реализация репозитория бронирований.
 *
 * Использует типобезопасный DSL для построения SQL запросов.
 * Все операции оптимизированы для высокой производительности.
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class BookingRepositoryImpl implements BookingRepository {

    private final DSLContext dsl;

    // Для примера, пока jOOQ не сгенерировал классы, определим таблицу вручную
    private static final Table<Record> BOOKINGS = table("bookings");

    // Поля таблицы bookings
    private static final Field<UUID> ID = field("id", UUID.class);
    private static final Field<UUID> ACCOUNT_ID = field("account_id", UUID.class);
    private static final Field<UUID> SLOT_ID = field("slot_id", UUID.class);
    private static final Field<UUID> CLIENT_USER_ID = field("client_user_id", UUID.class);
    private static final Field<UUID> SERVICE_ID = field("service_id", UUID.class);
    private static final Field<BigDecimal> PRICE = field("price", BigDecimal.class);
    private static final Field<String> CURRENCY = field("currency", String.class);
    private static final Field<Integer> DURATION_MINUTES = field("duration_minutes", Integer.class);
    private static final Field<String> STATUS = field("status", String.class);
    private static final Field<String> PAYMENT_STATUS = field("payment_status", String.class);
    private static final Field<String> SOURCE = field("source", String.class);
    private static final Field<String> IDEMPOTENCY_KEY = field("idempotency_key", String.class);
    private static final Field<String> CLIENT_NAME = field("client_name", String.class);
    private static final Field<String> CLIENT_PHONE = field("client_phone", String.class);
    private static final Field<String> SERVICE_NAME = field("service_name", String.class);
    private static final Field<String> NOTES = field("notes", String.class);
    private static final Field<String> INTERNAL_NOTES = field("internal_notes", String.class);
    private static final Field<LocalDateTime> SCHEDULED_AT = field("scheduled_at", LocalDateTime.class);
    private static final Field<LocalDateTime> CREATED_AT = field("created_at", LocalDateTime.class);
    private static final Field<LocalDateTime> UPDATED_AT = field("updated_at", LocalDateTime.class);
    private static final Field<LocalDateTime> CONFIRMED_AT = field("confirmed_at", LocalDateTime.class);
    private static final Field<LocalDateTime> CANCELLED_AT = field("cancelled_at", LocalDateTime.class);
    private static final Field<LocalDateTime> COMPLETED_AT = field("completed_at", LocalDateTime.class);
    private static final Field<Integer> VERSION = field("version", Integer.class);
    private static final Field<JSON> METADATA = field("metadata", JSON.class);

    @Override
    @Transactional
    public Booking save(Booking booking) {
        log.debug("Saving new booking with idempotency key: {}", booking.getIdempotencyKey());

        UUID generatedId = booking.getId() != null ? booking.getId() : UUID.randomUUID();

        int inserted = dsl.insertInto(BOOKINGS)
                .set(ID, generatedId)
                .set(ACCOUNT_ID, booking.getAccountId())
                .set(SLOT_ID, booking.getSlotId())
                .set(CLIENT_USER_ID, booking.getClientUserId())
                .set(SERVICE_ID, booking.getServiceId())
                .set(PRICE, booking.getPrice())
                .set(CURRENCY, booking.getCurrency())
                .set(DURATION_MINUTES, booking.getDurationMinutes())
                .set(STATUS, booking.getStatus().getValue())
                .set(PAYMENT_STATUS, booking.getPaymentStatus().getValue())
                .set(SOURCE, booking.getSource().getValue())
                .set(IDEMPOTENCY_KEY, booking.getIdempotencyKey())
                .set(CLIENT_NAME, booking.getClientName())
                .set(CLIENT_PHONE, booking.getClientPhone())
                .set(SERVICE_NAME, booking.getServiceName())
                .set(NOTES, booking.getNotes())
                .set(INTERNAL_NOTES, booking.getInternalNotes())
                .set(SCHEDULED_AT, booking.getScheduledAt())
                .set(CREATED_AT, booking.getCreatedAt())
                .set(UPDATED_AT, booking.getUpdatedAt())
                .set(VERSION, 0)
                .set(METADATA, booking.getMetadata() != null ? JSON.json(toJson(booking.getMetadata())) : JSON.json("{}"))
                .onConflict(IDEMPOTENCY_KEY)
                .doNothing() // Если ключ уже существует, ничего не делаем (идемпотентность)
                .execute();

        if (inserted == 0) {
            // Запись с таким idempotency key уже существует
            log.info("Booking with idempotency key {} already exists", booking.getIdempotencyKey());
            return findByIdempotencyKey(booking.getIdempotencyKey())
                    .orElseThrow(() -> new IllegalStateException("Failed to retrieve existing booking"));
        }

        booking.setId(generatedId);
        log.info("Successfully saved booking with ID: {}", generatedId);
        return booking;
    }

    @Override
    @Transactional
    public Booking update(Booking booking) {
        log.debug("Updating booking ID: {}, version: {}", booking.getId(), booking.getVersion());

        int updated = dsl.update(BOOKINGS)
                .set(STATUS, booking.getStatus().getValue())
                .set(PAYMENT_STATUS, booking.getPaymentStatus().getValue())
                .set(NOTES, booking.getNotes())
                .set(INTERNAL_NOTES, booking.getInternalNotes())
                .set(UPDATED_AT, LocalDateTime.now())
                .set(CONFIRMED_AT, booking.getConfirmedAt())
                .set(CANCELLED_AT, booking.getCancelledAt())
                .set(COMPLETED_AT, booking.getCompletedAt())
                .set(VERSION, booking.getVersion() + 1)
                .set(METADATA, JSON.json(toJson(booking.getMetadata())))
                .where(ID.eq(booking.getId()))
                .and(VERSION.eq(booking.getVersion())) // Оптимистичная блокировка
                .execute();

        if (updated == 0) {
            throw new OptimisticLockException(
                    "Booking " + booking.getId() + " was modified by another transaction"
            );
        }

        booking.setVersion(booking.getVersion() + 1);
        booking.setUpdatedAt(LocalDateTime.now());

        log.info("Successfully updated booking ID: {}", booking.getId());
        return booking;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> findById(UUID id) {
        log.debug("Finding booking by ID: {}", id);

        Record record = dsl.selectFrom(BOOKINGS)
                .where(ID.eq(id))
                .fetchOne();

        return Optional.ofNullable(record).map(this::mapToBooking);
    }

    @Override
    @Transactional
    public Optional<Booking> findByIdForUpdate(UUID id) {
        log.debug("Finding booking by ID with lock: {}", id);

        Record record = dsl.selectFrom(BOOKINGS)
                .where(ID.eq(id))
                .forUpdate() // Пессимистичная блокировка
                .fetchOne();

        return Optional.ofNullable(record).map(this::mapToBooking);
    }

    @Override
    @Transactional
    public boolean deleteById(UUID id) {
        log.debug("Soft deleting booking ID: {}", id);

        int deleted = dsl.update(BOOKINGS)
                .set(STATUS, BookingStatus.CANCELLED.getValue())
                .set(CANCELLED_AT, LocalDateTime.now())
                .set(UPDATED_AT, LocalDateTime.now())
                .where(ID.eq(id))
                .and(STATUS.notIn(
                        BookingStatus.CANCELLED.getValue(),
                        BookingStatus.COMPLETED.getValue()
                ))
                .execute();

        log.info("Soft deleted {} booking(s) with ID: {}", deleted, id);
        return deleted > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> findByIdempotencyKey(String idempotencyKey) {
        if (idempotencyKey == null) {
            return Optional.empty();
        }

        log.debug("Finding booking by idempotency key: {}", idempotencyKey);

        Record record = dsl.selectFrom(BOOKINGS)
                .where(IDEMPOTENCY_KEY.eq(idempotencyKey))
                .fetchOne();

        return Optional.ofNullable(record).map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsActiveBookingForSlot(UUID slotId) {
        log.debug("Checking if slot {} has active booking", slotId);

        Integer count = dsl.selectCount()
                .from(BOOKINGS)
                .where(SLOT_ID.eq(slotId))
                .and(STATUS.in(
                        BookingStatus.CREATED.getValue(),
                        BookingStatus.CONFIRMED.getValue()
                ))
                .fetchOne(0, Integer.class);

        boolean exists = count != null && count > 0;
        log.debug("Slot {} active booking exists: {}", slotId, exists);
        return exists;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> findActiveBookingBySlot(UUID slotId) {
        log.debug("Finding active booking for slot: {}", slotId);

        Record record = dsl.selectFrom(BOOKINGS)
                .where(SLOT_ID.eq(slotId))
                .and(STATUS.in(
                        BookingStatus.CREATED.getValue(),
                        BookingStatus.CONFIRMED.getValue()
                ))
                .fetchOne();

        return Optional.ofNullable(record).map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByClientUserId(UUID clientUserId, int limit, int offset) {
        log.debug("Finding bookings for client: {}, limit: {}, offset: {}", clientUserId, limit, offset);

        return dsl.selectFrom(BOOKINGS)
                .where(CLIENT_USER_ID.eq(clientUserId))
                .orderBy(SCHEDULED_AT.desc())
                .limit(limit)
                .offset(offset)
                .fetch()
                .map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByAccountIdAndDate(UUID accountId, LocalDateTime date) {
        log.debug("Finding bookings for account: {} on date: {}", accountId, date);

        LocalDateTime dayStart = date.toLocalDate().atStartOfDay();
        LocalDateTime dayEnd = dayStart.plusDays(1);

        return dsl.selectFrom(BOOKINGS)
                .where(ACCOUNT_ID.eq(accountId))
                .and(SCHEDULED_AT.ge(dayStart))
                .and(SCHEDULED_AT.lt(dayEnd))
                .orderBy(SCHEDULED_AT.asc())
                .fetch()
                .map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByAccountIdBetween(UUID accountId, LocalDateTime from, LocalDateTime to) {
        log.debug("Finding bookings for account: {} between {} and {}", accountId, from, to);

        return dsl.selectFrom(BOOKINGS)
                .where(ACCOUNT_ID.eq(accountId))
                .and(SCHEDULED_AT.ge(from))
                .and(SCHEDULED_AT.le(to))
                .orderBy(SCHEDULED_AT.asc())
                .fetch()
                .map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByStatus(BookingStatus status, int limit) {
        log.debug("Finding bookings with status: {}, limit: {}", status, limit);

        return dsl.selectFrom(BOOKINGS)
                .where(STATUS.eq(status.getValue()))
                .orderBy(CREATED_AT.desc())
                .limit(limit)
                .fetch()
                .map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findPendingConfirmation(LocalDateTime createdBefore, int limit) {
        log.debug("Finding pending confirmation bookings created before: {}", createdBefore);

        return dsl.selectFrom(BOOKINGS)
                .where(STATUS.eq(BookingStatus.CREATED.getValue()))
                .and(CREATED_AT.lt(createdBefore))
                .orderBy(CREATED_AT.asc())
                .limit(limit)
                .fetch()
                .map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findForReminders(LocalDateTime from, LocalDateTime to) {
        log.debug("Finding bookings for reminders between {} and {}", from, to);

        return dsl.selectFrom(BOOKINGS)
                .where(STATUS.eq(BookingStatus.CONFIRMED.getValue()))
                .and(SCHEDULED_AT.ge(from))
                .and(SCHEDULED_AT.le(to))
                .orderBy(SCHEDULED_AT.asc())
                .fetch()
                .map(this::mapToBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findExpiredUnconfirmed(LocalDateTime expiryTime) {
        log.debug("Finding expired unconfirmed bookings older than: {}", expiryTime);

        return dsl.selectFrom(BOOKINGS)
                .where(STATUS.eq(BookingStatus.CREATED.getValue()))
                .and(CREATED_AT.lt(expiryTime))
                .and(SCHEDULED_AT.gt(LocalDateTime.now())) // Еще не прошло время визита
                .fetch()
                .map(this::mapToBooking);
    }

    @Override
    @Transactional
    public int updateStatusBatch(List<UUID> bookingIds, BookingStatus newStatus) {
        if (bookingIds.isEmpty()) {
            return 0;
        }

        log.debug("Batch updating {} bookings to status: {}", bookingIds.size(), newStatus);

        LocalDateTime now = LocalDateTime.now();
        UpdateSetMoreStep<Record> update = dsl.update(BOOKINGS)
                .set(STATUS, newStatus.getValue())
                .set(UPDATED_AT, now);

        // Устанавливаем соответствующие временные метки
        switch (newStatus) {
            case CONFIRMED -> update.set(CONFIRMED_AT, now);
            case CANCELLED -> update.set(CANCELLED_AT, now);
            case COMPLETED -> update.set(COMPLETED_AT, now);
        }

        int updated = update
                .where(ID.in(bookingIds))
                .execute();

        log.info("Batch updated {} bookings to status: {}", updated, newStatus);
        return updated;
    }

    @Override
    @Transactional
    public int markAsCompleted(LocalDateTime scheduledBefore) {
        log.debug("Marking bookings as completed for visits before: {}", scheduledBefore);

        int updated = dsl.update(BOOKINGS)
                .set(STATUS, BookingStatus.COMPLETED.getValue())
                .set(COMPLETED_AT, LocalDateTime.now())
                .set(UPDATED_AT, LocalDateTime.now())
                .where(STATUS.eq(BookingStatus.CONFIRMED.getValue()))
                .and(SCHEDULED_AT.lt(scheduledBefore))
                .execute();

        log.info("Marked {} bookings as completed", updated);
        return updated;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<BookingStatus, Long> countByStatusForAccount(UUID accountId, LocalDateTime from, LocalDateTime to) {
        log.debug("Counting bookings by status for account: {} between {} and {}", accountId, from, to);

        return dsl.select(STATUS, count())
                .from(BOOKINGS)
                .where(ACCOUNT_ID.eq(accountId))
                .and(SCHEDULED_AT.ge(from))
                .and(SCHEDULED_AT.le(to))
                .groupBy(STATUS)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        r -> BookingStatus.fromValue(r.value1()),
                        r -> r.value2().longValue()
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public BookingStatistics getStatistics(LocalDateTime from, LocalDateTime to) {
        log.debug("Getting booking statistics between {} and {}", from, to);

        var stats = dsl.select(
                        count(),
                        count().filterWhere(STATUS.eq(BookingStatus.CONFIRMED.getValue())),
                        count().filterWhere(STATUS.eq(BookingStatus.CANCELLED.getValue())),
                        count().filterWhere(STATUS.eq(BookingStatus.COMPLETED.getValue())),
                        count().filterWhere(STATUS.eq(BookingStatus.NO_SHOW.getValue())),
                        sum(PRICE).filterWhere(STATUS.in(
                                BookingStatus.COMPLETED.getValue(),
                                BookingStatus.CONFIRMED.getValue()
                        )),
                        avg(PRICE).filterWhere(STATUS.in(
                                BookingStatus.COMPLETED.getValue(),
                                BookingStatus.CONFIRMED.getValue()
                        ))
                )
                .from(BOOKINGS)
                .where(SCHEDULED_AT.ge(from))
                .and(SCHEDULED_AT.le(to))
                .fetchOne();

        return new BookingStatistics(
                stats.value1() != null ? stats.value1() : 0L,
                stats.value2() != null ? stats.value2() : 0L,
                stats.value3() != null ? stats.value3() : 0L,
                stats.value4() != null ? stats.value4() : 0L,
                stats.value5() != null ? stats.value5() : 0L,
                stats.value6() != null ? stats.value6() : BigDecimal.ZERO,
                stats.value7() != null ? stats.value7() : BigDecimal.ZERO
        );
    }

    /**
     * Маппинг Record в доменную сущность Booking.
     */
    private Booking mapToBooking(Record record) {
        return Booking.builder()
                .id(record.get(ID))
                .accountId(record.get(ACCOUNT_ID))
                .slotId(record.get(SLOT_ID))
                .clientUserId(record.get(CLIENT_USER_ID))
                .serviceId(record.get(SERVICE_ID))
                .price(record.get(PRICE))
                .currency(record.get(CURRENCY))
                .durationMinutes(record.get(DURATION_MINUTES))
                .status(BookingStatus.fromValue(record.get(STATUS)))
                .paymentStatus(PaymentStatus.fromValue(record.get(PAYMENT_STATUS)))
                .source(BookingSource.fromValue(record.get(SOURCE)))
                .idempotencyKey(record.get(IDEMPOTENCY_KEY))
                .clientName(record.get(CLIENT_NAME))
                .clientPhone(record.get(CLIENT_PHONE))
                .serviceName(record.get(SERVICE_NAME))
                .notes(record.get(NOTES))
                .internalNotes(record.get(INTERNAL_NOTES))
                .scheduledAt(record.get(SCHEDULED_AT))
                .createdAt(record.get(CREATED_AT))
                .updatedAt(record.get(UPDATED_AT))
                .confirmedAt(record.get(CONFIRMED_AT))
                .cancelledAt(record.get(CANCELLED_AT))
                .completedAt(record.get(COMPLETED_AT))
                .version(record.get(VERSION))
                .metadata(parseJsonToMap(record.get(METADATA)))
                .build();
    }

    /**
     * Преобразование Map в JSON строку.
     */
    private String toJson(Map<String, Object> map) {
        // В реальном проекте используйте Jackson ObjectMapper
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
        // В реальном проекте используйте Jackson ObjectMapper
        try {
            return (Map<String, Object>) json.data();
        } catch (Exception e) {
            log.warn("Failed to parse JSON metadata", e);
            return new HashMap<>();
        }
    }

}
