package qodo.ru.servicebooking.domain.valueobjects;

import lombok.Value;

import java.util.regex.Pattern;

/**
 * Value Object для телефонного номера.
 *
 * Валидирует и нормализует телефонные номера.
 */
@Value
public class PhoneNumber {
    private static final Pattern RUSSIAN_PHONE = Pattern.compile("^\\+7\\d{10}$");
    private static final Pattern DIGITS_ONLY = Pattern.compile("\\D");

    String value;

    /**
     * Создает и валидирует телефонный номер.
     */
    public static PhoneNumber of(String phone) {
        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }

        String normalized = normalize(phone);
        if (!isValid(normalized)) {
            throw new IllegalArgumentException("Invalid phone number: " + phone);
        }

        return new PhoneNumber(normalized);
    }

    /**
     * Нормализует телефонный номер к формату +7XXXXXXXXXX.
     */
    private static String normalize(String phone) {
        // Удаляем все нецифровые символы
        String digits = DIGITS_ONLY.matcher(phone).replaceAll("");

        // Обрабатываем различные форматы российских номеров
        if (digits.startsWith("8") && digits.length() == 11) {
            digits = "7" + digits.substring(1);
        }

        if (digits.startsWith("7") && digits.length() == 11) {
            return "+" + digits;
        }

        if (digits.length() == 10) {
            return "+7" + digits;
        }

        return "+" + digits;
    }

    /**
     * Проверяет валидность номера.
     */
    private static boolean isValid(String phone) {
        return RUSSIAN_PHONE.matcher(phone).matches();
    }

    /**
     * Форматирует номер для отображения.
     */
    public String format() {
        // +7 (XXX) XXX-XX-XX
        return String.format("%s (%s) %s-%s-%s",
                value.substring(0, 2),
                value.substring(2, 5),
                value.substring(5, 8),
                value.substring(8, 10),
                value.substring(10, 12)
        );
    }

    /**
     * Маскирует номер для логов.
     */
    public String mask() {
        return value.substring(0, 5) + "****" + value.substring(9);
    }
}
