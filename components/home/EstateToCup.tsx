import { SectionHeading } from "./SectionHeading";

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Sourced at peak", body: "We travel Assam's estates and select leaf at its freshest, fullest moment." },
  { n: "02", title: "Tasted & chosen", body: "Every batch is cupped and judged before it earns the SAMAAYA name. Most don't." },
  { n: "03", title: "Packed fresh", body: "We pack soon after sourcing — no long warehousing, no flavour lost to time." },
  { n: "04", title: "Shipped to you", body: "Dispatched fast and tracked all the way, so it arrives fresh and ready." },
];

/** Section 6 — From Estate to Your Cup (copy deck §6). */
export function EstateToCup() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="Estate to cup" title="From the garden to your cup — fast." />

        <ol className="mt-14 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative">
              {/* connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <span className="absolute left-12 top-5 hidden h-px w-full bg-charcoal/10 lg:block" />
              )}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-deep font-display text-sm font-semibold text-cream">
                {s.n}
              </div>
              <h3 className="mt-4 font-display text-lg text-green-deep">{s.title}</h3>
              <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-charcoal/65">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
