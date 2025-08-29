package qodo.ru.servicebooking.domain.event.impl;

import lombok.Builder;
import lombok.Value;
import qodo.ru.servicebooking.domain.event.DomainEvent;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Событие создания бронирования.
 *
 * Публикуется при успешном создании новой записи.
 */
@Value
@Builder
public class BookingCreatedEvent implements DomainEvent {

    UUID bookingId;
    UUID accountId;
    UUID slotId;
    UUID clientUserId;
    UUID serviceId;

    BigDecimal price;
    String currency;
    int durationMinutes;
    LocalDateTime scheduledAt;

    String clientName;
    String clientPhone;
    String serviceName;
    String source;

    Map<String, Object> metadata;

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
        return "booking.created";
    }
}
