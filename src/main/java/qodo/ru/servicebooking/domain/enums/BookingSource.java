package qodo.ru.servicebooking.domain.enums;

public enum BookingSource {

    /**
     * Через Telegram бота - основной канал.
     */
    TELEGRAM("telegram"),

    /**
     * Через веб-интерфейс.
     */
    WEB("web"),

    /**
     * Через API интеграцию.
     */
    API("api"),

    /**
     * Создано администратором вручную.
     */
    ADMIN("admin"),

    /**
     * Импортировано из внешней системы.
     */
    IMPORT("import");

    private final String value;

    BookingSource(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static BookingSource fromValue(String value) {
        for (BookingSource source : BookingSource.values()) {
            if (source.value.equalsIgnoreCase(value)) {
                return source;
            }
        }
        // Default для неизвестных источников
        return API;
    }

    /**
     * Проверяет, является ли источник автоматическим.
     */
    public boolean isAutomated() {
        return this == TELEGRAM || this == WEB || this == API;
    }

    /**
     * Проверяет, требуется ли дополнительная верификация.
     */
    public boolean requiresVerification() {
        return this == IMPORT || this == API;
    }
}
