package qodo.ru.servicebooking.infrastructure.persistence.repository;

import qodo.ru.servicebooking.domain.entity.DistributedLock;

import java.util.Optional;

public interface DistributedLockRepository {

    /**
     * Попытаться получить блокировку.
     *
     * @param lockKey ключ блокировки
     * @param ownerId идентификатор владельца
     * @param ttlSeconds время жизни в секундах
     * @return true если блокировка получена
     */
    boolean tryAcquire(String lockKey, String ownerId, int ttlSeconds);

    /**
     * Освободить блокировку.
     *
     * @param lockKey ключ блокировки
     * @param ownerId идентификатор владельца
     * @return true если блокировка освобождена
     */
    boolean release(String lockKey, String ownerId);

    /**
     * Продлить блокировку.
     *
     * @param lockKey ключ блокировки
     * @param ownerId идентификатор владельца
     * @param ttlSeconds новое время жизни
     * @return true если продлено успешно
     */
    boolean extend(String lockKey, String ownerId, int ttlSeconds);

    /**
     * Найти активную блокировку.
     *
     * @param lockKey ключ блокировки
     * @return Optional с блокировкой
     */
    Optional<DistributedLock> findActiveLock(String lockKey);

    /**
     * Удалить истекшие блокировки.
     *
     * @return количество удаленных блокировок
     */
    int cleanupExpired();
}
