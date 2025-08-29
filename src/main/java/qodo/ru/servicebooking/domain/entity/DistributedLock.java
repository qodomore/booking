package qodo.ru.servicebooking.domain.entity;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Распределенная блокировка.
 * <p>
 * Используется как fallback когда Redis недоступен.
 * Блокировки на уровне БД менее эффективны, но гарантируют консистентность.
 */
@Data
@Builder
public class DistributedLock {

    /**
     * Ключ блокировки (например, "booking:slot:123").
     */
    private String lockKey;

    /**
     * Идентификатор владельца блокировки (instance ID).
     */
    private String lockedBy;

    /**
     * Время установки блокировки.
     */
    @Builder.Default
    private LocalDateTime lockedAt = LocalDateTime.now();

    /**
     * Время истечения блокировки.
     */
    private LocalDateTime expiresAt;

    /**
     * Метаданные блокировки.
     */
    private String metadata;

    /**
     * Проверяет, истекла ли блокировка.
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Проверяет, принадлежит ли блокировка указанному владельцу.
     */
    public boolean isOwnedBy(String owner) {
        return lockedBy != null && lockedBy.equals(owner);
    }

    /**
     * Продлевает блокировку на указанное количество секунд.
     */
    public void extend(int seconds) {
        this.expiresAt = LocalDateTime.now().plusSeconds(seconds);
    }

    /**
     * Создает ключ блокировки для слота.
     */
    public static String createSlotLockKey(UUID slotId) {
        return String.format("booking:slot:%s", slotId);
    }

    /**
     * Создает ключ блокировки для аккаунта.
     */
    public static String createAccountLockKey(UUID accountId) {
        return String.format("booking:account:%s", accountId);
    }
}
