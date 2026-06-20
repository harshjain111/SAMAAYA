"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ProductImageItem } from "@/lib/data/products";

export interface ProductGalleryProps {
  images: ProductImageItem[];
  name: string;
}

/** Product image gallery — main image + thumbnail selector. */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        {main ? (
          <Image
            src={main.url}
            alt={main.alt || name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-green-leaf/40">
            No image
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-green-deep" : "border-transparent",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${name} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
