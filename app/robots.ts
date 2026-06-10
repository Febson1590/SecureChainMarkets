import type { MetadataRoute } from "next";

const BASE_URL = "https://securechainmarkets.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep crawlers out of authenticated and transactional surfaces.
        disallow: ["/dashboard", "/admin", "/api/", "/verify", "/account-status"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
