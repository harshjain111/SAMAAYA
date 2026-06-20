import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Moment } from "@/types/database";

const MOMENTS: { value: Moment | "all"; label: string }[] = [
  { value: "all", label: "All moments" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

const STRENGTHS: { value: string; label: string }[] = [
  { value: "all", label: "Any strength" },
  { value: "1", label: "Light" },
  { value: "2", label: "Mild" },
  { value: "3", label: "Medium" },
  { value: "4", label: "Strong" },
  { value: "5", label: "Bold" },
];

function chipHref(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "all") sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export interface ShopFiltersProps {
  moment?: string;
  strength?: string;
}

/** Filter chips for /shop — links that set query params (PRD §3.1). */
export function ShopFilters({ moment = "all", strength = "all" }: ShopFiltersProps) {
  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-sm transition-colors",
      active
        ? "border-green-deep bg-green-deep text-white"
        : "border-charcoal/20 text-charcoal/70 hover:border-green-deep",
    );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by moment">
        {MOMENTS.map((m) => (
          <Link
            key={m.value}
            href={chipHref({ moment: m.value, strength })}
            className={chip((moment || "all") === m.value)}
          >
            {m.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by strength">
        {STRENGTHS.map((s) => (
          <Link
            key={s.value}
            href={chipHref({ moment, strength: s.value })}
            className={chip((strength || "all") === s.value)}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
