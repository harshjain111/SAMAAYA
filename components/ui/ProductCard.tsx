"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { buttonClasses } from "./Button";
import { StrengthMeter } from "./StrengthMeter";

export interface CardVariant {
  id?: string;
  label: string; // "250g"
  price: number;
  mrp?: number | null;
}

export interface ProductCardProps {
  name: string;
  slug: string;
  tastingNote?: string | null;
  strength?: number | null;
  image?: { url: string; alt?: string | null } | null;
  variants: CardVariant[];
  /** Inline add-to-cart (wired in Prompt 2.1). Optional → button still renders. */
  onAddToCart?: (variant: CardVariant) => void;
  className?: string;
  priority?: boolean;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/**
 * Product card (PRD §5.2). Image, name, tasting note, StrengthMeter, "From ₹X",
 * size selector with LIVE price update, and inline Add to Cart. Mobile-first.
 */
export function ProductCard({
  name,
  slug,
  tastingNote,
  strength,
  image,
  variants,
  onAddToCart,
  className,
  priority = false,
}: ProductCardProps) {
  const sorted = [...variants].sort((a, b) => a.price - b.price);
  const minPrice = sorted.length ? sorted[0].price : 0;
  const [selected, setSelected] = useState<CardVariant | undefined>(sorted[0]);

  const price = selected?.price ?? minPrice;
  const mrp = selected?.mrp ?? null;
  const isEntry = selected?.label === sorted[0]?.label;

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white",
        "transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <Link
        href={`/product/${slug}`}
        className="relative block aspect-square overflow-hidden bg-cream"
      >
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-green-leaf/40">
            <span className="text-sm">No image</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${slug}`} className="block">
          <h3 className="text-lg leading-snug">{name}</h3>
        </Link>
        {tastingNote && (
          <p className="mt-1 line-clamp-2 text-sm text-charcoal/60">
            {tastingNote}
          </p>
        )}

        {typeof strength === "number" && (
          <StrengthMeter strength={strength} size="sm" className="mt-3" />
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          {isEntry && sorted.length > 1 && (
            <span className="text-xs text-charcoal/50">From</span>
          )}
          <span className="text-xl font-semibold text-green-deep">
            {inr(price)}
          </span>
          {mrp && mrp > price && (
            <span className="text-sm text-charcoal/40 line-through">
              {inr(mrp)}
            </span>
          )}
        </div>

        {/* Size selector — live price update */}
        {sorted.length > 1 && (
          <div
            className="mt-3 flex flex-wrap gap-1.5"
            role="group"
            aria-label="Select size"
          >
            {sorted.map((v) => {
              const active = v.label === selected?.label;
              return (
                <button
                  key={v.id ?? v.label}
                  type="button"
                  onClick={() => setSelected(v)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-green-deep bg-green-deep text-white"
                      : "border-charcoal/20 text-charcoal/70 hover:border-green-deep",
                  )}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Inline Add to Cart */}
        <button
          type="button"
          onClick={() => selected && onAddToCart?.(selected)}
          className={cn(buttonClasses("primary", "sm"), "mt-4 w-full")}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
