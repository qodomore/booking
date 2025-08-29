package qodo.ru.servicebooking.domain.event.impl;

import lombok.Builder;
import lombok.Value;
import qodo.ru.servicebooking.domain.enums.PaymentStatus;
import qodo.ru.servicebooking.domain.event.DomainEvent;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Событие обновления статуса оплаты.
 *
 * Публикуется при изменении статуса оплаты бронирования.
 */
@Value
@Builder
public class PaymentStatusUpdatedEvent implements DomainEvent {

    UUID bookingId;
    UUID accountId;
    UUID clientUserId;

    PaymentStatus oldStatus;
    PaymentStatus newStatus;

    BigDecimal amount;
    String currency;

    String paymentMethod;
    String transactionId;
    String failureReason;

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
        return "booking.payment_status_updated";
    }
}
