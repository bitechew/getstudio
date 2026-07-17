import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  bookingService,
  pricingService,
  settingsService,
  operatingHoursService,
  galleryService,
  testimonialService,
} from "@/lib/db-service";
import DashboardClient from "@/components/dashboard-client";

export const revalidate = 0; // Fetch fresh data on load

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const { role } = session.user as any;
  if (role !== "ADMIN") {
    redirect("/my-bookings");
  }

  // Load all admin datasets from fallback / postgres database
  const bookings = await bookingService.findMany();
  const pricing = await pricingService.findMany();
  const settings = await settingsService.findUnique();
  const operatingHours = await operatingHoursService.findMany();
  const gallery = await galleryService.findMany();
  const testimonials = await testimonialService.findMany();

  // Date serialization
  const serializedBookings = bookings.map((b: any) => ({
    ...b,
    date: new Date(b.date).toISOString(),
    createdAt: new Date(b.createdAt).toISOString(),
    updatedAt: new Date(b.updatedAt).toISOString(),
  }));

  return (
    <div className="py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-6 border-b border-neutral-100 dark:border-neutral-850">
          <div>
            <h1 className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-3">ADMIN PORTAL</h1>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">Studio Dashboard</h2>
            <p className="text-sm font-light text-neutral-500 dark:text-neutral-450 mt-2">
              Manage booking requests, pricing packages, studio schedules, settings, and the gallery.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-full text-xs font-semibold tracking-wider shadow-sm">
            ADMINISTRATOR MODE
          </div>
        </div>

        {/* Dashboard Client */}
        <DashboardClient
          bookings={serializedBookings}
          pricing={pricing}
          settings={settings}
          operatingHours={operatingHours}
          gallery={gallery}
          testimonials={testimonials}
        />

      </div>
    </div>
  );
}
