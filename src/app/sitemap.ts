import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { ALL_POST_SLUGS_QUERY } from "@/lib/sanity/queries";

const BASE_URL = "https://www.victormts.dev";
const LOCALES = ["en", "pt-br"] as const;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await client.fetch<{ slug: string }[]>(ALL_POST_SLUGS_QUERY);

  const staticRoutes = LOCALES.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/${locale}/works`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${locale}/lab`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  const postRoutes = LOCALES.flatMap((locale) =>
    slugs.map((s) => ({
      url: `${BASE_URL}/${locale}/works/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  );

  return [...staticRoutes, ...postRoutes];
}
