package qodo.ru.servicebooking.domain.event.impl;

import lombok.Builder;
import lombok.Value;
import qodo.ru.servicebooking.domain.event.DomainEvent;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Событие завершения визита.
 *
 * Публикуется когда визит успешно состоялся.
 */
@Value
@Builder
public class BookingCompletedEvent implements DomainEvent {

    UUID bookingId;
    UUID accountId;
    UUID clientUserId;
    UUID serviceId;

    @Builder.Default
    LocalDateTime completedAt = LocalDateTime.now();

    BigDecimal actualPrice;
    int actualDurationMinutes;

    boolean feedbackRequested;

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
        return "booking.completed";
    }
}
