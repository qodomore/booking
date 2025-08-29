package qodo.ru.servicebooking.domain.exception;

import qodo.ru.servicebooking.domain.enums.BookingStatus;

import java.util.UUID;

public class InvalidBookingStateException extends BookingDomainException {
    private final UUID bookingId;
    private final BookingStatus currentStatus;
    private final BookingStatus targetStatus;

    public InvalidBookingStateException(UUID bookingId, BookingStatus currentStatus, BookingStatus targetStatus) {
        super(
                String.format("Cannot transition booking %s from %s to %s",
                        bookingId, currentStatus, targetStatus),
                "INVALID_STATE_TRANSITION"
        );
        this.bookingId = bookingId;
        this.currentStatus = currentStatus;
        this.targetStatus = targetStatus;
    }

    public UUID getBookingId() {
        return bookingId;
    }

    public BookingStatus getCurrentStatus() {
        return currentStatus;
    }

    public BookingStatus getTargetStatus() {
        return targetStatus;
    }
}
