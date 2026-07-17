import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { bookingService } from "@/lib/db-service";

export async function PUT(
  req: Request,
  { params }: { params: any }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const existingBooking = await bookingService.findById(id);

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { role, id: currentUserId } = session.user as any;
    const isAdmin = role === "ADMIN";
    const isOwner = existingBooking.userId === currentUserId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized to update this booking" }, { status: 403 });
    }

    const updateData: any = {};

    if (isAdmin) {
      if (body.status) updateData.status = body.status;
      if (body.customerName) updateData.customerName = body.customerName;
      if (body.customerEmail) updateData.customerEmail = body.customerEmail;
      if (body.customerPhone) updateData.customerPhone = body.customerPhone;
      if (body.notes !== undefined) updateData.notes = body.notes;
      if (body.date) updateData.date = new Date(body.date);
      if (body.startTime) updateData.startTime = body.startTime;
      if (body.endTime) updateData.endTime = body.endTime;
      if (body.duration) updateData.duration = body.duration;
      if (body.price !== undefined) updateData.price = body.price;
    } else {
      if (body.status === "CANCELLED") {
        updateData.status = "CANCELLED";
      } else {
        return NextResponse.json({ error: "Customers can only cancel bookings" }, { status: 403 });
      }
    }

    const updatedBooking = await bookingService.update(id, updateData);
    return NextResponse.json(updatedBooking);

  } catch (error: any) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    await bookingService.delete(id);
    return NextResponse.json({ message: "Booking deleted successfully" });

  } catch (error: any) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
