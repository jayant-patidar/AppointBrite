/**
 * Date/time slot calculation helpers.
 */

/**
 * Generate time slots for a given business day.
 */
export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  durationMinutes: number,
  bufferMinutes: number = 0,
): Array<{ startTime: string; endTime: string }> {
  const slots: Array<{ startTime: string; endTime: string }> = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);
  
  let currentMinutes = openH * 60 + openM;
  const endMinutes = closeH * 60 + closeM;
  const slotLength = durationMinutes + bufferMinutes;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const startH = Math.floor(currentMinutes / 60);
    const startM = currentMinutes % 60;
    const endSlotMinutes = currentMinutes + durationMinutes;
    const endH = Math.floor(endSlotMinutes / 60);
    const endM = endSlotMinutes % 60;

    slots.push({
      startTime: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      endTime: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
    });

    currentMinutes += slotLength;
  }

  return slots;
}
