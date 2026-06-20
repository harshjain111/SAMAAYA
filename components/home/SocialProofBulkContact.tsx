import { TestimonialCard } from "@/components/ui";
import { ContactForm } from "./ContactForm";
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
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Testimonials */}
        <h2 className="text-center text-3xl sm:text-4xl">
          The moment, in their words.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
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
        <div className="mt-16 grid gap-10 rounded-3xl bg-cream p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <h3 className="text-2xl">Buying for your café, office, or shop?</h3>
            <p className="mt-3 text-charcoal/75">
              Get SAMAAYA at wholesale rates, fresh and direct. Message us for a
              quick quote.
            </p>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center rounded-full bg-amber px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-light"
              >
                Chat on WhatsApp →
              </a>
            ) : (
              <p className="mt-5 text-sm text-charcoal/50">
                WhatsApp number coming soon.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-2xl">Questions? We&apos;re listening.</h3>
            <div className="mt-5">
              <ContactForm contactEmail={contactEmail} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
