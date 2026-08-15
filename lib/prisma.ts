import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import type { PoolConfig } from "mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function needsSsl(host: string | undefined) {
  if (!host) return process.env.NODE_ENV === "production";
  return host !== "localhost" && host !== "127.0.0.1";
}

function sslOption(host: string | undefined): PoolConfig["ssl"] {
  if (!needsSsl(host)) return undefined;
  return {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  };
}

function poolConfigFromUrl(url: string): PoolConfig {
  const parsed = new URL(url);
  const host = parsed.hostname;
  return {
    host,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, "").split("?")[0],
    connectionLimit: 3,
    acquireTimeout: 20000,
    connectTimeout: 20000,
    ssl: sslOption(host),
  };
}

function createPrismaClient() {
  const config: PoolConfig = process.env.DATABASE_URL
    ? poolConfigFromUrl(process.env.DATABASE_URL)
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "auto_shop_db",
        connectionLimit: 3,
        acquireTimeout: 20000,
        connectTimeout: 20000,
        ssl: sslOption(process.env.DB_HOST),
      };

  return new PrismaClient({ adapter: new PrismaMariaDb(config) });
}

function getPrismaClient() {
  const existing = globalForPrisma.prisma;
  if (existing) return existing;
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = getPrismaClient();
