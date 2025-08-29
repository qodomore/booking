package qodo.ru.servicebooking.domain.exception;

import java.util.UUID;

public class BookingNotFoundException extends BookingDomainException {
    private final UUID bookingId;

    public BookingNotFoundException(UUID bookingId) {
        super(
                String.format("Booking %s not found", bookingId),
                "BOOKING_NOT_FOUND"
        );
        this.bookingId = bookingId;
    }

    public UUID getBookingId() {
        return bookingId;
    }
}
