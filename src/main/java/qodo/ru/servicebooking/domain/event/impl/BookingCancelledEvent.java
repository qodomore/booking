package qodo.ru.servicebooking.domain.event.impl;

import lombok.Builder;
import lombok.Value;
import qodo.ru.servicebooking.domain.event.DomainEvent;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Событие отмены бронирования.
 *
 * Публикуется при отмене записи клиентом или мастером.
 */
@Value
@Builder
public class BookingCancelledEvent implements DomainEvent {

    UUID bookingId;
    UUID accountId;
    UUID clientUserId;
    LocalDateTime scheduledAt;

    UUID cancelledBy;
    @Builder.Default
    LocalDateTime cancelledAt = LocalDateTime.now();

    String cancellationReason;
    String cancellationSource; // "client", "master", "system", "admin"
    boolean refundInitiated;

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
        return "booking.cancelled";
    }
}
