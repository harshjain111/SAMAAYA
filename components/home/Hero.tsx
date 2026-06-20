import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui";

export interface HeroProps {
  priceFrom?: number;
}

/** Section 1 — Hero (copy deck §1). Emotional H1 + FRESH subhead, dual CTA. */
export function Hero({ priceFrom }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Priority-loaded hero image (owner replaces via real photography). */}
      <Image
        src="https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=2000&q=80"
        alt="Fresh Assam tea leaves"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-deep/90 via-green-deep/80 to-green-mid/70" />

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-light">
            Fresh from Assam&apos;s finest estates
          </p>
          <h1 className="mt-4 text-4xl text-cream sm:text-5xl lg:text-6xl">
            Some moments deserve a better cup.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/85">
            Most tea sits in a warehouse for up to two years before it reaches
            you. SAMAAYA doesn&apos;t. We bring it fresh from Assam&apos;s finest
            estates — so the cup in your hand is as alive as the garden it came
            from.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className={buttonClasses("primary", "lg")}>
              Shop the Range
            </Link>
            <Link
              href="#fresh-difference"
              className={buttonClasses("ghost", "lg", "border-cream text-cream hover:bg-cream hover:text-green-deep")}
            >
              Why Fresh Matters
            </Link>
          </div>
          <p className="mt-6 text-sm text-cream/75">
            Estate-sourced · Packed fresh, never warehoused · Shipped across India
            {typeof priceFrom === "number" && priceFrom > 0 && (
              <> · From ₹{Math.round(priceFrom).toLocaleString("en-IN")}</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
