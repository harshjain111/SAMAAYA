import { cn } from "@/lib/cn";

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
    <figure
      className={cn(
        "flex flex-col rounded-2xl border border-charcoal/10 bg-white p-6",
        className,
      )}
    >
      <div
        className="text-amber"
        aria-label={`${stars} out of 5 stars`}
        role="img"
      >
        <span aria-hidden="true">
          {"★".repeat(stars)}
          <span className="text-amber/25">{"★".repeat(5 - stars)}</span>
        </span>
      </div>
      <blockquote className="mt-3 flex-1 text-charcoal/80">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-green-deep">
        {author}
        {location && (
          <span className="font-normal text-charcoal/50">, {location}</span>
        )}
      </figcaption>
    </figure>
  );
}
