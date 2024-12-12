import { ICartState, ICartItem, IProduct, IVariant } from "../common/product";
import { convertProductToCartItem } from "./convertProductToCartItem";
import { mockProducts } from "./product";

class MockResponse {
  body: string;
  status: number;
  headers: Record<string, string>;

  constructor(
    body: string,
    options: { status: number; headers?: Record<string, string> },
  ) {
    this.body = body;
    this.status = options.status;
    this.headers = options.headers || {};
  }

  async json() {
    return JSON.parse(this.body);
  }
}

// Utility function to wrap mock data in a Response object
const mockResponse = (data: any) => {
  return Promise.resolve(
    new MockResponse(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
};

// Factory function to create a new cart state with 0 items
export const createMockCartState = (): ICartState => ({
  token: "mock-cart-token",
  note: "",
  attributes: {},
  original_total_price: 0, // No items, so total prices are zero
  total_price: 0,
  total_discount: 0,
  total_weight: 0, // No weight since no items are present
  item_count: 0, // No items in the cart
  items: [], // Empty array for no items
  requires_shipping: false, // No shipping required for an empty cart
  currency: "USD",
  items_subtotal_price: 0, // Subtotal price is zero for no items
  cart_level_discount_applications: [], // No discounts applied
});

let mockCart: ICartState;

beforeEach(() => {
  // Reset the mockCart to an empty state before each test
  mockCart = createMockCartState();
});

// Mock implementation for Shopify Cart API functions
export const ShopifyCartAPI = {
  updateItemQuantity: jest.fn((variantId: number, quantity: number) => {
    // Find the item and update its quantity
    const item = mockCart.items.find((item) => item.variant_id == variantId);
    if (item) {
      const quantityDifference = quantity - item.quantity;
      mockCart.item_count += quantityDifference;
      mockCart.items_subtotal_price += quantityDifference * item.price;
      mockCart.total_price += quantityDifference * item.price;
      item.quantity = quantity;
      item.line_price = item.price * quantity;
    } else {
      let p: null | IProduct = null;
      let v: null | IVariant = null;
      mockProducts.forEach((product) => {
        product.variants.forEach((variant) => {
          if (variant.id === variantId) {
            p = product;
            v = variant;
          }
        });
      });
      if (p && v) {
        const lineitem = convertProductToCartItem(p, v);
        mockCart.items.push(lineitem);
        mockCart.item_count += 1;
        mockCart.items_subtotal_price += lineitem.price;
        mockCart.total_price += lineitem.price;
        mockCart.original_total_price += lineitem.original_price;
        mockCart.requires_shipping = true;
      }
    }
    return mockResponse(mockCart);
  }),

  getCart: jest.fn(() => {
    // Return the current cart
    return mockResponse(mockCart);
  }),
};
