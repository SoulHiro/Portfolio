import type { MetadataRoute } from "next";

const BASE_URL = "https://www.victormts.dev";
const LOCALES = ["en", "pt-br"] as const;

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  }));
}
