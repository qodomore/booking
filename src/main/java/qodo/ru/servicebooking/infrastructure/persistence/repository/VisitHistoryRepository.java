package qodo.ru.servicebooking.infrastructure.persistence.repository;

import qodo.ru.servicebooking.domain.entity.VisitHistory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VisitHistoryRepository {

    /**
     * Сохранить историю визита.
     */
    VisitHistory save(VisitHistory visitHistory);

    /**
     * Найти историю по ID бронирования.
     */
    Optional<VisitHistory> findByBookingId(UUID bookingId);

    /**
     * Найти истории с высокими оценками для отзывов.
     */
    List<VisitHistory> findTopRated(int minRating, int limit);

    /**
     * Обновить отзыв клиента.
     */
    boolean updateReview(UUID bookingId, int rating, String review);

    /**
     * Найти истории для портфолио мастера.
     */
    List<VisitHistory> findForPortfolio(UUID accountId, int limit);
}
