import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CartDrawer } from "../CartDrawer";
import { createMockCartState } from "../../testutils/cart";

describe("Cart Drawer", () => {
  it("opens when toggled", () => {
    const container = {
      attributes: {
        getNamedItem: (str: string) => ({
          value: encodeURIComponent(JSON.stringify(createMockCartState())),
        }),
      },
    };
    render(<CartDrawer container={container} />);
    act(() => {
      document.dispatchEvent(new CustomEvent("cart_toggle"));
    });
    const element = screen.getByTestId("cart-title");
    expect(element).toBeInTheDocument();
  });
  it("opens after purchase, and reflects proper item/subtotal", async () => {
    const container = {
      attributes: {
        getNamedItem: (str: string) => ({
          value: encodeURIComponent(JSON.stringify(createMockCartState())),
        }),
      },
    };
    render(<CartDrawer container={container} />);
    act(() => {
      document.dispatchEvent(
        new CustomEvent("buy_button", {
          detail: {
            available: true,
            variantId: 50003198312761,
            isSubscription: false,
            quantity: 1,
            product_hash: "ready-to-run",
          },
        }),
      );
    });

    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.getByTestId("cart-title")).toBeInTheDocument();
    expect(screen.getByTestId("free-shipping-progress")).toHaveTextContent(
      `You're only $48.59 away from a free Ready to Run!`,
    );
  });
});
