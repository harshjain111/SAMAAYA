import type { Metadata } from "next";
import {
  Button,
  StrengthMeter,
  ProductCard,
  TrustBadge,
  MomentCard,
  SectionDivider,
  TestimonialCard,
  StatusPill,
  FreeShippingNudge,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "SAMAAYA design system — tokens, type, and components.",
};

const COLORS: { name: string; hex: string; note: string }[] = [
  { name: "green-deep", hex: "#1B4332", note: "Primary brand, headers, dark sections" },
  { name: "green-mid", hex: "#2D5A3D", note: "Secondary surfaces" },
  { name: "green-leaf", hex: "#52796F", note: "Accents, icons" },
  { name: "green-soft", hex: "#74A57F", note: "Highlights, strength-meter fill" },
  { name: "amber", hex: "#C9881F", note: "PRIMARY CTA — high contrast" },
  { name: "amber-light", hex: "#D4A24E", note: "Hover, secondary accent" },
  { name: "cream", hex: "#F7F3E9", note: "Page background, warm" },
  { name: "charcoal", hex: "#2A2A24", note: "Body text" },
  { name: "white", hex: "#FFFFFF", note: "Surfaces" },
];

const SAMPLE_VARIANTS = [
  { label: "250g", price: 299, mrp: 349 },
  { label: "500g", price: 549, mrp: 649 },
  { label: "1kg", price: 999, mrp: 1199 },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-charcoal/10 py-12">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-green-leaf">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Styleguide() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-leaf">
          SAMAAYA Design System
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl">The Right Moment.</h1>
        <p className="mt-4 max-w-xl text-charcoal/70">
          Verify tokens, typography, and components here before building
          features. Primary CTAs are <strong>amber</strong> — never
          green-on-green.
        </p>
      </header>

      {/* COLORS */}
      <Section title="Color tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COLORS.map((c) => (
            <div
              key={c.name}
              className="overflow-hidden rounded-xl border border-charcoal/10 bg-white"
            >
              <div
                className="h-20 w-full border-b border-black/5"
                style={{ backgroundColor: c.hex }}
              />
              <div className="p-3">
                <p className="font-semibold text-charcoal">{c.name}</p>
                <p className="font-mono text-xs text-charcoal/60">{c.hex}</p>
                <p className="mt-1 text-xs text-charcoal/50">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TYPOGRAPHY */}
      <Section title="Typography">
        <div className="space-y-4">
          <div>
            <span className="text-xs text-charcoal/50">Display / Fraunces — H1</span>
            <h1 className="text-5xl">Some moments deserve a better cup.</h1>
          </div>
          <div>
            <span className="text-xs text-charcoal/50">Display / Fraunces — H2</span>
            <h2 className="text-3xl">Six teas. Pick your moment.</h2>
          </div>
          <div>
            <span className="text-xs text-charcoal/50">Body / Inter</span>
            <p className="max-w-2xl text-base text-charcoal/80">
              Most tea sits in a warehouse for up to two years before it reaches
              you. SAMAAYA doesn&apos;t. We bring it fresh from Assam&apos;s
              finest estates — so the cup in your hand is as alive as the garden
              it came from.
            </p>
          </div>
          <div>
            <span className="text-xs text-charcoal/50">Eyebrow / overline</span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-leaf">
              Fresh from Assam&apos;s finest estates
            </p>
          </div>
        </div>
      </Section>

      {/* BUTTONS */}
      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Shop the Range</Button>
          <Button variant="ghost">Why Fresh Matters</Button>
          <Button variant="primary" size="sm">
            Add to Cart
          </Button>
          <Button variant="primary" size="lg">
            Place Order
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <p className="mt-4 text-xs text-charcoal/50">
          Primary = amber fill · Ghost = green outline · sizes sm/md/lg.
        </p>
      </Section>

      {/* STRENGTH METER */}
      <Section title="Strength meter">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <StrengthMeter key={s} strength={s} />
          ))}
        </div>
      </Section>

      {/* STATUS PILLS */}
      <Section title="Status pills">
        <div className="flex flex-wrap gap-2">
          {[
            "new",
            "confirmed",
            "packed",
            "shipped",
            "delivered",
            "cancelled",
            "refunded",
          ].map((s) => (
            <StatusPill key={s} status={s} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["pending", "paid", "failed"].map((s) => (
            <StatusPill key={s} status={s} />
          ))}
        </div>
      </Section>

      {/* TRUST BADGES */}
      <Section title="Trust badges">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TrustBadge icon="🌱" title="Estate-sourced" text="Assam's finest gardens" />
          <TrustBadge icon="📦" title="Packed fresh" text="Never aged in storage" />
          <TrustBadge icon="🚚" title="Pan-India delivery" text="Fast, tracked dispatch" />
          <TrustBadge icon="🔒" title="Secure checkout" text="UPI, cards & netbanking" />
        </div>
      </Section>

      {/* FREE SHIPPING NUDGE */}
      <Section title="Free-shipping nudge">
        <div className="grid max-w-md gap-4">
          <FreeShippingNudge subtotal={350} threshold={599} />
          <FreeShippingNudge subtotal={650} threshold={599} />
        </div>
      </Section>

      {/* PRODUCT CARD */}
      <Section title="Product card">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            name="Assam Morning Gold"
            slug="assam-morning-gold"
            tastingNote="Malty, brisk, full-bodied — a proper wake-up cup."
            strength={5}
            image={{
              url: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=1200&q=80",
              alt: "Loose-leaf Assam black tea",
            }}
            variants={SAMPLE_VARIANTS}
          />
          <ProductCard
            name="Garden Green Calm"
            slug="garden-green-calm"
            tastingNote="Smooth, grassy, gently sweet — a mid-day reset."
            strength={2}
            image={{
              url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80",
              alt: "Fresh green tea leaves",
            }}
            variants={[{ label: "250g", price: 349 }, { label: "500g", price: 649 }]}
          />
          <ProductCard
            name="No-image fallback"
            slug="placeholder"
            tastingNote="Shows the empty-image state."
            strength={3}
            image={null}
            variants={[{ label: "250g", price: 299 }]}
          />
        </div>
      </Section>

      {/* MOMENT CARDS */}
      <Section title="Moment cards">
        <div className="grid gap-6 sm:grid-cols-3">
          <MomentCard
            moment="morning"
            icon="sun"
            title="Morning Energy"
            tagline="Wake up to something bold."
            description="The first cup of the day should mean it. Strong, brisk, and bright."
          />
          <MomentCard
            moment="afternoon"
            icon="cloud"
            title="Afternoon Calm"
            tagline="A pause that's actually yours."
            description="A smooth, balanced cup to slow the noise for a minute."
          />
          <MomentCard
            moment="evening"
            icon="moon"
            title="Evening Comfort"
            tagline="Wind down, gently."
            description="Lighter, softer, easy. The cup that tells your day it's okay to end."
          />
        </div>
      </Section>

      {/* SECTION DIVIDER */}
      <Section title="Section divider">
        <SectionDivider />
      </Section>

      {/* TESTIMONIALS */}
      <Section title="Testimonial cards">
        <div className="grid gap-6 sm:grid-cols-3">
          <TestimonialCard
            quote="You can actually taste how fresh it is. Nothing like the boxes from the supermarket."
            author="Ananya"
            location="Bengaluru"
          />
          <TestimonialCard
            quote="Became my daily morning cup within a week."
            author="Rohan"
            location="Pune"
          />
          <TestimonialCard
            quote="Ordered for the family, now everyone's hooked."
            author="Meera"
            location="Delhi"
            rating={4}
          />
        </div>
      </Section>
    </main>
  );
}
