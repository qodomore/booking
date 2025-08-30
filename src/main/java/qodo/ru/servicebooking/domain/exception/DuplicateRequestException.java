package qodo.ru.servicebooking.domain.exception;

import lombok.Getter;

@Getter
public class DuplicateRequestException extends BookingDomainException {
    private final String idempotencyKey;

    public DuplicateRequestException(String idempotencyKey) {
        super(
                String.format("Duplicate request with idempotency key: %s", idempotencyKey),
                "DUPLICATE_REQUEST"
        );
        this.idempotencyKey = idempotencyKey;
    }

}
