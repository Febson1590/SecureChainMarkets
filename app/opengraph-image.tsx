import { ImageResponse } from "next/og";

/**
 * Open Graph preview image — 1200x630 PNG.
 * Used by Facebook, LinkedIn, iMessage, Slack, X/Twitter, etc.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SecureChainMarkets — trade global markets with confidence";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 88px",
          background:
            "radial-gradient(ellipse 65% 50% at 25% 0%, rgba(212,168,87,0.22), transparent 60%), radial-gradient(ellipse 55% 50% at 90% 100%, rgba(26,115,232,0.20), transparent 65%), linear-gradient(180deg, #08111F 0%, #0A1530 55%, #08111F 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        {/* Brand mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* TC monogram tile */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.10)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: -1,
                color: "#D4A857",
                lineHeight: 1,
              }}
            >
              TC
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -0.5 }}>
              <span style={{ color: "white" }}>SecureChain</span>
              <span style={{ color: "#D4A857" }}>Markets</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 6,
                color: "#94A3B8",
                marginTop: 12,
                textTransform: "uppercase",
              }}
            >
              Trade · Invest · Grow
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -1 }}>
            Trade digital assets
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#D4A857",
              letterSpacing: -1,
            }}
          >
            with confidence.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#94A3B8",
              marginTop: 28,
              maxWidth: 880,
              fontWeight: 500,
            }}
          >
            Major digital assets with clear pricing and tools built for modern investors.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 18,
            color: "#64748B",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#D4A857" }}>●</span>
          <span>securechainmarkets.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
