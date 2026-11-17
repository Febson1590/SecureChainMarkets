import "server-only";
import { cookies, headers } from "next/headers";
import { asDisplayCurrency, CURRENCY_COOKIE, detectCurrencyFromLocale, type DisplayCurrency } from "@/lib/currency";

/** Resolve a user's display currency server-side.
 *  Precedence: profile preference (if logged in) > cookie > Accept-Language > USD. */
export async function resolveDisplayCurrency(profileCurrency?: string | null): Promise<DisplayCurrency> {
  const profile = asDisplayCurrency(profileCurrency);
  if (profile) return profile;

  const cookieStore = await cookies();
  const fromCookie = asDisplayCurrency(cookieStore.get(CURRENCY_COOKIE)?.value);
  if (fromCookie) return fromCookie;

  const h = await headers();
  return detectCurrencyFromLocale(h.get("accept-language"));
}
