import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const revalidate = 3600;

interface Policy {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

/**
 * Default policy copy — honest and India/Razorpay-appropriate. Owner edits the
 * [bracketed] specifics. Replace with final legal text before launch.
 */
const POLICIES: Record<string, Policy> = {
  shipping: {
    title: "Shipping Policy",
    intro: "We pack fresh and dispatch fast, with tracking all the way.",
    sections: [
      {
        heading: "Dispatch time",
        body: [
          "Orders are usually packed and dispatched within [1–2] business days.",
          "You'll receive tracking details by email (and WhatsApp) as soon as your order ships.",
        ],
      },
      {
        heading: "Delivery time",
        body: [
          "Typical delivery is [3–7] business days depending on your location in India.",
          "We currently ship across India only.",
        ],
      },
      {
        heading: "Shipping charges",
        body: [
          "Shipping is calculated at checkout. Orders above [₹X] ship free.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    intro: "Tea is a consumable, but we stand behind every pack.",
    sections: [
      {
        heading: "Damaged or wrong items",
        body: [
          "If your order arrives damaged, or you received the wrong item, contact us within [48 hours] of delivery with photos at [email]. We'll make it right with a replacement or refund.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Approved refunds are issued to your original payment method via Razorpay within [5–7] business days.",
          "Opened or used food products cannot be returned for hygiene reasons unless they were defective.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "We collect only what we need to fulfil your order.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Your name, contact details, and shipping address to process and deliver orders.",
          "Payment is handled securely by Razorpay — we never store your card details.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To fulfil orders, send order/shipping updates, and provide support.",
          "We do not sell your personal data.",
        ],
      },
      {
        heading: "Contact",
        body: ["For any privacy request, email us at [email]."],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "The basics of buying from SAMAAYA.",
    sections: [
      {
        heading: "Orders & pricing",
        body: [
          "All prices are in INR and inclusive of applicable taxes unless stated otherwise.",
          "We reserve the right to cancel orders in cases of pricing errors or stock issues; you'll be refunded in full.",
        ],
      },
      {
        heading: "Use of the site",
        body: [
          "By placing an order you confirm the details you provide are accurate.",
          "Product imagery is indicative; natural tea may vary slightly batch to batch.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return { title: policy ? policy.title : "Policy" };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();
  const settings = await getStoreSettings();

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl sm:text-4xl">{policy.title}</h1>
        <p className="mt-3 text-charcoal/70">{policy.intro}</p>
        <div className="mt-8 space-y-8">
          {policy.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2 text-charcoal/75">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-charcoal/50">
          Questions? Email{" "}
          {settings.contact_email ? (
            <a href={`mailto:${settings.contact_email}`} className="font-medium text-green-deep underline">
              {settings.contact_email}
            </a>
          ) : (
            "us"
          )}
          .
        </p>
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
