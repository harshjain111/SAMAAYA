import { Icon } from "@/components/ui";
import { SectionHeading } from "./SectionHeading";

const USUAL = [
  "Aged in storage 1–2 years",
  "Heavily blended for consistency",
  "Flavour faded by the time you brew",
];
const SAMAAYA = [
  "Packed fresh, shipped fast",
  "Sourced for character",
  "Flavour still alive in the cup",
];

/** Section 3 — The Fresh Difference (copy deck §3). The USP / moat. */
export function FreshDifference() {
  return (
    <section id="fresh-difference" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="The fresh difference"
          title="Tea is best when it's fresh. So why is most of it old?"
          subtitle="Most packaged tea is one to two years old by the time you brew it — harvested, stored, blended, and shipped slowly. We built SAMAAYA to do the opposite: source at peak, taste hard, pack fresh, and move fast."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {/* The usual way */}
          <div className="rounded-2xl border border-charcoal/10 bg-white/60 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-charcoal/45">
              The usual way
            </p>
            <ul className="mt-5 space-y-4">
              {USUAL.map((t) => (
                <li key={t} className="flex items-start gap-3 text-charcoal/55">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal/10 text-charcoal/40">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </span>
                  <span className="text-[15px]">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The SAMAAYA way */}
          <div className="grain relative overflow-hidden rounded-2xl bg-green-deep p-6 text-cream shadow-soft sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-soft/15 blur-2xl" />
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-light">
              The SAMAAYA way
            </p>
            <ul className="mt-5 space-y-4">
              {SAMAAYA.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-soft/25 text-cream">
                    <Icon name="check" size={13} />
                  </span>
                  <span className="text-[15px] text-cream/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-lg italic text-charcoal/70">
          You can taste the difference freshness makes. That&apos;s the whole point.
        </p>
      </div>
    </section>
  );
}
