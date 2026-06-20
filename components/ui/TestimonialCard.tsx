import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  /** City or location, shown after the name. */
  location?: string;
  rating?: number; // 0–5
  className?: string;
}

/** Testimonial card — social proof (PRD §5.1 §8, §6.5). */
export function TestimonialCard({
  quote,
  author,
  location,
  rating = 5,
  className,
}: TestimonialCardProps) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <figure className={cn("flex flex-col card p-6", className)}>
      <div
        className="flex gap-0.5 text-amber"
        aria-label={`${stars} out of 5 stars`}
        role="img"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Icon
            key={i}
            name="star"
            size={16}
            filled={i < stars}
            className={i < stars ? "text-amber" : "text-amber/25"}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed text-charcoal/80">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 text-sm font-semibold text-green-deep">
        {author}
        {location && (
          <span className="font-normal text-charcoal/50">, {location}</span>
        )}
      </figcaption>
    </figure>
  );
}
