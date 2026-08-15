import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import mariadb from "mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isRemoteDb =
  process.env.NODE_ENV === "production" ||
  (process.env.DB_HOST && process.env.DB_HOST !== "localhost") ||
  (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost"));

function createPrismaClient() {
  const pool = process.env.DATABASE_URL
    ? mariadb.createPool({
        uri: process.env.DATABASE_URL,
        connectionLimit: 5,
        connectTimeout: 20000,
        ssl: isRemoteDb ? { rejectUnauthorized: true } : undefined,
      })
    : mariadb.createPool({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "auto_shop_db",
        connectionLimit: 5,
        connectTimeout: 20000,
        ssl: isRemoteDb ? { rejectUnauthorized: true } : undefined,
      });

  const adapter = new PrismaMariaDb(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}