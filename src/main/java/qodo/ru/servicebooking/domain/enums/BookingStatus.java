package qodo.ru.servicebooking.domain.enums;

public enum BookingStatus {

    /**
     * Создано, ожидает подтверждения.
     * Начальный статус после создания записи.
     */
    CREATED("created"),

    /**
     * Подтверждено мастером или системой.
     * Клиент точно придет, слот заблокирован.
     */
    CONFIRMED("confirmed"),

    /**
     * Отменено клиентом или мастером.
     * Слот освобожден для других записей.
     */
    CANCELLED("cancelled"),

    /**
     * Визит состоялся.
     * Финальный успешный статус.
     */
    COMPLETED("completed"),

    /**
     * Клиент не пришел.
     * Финальный неуспешный статус для аналитики.
     */
    NO_SHOW("no_show");

    private final String value;

    BookingStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static BookingStatus fromValue(String value) {
        for (BookingStatus status : BookingStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown BookingStatus: " + value);
    }

    /**
     * Проверяет, можно ли перейти в указанный статус.
     */
    public boolean canTransitionTo(BookingStatus newStatus) {
        return switch (this) {
            case CREATED -> newStatus == CONFIRMED || newStatus == CANCELLED;
            case CONFIRMED -> newStatus == COMPLETED || newStatus == CANCELLED || newStatus == NO_SHOW;
            case CANCELLED, COMPLETED, NO_SHOW -> false; // Финальные статусы
        };
    }

    /**
     * Проверяет, является ли статус активным (занимает слот).
     */
    public boolean isActive() {
        return this == CREATED || this == CONFIRMED;
    }

    /**
     * Проверяет, является ли статус финальным.
     */
    public boolean isFinal() {
        return this == CANCELLED || this == COMPLETED || this == NO_SHOW;
    }
}
