/* Shared display-currency plumbing.

   The ENTIRE platform ledger is USD. These helpers only localise what
   the user SEES. Nothing in deposits/withdrawals/investments/accounting
   is changed — we hand the server a USD number for every real money
   movement. The user's display currency is a UI preference, nothing
   more. */

export type DisplayCurrency = "USD" | "EUR" | "GBP";

export const CURRENCIES: DisplayCurrency[] = ["USD", "EUR", "GBP"];

export const CURRENCY_SYMBOLS: Record<DisplayCurrency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const CURRENCY_LABELS: Record<DisplayCurrency, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
};

export const CURRENCY_FLAGS: Record<DisplayCurrency, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
};

/** Cookie name the switcher writes to for anonymous users. */
export const CURRENCY_COOKIE = "scm_display_currency";

/** Guard an unknown string against the DisplayCurrency union. */
export function asDisplayCurrency(v: string | null | undefined): DisplayCurrency | null {
  if (v === "USD" || v === "EUR" || v === "GBP") return v;
  return null;
}

/** Heuristic for anonymous users on first paint — regionalise by
 *  browser language. Falls back to USD. */
export function detectCurrencyFromLocale(acceptLanguage: string | null | undefined): DisplayCurrency {
  const lang = (acceptLanguage ?? "").toLowerCase();
  if (!lang) return "USD";
  if (lang.startsWith("en-gb") || lang.includes("en-gb,"))   return "GBP";
  // Common EU locales
  const euPrefixes = ["de", "fr", "es", "it", "nl", "pt", "pl", "sv", "da", "fi", "cs", "ro", "el", "hu", "sk", "sl", "bg", "hr", "lt", "lv", "et", "ga", "mt", "en-ie", "en-mt"];
  if (euPrefixes.some((p) => lang.startsWith(p))) return "EUR";
  return "USD";
}

/** Convert a USD amount to the display currency using live rates. */
export function convertUsd(usd: number, currency: DisplayCurrency, rate: number): number {
  if (!Number.isFinite(usd)) return 0;
  if (currency === "USD" || !Number.isFinite(rate) || rate <= 0) return usd;
  return usd * rate;
}

/** Render a USD amount in the user's display currency. Server-safe. */
export function formatMoney(
  usd: number,
  currency: DisplayCurrency,
  rate: number,
  opts: { decimals?: number } = {},
): string {
  const value = convertUsd(usd, currency, rate);
  const abs = Math.abs(value);
  const auto =
    opts.decimals ??
    (abs >= 1      ? 2
      : abs >= 0.01  ? 4
      : abs >= 0.0001 ? 6
      : 8);
  const locale = currency === "GBP" ? "en-GB" : currency === "EUR" ? "en-IE" : "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: auto,
      maximumFractionDigits: auto,
    }).format(value);
  } catch {
    const sym = CURRENCY_SYMBOLS[currency] ?? "$";
    return `${sym}${value.toFixed(auto)}`;
  }
}
