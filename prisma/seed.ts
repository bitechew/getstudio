import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Clean existing data to prevent duplicate key errors during reseeding
  await prisma.booking.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.pricing.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.settings.deleteMany({});
  await prisma.operatingHours.deleteMany({});

  // Hash passwords
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const customerPassword = await bcrypt.hash("Customer123!", 10);

  // 1. Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@studio.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      phone: "+1 555-0100",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@studio.com",
      name: "Jane Doe",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+1 555-0200",
    },
  });

  console.log("Seeded Users:", { admin: admin.email, customer: customer.email });

  // 2. Settings
  await prisma.settings.create({
    data: {
      id: "default",
      studioName: "GET STUDIO",
      address: "Jakarta, Indonesia",
      phone: "+62 812-3456-7890",
      whatsapp: "+62 812-3456-7890",
      instagram: "@getstudio",
      email: "hello@getstudio.id",
      hourlyRate: 39000,
    },
  });
  console.log("Seeded Settings");

  // 3. Pricing
  const pricingData = [
    { duration: "Lite", price: 39000, label: "Lite", description: "1 - 4 Person\n8 Minutes\nFree All Soft File" },
    { duration: "Twin", price: 49000, label: "Twin", description: "1 - 2 Person\n10 minutes\nFree All Soft File\n1 Printed 4R" },
    { duration: "Squad", price: 89000, label: "Squad", description: "1 - 4 Person\n15 minutes\nFree All Soft File\n1 Printed 4R" },
    { duration: "Family", price: 119000, label: "Family", description: "1 - 6 Person\n20 minutes\nFree All Soft File\n2 Printed 4R" },
    { duration: "Crew", price: 179000, label: "Crew", description: "1 - 10 Person\n25 minutes\nFree All Soft File\n4 Printed 4R" },
    { duration: "Party", price: 229000, label: "Party", description: "1 - 10 Person\n45 minutes\nFree All Soft File\n6 Printed 4R" },
  ];

  for (const p of pricingData) {
    await prisma.pricing.create({ data: p });
  }
  console.log("Seeded Pricing options");

  // 4. Operating Hours
  const days = [
    { dayOfWeek: 0, openTime: "10:00", closeTime: "22:00", isOpen: true },
    { dayOfWeek: 1, openTime: "10:00", closeTime: "22:00", isOpen: true },
    { dayOfWeek: 2, openTime: "10:00", closeTime: "22:00", isOpen: true },
    { dayOfWeek: 3, openTime: "10:00", closeTime: "22:00", isOpen: true },
    { dayOfWeek: 4, openTime: "10:00", closeTime: "22:00", isOpen: true },
    { dayOfWeek: 5, openTime: "10:00", closeTime: "22:00", isOpen: true },
    { dayOfWeek: 6, openTime: "10:00", closeTime: "22:00", isOpen: true },
  ];

  for (const d of days) {
    await prisma.operatingHours.create({ data: d });
  }
  console.log("Seeded Operating Hours");

  // 5. Testimonials
  const testimonials = [
    {
      name: "Sophia Martinez",
      role: "Fashion Photographer",
      comment: "Aura Studio is my go-to creative space. The natural light from the south-facing windows is incredible, and the equipment provided is top-tier. Booking is seamless!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
    },
    {
      name: "Marcus Vance",
      role: "Creative Director",
      comment: "We booked the full-day session for our brand's winter campaign. The staff was super helpful, setting up the custom color backdrops before we even arrived. 10/10 service.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    },
    {
      name: "Emily Chen",
      role: "Portrait Client",
      comment: "Clean, elegant, and professional. The booking system was very straightforward, and I loved being able to see live availability. My family portraits came out beautiful.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("Seeded Testimonials");

  // 6. Gallery
  const galleryItems = [
    { url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800", title: "Professional Studio Setup", category: "Studio" },
    { url: "https://images.unsplash.com/photo-1616448242650-7140735e3648?q=80&w=800", title: "Natural Light Studio Space", category: "Studio" },
    { url: "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=800", title: "Editorial Portrait", category: "Portrait" },
    { url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800", title: "High-Fashion Shoot", category: "Fashion" },
    { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800", title: "Creative Lighting Portrait", category: "Portrait" },
    { url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800", title: "Product Commercial Photography", category: "Product" },
  ];

  for (const g of galleryItems) {
    await prisma.gallery.create({ data: g });
  }
  console.log("Seeded Gallery Items");

  // 7. Seed some demo bookings
  const todayStr = new Date().toISOString().split("T")[0];
  const today = new Date(todayStr);

  await prisma.booking.create({
    data: {
      userId: customer.id,
      customerName: "Jane Doe",
      customerEmail: "customer@studio.com",
      customerPhone: "+1 555-0200",
      date: today,
      startTime: "13:00",
      endTime: "15:00",
      duration: "2 hours",
      price: 49000,
      status: "CONFIRMED",
      notes: "Need a white paper backdrop setup.",
    }
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const tomorrowDate = new Date(tomorrowStr);

  await prisma.booking.create({
    data: {
      customerName: "Alex Smith",
      customerEmail: "alex@example.com",
      customerPhone: "+1 555-9876",
      date: tomorrowDate,
      startTime: "16:00",
      endTime: "17:00",
      duration: "1 hour",
      price: 39000,
      status: "PENDING",
      notes: "Bringing a pet for portrait photos.",
    }
  });

  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
