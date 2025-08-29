package qodo.ru.servicebooking.domain.exception;

public class DuplicateRequestException extends BookingDomainException {
    private final String idempotencyKey;

    public DuplicateRequestException(String idempotencyKey) {
        super(
                String.format("Duplicate request with idempotency key: %s", idempotencyKey),
                "DUPLICATE_REQUEST"
        );
        this.idempotencyKey = idempotencyKey;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }
}
