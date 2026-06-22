import { TestimonialCard, Icon } from "@/components/ui";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "./SectionHeading";
import { normalizePhoneForWa } from "@/lib/notify/whatsapp";

export interface SocialProofBulkContactProps {
  whatsappNumber?: string | null;
  contactEmail?: string | null;
}

/** Section 8 — Social proof + bulk/wholesale + contact (copy deck §8). */
export function SocialProofBulkContact({
  whatsappNumber,
  contactEmail,
}: SocialProofBulkContactProps) {
  const waUrl = whatsappNumber
    ? `https://wa.me/${normalizePhoneForWa(whatsappNumber)}?text=${encodeURIComponent(
        "Hi SAMAAYA, I'd like a wholesale/bulk quote.",
      )}`
    : null;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="In their words" title="The moment, in their words." />

        <div className="mt-12 grid gap-5 sm:grid-cols-3 sm:gap-6">
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
          />
        </div>

        {/* Bulk + Contact */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="grain relative flex flex-col justify-center overflow-hidden rounded-3xl bg-green-deep p-8 text-cream sm:p-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber/15 blur-3xl" />
            <h3 className="font-display text-2xl text-cream">
              Buying for your café, office, or shop?
            </h3>
            <p className="mt-3 max-w-md text-cream/75">
              Get SAMAAYA at wholesale rates, fresh and direct. Message us for a
              quick quote.
            </p>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-amber px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-light"
              >
                Chat on WhatsApp
                <Icon name="arrow-right" size={18} />
              </a>
            ) : (
              <p className="mt-6 text-sm text-cream/50">WhatsApp number coming soon.</p>
            )}
          </div>

          <div className="card p-8 sm:p-10">
            <h3 className="font-display text-2xl text-green-deep">
              Questions? We&apos;re listening.
            </h3>
            <div className="mt-5">
              <ContactForm contactEmail={contactEmail} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
