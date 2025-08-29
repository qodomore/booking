package qodo.ru.servicebooking.domain.valueobjects;

import lombok.Value;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Value Object для временного слота.
 *
 * Представляет временной интервал для бронирования.
 */
@Value
public class TimeSlot {
    LocalDateTime startTime;
    LocalDateTime endTime;

    /**
     * Создает слот из начального времени и длительности.
     */
    public static TimeSlot of(LocalDateTime start, Duration duration) {
        return new TimeSlot(start, start.plus(duration));
    }

    /**
     * Создает слот из начального времени и минут.
     */
    public static TimeSlot of(LocalDateTime start, int durationMinutes) {
        return of(start, Duration.ofMinutes(durationMinutes));
    }

    /**
     * Проверяет валидность слота.
     */
    public boolean isValid() {
        return startTime != null && endTime != null && endTime.isAfter(startTime);
    }

    /**
     * Получает длительность слота.
     */
    public Duration getDuration() {
        return Duration.between(startTime, endTime);
    }

    /**
     * Получает длительность в минутах.
     */
    public long getDurationMinutes() {
        return getDuration().toMinutes();
    }

    /**
     * Проверяет, пересекается ли с другим слотом.
     */
    public boolean overlaps(TimeSlot other) {
        return startTime.isBefore(other.endTime) && endTime.isAfter(other.startTime);
    }

    /**
     * Проверяет, содержит ли указанное время.
     */
    public boolean contains(LocalDateTime time) {
        return !time.isBefore(startTime) && time.isBefore(endTime);
    }

    /**
     * Проверяет, прошел ли слот.
     */
    public boolean isPast() {
        return endTime.isBefore(LocalDateTime.now());
    }

    /**
     * Проверяет, является ли слот текущим.
     */
    public boolean isCurrent() {
        LocalDateTime now = LocalDateTime.now();
        return !now.isBefore(startTime) && now.isBefore(endTime);
    }

    /**
     * Проверяет, является ли слот будущим.
     */
    public boolean isFuture() {
        return startTime.isAfter(LocalDateTime.now());
    }

    @Override
    public String toString() {
        return String.format("%s - %s (%d min)",
                startTime.toLocalTime(),
                endTime.toLocalTime(),
                getDurationMinutes());
    }
}
