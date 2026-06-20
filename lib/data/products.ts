import { createPublicClient } from "@/lib/supabase/public";
import type { CardVariant } from "@/components/ui";
import type { Moment } from "@/types/database";

/** Product shape ready to feed ProductCard + listing pages. */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  tastingNote: string | null;
  strength: number | null;
  moment: Moment | null;
  featured: boolean;
  image: { url: string; alt: string | null } | null;
  variants: CardVariant[];
  /** Lowest active variant price, for "From ₹X" and sorting. */
  priceFrom: number;
}

// Raw row shapes from the nested select.
interface RawVariant {
  id: string;
  label: string;
  price: number | string;
  mrp: number | string | null;
  active: boolean;
  sort_order: number;
}
interface RawImage {
  url: string;
  alt: string | null;
  sort_order: number;
}
interface RawProduct {
  id: string;
  name: string;
  slug: string;
  short_tasting_note: string | null;
  strength: number | null;
  moment: Moment | null;
  featured: boolean;
  sort_order: number;
  product_variants: RawVariant[];
  product_images: RawImage[];
}

const num = (v: number | string | null): number | null =>
  v === null ? null : typeof v === "string" ? parseFloat(v) : v;

function mapProduct(p: RawProduct): ProductListItem {
  const variants: CardVariant[] = (p.product_variants ?? [])
    .filter((v) => v.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      label: v.label,
      price: num(v.price) ?? 0,
      mrp: num(v.mrp),
    }));

  const image =
    (p.product_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ url: i.url, alt: i.alt }))[0] ?? null;

  const priceFrom = variants.length
    ? Math.min(...variants.map((v) => v.price))
    : 0;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tastingNote: p.short_tasting_note,
    strength: p.strength,
    moment: p.moment,
    featured: p.featured,
    image,
    variants,
    priceFrom,
  };
}

const SELECT = `
  id, name, slug, short_tasting_note, strength, moment, featured, sort_order,
  product_variants ( id, label, price, mrp, active, sort_order ),
  product_images ( url, alt, sort_order )
`;

/** All active products, ordered by sort_order. RLS restricts to active rows. */
export async function getActiveProducts(options?: {
  moment?: Moment;
}): Promise<ProductListItem[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (options?.moment) query = query.eq("moment", options.moment);

  const { data, error } = await query;
  if (error) {
    console.error("[getActiveProducts]", error.message);
    return [];
  }
  // Drop products with no buyable variant.
  return (data as unknown as RawProduct[])
    .map(mapProduct)
    .filter((p) => p.variants.length > 0);
}
