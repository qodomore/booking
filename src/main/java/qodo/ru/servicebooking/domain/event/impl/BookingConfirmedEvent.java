package qodo.ru.servicebooking.domain.event.impl;

import lombok.Builder;
import lombok.Value;
import qodo.ru.servicebooking.domain.event.DomainEvent;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Событие подтверждения бронирования.
 *
 * Публикуется когда мастер или система подтверждает запись.
 */
@Value
@Builder
public class BookingConfirmedEvent implements DomainEvent {
    UUID bookingId;
    UUID accountId;
    UUID clientUserId;
    LocalDateTime scheduledAt;

    UUID confirmedBy;
    @Builder.Default
    LocalDateTime confirmedAt = LocalDateTime.now();

    String confirmationMethod; // "manual", "auto", "payment"

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
        return "booking.confirmed";
    }

}
