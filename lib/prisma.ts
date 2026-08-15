import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isRemoteDb =
  process.env.NODE_ENV === "production" ||
  (process.env.DB_HOST && process.env.DB_HOST !== "localhost") ||
  (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost"));

function createPrismaClient() {
  const adapter =
    process.env.DATABASE_URL != null
      ? new PrismaMariaDb(process.env.DATABASE_URL, {
          connectionLimit: 5,
          connectTimeout: 20000,
          ssl: isRemoteDb ? { rejectUnauthorized: true } : undefined,
        })
      : new PrismaMariaDb({
          host: process.env.DB_HOST || "localhost",
          port: Number(process.env.DB_PORT) || 4000,
          user: process.env.DB_USER || "root",
          password: process.env.DB_PASSWORD || "",
          database: process.env.DB_NAME || "auto_shop_db",
          connectionLimit: 5,
          connectTimeout: 20000,
          ssl: isRemoteDb ? { rejectUnauthorized: true } : undefined,
        });

  return new PrismaClient({ adapter });
}

function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();