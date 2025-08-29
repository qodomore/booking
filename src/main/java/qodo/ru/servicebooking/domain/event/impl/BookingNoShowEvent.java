package qodo.ru.servicebooking.domain.event.impl;

import lombok.Builder;
import lombok.Value;
import qodo.ru.servicebooking.domain.event.DomainEvent;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Событие неявки клиента.
 *
 * Публикуется когда клиент не пришел на запись.
 */
@Value
@Builder
public class BookingNoShowEvent implements DomainEvent {

    UUID bookingId;
    UUID accountId;
    UUID clientUserId;
    LocalDateTime scheduledAt;

    @Builder.Default
    LocalDateTime markedAt = LocalDateTime.now();

    boolean penaltyApplied;
    String notes;

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
        return "booking.no_show";
    }
}
