package qodo.ru.servicebooking.infrastructure.persistence.repository;

import qodo.ru.servicebooking.domain.entity.Booking;
import qodo.ru.servicebooking.domain.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository {


    // ============= Основные операции CRUD =============

    /**
     * Сохранить новое бронирование.
     *
     * @param booking бронирование для сохранения
     * @return сохраненное бронирование с заполненным ID
     */
    Booking save(Booking booking);

    /**
     * Обновить существующее бронирование.
     * Использует оптимистичную блокировку через version.
     *
     * @param booking бронирование для обновления
     * @return обновленное бронирование
     * @throws OptimisticLockException если версия устарела
     */
    Booking update(Booking booking);

    /**
     * Найти бронирование по ID.
     *
     * @param id идентификатор бронирования
     * @return Optional с бронированием или empty
     */
    Optional<Booking> findById(UUID id);

    /**
     * Найти бронирование по ID с пессимистичной блокировкой.
     * Использует SELECT ... FOR UPDATE.
     *
     * @param id идентификатор бронирования
     * @return Optional с заблокированным бронированием
     */
    Optional<Booking> findByIdForUpdate(UUID id);

    /**
     * Удалить бронирование (soft delete - меняет статус).
     *
     * @param id идентификатор бронирования
     * @return true если удалено, false если не найдено
     */
    boolean deleteById(UUID id);

    // ============= Поиск по бизнес-критериям =============

    /**
     * Найти бронирование по ключу идемпотентности.
     * Критично для защиты от дублирования.
     *
     * @param idempotencyKey ключ идемпотентности
     * @return Optional с бронированием
     */
    Optional<Booking> findByIdempotencyKey(String idempotencyKey);

    /**
     * Проверить существование активного бронирования на слот.
     * Используется для предотвращения двойных бронирований.
     *
     * @param slotId идентификатор слота
     * @return true если слот занят
     */
    boolean existsActiveBookingForSlot(UUID slotId);

    /**
     * Найти активное бронирование для слота.
     *
     * @param slotId идентификатор слота
     * @return Optional с активным бронированием
     */
    Optional<Booking> findActiveBookingBySlot(UUID slotId);

    /**
     * Найти все бронирования клиента.
     *
     * @param clientUserId ID клиента
     * @param limit максимальное количество записей
     * @param offset смещение для пагинации
     * @return список бронирований
     */
    List<Booking> findByClientUserId(UUID clientUserId, int limit, int offset);

    /**
     * Найти бронирования мастера на дату.
     *
     * @param accountId ID мастера
     * @param date дата (учитывается только день)
     * @return список бронирований на указанную дату
     */
    List<Booking> findByAccountIdAndDate(UUID accountId, LocalDateTime date);

    /**
     * Найти бронирования мастера в диапазоне времени.
     *
     * @param accountId ID мастера
     * @param from начало периода
     * @param to конец периода
     * @return список бронирований в периоде
     */
    List<Booking> findByAccountIdBetween(UUID accountId, LocalDateTime from, LocalDateTime to);

    // ============= Поиск по статусам =============

    /**
     * Найти бронирования по статусу.
     *
     * @param status статус бронирования
     * @param limit максимальное количество
     * @return список бронирований
     */
    List<Booking> findByStatus(BookingStatus status, int limit);

    /**
     * Найти бронирования, требующие подтверждения.
     * Ищет записи в статусе CREATED старше указанного времени.
     *
     * @param createdBefore созданные до этого времени
     * @param limit максимальное количество
     * @return список бронирований для подтверждения
     */
    List<Booking> findPendingConfirmation(LocalDateTime createdBefore, int limit);

    /**
     * Найти бронирования для напоминаний.
     * Ищет подтвержденные записи на ближайшее время.
     *
     * @param scheduledBetween диапазон времени визита
     * @return список бронирований для напоминаний
     */
    List<Booking> findForReminders(LocalDateTime from, LocalDateTime to);

    /**
     * Найти просроченные неподтвержденные бронирования.
     * Для автоматической отмены.
     *
     * @param expiryTime время истечения
     * @return список просроченных бронирований
     */
    List<Booking> findExpiredUnconfirmed(LocalDateTime expiryTime);

    // ============= Массовые операции =============

    /**
     * Массовое обновление статуса.
     * Например, для отмены всех записей мастера.
     *
     * @param bookingIds список ID бронирований
     * @param newStatus новый статус
     * @return количество обновленных записей
     */
    int updateStatusBatch(List<UUID> bookingIds, BookingStatus newStatus);

    /**
     * Отметить визиты как состоявшиеся.
     * Для записей, где прошло время визита.
     *
     * @param scheduledBefore время до которого был визит
     * @return количество обновленных записей
     */
    int markAsCompleted(LocalDateTime scheduledBefore);

    // ============= Статистика и аналитика =============

    /**
     * Подсчет бронирований мастера по статусам.
     *
     * @param accountId ID мастера
     * @param from начало периода
     * @param to конец периода
     * @return карта статус -> количество
     */
    Map<BookingStatus, Long> countByStatusForAccount(UUID accountId, LocalDateTime from, LocalDateTime to);

    /**
     * Получить общую статистику по бронированиям.
     *
     * @param from начало периода
     * @param to конец периода
     * @return статистика
     */
    BookingStatistics getStatistics(LocalDateTime from, LocalDateTime to);

    // ============= Вспомогательные классы =============

    /**
     * Статистика по бронированиям.
     */
    record BookingStatistics(
            long total,
            long confirmed,
            long cancelled,
            long completed,
            long noShow,
            BigDecimal totalRevenue,
            BigDecimal averagePrice
    ) {}

    /**
     * Исключение оптимистичной блокировки.
     */
    class OptimisticLockException extends RuntimeException {
        public OptimisticLockException(String message) {
            super(message);
        }
    }
}
