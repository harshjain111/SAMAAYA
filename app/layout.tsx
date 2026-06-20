import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Display serif — premium, confident headings (CLAUDE.md §DESIGN TOKENS)
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

// Body / UI sans
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SAMAAYA — Fresh-to-cup Assam tea",
    template: "%s · SAMAAYA",
  },
  description:
    "Fresh from Assam's finest estates. Most tea sits in a warehouse for up to two years — SAMAAYA doesn't. The Right Moment.",
  keywords: ["Assam tea", "fresh tea", "loose leaf tea", "black tea", "green tea", "buy tea online India"],
  openGraph: {
    type: "website",
    siteName: "SAMAAYA",
    title: "SAMAAYA — Fresh-to-cup Assam tea",
    description:
      "Fresh from Assam's finest estates. Packed fresh, never warehoused. The Right Moment.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAMAAYA — Fresh-to-cup Assam tea",
    description: "Fresh from Assam's finest estates. The Right Moment.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
