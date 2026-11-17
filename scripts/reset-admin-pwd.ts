import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const newPwd = process.argv[2];
  if (!newPwd || newPwd.length < 8) {
    console.log("Usage: tsx scripts/reset-admin-pwd.ts <newPassword (>=8 chars)>");
    process.exit(1);
  }
  const u = await db.user.findUnique({
    where: { email: "admin@securechainmarkets.com" },
    select: { id: true, updatedAt: true },
  });
  if (!u) { console.log("Admin user not found"); return; }
  const hashed = await bcrypt.hash(newPwd, 12);
  await db.user.update({ where: { id: u.id }, data: { password: hashed } });
  const verify = await bcrypt.compare(newPwd, (await db.user.findUnique({ where: { id: u.id }, select: { password: true } }))!.password!);
  console.log("Password reset:", verify ? "SUCCESS" : "FAILED");
  console.log("Previous updatedAt:", u.updatedAt.toISOString());
}

main().finally(() => db.$disconnect());
