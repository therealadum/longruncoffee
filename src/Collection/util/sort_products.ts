import { IProductReview, Product } from "../types";
import { SortOption } from "./sort_and_filter_query_params";

export function sort_products(
  products: Product[],
  reviews: any,
  sortOption: SortOption | undefined,
) {
  if (!sortOption || sortOption.value === "default") {
    return products;
  }
  return products.sort((a, b) => {
    switch (sortOption.value) {
      case "newest":
        return new Date(a.created_at) < new Date(b.created_at) ? 1 : -1;
      case "best_reviews":
        const a_r: IProductReview = reviews[a.id];
        const b_r: IProductReview = reviews[b.id];
        return (
          parseFloat(b_r?.rating?.value || "0.0") -
          parseFloat(a_r?.rating?.value || "0.0")
        );
      case "title_a_z":
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      case "title_z_a":
        return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
      case "price_low_high":
        return a.price - b.price;
      case "price_high_low":
        return b.price - a.price;
      default:
        return 1;
    }
  });
}
