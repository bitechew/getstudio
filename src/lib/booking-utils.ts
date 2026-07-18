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

  // Pricing.duration strings come from DB.
  // In your current seed/setup, duration options represent:
  // - "Lite" "Twin" "Squad" "Family" "Crew" "Party" (package names)
  // - "1 hour" (time length)
  // - (older versions may have used "2 hours" etc.)
  const normalized = duration.trim().toLowerCase();

  let durationMinutes = 60;

  // Explicit numeric durations first
  if (normalized === "1 hour") durationMinutes = 60;
  else if (normalized === "2 hours") durationMinutes = 120;
  else if (normalized === "3 hours") durationMinutes = 180;
  else if (normalized === "4 hours") durationMinutes = 240;
  else if (normalized === "half day") durationMinutes = 240;
  else if (normalized === "full day") durationMinutes = 480;
  else {
    // If duration is actually a package name, map to a sensible length.
    // Current UI uses pricing.duration from DB, so map the known packages.
    switch (normalized) {
      case "lite":
        durationMinutes = 60;
        break;
      case "twin":
        durationMinutes = 60;
        break;
      case "squad":
        durationMinutes = 60;
        break;
      case "family":
        durationMinutes = 60;
        break;
      case "crew":
        durationMinutes = 60;
        break;
      case "party":
        durationMinutes = 60;
        break;
      default:
        durationMinutes = 60;
        break;
    }
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
