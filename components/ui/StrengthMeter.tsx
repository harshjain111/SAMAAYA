import { cn } from "@/lib/cn";

const LABELS: Record<number, string> = {
  1: "Light",
  2: "Mild",
  3: "Medium",
  4: "Strong",
  5: "Bold",
};

export interface StrengthMeterProps {
  /** 1–5 (PRD strength meter). Values are clamped to this range. */
  strength: number;
  max?: number;
  /** Show the word label (Light…Bold) next to the bars. */
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Strength meter — 1–5 bars, green-soft fill (PRD §5.2). Accessible: exposes a
 * text label via aria so it isn't conveyed by colour alone.
 */
export function StrengthMeter({
  strength,
  max = 5,
  showLabel = true,
  size = "md",
  className,
}: StrengthMeterProps) {
  const value = Math.max(0, Math.min(max, Math.round(strength)));
  const word = LABELS[value] ?? `${value}/${max}`;
  const barH = size === "sm" ? "h-1.5" : "h-2";
  const barW = size === "sm" ? "w-4" : "w-6";

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="img"
      aria-label={`Strength ${value} of ${max} (${word})`}
    >
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn(
              "rounded-full transition-colors",
              barH,
              barW,
              i < value ? "bg-green-soft" : "bg-green-soft/20",
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-charcoal/60" aria-hidden="true">
          {word}
        </span>
      )}
    </div>
  );
}
