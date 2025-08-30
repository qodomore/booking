package qodo.ru.servicebooking.infrastructure.persistence.repository.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSON;
import org.jooq.Table;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import qodo.ru.servicebooking.domain.entity.VisitHistory;
import qodo.ru.servicebooking.infrastructure.persistence.repository.VisitHistoryRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

@Slf4j
@Repository
@RequiredArgsConstructor
public class VisitHistoryRepositoryImpl implements VisitHistoryRepository {

    private final DSLContext dsl;

    private static final Table<Record> VISIT_HISTORY = table("visit_history");
    private static final Table<Record> BOOKINGS = table("bookings");

    // Поля visit_history
    private static final Field<UUID> ID = field("id", UUID.class);
    private static final Field<UUID> BOOKING_ID = field("booking_id", UUID.class);
    private static final Field<LocalDateTime> VISITED_AT = field("visited_at", LocalDateTime.class);
    private static final Field<Integer> ACTUAL_DURATION = field("actual_duration_minutes", Integer.class);
    private static final Field<BigDecimal> ACTUAL_PRICE = field("actual_price", BigDecimal.class);
    private static final Field<Integer> RATING = field("rating", Integer.class);
    private static final Field<String> REVIEW = field("review", String.class);
    private static final Field<LocalDateTime> REVIEW_AT = field("review_at", LocalDateTime.class);
    private static final Field<JSON> PHOTOS = field("photos", JSON.class);
    private static final Field<JSON> METADATA = field("metadata", JSON.class);
    private static final Field<LocalDateTime> CREATED_AT = field("created_at", LocalDateTime.class);
    private static final Field<LocalDateTime> UPDATED_AT = field("updated_at", LocalDateTime.class);

    @Override
    @Transactional
    public VisitHistory save(VisitHistory visitHistory) {
        log.debug("Saving visit history for booking: {}", visitHistory.getBookingId());

        UUID historyId = visitHistory.getId() != null ? visitHistory.getId() : UUID.randomUUID();

        dsl.insertInto(VISIT_HISTORY)
                .set(ID, historyId)
                .set(BOOKING_ID, visitHistory.getBookingId())
                .set(VISITED_AT, visitHistory.getVisitedAt())
                .set(ACTUAL_DURATION, visitHistory.getActualDurationMinutes())
                .set(ACTUAL_PRICE, visitHistory.getActualPrice())
                .set(RATING, visitHistory.getRating())
                .set(REVIEW, visitHistory.getReview())
                .set(REVIEW_AT, visitHistory.getReviewAt())
                .set(PHOTOS, JSON.json(toJsonArray(visitHistory.getPhotos())))
                .set(METADATA, JSON.json(toJson(visitHistory.getMetadata())))
                .set(CREATED_AT, visitHistory.getCreatedAt())
                .set(UPDATED_AT, visitHistory.getUpdatedAt())
                .onConflict(BOOKING_ID)
                .doUpdate()
                .set(ACTUAL_DURATION, visitHistory.getActualDurationMinutes())
                .set(ACTUAL_PRICE, visitHistory.getActualPrice())
                .set(UPDATED_AT, LocalDateTime.now())
                .execute();

        visitHistory.setId(historyId);
        log.info("Saved visit history: {}", historyId);
        return visitHistory;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VisitHistory> findByBookingId(UUID bookingId) {
        log.debug("Finding visit history for booking: {}", bookingId);

        Record record = dsl.selectFrom(VISIT_HISTORY)
                .where(BOOKING_ID.eq(bookingId))
                .fetchOne();

        return Optional.ofNullable(record).map(this::mapToVisitHistory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitHistory> findTopRated(int minRating, int limit) {
        log.debug("Finding top rated visits with rating >= {}", minRating);

        return dsl.selectFrom(VISIT_HISTORY)
                .where(RATING.ge(minRating))
                .and(REVIEW.isNotNull())
                .orderBy(RATING.desc(), REVIEW_AT.desc())
                .limit(limit)
                .fetch()
                .map(this::mapToVisitHistory);
    }

    @Override
    @Transactional
    public boolean updateReview(UUID bookingId, int rating, String review) {
        log.debug("Updating review for booking: {}", bookingId);

        int updated = dsl.update(VISIT_HISTORY)
                .set(RATING, rating)
                .set(REVIEW, review)
                .set(REVIEW_AT, LocalDateTime.now())
                .set(UPDATED_AT, LocalDateTime.now())
                .where(BOOKING_ID.eq(bookingId))
                .execute();

        return updated > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitHistory> findForPortfolio(UUID accountId, int limit) {
        log.debug("Finding portfolio items for account: {}", accountId);

        // JOIN с bookings для получения account_id
        return dsl.select(VISIT_HISTORY.fields())
                .from(VISIT_HISTORY)
                .join(BOOKINGS).on(VISIT_HISTORY.field(BOOKING_ID).eq(BOOKINGS.field("id", UUID.class)))
                .where(BOOKINGS.field("account_id", UUID.class).eq(accountId))
                .and(PHOTOS.isNotNull())
                .and(RATING.ge(4))
                .orderBy(VISIT_HISTORY.field(CREATED_AT).desc())
                .limit(limit)
                .fetch()
                .map(r -> mapToVisitHistory(r.into(VISIT_HISTORY)));
    }

    private VisitHistory mapToVisitHistory(Record record) {
        return VisitHistory.builder()
                .id(record.get(ID))
                .bookingId(record.get(BOOKING_ID))
                .visitedAt(record.get(VISITED_AT))
                .actualDurationMinutes(record.get(ACTUAL_DURATION))
                .actualPrice(record.get(ACTUAL_PRICE))
                .rating(record.get(RATING))
                .review(record.get(REVIEW))
                .reviewAt(record.get(REVIEW_AT))
                .photos(parseJsonArray(record.get(PHOTOS)))
                .metadata(parseJsonToMap(record.get(METADATA)))
                .createdAt(record.get(CREATED_AT))
                .updatedAt(record.get(UPDATED_AT))
                .build();
    }

    private String toJson(Map<String, Object> map) {
        return map != null ? map.toString() : "{}";
    }

    private String toJsonArray(List<String> list) {
        return list != null ? list.toString() : "[]";
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonToMap(JSON json) {
        if (json == null) return new HashMap<>();
        try {
            return (Map<String, Object>) json.data();
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJsonArray(JSON json) {
        if (json == null) return new ArrayList<>();
        try {
            return (List<String>) json.data();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
