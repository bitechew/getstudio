export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isTimeSlotPast(date: Date, timeStr: string, currentTime: Date = new Date()): boolean {
  const selectedDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());

  if (selectedDay.getTime() < todayDay.getTime()) return true;
  if (selectedDay.getTime() > todayDay.getTime()) return false;

  const [hour, minute] = timeStr.split(":").map(Number);
  const slotTime = new Date(currentTime);
  slotTime.setHours(hour, minute, 0, 0);

  return slotTime.getTime() < currentTime.getTime();
}

// Convert HH:MM time string to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to HH:MM time string
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Calculate End Time based on Start Time and Package
export function calculateEndTime(startTime: string, duration: string): string {
  const startMin = timeToMinutes(startTime);
  let durationMinutes = 60;

  switch (duration.toLowerCase()) {
    case "lite":
    case "twin":
    case "squad":
    case "family":
    case "crew":
    case "party":
    case "1 hour":
    case "2 hours":
    case "3 hours":
    case "4 hours":
    case "half day":
    case "full day":
    default:
      durationMinutes = 60;
      break;
  }

  const endMin = startMin + durationMinutes;
  return minutesToTime(endMin);
}

// Check if booking overlaps with any existing booking
export function checkOverlap(
  newStart: string,
  newEnd: string,
  existingBookings: { startTime: string; endTime: string; status: string }[]
): boolean {
  const newStartMin = timeToMinutes(newStart);
  const newEndMin = timeToMinutes(newEnd);

  for (const booking of existingBookings) {
    if (booking.status === "CANCELLED") continue;

    const existStartMin = timeToMinutes(booking.startTime);
    const existEndMin = timeToMinutes(booking.endTime);

    // Overlap condition
    if (newStartMin < existEndMin && newEndMin > existStartMin) {
      return true;
    }
  }

  return false;
}
