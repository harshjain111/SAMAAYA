import Link from "next/link";

/** Section 7 — The Samaaya Story (copy deck §7). Short, honest, no fake heritage. */
export function SamaayaStory() {
  return (
    <section className="bg-green-deep text-cream">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl text-cream sm:text-4xl">
          We&apos;re new. That&apos;s exactly why we&apos;re better.
        </h2>
        <div className="mt-6 space-y-4 text-cream/85">
          <p>
            SAMAAYA started with a simple frustration: the tea most of us drink
            isn&apos;t fresh. It&apos;s aged, blended, and stripped of the thing
            that made it special in the first place.
          </p>
          <p>
            So we spent our time where it matters — across Assam&apos;s tea
            gardens, tasting, learning, and obsessing over what a truly fresh cup
            should taste like. We didn&apos;t inherit a hundred-year-old
            playbook. We built a better one, using everything we know today about
            sourcing, freshness, and flavour.
          </p>
          <p>
            Assam makes some of the finest tea on earth. We make sure it reaches
            you while it&apos;s still at its best.
          </p>
          <p>
            No middlemen dulling the leaf. No warehouse stealing its life. Just
            fresh tea, from a real place, for a real moment.
          </p>
          <p>That moment is yours. We just make it worth it.</p>
        </div>
        <Link
          href="/about"
          className="mt-8 inline-block font-semibold text-amber-light hover:text-amber"
        >
          Read our full story →
        </Link>
      </div>
    </section>
  );
}
