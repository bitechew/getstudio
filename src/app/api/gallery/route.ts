import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { galleryService } from "@/lib/db-service";

export async function GET() {
  try {
    const images = await galleryService.findMany();
    return NextResponse.json(images);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, title, category } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const image = await galleryService.create({ url, title, category });
    return NextResponse.json(image, { status: 201 });
  } catch (error: any) {
    console.error("Create gallery item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
