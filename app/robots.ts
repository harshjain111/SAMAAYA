import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/transactional routes out of the index.
      disallow: ["/admin", "/account", "/checkout", "/cart", "/order", "/auth", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
