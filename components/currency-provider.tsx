"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  type DisplayCurrency, CURRENCY_COOKIE, asDisplayCurrency, convertUsd, formatMoney,
} from "@/lib/currency";

type Rates = Record<DisplayCurrency, number>;

interface Ctx {
  currency: DisplayCurrency;
  rates: Rates;
  rate: number;              // rate FROM USD TO the current currency
  setCurrency: (c: DisplayCurrency) => void;
  format: (usd: number, opts?: { decimals?: number }) => string;
  convert: (usd: number) => number;
}

const FALLBACK_RATES: Rates = { USD: 1, EUR: 0.92, GBP: 0.79 };
const Context = createContext<Ctx | null>(null);

function writeCookie(c: DisplayCurrency) {
  try {
    // 1 year, path=/, lax — safe to send on same-site navigations.
    document.cookie = `${CURRENCY_COOKIE}=${c}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch { /* SSR */ }
}

export function CurrencyProvider({
  initialCurrency,
  initialRates,
  persistToProfile = false,
  children,
}: {
  initialCurrency: DisplayCurrency;
  initialRates?: Partial<Rates> | null;
  /** When true (logged-in area), currency changes also POST to the user
   *  profile so the choice persists across devices. */
  persistToProfile?: boolean;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(initialCurrency);
  const [rates, setRates] = useState<Rates>({ ...FALLBACK_RATES, ...(initialRates ?? {}) });

  // Fetch live rates once on mount (cached at /api/fx-rates for 1h).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/fx-rates")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setRates({
          USD: 1,
          EUR: Number(data?.EUR) || FALLBACK_RATES.EUR,
          GBP: Number(data?.GBP) || FALLBACK_RATES.GBP,
        });
      })
      .catch(() => { /* keep fallback */ });
    return () => { cancelled = true; };
  }, []);

  const setCurrency = useCallback((c: DisplayCurrency) => {
    setCurrencyState(c);
    writeCookie(c);
    if (persistToProfile) {
      fetch("/api/user/display-currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: c }),
      }).catch(() => { /* UI continues; cookie is the source of truth client-side */ });
    }
  }, [persistToProfile]);

  const value = useMemo<Ctx>(() => {
    const rate = rates[currency] ?? 1;
    return {
      currency,
      rates,
      rate,
      setCurrency,
      format: (usd, opts) => formatMoney(usd, currency, rate, opts),
      convert: (usd) => convertUsd(usd, currency, rate),
    };
  }, [currency, rates, setCurrency]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDisplayCurrency(): Ctx {
  const ctx = useContext(Context);
  if (!ctx) {
    // Fail-safe: if a component mounts outside the provider, treat it
    // as USD (identity) rather than crashing the page.
    return {
      currency: "USD",
      rates: FALLBACK_RATES,
      rate: 1,
      setCurrency: () => {},
      format: (usd) => formatMoney(usd, "USD", 1),
      convert: (usd) => usd,
    };
  }
  return ctx;
}

/** Drop-in replacement for a `formatCurrency(x)` call that respects
 *  the user's chosen display currency. Use inline: `<Money usd={1500} />`.
 *  Pass `secondary` to render "£1,190 · $1,500" for dual-display on
 *  confirm screens. */
export function Money({
  usd,
  decimals,
  secondary = false,
  className,
}: {
  usd: number | string | null | undefined;
  decimals?: number;
  /** If true, also shows the underlying USD in a small/muted style
   *  next to the primary value. Used on money-movement confirms. */
  secondary?: boolean;
  className?: string;
}) {
  const { format, currency } = useDisplayCurrency();
  const n = typeof usd === "string" ? parseFloat(usd) : (usd ?? 0);
  const primary = format(Number.isFinite(n) ? n : 0, { decimals });
  if (!secondary || currency === "USD") {
    return <span className={className}>{primary}</span>;
  }
  return (
    <span className={className}>
      {primary}
      <span className="text-[0.85em] opacity-60 ml-1.5">
        ≈ ${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
      </span>
    </span>
  );
}
