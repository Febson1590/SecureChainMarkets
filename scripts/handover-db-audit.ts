/** Read-only pre-handover audit of operational content in the DB. */
import { db } from "../lib/db";

async function main() {
  const [users, plans, activePlans, traders, activeTraders, depositWallets, activeWallets, marketAssets, siteConfig] =
    await Promise.all([
      db.user.findMany({ select: { email: true, role: true, status: true, emailVerified: true } }),
      db.investmentPlan.count(),
      db.investmentPlan.count({ where: { isActive: true } }),
      db.copyTrader.count(),
      db.copyTrader.count({ where: { isActive: true } }),
      db.depositWallet.count(),
      db.depositWallet.count({ where: { isActive: true } }),
      db.marketAsset.count(),
      db.siteConfig.findMany().catch(() => []),
    ]);

  console.log("USERS:");
  for (const u of users) console.log(`  ${u.role}  ${u.status}  verified=${!!u.emailVerified}  ${u.email}`);
  console.log(`INVESTMENT PLANS: ${plans} total, ${activePlans} active`);
  console.log(`COPY TRADERS:     ${traders} total, ${activeTraders} active`);
  console.log(`DEPOSIT WALLETS:  ${depositWallets} total, ${activeWallets} active`);
  const wallets = await db.depositWallet.findMany({ select: { asset: true, network: true, isActive: true, address: true } });
  for (const w of wallets) console.log(`  ${w.isActive ? "ON " : "off"}  ${w.asset} ${w.network ?? ""}  ${w.address.slice(0, 18)}…`);
  console.log(`MARKET ASSETS:    ${marketAssets}`);
  console.log(`SITE CONFIG ROWS: ${siteConfig.length}`);
  for (const c of siteConfig as any[]) console.log(`  ${c.key} = ${String(c.value).slice(0, 60)}`);
}

main().finally(() => db.$disconnect());
