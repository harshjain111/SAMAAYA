import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import type { Moment } from "@/types/database";

export interface MomentCardProps {
  moment: Moment;
  icon: IconName;
  title: string;
  tagline: string;
  description: string;
  ctaLabel?: string;
  className?: string;
}

/** Moment card — the emotional "find your moment" layer (PRD §5.1 §5). */
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
        "group flex flex-col card card-hover p-6",
        className,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-soft/15 text-green-deep transition-colors group-hover:bg-green-deep group-hover:text-cream">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 font-display text-xl">{title}</h3>
      <p className="mt-1 text-sm font-medium italic text-green-leaf">{tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/65">
        {description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber transition-colors group-hover:text-amber-light">
        {ctaLabel}
        <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
