import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getMarketAssets } from "@/lib/coingecko";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/utils";
import { CryptoIcon } from "@/components/public/crypto-icon";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Markets" };

export default async function MarketsPage() {
  const assets = await getMarketAssets();

  return (
    <div className="bg-white text-[#1A1A22] overflow-x-hidden">
      {/* Soft hero glow background, matching the landing page */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 75% 30%, rgba(212, 175, 55,0.10) 0%, rgba(212, 175, 55,0) 70%)," +
              "linear-gradient(180deg, #FFFFFF 0%, #FBF7E8 60%, #FFFFFF 100%)",
          }}
        />

        <div className="max-w-[1200px] mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] bg-[#FBF4DC] text-[#D4AF37] border border-[#E6D9A6] mb-4">
            Markets
          </span>
          <h1 className="text-[30px] sm:text-[40px] lg:text-[48px] font-bold tracking-tight leading-[1.05]">
            Market Overview
          </h1>
          <p className="mt-4 text-[14px] sm:text-[15.5px] text-slate-700 leading-[1.6] max-w-[640px] mx-auto">
            Latest prices and 24-hour performance for the digital assets listed on VorateTrade.
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {assets.slice(0, 4).map((a) => {
              const up = a.change >= 0;
              return (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-[0_8px_22px_-14px_rgba(20, 20, 26,0.18)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <CryptoIcon symbol={a.symbol} size={22} className="flex-shrink-0" />
                      <span className="text-[13px] font-bold text-[#1A1A22] truncate">{a.symbol}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                        up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                      }`}
                    >
                      {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {Math.abs(a.change).toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-[16px] sm:text-[18px] font-bold text-[#1A1A22] tabular-nums truncate">
                    {formatCurrency(a.price)}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 truncate">{a.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All assets — mobile cards + desktop table */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_18px_50px_-26px_rgba(20, 20, 26,0.18)] overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[14px] sm:text-[15px] font-semibold text-[#1A1A22]">All Assets</h2>
              <span className="text-[11.5px] text-slate-600">{assets.length} markets</span>
            </div>

            {/* ── Mobile cards ── */}
            <ul className="md:hidden divide-y divide-slate-100">
              {assets.map((a) => {
                const up = a.change >= 0;
                return (
                  <li key={a.id} className="px-4 py-3.5 flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 w-5 text-right tabular-nums flex-shrink-0">
                      {a.rank}
                    </span>
                    <CryptoIcon symbol={a.symbol} size={28} className="flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold text-[#1A1A22] truncate leading-tight">
                        {a.name}
                      </div>
                      <div className="text-[11px] text-slate-600 leading-tight">{a.symbol}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[13.5px] font-bold text-[#1A1A22] tabular-nums">
                        {formatCurrency(a.price)}
                      </div>
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10.5px] font-semibold tabular-nums mt-1 ${
                          up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                        }`}
                      >
                        {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {Math.abs(a.change).toFixed(2)}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ── Desktop / tablet table ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#FBF7E8]">
                    {["#", "Asset", "Price", "24h Change", "Market Cap", "Volume 24h", "Supply"].map((h, i) => (
                      <th
                        key={h}
                        className={`text-[11px] font-bold uppercase tracking-widest text-slate-600 px-4 lg:px-6 py-3.5 whitespace-nowrap
                          ${i >= 2 ? "text-right" : "text-left"}
                          ${i === 6 ? "hidden lg:table-cell" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => {
                    const up = a.change >= 0;
                    return (
                      <tr key={a.id} className="border-b border-slate-100 hover:bg-[#FBF7E8] transition-colors">
                        <td className="px-4 lg:px-6 py-4 text-slate-600 tabular-nums">{a.rank}</td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <CryptoIcon symbol={a.symbol} size={28} className="flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[13.5px] font-semibold text-[#1A1A22] truncate">{a.name}</div>
                              <div className="text-[11px] text-slate-600">{a.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right">
                          <span className="text-[13.5px] font-bold text-[#1A1A22] tabular-nums">{formatCurrency(a.price)}</span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-0.5 text-[11.5px] font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                              up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                            }`}
                          >
                            {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                            {formatPercent(a.change)}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right text-[12.5px] text-slate-700 tabular-nums">
                          ${formatCompact(a.marketCap)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right text-[12.5px] text-slate-700 tabular-nums">
                          ${formatCompact(a.volume24h)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right text-[12.5px] text-slate-700 tabular-nums hidden lg:table-cell whitespace-nowrap">
                          {formatCompact(a.supply)} {a.symbol}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
