package qodo.ru.servicebooking.domain.exception;

public class BusinessRuleViolationException extends BookingDomainException {
    private final String rule;

    public BusinessRuleViolationException(String rule, String message) {
        super(message, "BUSINESS_RULE_VIOLATION");
        this.rule = rule;
    }

    public String getRule() {
        return rule;
    }
}
