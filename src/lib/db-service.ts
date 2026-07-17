import { prisma } from "./db";
import {
  readFallbackDb,
  writeFallbackDb,
  User as FallbackUser,
  Booking as FallbackBooking,
  Pricing as FallbackPricing,
  Gallery as FallbackGallery,
  Testimonial as FallbackTestimonial,
  Settings as FallbackSettings,
  OperatingHours as FallbackOperatingHours,
} from "./db-fallback";

let isDbConnected: boolean | null = null;

function getPrismaClient(): any {
  return prisma as any;
}

export async function checkDbConnection(): Promise<boolean> {
  if (isDbConnected !== null) return isDbConnected;

  // prisma is null when DATABASE_URL is missing/invalid — use fallback immediately
  if (!prisma) {
    isDbConnected = false;
    return false;
  }

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("johndoe:randompassword")) {
    isDbConnected = false;
    return false;
  }

  try {
    // Attempt a quick query to verify DB connection
    await (prisma as any).$queryRaw`SELECT 1`;
    isDbConnected = true;
    return true;
  } catch (error) {
    isDbConnected = false;
    return false;
  }
}

// User Services
export const userService = {
  async findUnique(email: string) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.user.findUnique({ where: { email: email.toLowerCase() } });
      } catch (err) {
        console.error("DB query failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async findById(id: string) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.user.findUnique({ where: { id } });
      } catch (err) {
        console.error("DB query failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const user = db.users.find((u) => u.id === id);
    return user || null;
  },

  async create(data: any) {
    const isDb = await checkDbConnection();
    const emailLower = data.email.toLowerCase();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.user.create({ data: { ...data, email: emailLower } });
      } catch (err) {
        console.error("DB create failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const newUser: FallbackUser = {
      id: Math.random().toString(36).substring(2, 11),
      name: data.name || null,
      email: emailLower,
      password: data.password,
      role: data.role || "CUSTOMER",
      phone: data.phone || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeFallbackDb(db);
    return newUser;
  },

  async update(id: string, data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.user.update({ where: { id }, data });
      } catch (err) {
        console.error("DB update failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    const updated = {
      ...db.users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    db.users[index] = updated;
    writeFallbackDb(db);
    return updated;
  },

  async findMany() {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.user.findMany({ orderBy: { createdAt: "desc" } });
      } catch (err) {
        console.error("DB findMany failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return db.users;
  }
};

// Booking Services
export const bookingService = {
  async findMany() {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.booking.findMany({ orderBy: { date: "asc" } });
      } catch (err) {
        console.error("DB findMany failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return [...db.bookings].sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  },

  async findById(id: string) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.booking.findUnique({ where: { id } });
      } catch (err) {
        console.error("DB findById failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const booking = db.bookings.find((b) => b.id === id);
    return booking || null;
  },

  async findByUserId(userId: string) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.booking.findMany({ where: { userId }, orderBy: { date: "asc" } });
      } catch (err) {
        console.error("DB findByUserId failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return db.bookings.filter((b) => b.userId === userId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async create(data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.booking.create({ data });
      } catch (err) {
        console.error("DB create failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const newBooking: FallbackBooking = {
      id: "bk-" + Math.random().toString(36).substring(2, 9),
      userId: data.userId || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      notes: data.notes || null,
      date: new Date(data.date).toISOString().split("T")[0] + "T00:00:00.000Z",
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      status: data.status || "PENDING",
      price: data.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.bookings.push(newBooking);
    writeFallbackDb(db);
    return newBooking;
  },

  async update(id: string, data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.booking.update({ where: { id }, data });
      } catch (err) {
        console.error("DB update failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const index = db.bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Booking not found");
    const updated = {
      ...db.bookings[index],
      ...data,
      date: data.date ? new Date(data.date).toISOString().split("T")[0] + "T00:00:00.000Z" : db.bookings[index].date,
      updatedAt: new Date().toISOString(),
    };
    db.bookings[index] = updated;
    writeFallbackDb(db);
    return updated;
  },

  async delete(id: string) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.booking.delete({ where: { id } });
      } catch (err) {
        console.error("DB delete failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const index = db.bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Booking not found");
    const deleted = db.bookings[index];
    db.bookings = db.bookings.filter((b) => b.id !== id);
    writeFallbackDb(db);
    return deleted;
  }
};

// Pricing Services
export const pricingService = {
  async findMany() {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.pricing.findMany({ orderBy: { price: "asc" } });
      } catch (err) {
        console.error("DB pricing findMany failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return db.pricing;
  },

  async update(id: string, data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.pricing.update({ where: { id }, data });
      } catch (err) {
        console.error("DB pricing update failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const index = db.pricing.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Pricing option not found");
    const updated = {
      ...db.pricing[index],
      ...data,
    };
    db.pricing[index] = updated;
    writeFallbackDb(db);
    return updated;
  }
};

// Gallery Services
export const galleryService = {
  async findMany() {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.gallery.findMany({ orderBy: { createdAt: "desc" } });
      } catch (err) {
        console.error("DB gallery findMany failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return [...db.gallery].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.gallery.create({ data });
      } catch (err) {
        console.error("DB gallery create failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const newImage: FallbackGallery = {
      id: "img-" + Math.random().toString(36).substring(2, 9),
      url: data.url,
      title: data.title || null,
      category: data.category || null,
      createdAt: new Date().toISOString(),
    };
    db.gallery.push(newImage);
    writeFallbackDb(db);
    return newImage;
  },

  async delete(id: string) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.gallery.delete({ where: { id } });
      } catch (err) {
        console.error("DB gallery delete failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const index = db.gallery.findIndex((g) => g.id === id);
    if (index === -1) throw new Error("Gallery item not found");
    const deleted = db.gallery[index];
    db.gallery = db.gallery.filter((g) => g.id !== id);
    writeFallbackDb(db);
    return deleted;
  }
};

// Testimonial Services
export const testimonialService = {
  async findMany() {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.testimonial.findMany({ orderBy: { createdAt: "desc" } });
      } catch (err) {
        console.error("DB testimonials findMany failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return [...db.testimonials].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.testimonial.create({ data });
      } catch (err) {
        console.error("DB testimonials create failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const newTestimonial: FallbackTestimonial = {
      id: "ts-" + Math.random().toString(36).substring(2, 9),
      name: data.name,
      role: data.role || null,
      avatar: data.avatar || null,
      rating: data.rating || 5,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    db.testimonials.push(newTestimonial);
    writeFallbackDb(db);
    return newTestimonial;
  }
};

// Settings Services
export const settingsService = {
  async findUnique() {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        const settings = await client.settings.findFirst({ where: { id: "default" } });
        if (settings) return settings;
        return await client.settings.create({ data: { id: "default" } });
      } catch (err) {
        console.error("DB settings findUnique failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return db.settings;
  },

  async update(data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.settings.update({ where: { id: "default" }, data });
      } catch (err) {
        console.error("DB settings update failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const updated = {
      ...db.settings,
      ...data,
    };
    db.settings = updated;
    writeFallbackDb(db);
    return updated;
  }
};

// Operating Hours Services
export const operatingHoursService = {
  async findMany() {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.operatingHours.findMany({ orderBy: { dayOfWeek: "asc" } });
      } catch (err) {
        console.error("DB operatingHours findMany failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    return [...db.operatingHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  },

  async update(id: string, data: any) {
    const isDb = await checkDbConnection();
    if (isDb) {
      try {
        const client = getPrismaClient();
        return await client.operatingHours.update({ where: { id }, data });
      } catch (err) {
        console.error("DB operatingHours update failed, fallback to JSON", err);
      }
    }
    const db = readFallbackDb();
    const index = db.operatingHours.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Operating hours not found");
    const updated = {
      ...db.operatingHours[index],
      ...data,
    };
    db.operatingHours[index] = updated;
    writeFallbackDb(db);
    return updated;
  }
};
