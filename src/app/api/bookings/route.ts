import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { bookingService, pricingService, operatingHoursService } from "@/lib/db-service";
import { calculateEndTime, checkOverlap, isTimeSlotPast, timeToMinutes, toLocalDateString } from "@/lib/booking-utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    // 1. Public route to check occupied slots for a given date
    if (dateParam) {
      const allBookings = await bookingService.findMany();
      const targetDate = new Date(`${dateParam}T00:00:00`);
      const targetDateStr = toLocalDateString(targetDate);

      const filteredBookings = allBookings
        .filter((b: any) => {
          // Compare dates in a timezone-neutral way.
          // booking.date is stored as a Date; format both as YYYY-MM-DD in local time
          // (the client sends date in YYYY-MM-DD using local WIB).
          const bookingDateStr = toLocalDateString(new Date(b.date));
          return bookingDateStr === targetDateStr && b.status !== "CANCELLED";
        })
        .map((b: any) => ({
          id: b.id,
          startTime: b.startTime,
          endTime: b.endTime,
          duration: b.duration,
          status: b.status,
        }));

      return NextResponse.json(filteredBookings);
    }

    // 2. Private booking retrieval (requires login)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, id: currentUserId } = session.user as any;

    if (role === "ADMIN") {
      const bookings = await bookingService.findMany();
      return NextResponse.json(bookings);
    } else {
      const bookings = await bookingService.findByUserId(currentUserId);
      return NextResponse.json(bookings);
    }
  } catch (error: any) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      notes,
      date,
      startTime,
      duration,
    } = body;

    // Validate inputs
    if (!customerName || !customerEmail || !customerPhone || !date || !startTime || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate past dates and times
    const bookingDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    const bookingDateStr = toLocalDateString(bookingDate);
    const todayStr = toLocalDateString(today);

    if (bookingDateStr < todayStr) {
      return NextResponse.json({ error: "Cannot book slots in the past" }, { status: 400 });
    }

    if (bookingDateStr === todayStr && isTimeSlotPast(bookingDate, startTime, today)) {
      return NextResponse.json({ error: "Cannot book a time that has already passed" }, { status: 400 });
    }

    // Calculate End Time
    const endTime = calculateEndTime(startTime, duration);
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);

    // Validate against Operating Hours
    const dayOfWeek = bookingDate.getDay();
    const allOpHours = await operatingHoursService.findMany();
    const dayOpHours = allOpHours.find((h: any) => h.dayOfWeek === dayOfWeek);

    if (!dayOpHours || !dayOpHours.isOpen) {
      return NextResponse.json({ error: "Studio is closed on this day" }, { status: 400 });
    }

    const opOpenMin = timeToMinutes(dayOpHours.openTime);
    const opCloseMin = timeToMinutes(dayOpHours.closeTime);

    if (startMin < opOpenMin || endMin > opCloseMin) {
      return NextResponse.json({
        error: `Booking must be within operating hours (${dayOpHours.openTime} to ${dayOpHours.closeTime})`
      }, { status: 400 });
    }

    // Double booking check (overlapping slots validation)
    const allBookings = await bookingService.findMany();
    const dateBookings = allBookings.filter(
      (b: any) => new Date(b.date).toISOString().split("T")[0] === bookingDateStr
    );

    const hasOverlap = checkOverlap(startTime, endTime, dateBookings);
    if (hasOverlap) {
      return NextResponse.json({ error: "Selected time slot overlaps with an existing booking" }, { status: 400 });
    }

    // Price calculation
    const pricingOptions = await pricingService.findMany();
    const priceOption = pricingOptions.find((p: any) => p.duration === duration);
    if (!priceOption) {
      return NextResponse.json({ error: "Invalid booking duration selected" }, { status: 400 });
    }
    const price = priceOption.price;

    // Create booking record
    const booking = await bookingService.create({
      userId: session ? (session.user as any).id : null,
      customerName,
      customerEmail,
      customerPhone,
      notes: notes || "",
      date: bookingDate,
      startTime,
      endTime,
      duration,
      price,
      status: "PENDING",
    });

    const referenceNumber = booking.id.toUpperCase();
    console.log(`
      📧 =======================================================
      EMAILING CONFIRMATION TO: ${customerEmail}
      SUBJECT: Booking Confirmation - Ref: ${referenceNumber}
      -------------------------------------------------------
      Dear ${customerName},

      Your photo studio session has been booked.

      Booking Details:
      - Reference Number: ${referenceNumber}
      - Date: ${bookingDateStr}
      - Time: ${startTime} - ${endTime} (${duration})
      - Price: Rp ${price.toLocaleString("id-ID")}
      - Status: Pending Approval

      Cancellation Information:
      If you need to cancel or change your booking, please log in to your account
      or contact us at hello@getstudio.id at least 24 hours in advance.

      Thank you for choosing GET STUDIO!
      =======================================================
    `);

    return NextResponse.json({
      message: "Booking created successfully",
      booking,
      referenceNumber,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
