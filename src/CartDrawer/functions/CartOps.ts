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
  cartSubTotalWithDiscounts: number;
}

export function checkoutStatus({
  cartState,
  subscriptionCartState,
  plan,
  cartSubTotalWithDiscounts,
}: ICheckoutStatusProps):
  | "OKAY"
  | "NOTHING_TO_CHECKOUT"
  | "MINIMUM_SPEND"
  | "ONLY_GIFTS" {
  if (
    cartState.attributes?.minimum_spend &&
    cartState?.attributes?.minimum_spend?.amount > cartSubTotalWithDiscounts
  ) {
    return "MINIMUM_SPEND";
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

export async function updateCart(updates: any, attributes?: any) {
  if (attributes) {
    await fetch(window.Shopify.routes.root + "cart/update.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attributes,
      }),
    });
  }
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
