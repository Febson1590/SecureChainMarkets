import { NextResponse } from "next/server";

/* Live USD → EUR / GBP rates for the display-currency layer.
   Source: exchangerate.host (free, no key). Cached at the edge for one
   hour: FX moves slowly enough that this is fine for display purposes
   (the underlying ledger is always USD). On failure we return a stale
   fallback so the UI never shows "—". */

export const revalidate = 3600;

const FALLBACK = { USD: 1, EUR: 0.92, GBP: 0.79 };

export async function GET() {
  try {
    // open.er-api.com — free, no key, daily rates, highly reliable.
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) throw new Error("non-json response");
    const data = await res.json();
    const eur = Number(data?.rates?.EUR);
    const gbp = Number(data?.rates?.GBP);
    if (!Number.isFinite(eur) || !Number.isFinite(gbp)) throw new Error("missing rates");
    return NextResponse.json(
      { USD: 1, EUR: eur, GBP: gbp, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } },
    );
  } catch (err) {
    console.error("[/api/fx-rates] fallback:", err);
    return NextResponse.json(
      { ...FALLBACK, fetchedAt: null, fallback: true },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  }
}
