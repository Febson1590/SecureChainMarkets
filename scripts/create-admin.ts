import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/**
 * One-off admin bootstrap. Creates an ADMIN/ACTIVE user with a profile
 * and the four standard wallet currencies. Idempotent — safe to re-run;
 * only updates the password hash if the email already exists.
 */
function genAddr(currency: string): string {
  const prefixes: Record<string, string> = { BTC: "1", ETH: "0x", USDT: "0x", USD: "VAULT-" };
  const prefix = prefixes[currency] || "";
  const chars = "abcdef0123456789";
  let address = prefix;
  for (let i = 0; i < 34; i++) address += chars[Math.floor(Math.random() * chars.length)];
  return address;
}

async function main() {
  const email = process.env.ADMIN_EMAIL    || "admin@voratetrade.com";
  const pwd   = process.env.ADMIN_PASSWORD || "Admin@123456";

  const passwordHash = await bcrypt.hash(pwd, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data:  { password: passwordHash, role: "ADMIN", status: "ACTIVE" },
    });
    console.log(`✅ Admin password updated: ${email}`);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email,
      name: "VorateTrade Admin",
      password: passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      profile: {
        create: {
          firstName: "VorateTrade",
          lastName:  "Admin",
          country:   "United States",
        },
      },
      wallets: {
        create: [
          { currency: "USD",  balance: 0, address: genAddr("USD")  },
          { currency: "BTC",  balance: 0, address: genAddr("BTC")  },
          { currency: "ETH",  balance: 0, address: genAddr("ETH")  },
          { currency: "USDT", balance: 0, address: genAddr("USDT") },
        ],
      },
    },
  });
  console.log(`✅ Admin created: ${admin.email}  (id: ${admin.id})`);
  console.log(`   Login with:  ${email}  /  ${pwd}`);
  console.log(`   Change the password from /dashboard/settings after first login.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
