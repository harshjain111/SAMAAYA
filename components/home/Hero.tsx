import Image from "next/image";
import Link from "next/link";
import { buttonClasses, Icon } from "@/components/ui";
import { HeroVideo } from "./HeroVideo";

export interface HeroProps {
  priceFrom?: number;
}

const TRUST = [
  { icon: "leaf" as const, label: "Estate-sourced" },
  { icon: "package" as const, label: "Packed fresh" },
  { icon: "truck" as const, label: "Shipped pan-India" },
];

/**
 * Section 1 — Hero (copy deck §1). Full-bleed cinematic video reveal with a
 * strong directional scrim so the cream text always stays high-contrast,
 * regardless of the footage. Poster image shows instantly + on reduced motion.
 */
export function Hero({ priceFrom }: HeroProps) {
  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-green-deep md:min-h-[86vh]">
      {/* Poster (instant + fallback behind the video) */}
      <Image
        src="/hero/hero.png"
        alt="Freshly brewed Assam tea"
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover"
      />
      {/* Cinematic video reveal — autoplays on mobile + desktop */}
      <HeroVideo />

      {/* Contrast scrim — dark on the left where the text sits, lighter on the right */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-deep via-green-deep/80 to-green-deep/25 md:to-transparent" />
      <div className="absolute inset-0 -z-10 bg-green-deep/30 md:bg-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 md:py-28">
        <div className="max-w-xl">
          <div className="reveal-up flex items-center gap-3">
            <span className="h-px w-8 bg-amber" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-light">
              Fresh from Assam&apos;s finest estates
            </p>
          </div>

          <h1 className="reveal-up reveal-delay-1 mt-5 text-balance font-display text-[2.5rem] font-medium leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
            Some moments deserve a better cup.
          </h1>

          <p className="reveal-up reveal-delay-2 mt-5 max-w-md text-base leading-relaxed text-cream/85 sm:text-lg">
            Most tea sits in a warehouse for up to two years. SAMAAYA
            doesn&apos;t — we bring it fresh from Assam&apos;s estates, so the cup
            in your hand is as alive as the garden it came from.
          </p>

          <div className="reveal-up reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/shop"
              className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
            >
              Shop the Range
            </Link>
            <Link
              href="#fresh-difference"
              className={buttonClasses(
                "ghost",
                "lg",
                "w-full border-cream/50 text-cream hover:bg-cream hover:text-green-deep sm:w-auto",
              )}
            >
              Why fresh matters
            </Link>
          </div>

          <ul className="reveal-up reveal-delay-3 mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2 text-sm text-cream/85">
                <Icon name={t.icon} size={18} className="text-green-soft" />
                {t.label}
              </li>
            ))}
            {typeof priceFrom === "number" && priceFrom > 0 && (
              <li className="flex items-center gap-1.5 text-sm text-cream/85">
                <span className="text-green-soft">From</span>₹
                {Math.round(priceFrom).toLocaleString("en-IN")}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
