import { MomentCard } from "@/components/ui";
import { SectionHeading } from "./SectionHeading";

/** Section 5 — Find Your Moment (copy deck §5). Three moment cards. */
export function FindYourMoment() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Find your moment"
          title={'Samaaya means "the right moment." Here\'s yours.'}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-3 sm:gap-6">
          <MomentCard
            moment="morning"
            icon="sun"
            title="Morning Energy"
            tagline="Wake up to something bold."
            description="The first cup of the day should mean it. Strong, brisk, and bright enough to start anything."
            ctaLabel="Shop morning teas"
          />
          <MomentCard
            moment="afternoon"
            icon="cloud"
            title="Afternoon Calm"
            tagline="A pause that's actually yours."
            description="The middle of the day needs a breath. A smooth, balanced cup to slow the noise for a minute."
            ctaLabel="Shop afternoon teas"
          />
          <MomentCard
            moment="evening"
            icon="moon"
            title="Evening Comfort"
            tagline="Wind down, gently."
            description="Lighter, softer, easy. The kind of cup that tells your day it's okay to end."
            ctaLabel="Shop evening teas"
          />
        </div>
      </div>
    </section>
  );
}
