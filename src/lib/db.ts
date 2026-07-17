/**
 * Prisma 7 client with graceful no-database fallback.
 *
 * Prisma 7 requires an `adapter` when using the "client" engine type.
 * Since we may not have a PostgreSQL database configured locally, we wrap
 * the constructor in a try/catch and expose `null` when it fails.
 * The db-service layer detects this and falls back to the JSON-file store.
 */

import type { PrismaClient as PrismaClientType } from "@prisma/client";

let prisma: PrismaClientType | null = null;

// Only instantiate if DATABASE_URL is configured
if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = require("@prisma/client");
    const globalForPrisma = global as unknown as { prisma: PrismaClientType };
    prisma =
      globalForPrisma.prisma ||
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma!;
    }
  } catch (e) {
    console.warn("⚠️  Prisma client failed to initialize. Using fallback JSON store.", e);
    prisma = null;
  }
}

export { prisma };
