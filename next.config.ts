import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so a stray lockfile in a parent
  // directory doesn't confuse Next's file tracing.
  outputFileTracingRoot: __dirname,
  images: {
    // Supabase Storage CDN will be added here once the project is provisioned.
    // remotePatterns: [{ protocol: "https", hostname: "<project>.supabase.co" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
