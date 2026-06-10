import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // allow base64 trader photos (compressed ~200KB, but safety net for edge cases)
    },
  },

  /* Canonical host. Apex (securechainmarkets.com) is the one we want users
     and search engines to see; redirect www → apex with a permanent 308 so
     bookmarks and inbound links never split traffic across two hostnames.
     The Vercel preview domain (*.vercel.app) is intentionally left alone so
     preview deployments don't redirect to production. */
  /* Baseline security headers for a financial platform. CSP is omitted
     deliberately — Google Translate + Next inline scripts make a strict
     policy brittle; add one later with careful testing if required. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.securechainmarkets.com" }],
        destination: "https://securechainmarkets.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
