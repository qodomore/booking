package qodo.ru.servicebooking.infrastructure.persistence.repository.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSON;
import org.jooq.Table;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import qodo.ru.servicebooking.domain.entity.DistributedLock;
import qodo.ru.servicebooking.infrastructure.persistence.repository.DistributedLockRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.jooq.TableOptions.table;
import static org.jooq.impl.DSL.field;


@Slf4j
@Repository
@RequiredArgsConstructor
public class DistributedLockRepositoryImpl implements DistributedLockRepository {

    private final DSLContext dsl;

    private static final Table<Record> DISTRIBUTED_LOCKS = table("distributed_locks");

    private static final Field<String> LOCK_KEY = field("lock_key", String.class);
    private static final Field<String> LOCKED_BY = field("locked_by", String.class);
    private static final Field<LocalDateTime> LOCKED_AT = field("locked_at", LocalDateTime.class);
    private static final Field<LocalDateTime> EXPIRES_AT = field("expires_at", LocalDateTime.class);
    private static final Field<JSON> METADATA = field("metadata", JSON.class);

    @Override
    @Transactional
    public boolean tryAcquire(String lockKey, String ownerId, int ttlSeconds) {
        log.debug("Trying to acquire lock: {} for owner: {}", lockKey, ownerId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusSeconds(ttlSeconds);

        // Сначала пытаемся удалить истекшие блокировки
        dsl.deleteFrom(DISTRIBUTED_LOCKS)
                .where(LOCK_KEY.eq(lockKey))
                .and(EXPIRES_AT.lt(now))
                .execute();

        // Пытаемся вставить новую блокировку
        try {
            int inserted = dsl.insertInto(DISTRIBUTED_LOCKS)
                    .set(LOCK_KEY, lockKey)
                    .set(LOCKED_BY, ownerId)
                    .set(LOCKED_AT, now)
                    .set(EXPIRES_AT, expiresAt)
                    .onConflict(LOCK_KEY)
                    .doNothing() // Если ключ существует, ничего не делаем
                    .execute();

            boolean acquired = inserted > 0;
            if (acquired) {
                log.info("Lock acquired: {} by {}", lockKey, ownerId);
            } else {
                log.debug("Lock already exists: {}", lockKey);
            }
            return acquired;

        } catch (Exception e) {
            log.warn("Failed to acquire lock: {}", lockKey, e);
            return false;
        }
    }

    @Override
    @Transactional
    public boolean release(String lockKey, String ownerId) {
        log.debug("Releasing lock: {} by owner: {}", lockKey, ownerId);

        int deleted = dsl.deleteFrom(DISTRIBUTED_LOCKS)
                .where(LOCK_KEY.eq(lockKey))
                .and(LOCKED_BY.eq(ownerId))
                .execute();

        boolean released = deleted > 0;
        if (released) {
            log.info("Lock released: {} by {}", lockKey, ownerId);
        } else {
            log.warn("Lock not found or not owned: {} by {}", lockKey, ownerId);
        }

        return released;
    }

    @Override
    @Transactional
    public boolean extend(String lockKey, String ownerId, int ttlSeconds) {
        log.debug("Extending lock: {} by owner: {} for {} seconds", lockKey, ownerId, ttlSeconds);

        LocalDateTime newExpiresAt = LocalDateTime.now().plusSeconds(ttlSeconds);

        int updated = dsl.update(DISTRIBUTED_LOCKS)
                .set(EXPIRES_AT, newExpiresAt)
                .where(LOCK_KEY.eq(lockKey))
                .and(LOCKED_BY.eq(ownerId))
                .and(EXPIRES_AT.gt(LocalDateTime.now())) // Только если еще не истекла
                .execute();

        boolean extended = updated > 0;
        if (extended) {
            log.info("Lock extended: {} until {}", lockKey, newExpiresAt);
        }

        return extended;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DistributedLock> findActiveLock(String lockKey) {
        log.debug("Finding active lock: {}", lockKey);

        Record record = dsl.selectFrom(DISTRIBUTED_LOCKS)
                .where(LOCK_KEY.eq(lockKey))
                .and(EXPIRES_AT.gt(LocalDateTime.now()))
                .fetchOne();

        return Optional.ofNullable(record).map(r ->
                DistributedLock.builder()
                        .lockKey(r.get(LOCK_KEY))
                        .lockedBy(r.get(LOCKED_BY))
                        .lockedAt(r.get(LOCKED_AT))
                        .expiresAt(r.get(EXPIRES_AT))
                        .build()
        );
    }

    @Override
    @Transactional
    public int cleanupExpired() {
        log.debug("Cleaning up expired locks");

        int deleted = dsl.deleteFrom(DISTRIBUTED_LOCKS)
                .where(EXPIRES_AT.lt(LocalDateTime.now()))
                .execute();

        if (deleted > 0) {
            log.info("Cleaned up {} expired locks", deleted);
        }

        return deleted;
    }
}
