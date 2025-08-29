package qodo.ru.servicebooking.domain.exception;

import java.math.BigDecimal;

public class PaymentException extends BookingDomainException {
    private final BigDecimal amount;
    private final String paymentProvider;

    public PaymentException(String message, BigDecimal amount, String paymentProvider) {
        super(message, "PAYMENT_FAILED");
        this.amount = amount;
        this.paymentProvider = paymentProvider;
    }

    public PaymentException(String message, BigDecimal amount, String paymentProvider, Throwable cause) {
        super(message, "PAYMENT_FAILED", cause);
        this.amount = amount;
        this.paymentProvider = paymentProvider;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getPaymentProvider() {
        return paymentProvider;
    }
}
