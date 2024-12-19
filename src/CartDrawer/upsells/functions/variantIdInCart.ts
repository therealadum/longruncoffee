import { ICartItem } from "../../../common/product";

export interface IVariantIdInCartParams {
  items: ICartItem[];
  variant_ids: number[];
}

export function variantIdInCart({
  items,
  variant_ids,
}: IVariantIdInCartParams) {
  let found_a_variant_id = false;

  items.forEach((item) => {
    if (variant_ids.indexOf(item.variant_id) !== -1) {
      found_a_variant_id = true;
    }
  });

  return found_a_variant_id;
}
