import mysql from "mysql2/promise";

const isProduction =
  process.env.NODE_ENV === "production" ||
  (process.env.DB_HOST && process.env.DB_HOST !== "localhost");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "autoshop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 👇 ეს ნაწილი აუცილებელია TiDB Cloud-ისთვის:
  ssl: isProduction
    ? {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      }
    : undefined,
});

export default pool;
