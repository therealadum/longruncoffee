import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CartDrawer } from "../CartDrawer";
import { createMockCartState } from "../../testutils/cart";

describe("Cart Drawer", () => {
  it("renders the component", () => {
    const container = {
      attributes: {
        getNamedItem: (str: string) => ({
          value: encodeURIComponent(JSON.stringify(createMockCartState())),
        }),
      },
    };
    render(<CartDrawer container={container} />);
    const element = screen.getByText(/Shop/i);
    console.error(element);
    expect(element).toBeInTheDocument();
  });
});
