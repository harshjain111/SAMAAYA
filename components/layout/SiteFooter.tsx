import Link from "next/link";

export interface SiteFooterProps {
  storeName?: string;
}

/** Footer — section 9 of the homepage (copy deck "FOOTER"). */
export function SiteFooter({ storeName = "SAMAAYA" }: SiteFooterProps) {
  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: "Shop",
      links: [
        { href: "/shop", label: "All teas" },
        { href: "/shop?moment=morning", label: "Morning" },
        { href: "/shop?moment=afternoon", label: "Afternoon" },
        { href: "/shop?moment=evening", label: "Evening" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/track", label: "Track Order" },
      ],
    },
    {
      title: "Policies",
      links: [
        { href: "/policies/shipping", label: "Shipping" },
        { href: "/policies/returns", label: "Returns" },
        { href: "/policies/privacy", label: "Privacy" },
        { href: "/policies/terms", label: "Terms" },
      ],
    },
  ];

  return (
    <footer className="bg-green-deep text-cream">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-2xl font-semibold">{storeName}</p>
            <p className="mt-1 text-sm italic text-cream/70">The Right Moment.</p>
            <form className="mt-6 max-w-xs">
              <label className="text-sm text-cream/80">
                Fresh tea, fresh offers. No spam.
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-full bg-cream/10 px-4 py-2 text-sm text-cream placeholder:text-cream/50 focus-visible:outline-2 focus-visible:outline-amber"
                />
                <button
                  type="submit"
                  className="rounded-full bg-amber px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-light"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold uppercase tracking-wider text-cream/60">
                {c.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-cream/85 transition-colors hover:text-amber-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/15 pt-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {storeName}. Fresh from Assam.
          </p>
          <p className="flex flex-wrap gap-3">
            <span>UPI</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>RuPay</span>
            <span>Razorpay Secured</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
