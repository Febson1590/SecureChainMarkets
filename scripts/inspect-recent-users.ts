/**
 * Read-only diagnostic: list the 10 most recent users with wallet balances,
 * holdings, verification status and email-verified flag, to explain how a
 * "fresh" registration could show a pre-existing balance.
 */
import { db } from "../lib/db";

async function main() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      wallets: true,
      holdings: { include: { asset: true } },
      verifications: { orderBy: { submittedAt: "desc" }, take: 1 },
      investment: true,
    },
  });

  for (const u of users) {
    const usd = u.wallets.find(w => w.currency === "USD");
    const holdingsValue = u.holdings.reduce(
      (s, h) => s + Number(h.quantity) * Number(h.asset.currentPrice), 0);
    console.log("──────────────────────────────────────────");
    console.log(`email          : ${u.email}`);
    console.log(`name           : ${u.name}`);
    console.log(`created        : ${u.createdAt.toISOString()}`);
    console.log(`updated        : ${u.updatedAt.toISOString()}`);
    console.log(`role/status    : ${u.role} / ${u.status}`);
    console.log(`emailVerified  : ${u.emailVerified ? u.emailVerified.toISOString() : "no"}`);
    console.log(`USD balance    : ${usd ? Number(usd.balance) : "no wallet"}`);
    console.log(`wallets        : ${u.wallets.map(w => `${w.currency}=${Number(w.balance)}`).join(", ")}`);
    console.log(`holdings value : ${holdingsValue}`);
    console.log(`investment     : ${u.investment ? `${u.investment.planName} amount=${Number(u.investment.amount)}` : "none"}`);
    console.log(`latest KYC     : ${u.verifications[0]?.status ?? "none submitted"}`);
  }
  console.log("──────────────────────────────────────────");
  console.log(`total users in DB: ${await db.user.count()}`);
}

main().finally(() => db.$disconnect());
