import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "dark" | "light"; // dark text on light bg | light text on dark bg
  className?: string;
}

/** Consistent section heading: eyebrow + serif title + optional subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-3",
            centered && "justify-center",
          )}
        >
          <span className="h-px w-7 bg-amber" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
            {eyebrow}
          </p>
          {centered && <span className="h-px w-7 bg-amber" />}
        </div>
      )}
      <h2
        className={cn(
          "mt-4 text-balance font-display text-3xl leading-tight sm:text-4xl",
          tone === "dark" ? "text-green-deep" : "text-cream",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-pretty leading-relaxed",
            tone === "dark" ? "text-charcoal/65" : "text-cream/75",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
