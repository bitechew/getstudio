import { NextResponse } from "next/server";
import { testimonialService } from "@/lib/db-service";

export async function GET() {
  try {
    const testimonials = await testimonialService.findMany();
    return NextResponse.json(testimonials);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, role, comment, rating, avatar } = await req.json();

    if (!name || !comment) {
      return NextResponse.json({ error: "Name and comment are required" }, { status: 400 });
    }

    const testimonial = await testimonialService.create({
      name,
      role: role || "",
      comment,
      rating: Number(rating) || 5,
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150`,
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
