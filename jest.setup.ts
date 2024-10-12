import { ShopifyCartAPI } from "./src/testutils/cart";

class _ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}

global.ResizeObserver = _ResizeObserver;

// @ts-ignore
global.fetch = jest.fn((_url, options) => {
  const url = _url as string;
  const parsedbody =
    typeof options?.body == "string" ? JSON.parse(options.body) : {};
  if (url.endsWith("/cart/add.js")) {
    return ShopifyCartAPI.addItem(parsedbody);
  }
  if (url.endsWith("/cart/change.js")) {
    return parsedbody.quantity === 0
      ? ShopifyCartAPI.removeItem(parsedbody.id)
      : ShopifyCartAPI.updateItemQuantity(parsedbody.id, parsedbody.quantity);
  }
  if (url.endsWith("/cart.js")) {
    return ShopifyCartAPI.getCart();
  }
  if (url.endsWith("/cart/clear.js")) {
    return ShopifyCartAPI.clearCart();
  }
  if (url.endsWith("/cart/shipping_rates.json")) {
    return ShopifyCartAPI.getShippingRates();
  }
});
