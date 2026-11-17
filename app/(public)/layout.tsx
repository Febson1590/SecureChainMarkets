import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { TawkWidget } from "@/components/tawk-widget";
import { CurrencyProvider } from "@/components/currency-provider";
import { resolveDisplayCurrency } from "@/lib/currency-server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const currency = await resolveDisplayCurrency();
  return (
    <CurrencyProvider initialCurrency={currency}>
      <div className="flex flex-col min-h-screen bg-white text-[#0A1A3A]">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
        <TawkWidget />
      </div>
    </CurrencyProvider>
  );
}
