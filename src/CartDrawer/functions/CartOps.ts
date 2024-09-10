import { IPlan } from "../../common/plans";
import {
  ICartState,
  IProduct,
  ISubscriptionCartState,
} from "../../common/product";

export interface ICheckoutStatusProps {
  cartState: ICartState;
  subscriptionCartState: ISubscriptionCartState;
  plan: IPlan | null;
}

export function checkoutStatus({
  cartState,
  subscriptionCartState,
  plan,
}: ICheckoutStatusProps):
  | "SUBSCRIBE_AND_SAVE_MINIMUM_BAG_COUNT"
  | "OKAY"
  | "NOTHING_TO_CHECKOUT"
  | "ONLY_GIFTS" {
  if (subscriptionCartState.items.length && !plan) {
    return "SUBSCRIBE_AND_SAVE_MINIMUM_BAG_COUNT";
  } else if (subscriptionCartState.items.length && plan) {
    return "OKAY";
  } else if (
    cartState.items.filter((item) => item.product_type !== "Gift").length > 0
  ) {
    return "OKAY";
  } else if (
    cartState.items.filter((item) => item.product_type !== "Gift").length === 0
  ) {
    return "ONLY_GIFTS";
  } else {
    return "NOTHING_TO_CHECKOUT";
  }
}

export async function updateCart(updates: any) {
  return await fetch(window.Shopify.routes.root + "cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      updates,
    }),
  });
}

export async function addToCart(items: any) {
  return await fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });
}

export async function getCart() {
  try {
    const response = await fetch(window.Shopify.routes.root + "cart.js");
    const parsed = await response.json();
    return parsed;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getProduct(product_hash: string): Promise<IProduct> {
  const data = await fetch(`/products/${product_hash}.js`);
  const product = await data.json();
  return product;
}
