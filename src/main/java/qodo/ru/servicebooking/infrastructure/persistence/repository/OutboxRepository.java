package qodo.ru.servicebooking.infrastructure.persistence.repository;

import qodo.ru.servicebooking.domain.entity.OutboxEvent;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OutboxRepository {

    /**
     * Сохранить новое событие в outbox.
     * Должно вызываться в той же транзакции, что и бизнес-операция.
     *
     * @param event событие для сохранения
     * @return сохраненное событие с ID
     */
    OutboxEvent save(OutboxEvent event);

    /**
     * Найти неопубликованные события для публикации.
     * Использует FOR UPDATE SKIP LOCKED для конкурентной обработки.
     *
     * @param limit максимальное количество событий
     * @return список событий для публикации
     */
    List<OutboxEvent> findUnpublishedForProcessing(int limit);

    /**
     * Найти события, готовые для повторной попытки.
     * Учитывает exponential backoff.
     *
     * @param limit максимальное количество событий
     * @return список событий для retry
     */
    List<OutboxEvent> findForRetry(int limit);

    /**
     * Отметить событие как опубликованное.
     *
     * @param eventId ID события
     * @return true если обновлено, false если не найдено
     */
    boolean markAsPublished(UUID eventId);

    /**
     * Отметить пакет событий как опубликованных.
     *
     * @param eventIds список ID событий
     * @return количество обновленных событий
     */
    int markAsPublishedBatch(List<UUID> eventIds);

    /**
     * Записать неудачную попытку публикации.
     *
     * @param eventId ID события
     * @param error текст ошибки
     * @return true если обновлено
     */
    boolean recordFailure(UUID eventId, String error);

    /**
     * Найти события по агрегату.
     *
     * @param aggregateId ID агрегата
     * @param aggregateType тип агрегата
     * @return список событий для агрегата
     */
    List<OutboxEvent> findByAggregate(UUID aggregateId, String aggregateType);

    /**
     * Удалить старые опубликованные события.
     * Для очистки таблицы от устаревших данных.
     *
     * @param publishedBefore опубликованные до этой даты
     * @return количество удаленных событий
     */
    int deleteOldPublished(LocalDateTime publishedBefore);

    /**
     * Получить статистику по outbox.
     *
     * @return статистика событий
     */
    OutboxStatistics getStatistics();

    /**
     * Статистика Outbox событий.
     */
    record OutboxStatistics(
            long totalEvents,
            long unpublished,
            long published,
            long failed,
            long retrying,
            double averageRetryCount,
            LocalDateTime oldestUnpublished
    ) {}
}
