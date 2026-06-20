import Image from "next/image";
import Link from "next/link";
import { buttonClasses, Icon } from "@/components/ui";

export interface HeroProps {
  priceFrom?: number;
}

const TRUST = [
  { icon: "leaf" as const, label: "Estate-sourced" },
  { icon: "package" as const, label: "Packed fresh" },
  { icon: "truck" as const, label: "Shipped pan-India" },
];

/** Section 1 — Hero (copy deck §1). Editorial split layout, high contrast. */
export function Hero({ priceFrom }: HeroProps) {
  return (
    <section className="grain relative isolate overflow-hidden bg-green-deep text-cream">
      {/* Soft directional light, not a flat wash */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-green-soft/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-amber/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Copy */}
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-amber" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-light">
              Fresh from Assam&apos;s finest estates
            </p>
          </div>

          <h1 className="mt-5 text-balance text-4xl font-medium leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
            Some moments deserve a better cup.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">
            Most tea sits in a warehouse for up to two years. SAMAAYA
            doesn&apos;t — we bring it fresh from Assam&apos;s estates, so the cup
            in your hand is as alive as the garden it came from.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={buttonClasses("primary", "lg")}>
              Shop the Range
            </Link>
            <Link
              href="#fresh-difference"
              className={buttonClasses(
                "ghost",
                "lg",
                "border-cream/40 text-cream hover:bg-cream hover:text-green-deep",
              )}
            >
              Why fresh matters
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2 text-sm text-cream/80">
                <Icon name={t.icon} size={18} className="text-green-soft" />
                {t.label}
              </li>
            ))}
            {typeof priceFrom === "number" && priceFrom > 0 && (
              <li className="flex items-center gap-2 text-sm text-cream/80">
                <span className="text-green-soft">From</span>
                ₹{Math.round(priceFrom).toLocaleString("en-IN")}
              </li>
            )}
          </ul>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-cream/15 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=1400&q=80"
              alt="Freshly packed Assam tea"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-green-deep/70 to-transparent" />
          </div>

          {/* Floating fresh chip */}
          <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-green-deep shadow-soft sm:left-8">
            <Icon name="leaf" size={16} className="text-green-leaf" />
            Packed fresh, never warehoused
          </div>
        </div>
      </div>

      {/* Clean edge into the next section */}
      <div className="h-px w-full bg-cream/10" />
    </section>
  );
}
