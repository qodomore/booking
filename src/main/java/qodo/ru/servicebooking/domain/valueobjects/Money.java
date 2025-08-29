package qodo.ru.servicebooking.domain.valueobjects;

import lombok.Value;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;

/**
 * Value Object для денежных сумм.
 *
 * Иммутабельный объект, инкапсулирующий денежную сумму и валюту.
 * Обеспечивает корректные операции с деньгами.
 */
@Value
public class Money {
    BigDecimal amount;
    Currency currency;

    /**
     * Создает Money из суммы и кода валюты.
     */
    public static Money of(BigDecimal amount, String currencyCode) {
        return new Money(
                amount.setScale(2, RoundingMode.HALF_UP),
                Currency.getInstance(currencyCode)
        );
    }

    /**
     * Создает Money в рублях.
     */
    public static Money rubles(BigDecimal amount) {
        return of(amount, "RUB");
    }

    /**
     * Создает Money в рублях из double.
     */
    public static Money rubles(double amount) {
        return rubles(BigDecimal.valueOf(amount));
    }

    /**
     * Складывает две суммы.
     * @throws IllegalArgumentException если валюты разные
     */
    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Cannot add money with different currencies");
        }
        return new Money(amount.add(other.amount), currency);
    }

    /**
     * Вычитает сумму.
     * @throws IllegalArgumentException если валюты разные
     */
    public Money subtract(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Cannot subtract money with different currencies");
        }
        return new Money(amount.subtract(other.amount), currency);
    }

    /**
     * Умножает на коэффициент.
     */
    public Money multiply(BigDecimal factor) {
        return new Money(
                amount.multiply(factor).setScale(2, RoundingMode.HALF_UP),
                currency
        );
    }

    /**
     * Проверяет, положительная ли сумма.
     */
    public boolean isPositive() {
        return amount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Проверяет, отрицательная ли сумма.
     */
    public boolean isNegative() {
        return amount.compareTo(BigDecimal.ZERO) < 0;
    }

    /**
     * Проверяет, нулевая ли сумма.
     */
    public boolean isZero() {
        return amount.compareTo(BigDecimal.ZERO) == 0;
    }

    @Override
    public String toString() {
        return amount + " " + currency.getCurrencyCode();
    }
}
