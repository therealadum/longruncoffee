import { ICartItem, IProduct, IVariant } from "../common/product";

export function convertProductToCartItem(
  product: IProduct,
  variant: IVariant,
): ICartItem {
  return {
    id: variant.id,
    properties: {},
    has_components: false,
    selling_plan_allocation: {},
    quantity: 1, // Assuming default quantity as 1
    variant_id: variant.id,
    key: `${variant.id}:${Math.random().toString(36).substring(2)}`, // Generate a random unique key
    title: variant.name,
    product_title: product.title,
    variant_title: variant.title,
    price: variant.price,
    original_price: variant.price,
    discounted_price: variant.price, // Assuming no discounts for now
    line_price: variant.price,
    original_line_price: variant.price,
    presentment_price: variant.price / 100, // Assuming price is in cents
    total_discount: 0, // Assuming no discounts for now
    discounts: [],
    sku: variant.sku,
    grams: variant.weight,
    vendor: product.vendor,
    taxable: variant.taxable,
    product_id: product.id,
    product_has_only_default_variant: product.variants.length === 1,
    gift_card: false, // Assuming it's not a gift card
    final_price: variant.price,
    final_line_price: variant.price,
    url: `/products/${product.handle}?variant=${variant.id}`,
    featured_image: {
      alt: product.title,
      aspect_ratio: 1,
      height: variant.featured_image.height,
      url: `https:${variant.featured_image.src}`,
      width: variant.featured_image.width,
    },
    image: `https:${variant.featured_image.src}`,
    handle: product.handle,
    requires_shipping: variant.requires_shipping,
    product_type: product.type,
    product_description: product.description,
    variant_options: variant.options,
    options_with_values: [],
    line_level_discount_allocations: [],
    line_level_total_discount: 0,
  };
}
