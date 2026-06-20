import { Icon, type IconName } from "@/components/ui";

const ITEMS: { icon: IconName; title: string; text: string }[] = [
  { icon: "leaf", title: "Estate-sourced", text: "From Assam's finest gardens" },
  { icon: "package", title: "Packed fresh", text: "Never aged in storage" },
  { icon: "truck", title: "Pan-India delivery", text: "Fast, tracked dispatch" },
  { icon: "shield", title: "Secure checkout", text: "UPI, cards & netbanking" },
];

/** Section 2 — Trust strip (copy deck §2). */
export function TrustStrip() {
  return (
    <section className="border-b border-charcoal/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-charcoal/10 px-6 py-7 sm:divide-x lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-center gap-3 px-2 py-2 sm:justify-center sm:px-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-soft/15 text-green-deep">
              <Icon name={it.icon} size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-green-deep">{it.title}</p>
              <p className="text-xs text-charcoal/55">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
