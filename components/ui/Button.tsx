import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Shared button classes — also usable on <Link>/<a> so links can look like
 * buttons without duplicating styles.
 * CTA rule (CLAUDE.md): primary = AMBER. Never green-on-green.
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold",
    "transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
    variant === "primary" &&
      "bg-amber text-white hover:bg-amber-light active:bg-amber-light",
    variant === "ghost" &&
      "border-2 border-green-deep text-green-deep hover:bg-green-deep hover:text-white",
    size === "sm" && "px-4 py-2 text-sm",
    size === "md" && "px-6 py-3 text-base",
    size === "lg" && "px-8 py-4 text-lg",
    className,
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", fullWidth, className, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={buttonClasses(
          variant,
          size,
          cn(fullWidth && "w-full", className),
        )}
        {...props}
      />
    );
  },
);
