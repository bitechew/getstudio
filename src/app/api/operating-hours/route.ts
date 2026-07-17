import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { operatingHoursService } from "@/lib/db-service";

export async function GET() {
  try {
    const hours = await operatingHoursService.findMany();
    return NextResponse.json(hours);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hours } = await req.json();
    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const updatedHours = [];
    for (const h of hours) {
      const updated = await operatingHoursService.update(h.id, {
        openTime: h.openTime,
        closeTime: h.closeTime,
        isOpen: h.isOpen,
      });
      updatedHours.push(updated);
    }

    return NextResponse.json(updatedHours);
  } catch (error: any) {
    console.error("Update operating hours error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
