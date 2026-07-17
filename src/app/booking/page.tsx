import { pricingService, operatingHoursService, settingsService } from "@/lib/db-service";
import BookingFormClient from "@/components/booking-form-client";

export const revalidate = 0; // Fetch fresh data on load

export default async function BookingPage() {
  const pricing = await pricingService.findMany();
  const operatingHours = await operatingHoursService.findMany();
  const settings = await settingsService.findUnique();

  return (
    <div className="py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-3">RESERVATIONS</h1>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">Book Your Session</h2>
          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
            Choose your date, time, and package below. All bookings follow Jakarta time (WIB) and are confirmed instantly.
          </p>
        </div>

        {/* Booking Wizard */}
        <BookingFormClient pricing={pricing} operatingHours={operatingHours} settings={settings} />
      </div>
    </div>
  );
}
