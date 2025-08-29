package qodo.ru.servicebooking.domain.exception;

import java.time.LocalDateTime;

public class PastBookingException extends BookingDomainException {
    private final LocalDateTime requestedTime;

    public PastBookingException(LocalDateTime requestedTime) {
        super(
                String.format("Cannot book slot in the past: %s", requestedTime),
                "PAST_BOOKING_ATTEMPT"
        );
        this.requestedTime = requestedTime;
    }

    public LocalDateTime getRequestedTime() {
        return requestedTime;
    }
}
