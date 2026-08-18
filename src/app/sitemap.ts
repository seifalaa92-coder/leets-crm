import type { MetadataRoute } from "next";
import { CLUBS } from "@/data/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.leetssports.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/clubs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/company`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/classes/book-court`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const clubRoutes: MetadataRoute.Sitemap = CLUBS.map((club) => ({
    url: `${base}/clubs/${club.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...clubRoutes];
}