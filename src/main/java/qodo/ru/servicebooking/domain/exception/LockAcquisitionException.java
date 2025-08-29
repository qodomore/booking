package qodo.ru.servicebooking.domain.exception;

public class LockAcquisitionException extends BookingDomainException {
    private final String lockKey;
    private final long waitTimeMs;

    public LockAcquisitionException(String lockKey, long waitTimeMs) {
        super(
                String.format("Failed to acquire lock for %s after %d ms", lockKey, waitTimeMs),
                "LOCK_ACQUISITION_FAILED"
        );
        this.lockKey = lockKey;
        this.waitTimeMs = waitTimeMs;
    }

    public String getLockKey() {
        return lockKey;
    }

    public long getWaitTimeMs() {
        return waitTimeMs;
    }
}
