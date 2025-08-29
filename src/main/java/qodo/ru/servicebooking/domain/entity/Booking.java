package qodo.ru.servicebooking.domain.entity;

import lombok.*;
import qodo.ru.servicebooking.domain.enums.BookingSource;
import qodo.ru.servicebooking.domain.enums.BookingStatus;
import qodo.ru.servicebooking.domain.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Основная сущность бронирования.
 *
 * Представляет запись клиента к мастеру на определенную услугу.
 * Является агрегатом в терминах DDD.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    /**
     * Уникальный идентификатор бронирования.
     */
    private UUID id;

    // ========== Связи с другими сервисами ==========

    /**
     * ID аккаунта мастера (из Users Service).
     */
    @NonNull
    private UUID accountId;

    /**
     * ID слота времени (из Schedule Service).
     * Критически важное поле - должно быть уникальным для активных записей.
     */
    @NonNull
    private UUID slotId;

    /**
     * ID клиента (из Users Service).
     */
    @NonNull
    private UUID clientUserId;

    /**
     * ID услуги (из Services Catalog).
     */
    @NonNull
    private UUID serviceId;

    // ========== Бизнес-поля ==========

    /**
     * Стоимость услуги.
     * Используем BigDecimal для точных денежных расчетов.
     */
    @NonNull
    private BigDecimal price;

    /**
     * Валюта (по умолчанию RUB).
     */
    @Builder.Default
    private String currency = "RUB";

    /**
     * Длительность услуги в минутах.
     */
    private int durationMinutes;

    /**
     * Запланированное время визита.
     * Денормализовано из Schedule Service для быстрого доступа.
     */
    @NonNull
    private LocalDateTime scheduledAt;

    // ========== Статусы ==========

    /**
     * Текущий статус бронирования.
     */
    @NonNull
    @Builder.Default
    private BookingStatus status = BookingStatus.CREATED;

    /**
     * Статус оплаты.
     */
    @NonNull
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    // ========== Источник и идемпотентность ==========

    /**
     * Источник создания записи.
     */
    @NonNull
    @Builder.Default
    private BookingSource source = BookingSource.TELEGRAM;

    /**
     * Ключ идемпотентности для защиты от дублирования.
     * Уникальный на уровне БД.
     */
    private String idempotencyKey;

    // ========== Денормализованные данные для производительности ==========

    /**
     * Имя клиента (копия из Users Service).
     * Денормализовано для быстрого отображения списков.
     */
    private String clientName;

    /**
     * Телефон клиента (копия из Users Service).
     */
    private String clientPhone;

    /**
     * Название услуги (копия из Services Catalog).
     */
    private String serviceName;

    // ========== Дополнительные данные ==========

    /**
     * Заметки от клиента при записи.
     */
    private String notes;

    /**
     * Внутренние заметки мастера (не видны клиенту).
     */
    private String internalNotes;

    /**
     * Метаданные в формате JSON.
     * Содержит UTM-метки, источники трафика, A/B тесты и т.д.
     */
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();

    // ========== Временные метки ==========

    /**
     * Время создания записи.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Время последнего обновления.
     */
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    /**
     * Время подтверждения записи.
     */
    private LocalDateTime confirmedAt;

    /**
     * Время отмены записи.
     */
    private LocalDateTime cancelledAt;

    /**
     * Время завершения визита.
     */
    private LocalDateTime completedAt;

    // ========== Версионирование для оптимистичной блокировки ==========

    /**
     * Версия для оптимистичной блокировки.
     * Инкрементируется при каждом обновлении.
     */
    @Builder.Default
    private int version = 0;

    // ========== Бизнес-методы ==========

    /**
     * Проверяет, можно ли подтвердить бронирование.
     */
    public boolean canBeConfirmed() {
        return status == BookingStatus.CREATED;
    }

    /**
     * Подтверждает бронирование.
     * @throws IllegalStateException если нельзя подтвердить
     */
    public void confirm() {
        if (!canBeConfirmed()) {
            throw new IllegalStateException(
                    String.format("Cannot confirm booking in status %s", status)
            );
        }
        this.status = BookingStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.version++;
    }

    /**
     * Проверяет, можно ли отменить бронирование.
     */
    public boolean canBeCancelled() {
        return status == BookingStatus.CREATED || status == BookingStatus.CONFIRMED;
    }

    /**
     * Отменяет бронирование.
     * @param reason причина отмены
     * @throws IllegalStateException если нельзя отменить
     */
    public void cancel(String reason) {
        if (!canBeCancelled()) {
            throw new IllegalStateException(
                    String.format("Cannot cancel booking in status %s", status)
            );
        }
        this.status = BookingStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (reason != null) {
            this.internalNotes = (this.internalNotes != null ? this.internalNotes + "\n" : "")
                    + "Cancelled: " + reason;
        }
        this.version++;
    }

    /**
     * Отмечает визит как состоявшийся.
     */
    public void complete() {
        if (status != BookingStatus.CONFIRMED) {
            throw new IllegalStateException(
                    String.format("Cannot complete booking in status %s", status)
            );
        }
        this.status = BookingStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.version++;
    }

    /**
     * Отмечает, что клиент не пришел.
     */
    public void markAsNoShow() {
        if (status != BookingStatus.CONFIRMED) {
            throw new IllegalStateException(
                    String.format("Cannot mark as no-show booking in status %s", status)
            );
        }
        this.status = BookingStatus.NO_SHOW;
        this.updatedAt = LocalDateTime.now();
        this.version++;
    }

    /**
     * Проверяет, активно ли бронирование (занимает слот).
     */
    public boolean isActive() {
        return status.isActive();
    }

    /**
     * Проверяет, завершено ли бронирование.
     */
    public boolean isFinal() {
        return status.isFinal();
    }

    /**
     * Проверяет, оплачено ли бронирование.
     */
    public boolean isPaid() {
        return paymentStatus.isSuccessful();
    }

    /**
     * Проверяет, прошло ли время визита.
     */
    public boolean isPastDue() {
        return scheduledAt.isBefore(LocalDateTime.now());
    }

    /**
     * Добавляет метаданные.
     */
    public void addMetadata(String key, Object value) {
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        metadata.put(key, value);
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Обновляет статус оплаты.
     */
    public void updatePaymentStatus(PaymentStatus newStatus) {
        this.paymentStatus = newStatus;
        this.updatedAt = LocalDateTime.now();
        this.version++;
    }
}
