package qodo.ru.servicebooking.domain.exception;

import java.util.UUID;

public class SlotAlreadyBookedException extends BookingDomainException {
    private final UUID slotId;
    private final UUID existingBookingId;

    public SlotAlreadyBookedException(UUID slotId, UUID existingBookingId) {
        super(
                String.format("Slot %s is already booked by booking %s", slotId, existingBookingId),
                "SLOT_ALREADY_BOOKED"
        );
        this.slotId = slotId;
        this.existingBookingId = existingBookingId;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public UUID getExistingBookingId() {
        return existingBookingId;
    }
}
