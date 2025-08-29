package qodo.ru.servicebooking.domain.event.impl;

import lombok.Builder;
import lombok.Value;
import qodo.ru.servicebooking.domain.event.DomainEvent;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Событие добавления отзыва к визиту.
 *
 * Публикуется когда клиент оставляет отзыв после визита.
 */
@Value
@Builder
public class ReviewAddedEvent implements DomainEvent {

    UUID bookingId;
    UUID accountId;
    UUID clientUserId;
    UUID serviceId;

    int rating;
    String review;

    @Builder.Default
    LocalDateTime reviewedAt = LocalDateTime.now();

    boolean isPositive; // rating >= 4

    @Builder.Default
    LocalDateTime occurredAt = LocalDateTime.now();
    UUID correlationId;
    UUID userId;

    @Override
    public UUID getAggregateId() {
        return bookingId;
    }

    @Override
    public String getEventType() {
        return "booking.review_added";
    }
}
