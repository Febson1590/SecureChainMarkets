import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/**
 * VorateTrade — minimal reference seed.
 *
 * Seeds ONLY market-asset reference data so the public /markets page has
 * symbols to render against live CoinGecko prices. No users, sessions,
 * transactions, deposits, withdrawals, support tickets, notifications, or
 * any other operational data is created — those tables stay empty until
 * real users sign up and act.
 *
 * Idempotent: re-running will not duplicate rows or wipe data.
 */
async function main() {
  console.log("🌱 Seeding VorateTrade reference data...");

  const assetData = [
    { symbol: "BTC",  name: "Bitcoin",     currentPrice: 67482.50,    priceChange24h: 2.34,  marketCap: 1328000000000, volume24h: 28400000000, circulatingSupply: 19700000,    rank: 1,  description: "The first and most recognized cryptocurrency, often called digital gold." },
    { symbol: "ETH",  name: "Ethereum",    currentPrice: 3521.80,     priceChange24h: 1.87,  marketCap: 423000000000,  volume24h: 14200000000, circulatingSupply: 120200000,   rank: 2,  description: "A decentralized platform enabling smart contracts and dApps." },
    { symbol: "USDT", name: "Tether",      currentPrice: 1.00,        priceChange24h: 0.01,  marketCap: 95000000000,   volume24h: 62000000000, circulatingSupply: 95000000000, rank: 3,  description: "A stablecoin pegged to the US Dollar." },
    { symbol: "BNB",  name: "BNB",         currentPrice: 412.30,      priceChange24h: -0.85, marketCap: 61000000000,   volume24h: 1800000000,  circulatingSupply: 148000000,   rank: 4,  description: "Native cryptocurrency of the Binance ecosystem." },
    { symbol: "SOL",  name: "Solana",      currentPrice: 178.45,      priceChange24h: 3.21,  marketCap: 82000000000,   volume24h: 4200000000,  circulatingSupply: 460000000,   rank: 5,  description: "A high-performance blockchain for fast, low-cost transactions." },
    { symbol: "XRP",  name: "XRP",         currentPrice: 0.6234,      priceChange24h: -1.12, marketCap: 34000000000,   volume24h: 1200000000,  circulatingSupply: 54600000000, rank: 6,  description: "Digital asset for global payments and financial institutions." },
    { symbol: "ADA",  name: "Cardano",     currentPrice: 0.4821,      priceChange24h: 1.45,  marketCap: 17000000000,   volume24h: 580000000,   circulatingSupply: 35300000000, rank: 7,  description: "Proof-of-stake blockchain focused on security and sustainability." },
    { symbol: "AVAX", name: "Avalanche",   currentPrice: 38.92,       priceChange24h: 2.67,  marketCap: 16000000000,   volume24h: 690000000,   circulatingSupply: 411000000,   rank: 8,  description: "Fast, low-cost, and eco-friendly blockchain platform." },
  ];

  const assets = await Promise.all(
    assetData.map((a) =>
      prisma.marketAsset.upsert({
        where:  { symbol: a.symbol },
        update: { currentPrice: a.currentPrice, priceChange24h: a.priceChange24h },
        create: a,
      })
    )
  );
  console.log(`✅ ${assets.length} market assets`);
  console.log("✅ Done. Database has reference data only — no users, no transactions.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
