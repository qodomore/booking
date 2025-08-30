package qodo.ru.servicebooking.domain.enums;

import lombok.Getter;

@Getter
public enum PaymentStatus {

    /**
     * Не оплачено. Дефолтный статус.
     */
    UNPAID("unpaid"),

    /**
     * Ожидает оплаты. Платеж инициирован.
     */
    PENDING("pending"),

    /**
     * Оплачено успешно.
     */
    PAID("paid"),

    /**
     * Возврат произведен.
     */
    REFUNDED("refunded"),

    /**
     * Ошибка при оплате.
     */
    FAILED("failed");

    private final String value;

    PaymentStatus(String value) {
        this.value = value;
    }

    public static PaymentStatus fromValue(String value) {
        for (PaymentStatus status : PaymentStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown PaymentStatus: " + value);
    }

    /**
     * Проверяет, требуется ли действие по оплате.
     */
    public boolean requiresPaymentAction() {
        return this == UNPAID || this == PENDING || this == FAILED;
    }

    /**
     * Проверяет, успешно ли оплачено.
     */
    public boolean isSuccessful() {
        return this == PAID;
    }
}
