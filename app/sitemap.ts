import type { MetadataRoute } from "next";

const BASE_URL = "https://securechainmarkets.com";

/* Public, indexable pages only — auth and dashboard routes are
   deliberately excluded (see robots.ts). */
const publicRoutes = [
  "",
  "/markets",
  "/about",
  "/contact",
  "/help",
  "/security",
  "/terms",
  "/privacy",
  "/risk",
  "/aml",
  "/kyc",
  "/licensing",
  "/login",
  "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" || path === "/markets" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/markets" ? 0.9 : 0.6,
  }));
}
