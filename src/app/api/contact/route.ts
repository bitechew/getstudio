import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();
    const normalizedMessage = String(message).trim();

    console.log(`\n📬 Contact Inquiry Received\nName: ${normalizedName}\nEmail: ${normalizedEmail}\nMessage: ${normalizedMessage}\n`);

    return NextResponse.json({
      message: "Your inquiry has been received. We will contact you shortly.",
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
