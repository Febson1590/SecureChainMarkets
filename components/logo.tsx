"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
}

/* Horizontal logo intrinsic ratio is ~2 : 1 (1774 × 887) */
const sizes = {
  sm: { icon: 32, full: { h: 32 }, textClass: "text-lg",  subClass: "text-[9px]"  },
  md: { icon: 40, full: { h: 40 }, textClass: "text-xl",  subClass: "text-[10px]" },
  lg: { icon: 52, full: { h: 52 }, textClass: "text-2xl", subClass: "text-[11px]" },
  xl: { icon: 64, full: { h: 64 }, textClass: "text-3xl", subClass: "text-xs"     },
};

export function Logo({ variant = "full", size = "md", href = "/", className }: LogoProps) {
  const s = sizes[size];

  const content = (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {variant === "icon" && (
        <Image
          src="/assets/logos/voratetrade-icon.png"
          alt="VorateTrade"
          width={s.icon}
          height={s.icon}
          priority
          className="flex-shrink-0"
        />
      )}

      {variant === "full" && (
        <Image
          src="/assets/logos/voratetrade-logo.png"
          alt="VorateTrade"
          width={1774}
          height={887}
          priority
          className="w-auto"
          style={{ height: s.full.h }}
        />
      )}

      {variant === "text" && (
        <div className="flex flex-col leading-none">
          <span
            className={cn("font-extrabold tracking-wider text-white", s.textClass)}
            style={{ letterSpacing: "0.08em" }}
          >
            VorateTrade
          </span>
          {size !== "sm" && (
            <span
              className={cn("font-medium uppercase", s.subClass)}
              style={{ letterSpacing: "0.32em", marginTop: "2px", color: "#D4AF37" }}
            >
              Trade · Invest · Grow
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
