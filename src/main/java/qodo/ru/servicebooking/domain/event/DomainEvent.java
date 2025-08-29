package qodo.ru.servicebooking.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

public interface DomainEvent {

    /**
     * Получить ID агрегата, к которому относится событие.
     */
    UUID getAggregateId();

    /**
     * Получить тип события.
     */
    String getEventType();

    /**
     * Получить время возникновения события.
     */
    LocalDateTime getOccurredAt();

    /**
     * Получить ID корреляции для трассировки.
     */
    UUID getCorrelationId();

    /**
     * Получить ID пользователя, инициировавшего событие.
     */
    UUID getUserId();
}
