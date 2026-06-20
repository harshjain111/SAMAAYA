import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so a stray lockfile in a parent
  // directory doesn't confuse Next's file tracing.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage CDN (product images uploaded via admin).
      { protocol: "https", hostname: "*.supabase.co" },
      // Unsplash — used by seed/sample product images during development.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
