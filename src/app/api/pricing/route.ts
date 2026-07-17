import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { pricingService } from "@/lib/db-service";

export async function GET() {
  try {
    const pricing = await pricingService.findMany();
    return NextResponse.json(pricing);
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

    const { pricingOptions } = await req.json();

    if (!Array.isArray(pricingOptions)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const updatedOptions = [];
    for (const option of pricingOptions) {
      const updated = await pricingService.update(option.id, {
        price: Number(option.price),
        label: option.label,
        description: option.description,
      });
      updatedOptions.push(updated);
    }

    return NextResponse.json(updatedOptions);
  } catch (error: any) {
    console.error("Update pricing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
