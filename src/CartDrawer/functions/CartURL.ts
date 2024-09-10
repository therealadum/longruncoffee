import { useState, useEffect } from "react";
import { ICartState, ISubscriptionCartState } from "../../common/product";
import { getCart, getProduct } from "./CartOps";

export function removeAddToCartURLParameters() {
  if (window.history) {
    window.history.replaceState(
      {},
      document.title,
      window.location.href.split("?")[0],
    );
  }
}

interface IUseAddToCartURLParams {
  add_to_cart_variant_id?: string;
  add_to_cart_product_hash?: string;
  add_to_cart_is_subscription?: string;
  add_to_cart_quantity?: string;
  add_to_cart_max?: string;
  add_to_cart_checkout?: string;
}

async function process_event({
  variantId,
  isSubscription,
  quantity,
  product_hash,
  a2c_max_qty,
  a2c_should_checkout,
}: any) {
  const a2c_product = await getProduct(product_hash);
  document.dispatchEvent(
    new CustomEvent("buy_button", {
      detail: {
        variantId,
        isSubscription,
        quantity,
        available: a2c_product.available,
        product_hash,
        a2c_max_qty,
        a2c_should_reset_url_params: true,
        a2c_should_checkout,
        a2c_product,
      },
    }),
  );
}

export function useAddToCartURL() {
  const prox = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: any) => searchParams.get(prop),
  });
  const params = prox as IUseAddToCartURLParams;
  const add_to_cart_variant_id = params.add_to_cart_variant_id;
  const add_to_cart_product_hash = params.add_to_cart_product_hash;
  const add_to_cart_quantity = params.add_to_cart_quantity;
  const add_to_cart_is_subscription = params.add_to_cart_is_subscription;
  const add_to_cart_max = params.add_to_cart_max;
  const add_to_cart_checkout = params.add_to_cart_checkout;

  useEffect(() => {
    if (Boolean(add_to_cart_variant_id && add_to_cart_product_hash)) {
      let quantity = 1;
      if (add_to_cart_quantity) {
        quantity = parseInt(add_to_cart_quantity);
      }

      let subscription = false;
      if (add_to_cart_is_subscription) {
        subscription = true;
      }

      let max_add_to_cart = quantity;
      if (add_to_cart_max) {
        max_add_to_cart = parseInt(add_to_cart_max);
      }

      let shouldCheckoutParam = false;
      if (add_to_cart_checkout) {
        shouldCheckoutParam = true;
      }

      try {
        process_event({
          variantId: add_to_cart_variant_id,
          isSubscription: subscription,
          quantity,
          product_hash: add_to_cart_product_hash,
          a2c_qty: add_to_cart_quantity,
          a2c_max_qty: max_add_to_cart,
          a2c_should_checkout: shouldCheckoutParam,
        });
      } catch (e) {
        console.error(e);
        removeAddToCartURLParameters();
      }
    }
  }, [
    add_to_cart_variant_id,
    add_to_cart_product_hash,
    add_to_cart_quantity,
    add_to_cart_is_subscription,
    add_to_cart_max,
    add_to_cart_checkout,
  ]);
}
