package qodo.ru.servicebooking.domain.valueobjects;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Запись аудита для отслеживания всех изменений бронирований.
 *
 * Используется для compliance, безопасности и отладки.
 */
@Data
@Builder
public class BookingAuditLog {

    /**
     * ID записи аудита.
     */
    private Long id;

    /**
     * ID бронирования.
     */
    private UUID bookingId;

    /**
     * Тип действия.
     */
    private AuditAction action;

    /**
     * Старые значения (до изменения).
     */
    private Map<String, Object> oldValues;

    /**
     * Новые значения (после изменения).
     */
    private Map<String, Object> newValues;

    /**
     * Кто внес изменения.
     */
    private UUID changedBy;

    /**
     * Когда внесены изменения.
     */
    @Builder.Default
    private LocalDateTime changedAt = LocalDateTime.now();

    /**
     * IP адрес инициатора.
     */
    private String ipAddress;

    /**
     * User Agent инициатора.
     */
    private String userAgent;

    /**
     * ID корреляции для трассировки.
     */
    private UUID correlationId;

    /**
     * Причина изменения.
     */
    private String reason;

    /**
     * Тип действия аудита.
     */
    @Getter
    public enum AuditAction {
        CREATE("Создание бронирования"),
        UPDATE("Обновление данных"),
        CONFIRM("Подтверждение"),
        CANCEL("Отмена"),
        COMPLETE("Завершение визита"),
        NO_SHOW("Клиент не пришел"),
        PAYMENT_UPDATE("Обновление статуса оплаты"),
        DELETE("Удаление");

        private final String description;

        AuditAction(String description) {
            this.description = description;
        }

    }
}
