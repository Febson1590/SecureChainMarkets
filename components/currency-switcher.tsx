"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useDisplayCurrency } from "@/components/currency-provider";
import { CURRENCIES, CURRENCY_FLAGS, CURRENCY_LABELS, CURRENCY_SYMBOLS, type DisplayCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

/* Compact currency picker. Variants:
   - "light" — used on the white public navbar (slate borders).
   - "dark"  — used on the dark dashboard header (white/10 borders). */

export function CurrencySwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { currency, setCurrency } = useDisplayCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const triggerCls = variant === "light"
    ? "h-10 px-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-colors"
    : "h-9 px-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-200 border border-white/10 rounded-md hover:bg-white/5 transition-colors";

  const menuCls = variant === "light"
    ? "absolute right-0 top-full mt-1 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-1 z-50"
    : "absolute right-0 top-full mt-1 w-48 rounded-md border border-white/10 bg-[#0B1220] shadow-xl py-1 z-50";

  const itemBase = "w-full px-3 py-2 flex items-center gap-2.5 text-[13px] text-left transition-colors";
  const itemCls = variant === "light"
    ? `${itemBase} hover:bg-slate-50 text-slate-700`
    : `${itemBase} hover:bg-white/5 text-slate-200`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={triggerCls}
      >
        <span className="text-base leading-none">{CURRENCY_FLAGS[currency]}</span>
        <span className="font-mono">{currency}</span>
        <ChevronDown size={13} className="opacity-70" />
      </button>

      {open && (
        <div role="listbox" className={menuCls}>
          {CURRENCIES.map((c: DisplayCurrency) => {
            const active = c === currency;
            return (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { setCurrency(c); setOpen(false); }}
                className={cn(itemCls)}
              >
                <span className="text-base leading-none">{CURRENCY_FLAGS[c]}</span>
                <span className="flex-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-[12.5px]">{c}</span>
                  <span className="opacity-60 text-[11.5px]">{CURRENCY_SYMBOLS[c]}</span>
                  <span className="opacity-60 text-[11.5px] ml-auto">{CURRENCY_LABELS[c]}</span>
                </span>
                {active && <Check size={12} className="opacity-70" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
