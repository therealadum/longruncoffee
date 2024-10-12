import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { NavigationBar } from "../NavigationBar";

describe("Navigation Bar", () => {
  beforeEach(() => {
    // Simulate mobile screen size (e.g., 375px wide for iPhone X)
    window.innerWidth = 375;
    window.innerHeight = 812;

    // Trigger the resize event to apply the dimensions
    window.dispatchEvent(new Event("resize"));
  });

  it("renders the component", () => {
    render(<NavigationBar />);
    const element = screen.getByText(/Shop/i);
    expect(element).toBeInTheDocument();
  });

  it("can open and close", async () => {
    render(<NavigationBar />);
    const openbutton = screen.getByTestId("open-navbar");
    act(() => {
      fireEvent.click(openbutton);
    });
    expect(screen.getByText("Powders")).toBeVisible();

    const closebutton = screen.getByTestId("close-navbar");
    act(() => {
      fireEvent.click(closebutton);
    });

    await new Promise((r) => setTimeout(r, 1000));
    const el = screen.queryByText("Powders");
    expect(el).toBeNull();
  });

  it("responds to changes in cart items", async () => {
    render(<NavigationBar />);
    act(() => {
      document.dispatchEvent(
        new CustomEvent("cart_count_change", {
          detail: {
            count: 5,
          },
        }),
      );
    });

    const el = screen.getByTestId("navbar-cart-count");
    expect(el).toHaveTextContent("5");
  });

  it("triggers cart open", async () => {
    render(<NavigationBar />);
    const handler = {
      fn: jest.fn(),
    };
    const spy = jest.spyOn(handler, "fn");
    document.addEventListener("cart_toggle", handler.fn);

    const el = screen.getByTestId("navbar-open-cart");
    fireEvent.click(el);

    expect(spy).toHaveBeenCalled();
  });
});
