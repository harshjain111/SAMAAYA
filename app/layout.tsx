import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "SAMAAYA — Fresh-to-cup Assam tea",
    template: "%s · SAMAAYA",
  },
  description:
    "Fresh from Assam's finest estates. Most tea sits in a warehouse for up to two years — SAMAAYA doesn't. The Right Moment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
