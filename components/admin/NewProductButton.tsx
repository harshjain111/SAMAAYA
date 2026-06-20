import { createProduct } from "@/lib/actions/products";
import { buttonClasses } from "@/components/ui";

/** Creates a draft product and redirects to its editor (server action). */
export function NewProductButton() {
  return (
    <form action={createProduct}>
      <button type="submit" className={buttonClasses("primary", "sm")}>
        + New product
      </button>
    </form>
  );
}
