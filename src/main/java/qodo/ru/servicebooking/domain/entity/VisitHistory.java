package qodo.ru.servicebooking.domain.entity;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

/**
 * История фактического визита клиента.
 *
 * Создается после завершения визита и содержит фактические данные
 * о проведенной услуге, оценке клиента и фотографиях работы.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class VisitHistory {

    /**
     * Уникальный идентификатор записи истории.
     */
    private UUID id;

    /**
     * Ссылка на бронирование (1:1 связь).
     */
    @NonNull
    private UUID bookingId;

    // ========== Фактические данные визита ==========

    /**
     * Фактическое время визита.
     * Может отличаться от запланированного.
     */
    @NonNull
    private LocalDateTime visitedAt;

    /**
     * Фактическая длительность в минутах.
     * Может отличаться от запланированной.
     */
    private Integer actualDurationMinutes;

    /**
     * Фактическая стоимость.
     * Может отличаться если были дополнительные услуги.
     */
    private BigDecimal actualPrice;

    // ========== Обратная связь от клиента ==========

    /**
     * Оценка от 1 до 5.
     */
    private Integer rating;

    /**
     * Текстовый отзыв клиента.
     */
    private String review;

    /**
     * Время оставления отзыва.
     */
    private LocalDateTime reviewAt;

    // ========== Портфолио мастера ==========

    /**
     * URLs фотографий выполненной работы.
     * Используется для портфолио мастера.
     */
    @Builder.Default
    private List<String> photos = new ArrayList<>();

    /**
     * Описание выполненной работы для портфолио.
     */
    private String workDescription;

    /**
     * Согласие клиента на использование фото в портфолио.
     */
    @Builder.Default
    private boolean photoConsentGiven = false;

    // ========== Дополнительные данные ==========

    /**
     * Использованные материалы и их количество.
     * Для учета расходов мастера.
     */
    @Builder.Default
    private Map<String, Object> materialsUsed = new HashMap<>();

    /**
     * Метаданные визита.
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

    // ========== Бизнес-методы ==========

    /**
     * Добавляет фотографию работы.
     */
    public void addPhoto(String photoUrl) {
        if (photos == null) {
            photos = new ArrayList<>();
        }
        photos.add(photoUrl);
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Устанавливает отзыв клиента.
     */
    public void setClientReview(Integer rating, String review) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.rating = rating;
        this.review = review;
        this.reviewAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Проверяет, есть ли отзыв.
     */
    public boolean hasReview() {
        return rating != null;
    }

    /**
     * Проверяет, положительный ли отзыв.
     */
    public boolean isPositiveReview() {
        return rating != null && rating >= 4;
    }

    /**
     * Рассчитывает разницу между плановой и фактической длительностью.
     */
    public Integer getDurationDifference(int plannedDuration) {
        if (actualDurationMinutes == null) {
            return null;
        }
        return actualDurationMinutes - plannedDuration;
    }

    /**
     * Рассчитывает разницу между плановой и фактической стоимостью.
     */
    public BigDecimal getPriceDifference(BigDecimal plannedPrice) {
        if (actualPrice == null) {
            return null;
        }
        return actualPrice.subtract(plannedPrice);
    }
}
