package qodo.ru.servicebooking.domain.entity;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Событие для Transactional Outbox Pattern.
 *
 * Гарантирует at-least-once доставку событий в RabbitMQ.
 * События создаются в той же транзакции, что и изменение агрегата,
 * а затем асинхронно публикуются в брокер сообщений.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class OutboxEvent {

    /**
     * Уникальный идентификатор события.
     */
    private UUID id;

    // ========== Идентификация события ==========

    /**
     * ID агрегата (например, bookingId).
     */
    @NonNull
    private UUID aggregateId;

    /**
     * Тип агрегата (например, "booking").
     */
    @NonNull
    private String aggregateType;

    /**
     * Тип события (например, "booking.created", "booking.confirmed").
     */
    @NonNull
    private String eventType;

    // ========== Данные события ==========

    /**
     * Полезная нагрузка события в формате JSON.
     */
    @NonNull
    private Map<String, Object> payload;

    // ========== Метаданные для трассировки ==========

    /**
     * ID корреляции для сквозной трассировки.
     */
    private UUID correlationId;

    /**
     * ID причинного события (что вызвало это событие).
     */
    private UUID causationId;

    /**
     * ID пользователя, инициировавшего событие.
     */
    private UUID userId;

    /**
     * Заголовки для передачи в RabbitMQ.
     */
    private Map<String, String> headers;

    // ========== Статус публикации ==========

    /**
     * Время создания события.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Время публикации в брокер.
     * NULL означает неопубликованное событие.
     */
    private LocalDateTime publishedAt;

    // ========== Обработка ошибок ==========

    /**
     * Количество попыток публикации.
     */
    @Builder.Default
    private int retryCount = 0;

    /**
     * Последняя ошибка при публикации.
     */
    private String lastError;

    /**
     * Время последней попытки.
     */
    private LocalDateTime lastRetryAt;

    /**
     * Максимальное количество попыток.
     */
    @Builder.Default
    private int maxRetries = 5;

    // ========== Бизнес-методы ==========

    /**
     * Проверяет, опубликовано ли событие.
     */
    public boolean isPublished() {
        return publishedAt != null;
    }

    /**
     * Отмечает событие как опубликованное.
     */
    public void markAsPublished() {
        this.publishedAt = LocalDateTime.now();
        this.lastError = null;
    }

    /**
     * Регистрирует неудачную попытку публикации.
     */
    public void recordFailedAttempt(String error) {
        this.retryCount++;
        this.lastError = error;
        this.lastRetryAt = LocalDateTime.now();
    }

    /**
     * Проверяет, можно ли повторить попытку.
     */
    public boolean canRetry() {
        return !isPublished() && retryCount < maxRetries;
    }

    /**
     * Проверяет, исчерпаны ли попытки.
     */
    public boolean isExhausted() {
        return !isPublished() && retryCount >= maxRetries;
    }

    /**
     * Рассчитывает задержку до следующей попытки (exponential backoff).
     */
    public long getNextRetryDelaySeconds() {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
        return Math.min((long) Math.pow(2, retryCount), 300); // Max 5 минут
    }

    /**
     * Проверяет, пора ли повторить попытку.
     */
    public boolean isReadyForRetry() {
        if (isPublished() || !canRetry()) {
            return false;
        }

        if (lastRetryAt == null) {
            return true; // Первая попытка
        }

        LocalDateTime nextRetryTime = lastRetryAt.plusSeconds(getNextRetryDelaySeconds());
        return LocalDateTime.now().isAfter(nextRetryTime);
    }

    /**
     * Получает routing key для RabbitMQ на основе типа события.
     */
    public String getRoutingKey() {
        return eventType.toLowerCase().replace(".", "_");
    }

    /**
     * Получает exchange name для RabbitMQ.
     */
    public String getExchangeName() {
        return "bookings.exchange.v1";
    }
}
