import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

// Define TypeScript interfaces for our entities
export interface User {
  id: string;
  name: string | null;
  email: string;
  password?: string;
  role: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  date: string; // ISO string
  startTime: string;
  endTime: string;
  duration: string;
  status: string; // PENDING, CONFIRMED, CANCELLED, COMPLETED
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pricing {
  id: string;
  duration: string;
  price: number;
  label: string;
  description: string | null;
}

export interface Gallery {
  id: string;
  url: string;
  title: string | null;
  category: string | null;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  avatar: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Settings {
  id: string;
  studioName: string;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  email: string;
  hourlyRate: number;
}

export interface OperatingHours {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface FallbackDatabase {
  users: User[];
  bookings: Booking[];
  pricing: Pricing[];
  gallery: Gallery[];
  testimonials: Testimonial[];
  settings: Settings;
  operatingHours: OperatingHours[];
}

const FALLBACK_FILE_PATH = path.join(process.cwd(), "src", "data", "db-fallback.json");

// Read from JSON file
export function readFallbackDb(): FallbackDatabase {
  if (!fs.existsSync(FALLBACK_FILE_PATH)) {
    return initFallbackDb();
  }
  try {
    const data = fs.readFileSync(FALLBACK_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading fallback database:", error);
    return initFallbackDb();
  }
}

// Write to JSON file
export function writeFallbackDb(data: FallbackDatabase): void {
  try {
    const dir = path.dirname(FALLBACK_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing fallback database:", error);
  }
}

// Initialize and seed fallback DB if not present
function initFallbackDb(): FallbackDatabase {
  const adminPassword = bcrypt.hashSync("Admin123!", 10);
  const customerPassword = bcrypt.hashSync("Customer123!", 10);

  const initialData: FallbackDatabase = {
    users: [
      {
        id: "admin-user-id",
        name: "Admin User",
        email: "admin@studio.com",
        password: adminPassword,
        role: "ADMIN",
        phone: "+1 555-0100",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "customer-user-id",
        name: "Jane Doe",
        email: "customer@studio.com",
        password: customerPassword,
        role: "CUSTOMER",
        phone: "+1 555-0200",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    bookings: [
      {
        id: "booking-1",
        userId: "customer-user-id",
        customerName: "Jane Doe",
        customerEmail: "customer@studio.com",
        customerPhone: "+1 555-0200",
        notes: "Need a white paper backdrop setup.",
        date: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
        startTime: "13:00",
        endTime: "15:00",
        duration: "2 hours",
        status: "CONFIRMED",
        price: 60.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "booking-2",
        userId: null,
        customerName: "Alex Smith",
        customerEmail: "alex@example.com",
        customerPhone: "+1 555-9876",
        notes: "Bringing a pet for portrait photos.",
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0] + "T00:00:00.000Z",
        startTime: "16:00",
        endTime: "17:00",
        duration: "1 hour",
        status: "PENDING",
        price: 30.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    pricing: [
      { id: "p-1", duration: "Lite", price: 39000, label: "Lite", description: "1 - 4 Person\n8 Minutes\nFree All Soft File" },
      { id: "p-2", duration: "Twin", price: 49000, label: "Twin", description: "1 - 2 Person\n10 minutes\nFree All Soft File\n1 Printed 4R" },
      { id: "p-3", duration: "Squad", price: 89000, label: "Squad", description: "1 - 4 Person\n15 minutes\nFree All Soft File\n1 Printed 4R" },
      { id: "p-4", duration: "Family", price: 119000, label: "Family", description: "1 - 6 Person\n20 minutes\nFree All Soft File\n2 Printed 4R" },
      { id: "p-5", duration: "Crew", price: 179000, label: "Crew", description: "1 - 10 Person\n25 minutes\nFree All Soft File\n4 Printed 4R" },
      { id: "p-6", duration: "Party", price: 229000, label: "Party", description: "1 - 10 Person\n45 minutes\nFree All Soft File\n6 Printed 4R" },
    ],
    gallery: [
      { id: "g-1", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800", title: "Professional Studio Setup", category: "Studio", createdAt: new Date().toISOString() },
      { id: "g-2", url: "https://images.unsplash.com/photo-1616448242650-7140735e3648?q=80&w=800", title: "Natural Light Studio Space", category: "Studio", createdAt: new Date().toISOString() },
      { id: "g-3", url: "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=800", title: "Editorial Portrait", category: "Portrait", createdAt: new Date().toISOString() },
      { id: "g-4", url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800", title: "High-Fashion Shoot", category: "Fashion", createdAt: new Date().toISOString() },
      { id: "g-5", url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800", title: "Creative Lighting Portrait", category: "Portrait", createdAt: new Date().toISOString() },
      { id: "g-6", url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800", title: "Product Commercial Photography", category: "Product", createdAt: new Date().toISOString() },
    ],
    testimonials: [
      {
        id: "t-1",
        name: "Sophia Martinez",
        role: "Fashion Photographer",
        comment: "GET STUDIO is my go-to creative space. The setup is clean, the booking flow is easy, and the photo booth experience feels polished and fun!",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
        createdAt: new Date().toISOString(),
      },
      {
        id: "t-2",
        name: "Marcus Vance",
        role: "Creative Director",
        comment: "We booked the full-day session for our brand's winter campaign. The staff was super helpful, setting up the custom color backdrops before we even arrived. 10/10 service.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
        createdAt: new Date().toISOString(),
      },
      {
        id: "t-3",
        name: "Emily Chen",
        role: "Portrait Client",
        comment: "Clean, elegant, and professional. The booking system was very straightforward, and I loved being able to see live availability. My family portraits came out beautiful.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
      id: "default",
      studioName: "GET STUDIO",
      address: "Jakarta, Indonesia",
      phone: "+62 812-3456-7890",
      whatsapp: "+62 812-3456-7890",
      instagram: "@getstudio",
      email: "hello@getstudio.id",
      hourlyRate: 39000,
    },
    operatingHours: [
      { id: "h-0", dayOfWeek: 0, openTime: "10:00", closeTime: "22:00", isOpen: true },
      { id: "h-1", dayOfWeek: 1, openTime: "10:00", closeTime: "22:00", isOpen: true },
      { id: "h-2", dayOfWeek: 2, openTime: "10:00", closeTime: "22:00", isOpen: true },
      { id: "h-3", dayOfWeek: 3, openTime: "10:00", closeTime: "22:00", isOpen: true },
      { id: "h-4", dayOfWeek: 4, openTime: "10:00", closeTime: "22:00", isOpen: true },
      { id: "h-5", dayOfWeek: 5, openTime: "10:00", closeTime: "22:00", isOpen: true },
      { id: "h-6", dayOfWeek: 6, openTime: "10:00", closeTime: "22:00", isOpen: true },
    ],
  };

  writeFallbackDb(initialData);
  return initialData;
}
