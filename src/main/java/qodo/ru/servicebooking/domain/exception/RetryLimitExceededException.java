package qodo.ru.servicebooking.domain.exception;

public class RetryLimitExceededException extends BookingDomainException {
    private final int attempts;
    private final String operation;

    public RetryLimitExceededException(String operation, int attempts) {
        super(
                String.format("Retry limit exceeded for operation %s after %d attempts", operation, attempts),
                "RETRY_LIMIT_EXCEEDED"
        );
        this.operation = operation;
        this.attempts = attempts;
    }

    public int getAttempts() {
        return attempts;
    }

    public String getOperation() {
        return operation;
    }
}
