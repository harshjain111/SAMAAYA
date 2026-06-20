/** Section 3 — The Fresh Difference (copy deck §3). The USP / moat, made visual. */
export function FreshDifference() {
  const rows: [string, string][] = [
    ["Aged in storage 1–2 years", "Packed fresh, shipped fast"],
    ["Heavily blended for consistency", "Sourced for character"],
    ["Flavour faded by the time you brew", "Flavour still alive in the cup"],
  ];

  return (
    <section id="fresh-difference" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-3xl sm:text-4xl">
          Tea is best when it&apos;s fresh. So why is most of it old?
        </h2>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-center text-charcoal/75">
          <p>
            Here&apos;s something the big brands won&apos;t tell you: most
            packaged tea is one to two years old by the time you brew it.
            It&apos;s harvested, stored, blended, warehoused, and shipped —
            slowly. Flavour fades with every passing month.
          </p>
          <p>
            We built SAMAAYA to do the opposite. We source at peak, taste hard,
            pack fresh, and move fast. No long storage. No sitting on shelves
            losing its soul. Just tea the way it&apos;s meant to taste — bright,
            full, and unmistakably fresh.
          </p>
        </div>

        {/* Comparison block */}
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-charcoal/10">
          <div className="grid grid-cols-2 bg-white text-sm font-semibold">
            <div className="border-b border-r border-charcoal/10 p-4 text-charcoal/60">
              The usual way
            </div>
            <div className="border-b border-charcoal/10 bg-green-deep/5 p-4 text-green-deep">
              The SAMAAYA way
            </div>
          </div>
          {rows.map(([usual, samaaya], i) => (
            <div key={i} className="grid grid-cols-2 text-sm">
              <div className="border-r border-charcoal/10 p-4 text-charcoal/60">
                {usual}
              </div>
              <div className="bg-green-deep/5 p-4 font-medium text-green-deep">
                {samaaya}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center italic text-charcoal/70">
          You can taste the difference freshness makes. That&apos;s the whole
          point.
        </p>
      </div>
    </section>
  );
}
