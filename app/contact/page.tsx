import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactForm } from "@/components/home/ContactForm";
import { normalizePhoneForWa } from "@/lib/notify/whatsapp";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions, bulk orders, or wholesale? We're listening.",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const waUrl = settings.whatsapp_number
    ? `https://wa.me/${normalizePhoneForWa(settings.whatsapp_number)}?text=${encodeURIComponent("Hi SAMAAYA, I have a question.")}`
    : null;

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl sm:text-4xl">Questions? We&apos;re listening.</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <ContactForm contactEmail={settings.contact_email} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-6">
              <h2 className="text-xl">Reach us directly</h2>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
                {settings.contact_email && (
                  <li>
                    Email:{" "}
                    <a href={`mailto:${settings.contact_email}`} className="font-medium text-green-deep underline">
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings.whatsapp_number && <li>WhatsApp: {settings.whatsapp_number}</li>}
              </ul>
            </div>

            <div className="rounded-2xl bg-cream p-6">
              <h2 className="text-xl">Buying for your café, office, or shop?</h2>
              <p className="mt-2 text-sm text-charcoal/75">
                Get SAMAAYA at wholesale rates, fresh and direct. Message us for a quick quote.
              </p>
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center rounded-full bg-amber px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-light"
                >
                  Chat on WhatsApp →
                </a>
              ) : (
                <p className="mt-3 text-sm text-charcoal/50">WhatsApp number coming soon.</p>
              )}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
