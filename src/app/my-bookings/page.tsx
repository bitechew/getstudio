import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { bookingService } from "@/lib/db-service";
import MyBookingsClient from "@/components/my-bookings-client";

export const revalidate = 0; // Fetch fresh data on load

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/my-bookings");
  }

  const { id: userId } = session.user as any;
  const bookings = await bookingService.findByUserId(userId);

  // Serialize dates for safety when passing to Client Component
  const serializedBookings = bookings.map((b: any) => ({
    ...b,
    date: new Date(b.date).toISOString(),
    createdAt: new Date(b.createdAt).toISOString(),
    updatedAt: new Date(b.updatedAt).toISOString(),
  }));

  return (
    <div className="py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-6 border-b border-neutral-100 dark:border-neutral-850">
          <div>
            <h1 className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-3">PORTAL</h1>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">My Reservations</h2>
            <p className="text-sm font-light text-neutral-500 dark:text-neutral-450 mt-2">
              View your booking history, status updates, or cancel scheduled sessions.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-full text-xs font-light text-neutral-500 dark:text-neutral-400">
            Logged in as: <strong className="text-neutral-900 dark:text-white font-medium">{session.user.name}</strong>
          </div>
        </div>

        {/* Client Interactive Bookings List */}
        <MyBookingsClient initialBookings={serializedBookings} />

      </div>
    </div>
  );
}
