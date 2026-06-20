import { SectionDivider } from "@/components/ui";

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Sourced at peak",
    body: "We travel Assam's estates and select leaf at its freshest, fullest moment.",
  },
  {
    n: "02",
    title: "Tasted & chosen",
    body: "Every batch is cupped and judged before it earns the SAMAAYA name. Most don't.",
  },
  {
    n: "03",
    title: "Packed fresh",
    body: "We pack soon after sourcing — no long warehousing, no flavour lost to time.",
  },
  {
    n: "04",
    title: "Shipped to you",
    body: "Dispatched fast and tracked all the way, so it arrives fresh and ready.",
  },
];

/** Section 6 — From Estate to Your Cup (copy deck §6). 4-step freshness journey. */
export function EstateToCup() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl sm:text-4xl">
          From the garden to your cup — fast.
        </h2>
        <SectionDivider />
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="font-display text-3xl font-semibold text-amber">
                {s.n}
              </span>
              <h3 className="mt-2 text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-charcoal/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
