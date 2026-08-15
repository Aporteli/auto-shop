import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter =
    process.env.DATABASE_URL != null
      ? new PrismaMariaDb(process.env.DATABASE_URL)
      : new PrismaMariaDb({
          host: process.env.DB_HOST || "localhost",
          port: Number(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER || "root",
          password: process.env.DB_PASSWORD || "",
          database: process.env.DB_NAME || "auto_shop_db",
          connectionLimit: 3,
        });

  return new PrismaClient({ adapter });
}

function getPrismaClient() {
  const existing = globalForPrisma.prisma;
  if (existing?.autoPart && existing.helpTicket) return existing;
  if (existing) void existing.$disconnect();
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = getPrismaClient();
