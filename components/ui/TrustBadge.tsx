import { cn } from "@/lib/cn";

export interface TrustBadgeProps {
  /** Emoji or icon node. */
  icon: React.ReactNode;
  title: string;
  text?: string;
  /** Stacked (cards) vs inline (thin trust strip). */
  layout?: "stacked" | "inline";
  className?: string;
}

/** Trust badge — credibility item (PRD §5.1 trust strip, §6.5). */
export function TrustBadge({
  icon,
  title,
  text,
  layout = "inline",
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        layout === "stacked"
          ? "flex-col items-center text-center"
          : "items-center",
        className,
      )}
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-green-deep">{title}</p>
        {text && <p className="text-sm text-charcoal/60">{text}</p>}
      </div>
    </div>
  );
}
