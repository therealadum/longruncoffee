import { ICartItem } from "../../src/common/product";
import { ShopifyCartAPI } from "../cart";

// Sample item for testing
const mockItem: ICartItem = {
  id: 123456789,
  properties: {},
  quantity: 1,
  variant_id: 111,
  key: "mock-item-key-1",
  title: "Product 1",
  price: 2999,
  original_price: 2999,
  presentment_price: 2999,
  discounted_price: 2799,
  line_price: 2799,
  original_line_price: 2999,
  total_discount: 200,
  discounts: [],
  sku: "SKU123",
  grams: 1000,
  vendor: "Vendor 1",
  taxable: true,
  product_id: 1111,
  product_has_only_default_variant: true,
  gift_card: false,
  final_price: 2799,
  final_line_price: 2799,
  url: "/product-1",
  featured_image: {
    aspect_ratio: 1.0,
    alt: "Product 1 Image",
    url: "https://example.com/product-1.jpg",
    width: 1000,
    height: 1000,
  },
  image: "https://example.com/product-1.jpg",
  handle: "product-1",
  requires_shipping: true,
  product_type: "Type 1",
  product_title: "Product 1",
  product_description: "Description of Product 1",
  variant_title: null,
  variant_options: ["Default"],
  options_with_values: [
    {
      name: "Option 1",
      value: "Default",
    },
  ],
  line_level_discount_allocations: [],
  line_level_total_discount: 200,
  has_components: false,
  selling_plan_allocation: null,
};

// Reset the cart before each test
beforeEach(async () => {
  await ShopifyCartAPI.clearCart();
});

describe("Shopify Cart API Mock", () => {
  it("should start with an empty cart", async () => {
    const response = await ShopifyCartAPI.getCart();
    const cart = await response.json(); // Parse the response as JSON
    expect(cart.items.length).toBe(0);
    expect(cart.total_price).toBe(0);
    expect(cart.item_count).toBe(0);
  });

  it("should add an item to the cart", async () => {
    await ShopifyCartAPI.addItem(mockItem);
    const response = await ShopifyCartAPI.getCart();
    const cart = await response.json(); // Parse the response as JSON

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].title).toBe(mockItem.title);
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.total_price).toBe(mockItem.price);
    expect(cart.item_count).toBe(1);
  });

  it("should update the quantity of an item in the cart", async () => {
    await ShopifyCartAPI.addItem(mockItem);

    // Update the quantity
    await ShopifyCartAPI.updateItemQuantity(mockItem.id, 3);
    const response = await ShopifyCartAPI.getCart();
    const cart = await response.json(); // Parse the response as JSON

    expect(cart.items[0].quantity).toBe(3);
    expect(cart.total_price).toBe(mockItem.price * 3);
    expect(cart.item_count).toBe(3);
  });

  it("should remove an item from the cart", async () => {
    await ShopifyCartAPI.addItem(mockItem);

    // Remove the item
    await ShopifyCartAPI.removeItem(mockItem.id);
    const response = await ShopifyCartAPI.getCart();
    const cart = await response.json(); // Parse the response as JSON

    expect(cart.items.length).toBe(0);
    expect(cart.total_price).toBe(0);
    expect(cart.item_count).toBe(0);
  });

  it("should clear the cart", async () => {
    await ShopifyCartAPI.addItem(mockItem);

    // Clear the cart
    await ShopifyCartAPI.clearCart();
    const response = await ShopifyCartAPI.getCart();
    const cart = await response.json(); // Parse the response as JSON

    expect(cart.items.length).toBe(0);
    expect(cart.total_price).toBe(0);
    expect(cart.item_count).toBe(0);
  });

  it("should fetch shipping rates", async () => {
    const response = await ShopifyCartAPI.getShippingRates();
    const shippingRates = await response.json(); // Parse the response as JSON

    expect(shippingRates.shipping_rates.length).toBe(2);
    expect(shippingRates.shipping_rates[0].title).toBe("Standard Shipping");
    expect(shippingRates.shipping_rates[1].title).toBe("Express Shipping");
  });
});
