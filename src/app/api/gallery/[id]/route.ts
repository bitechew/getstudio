import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { galleryService } from "@/lib/db-service";

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
    await galleryService.delete(id);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
