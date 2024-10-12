import { ShopifyCartAPI } from "./src/testutils/cart";
import { ShopifyProductAPI } from "./src/testutils/product";

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

const regex = /\/products\/[a-zA-Z0-9_-]+\.js$/;

function isValidProductUrl(url: string): boolean {
  return regex.test(url);
}
function extractProductIdentifier(url: string): string | null {
  const regex = /\/products\/([a-zA-Z0-9_-]+)\.js$/;
  const match = regex.exec(url);

  if (match && match[1]) {
    return match[1]; // Return the captured product identifier
  }
  return null; // Return null if the pattern doesn't match
}

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
  if (isValidProductUrl(url)) {
    const handle = extractProductIdentifier(url);
    return ShopifyProductAPI.getProductByHandle(handle as string);
  }
});
