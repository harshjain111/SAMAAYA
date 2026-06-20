import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "SAMAAYA design system — tokens, type, and buttons.",
};

const COLORS: { name: string; varName: string; hex: string; note: string }[] = [
  { name: "green-deep", varName: "--color-green-deep", hex: "#1B4332", note: "Primary brand, headers, dark sections" },
  { name: "green-mid", varName: "--color-green-mid", hex: "#2D5A3D", note: "Secondary surfaces" },
  { name: "green-leaf", varName: "--color-green-leaf", hex: "#52796F", note: "Accents, icons" },
  { name: "green-soft", varName: "--color-green-soft", hex: "#74A57F", note: "Highlights, strength-meter fill" },
  { name: "amber", varName: "--color-amber", hex: "#C9881F", note: "PRIMARY CTA — high contrast" },
  { name: "amber-light", varName: "--color-amber-light", hex: "#D4A24E", note: "Hover, secondary accent" },
  { name: "cream", varName: "--color-cream", hex: "#F7F3E9", note: "Page background, warm" },
  { name: "charcoal", varName: "--color-charcoal", hex: "#2A2A24", note: "Body text" },
  { name: "white", varName: "--color-white", hex: "#FFFFFF", note: "Surfaces" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
          features. Primary CTAs are <strong>amber</strong> — never green-on-green.
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
            <span className="text-xs text-charcoal/50">Display / Fraunces — H3</span>
            <h3 className="text-2xl">From the garden to your cup — fast.</h3>
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
          <button className="inline-flex items-center rounded-full bg-amber px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-light">
            Shop the Range
          </button>
          <button className="inline-flex items-center rounded-full border-2 border-green-deep px-6 py-3 font-semibold text-green-deep transition-colors hover:bg-green-deep hover:text-white">
            Why Fresh Matters
          </button>
          <button
            className="inline-flex items-center rounded-full bg-amber px-6 py-3 font-semibold text-white opacity-50"
            disabled
          >
            Disabled
          </button>
        </div>
        <p className="mt-4 text-xs text-charcoal/50">
          Primary = amber (fill). Ghost = green outline. The full Button
          component lands in Prompt 1.1.
        </p>
      </Section>

      {/* SURFACES */}
      <Section title="Surfaces & contrast">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-green-deep p-6">
            <h3 className="text-white">Dark green section</h3>
            <p className="mt-2 text-sm text-cream/80">
              Amber CTA pops against deep green — the top conversion lever.
            </p>
            <button className="mt-4 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-light">
              Add to Cart
            </button>
          </div>
          <div className="rounded-xl border border-charcoal/10 bg-cream p-6">
            <h3>Cream section</h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Warm background, generous whitespace, premium feel.
            </p>
            <button className="mt-4 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-light">
              Add to Cart
            </button>
          </div>
        </div>
      </Section>
    </main>
  );
}
