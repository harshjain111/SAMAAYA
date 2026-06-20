import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Moment } from "@/types/database";

export interface MomentCardProps {
  moment: Moment;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  ctaLabel?: string;
  className?: string;
}

/**
 * Moment card — the emotional "find your moment" layer (PRD §5.1 §5).
 * Links to the moment-filtered shop. The whole card is clickable.
 */
export function MomentCard({
  moment,
  icon,
  title,
  tagline,
  description,
  ctaLabel = "Shop these teas",
  className,
}: MomentCardProps) {
  return (
    <Link
      href={`/shop?moment=${moment}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-charcoal/10 bg-white p-6",
        "transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
        className,
      )}
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <h3 className="mt-3 text-xl">{title}</h3>
      <p className="mt-1 text-sm font-medium italic text-green-leaf">{tagline}</p>
      <p className="mt-3 flex-1 text-sm text-charcoal/70">{description}</p>
      <span className="mt-4 text-sm font-semibold text-amber group-hover:text-amber-light">
        {ctaLabel} →
      </span>
    </Link>
  );
}
