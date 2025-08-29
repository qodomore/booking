package qodo.ru.servicebooking.domain.exception;

public class BookingDomainException extends RuntimeException {
    private final String errorCode;

    protected BookingDomainException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    protected BookingDomainException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
