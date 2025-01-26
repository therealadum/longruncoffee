import { Product } from "../types";

export function get_display_product_price(product: Product) {
  // default to product-level compare at and price
  let compare_at_price = product.compare_at_price || product.price;
  let price = product.price;

  if (product.variants.length) {
    // find the cheapest variant and use that compare at / cheapeast price
    const sorted_variants_by_price = product.variants.sort(
      (a, b) => a.price - b.price,
    );
    const cheapest_variant = sorted_variants_by_price[0];
    compare_at_price = cheapest_variant.compare_at_price || product.price;
    price = cheapest_variant.price;
  }
  return {
    compare_at_price,
    price,
  };
}
