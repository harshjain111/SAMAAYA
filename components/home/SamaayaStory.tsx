import Link from "next/link";
import { Icon } from "@/components/ui";

/** Section 7 — The Samaaya Story (copy deck §7). Honest, no fake heritage. */
export function SamaayaStory() {
  return (
    <section className="grain relative overflow-hidden bg-green-deep text-cream">
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-green-soft/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="flex items-center gap-3">
          <span className="h-px w-7 bg-amber" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-light">
            Our story
          </p>
        </div>
        <h2 className="mt-5 text-balance font-display text-3xl leading-tight text-cream sm:text-4xl">
          We&apos;re new. That&apos;s exactly why we&apos;re better.
        </h2>
        <div className="mt-6 space-y-4 text-cream/80 sm:text-lg">
          <p>
            SAMAAYA started with a simple frustration: the tea most of us drink
            isn&apos;t fresh. It&apos;s aged, blended, and stripped of the thing
            that made it special in the first place.
          </p>
          <p>
            So we spent our time where it matters — across Assam&apos;s tea
            gardens, tasting and obsessing over what a truly fresh cup should
            taste like. We didn&apos;t inherit a hundred-year-old playbook. We
            built a better one.
          </p>
        </div>

        <blockquote className="mt-8 border-l-2 border-amber pl-5 font-display text-xl leading-snug text-cream/95 sm:text-2xl">
          No middlemen dulling the leaf. No warehouse stealing its life. Just
          fresh tea, from a real place, for a real moment.
        </blockquote>

        <Link
          href="/about"
          className="mt-8 inline-flex items-center gap-1.5 font-semibold text-amber-light transition-colors hover:text-amber"
        >
          Read our full story
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </section>
  );
}
