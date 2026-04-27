import "dotenv/config";
import { readFileSync } from "node:fs";
import pg from "pg";

const sqlRaw = readFileSync(".prisma-init.sql", "utf8");
const sql = sqlRaw
  .split("\n")
  .filter((l) => !l.startsWith("Loaded Prisma config"))
  .join("\n");

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log("connected");
await client.query(sql);
console.log("schema created");
await client.end();
