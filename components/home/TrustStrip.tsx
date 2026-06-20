import { TrustBadge } from "@/components/ui";

/** Section 2 — Trust strip (copy deck §2). Four credibility items. */
export function TrustStrip() {
  return (
    <section className="border-b border-charcoal/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4">
        <TrustBadge icon="🌱" title="Estate-sourced" text="From Assam's finest gardens" />
        <TrustBadge icon="📦" title="Packed fresh" text="Never aged in storage" />
        <TrustBadge icon="🚚" title="Pan-India delivery" text="Fast, tracked dispatch" />
        <TrustBadge icon="🔒" title="Secure checkout" text="UPI, cards & netbanking" />
      </div>
    </section>
  );
}
