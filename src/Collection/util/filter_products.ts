import { Product } from "../types";
import { FilterGroup } from "./sort_and_filter_query_params";

export function filter_products(
  products: Product[],
  filters: FilterGroup[],
  should_filter: boolean,
): Product[] {
  if (!should_filter) {
    return products;
  }
  return products.filter((product) => {
    let should_display = false;

    // get list of variant options for option2 (for filtering by roast)
    const variant_option_2s = product.variants.map(
      (variant) => variant.option2,
    );

    filters.forEach((filter, idx) => {
      const checked_filter_options = filter.options.filter(
        (filter_option) => filter_option.checked,
      );

      // for each filter, ensure that ONE option that is checked applies to the current product
      let product_fits_filter = checked_filter_options.length === 0;

      checked_filter_options.forEach((cfo) => {
        // only re-check for a given filter if it has not matched yet
        if (!product_fits_filter) {
          switch (filter.id) {
            case "style":
              // check product variant options
              // otherwise check tags for bundles
              product_fits_filter =
                variant_option_2s.find((v) => v == cfo.value) != undefined ||
                product.tags.find((v) => v == cfo.value) != undefined;
              break;
            case "roast":
              // check tags only
              product_fits_filter =
                product.tags.find((v) => v == cfo.value) != undefined;
              break;
            default:
              console.log("unsupported filter type");
              break;
          }
        }
      });

      // prevent filtered items from being marked as relevant for other filters
      // but allow it to run the first time
      if (idx === 0 || should_display) {
        should_display = product_fits_filter;
      }
    });
    // for each filter
    // for style
    // check option1 value as default, if "powder" check product id
    // for roast, check tag value
    return should_display;
  });
}
