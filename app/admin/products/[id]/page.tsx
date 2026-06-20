import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminProduct,
  getProductsForRelatedPicker,
} from "@/lib/data/admin-products";
import { ProductForm } from "@/components/admin/ProductForm";
import { VariantsEditor } from "@/components/admin/VariantsEditor";
import { ImageManager } from "@/components/admin/ImageManager";
import { RelatedEditor } from "@/components/admin/RelatedEditor";

export const metadata: Metadata = { title: "Admin · Edit product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, allProducts] = await Promise.all([
    getAdminProduct(id),
    getProductsForRelatedPicker(id),
  ]);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/products" className="text-sm text-charcoal/50 hover:text-green-deep">
          ← Products
        </Link>
        <Link
          href={`/product/${data.product.slug}`}
          target="_blank"
          className="text-sm font-medium text-amber hover:text-amber-light"
        >
          View in store ↗
        </Link>
      </div>

      <h1 className="mt-3 text-2xl font-semibold text-green-deep">
        {data.product.name}
      </h1>

      <div className="mt-6 space-y-6">
        <ProductForm product={data.product} />
        <VariantsEditor productId={data.product.id} variants={data.variants} />
        <ImageManager productId={data.product.id} images={data.images} />
        <RelatedEditor
          productId={data.product.id}
          allProducts={allProducts}
          selectedIds={data.relatedIds}
        />
      </div>
    </div>
  );
}
