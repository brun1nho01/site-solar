import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;
  const lastReviewed = "2026-09-01";

  return [
    {
      url: baseUrl,
      lastModified: lastReviewed,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: lastReviewed,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: lastReviewed,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
