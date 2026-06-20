import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProductSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/track`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/policies/shipping`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/returns`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/product/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
