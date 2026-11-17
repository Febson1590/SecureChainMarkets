import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const u = await db.user.findUnique({
    where: { email: "admin@securechainmarkets.com" },
    select: { id: true, email: true, name: true, role: true, status: true, password: true },
  });
  if (!u) { console.log("USER NOT FOUND"); return; }
  console.log("id:        ", u.id);
  console.log("email:     ", u.email);
  console.log("name:      ", u.name);
  console.log("role:      ", u.role);
  console.log("status:    ", u.status);
  console.log("has pwd:   ", !!u.password);
  console.log("pwd hash:  ", u.password?.slice(0, 20) + "...");
  if (!u.password) return;
  const trial = process.argv[2] ?? "Admin@123456";
  console.log(`\nTrying "${trial}" → MATCH:`, await bcrypt.compare(trial, u.password));
}

main().finally(() => db.$disconnect());
