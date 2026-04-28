import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { GoogleTranslateHost } from "@/components/language-switcher";
import "./globals.css";

/* Single sans-serif system font for everything — landing, auth, dashboard,
   admin. Inter is the de-facto fintech UI font (Stripe, Coinbase, Linear). */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/* JetBrains Mono is reserved for tabular numerals / code-like UI strings. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SecureChainMarkets — Trade Global Markets with Confidence",
    template: "%s | SecureChainMarkets",
  },
  description:
    "SecureChainMarkets — one professional trading account for forex, indices, commodities, stocks and crypto. Built for speed, clarity and control.",
  keywords: ["forex", "indices", "commodities", "stocks", "crypto", "trading", "broker", "brokerage", "SecureChainMarkets"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  applicationName: "SecureChainMarkets",
  authors: [{ name: "SecureChainMarkets" }],
  creator: "SecureChainMarkets",
  publisher: "SecureChainMarkets",

  /* Next auto-discovers app/icon.png, app/apple-icon.png and app/favicon.ico
     via file conventions. We also reference the resized public/icon-*.png
     variants for legacy bookmark and PWA manifest consumers. Every icon
     is the SecureChainMarkets brand mark. */
  icons: {
    icon: [
      { url: "/favicon.ico",  sizes: "any" },
      { url: "/icon.png",     type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  openGraph: {
    title: "SecureChainMarkets — Trade Digital Assets with Confidence",
    description: "Buy, sell and hold major digital assets with clear pricing and tools designed for modern investors.",
    siteName: "SecureChainMarkets",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureChainMarkets — Trade Digital Assets with Confidence",
    description: "Buy, sell and hold major digital assets with clear pricing and tools designed for modern investors.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08111F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
        <GoogleTranslateHost />
        <Toaster
          position="top-center"
          theme="dark"
          richColors
          expand={false}
          closeButton
          duration={5000}
          offset={16}
          visibleToasts={3}
        />
      </body>
    </html>
  );
}
