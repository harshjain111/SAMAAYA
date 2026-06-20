import { cn } from "@/lib/cn";

export interface SectionDividerProps {
  className?: string;
}

/**
 * Section divider — a subtle, low-opacity tea-leaf sprig flanked by thin rules
 * (PRD §6.3, never loud). Decorative only.
 */
export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-4 py-8", className)}
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-green-leaf/20 sm:w-24" />
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        className="text-green-leaf/40"
      >
        {/* Simple tea-leaf motif */}
        <path
          d="M12 2c5 3 7 7 7 11a7 7 0 0 1-14 0c0-4 2-8 7-11Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <path
          d="M12 5c0 5 0 10 0 15M12 9l3-2M12 13l-3-2M12 17l3-2"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="h-px w-16 bg-green-leaf/20 sm:w-24" />
    </div>
  );
}
