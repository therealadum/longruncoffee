import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Collection } from "../Collection";
import { test_collection } from "../test_collection";
import { IProductReview } from "../types";

describe("Collection", () => {
  it("Desktop > Lists all products when no filters are applied", () => {
    render(
      <Collection
        container={{
          attributes: {
            getNamedItem: (s: string) => ({
              value: encodeURIComponent(JSON.stringify(test_collection)),
            }),
          },
        }}
      />,
    );

    // for each filter group
    // un-check option button
    const filterButtons = screen.getAllByTestId((testId) =>
      testId.startsWith("collection-desktop-filter-button"),
    );
    for (const button of filterButtons) {
      // 2) Click to open its filter popover/panel
      userEvent.click(button);

      // 3) Parse section ID from the button's data-testid
      // Example: "collection-desktop-filter-button-size" => "size"
      const dataTestId = button.getAttribute("data-testid") || "";
      const sectionId = dataTestId.replace(
        "collection-desktop-filter-button-",
        "",
      );

      // 4) Now find all checkboxes for this filter group
      // They start with "collection-desktop-filter-{sectionId}-option-"
      const checkboxes = screen.queryAllByTestId((testId) =>
        testId.startsWith(`collection-desktop-filter-${sectionId}-option-`),
      );

      // 5) Uncheck each one if it's currently checked
      for (const checkbox of checkboxes) {
        // If the checkbox is an HTMLInputElement and is checked, click it again to uncheck
        if (checkbox instanceof HTMLInputElement && checkbox.checked) {
          userEvent.click(checkbox);
        }
      }
    }

    const products = screen.getAllByTestId((testId) =>
      testId.startsWith("collection-product"),
    );
    expect(products.length).toBe(test_collection.products.length);
  });
  it("Mobile > Lists all products when no filters are applied", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 667,
    });
    window.dispatchEvent(new Event("resize"));
    render(
      <Collection
        container={{
          attributes: {
            getNamedItem: (s: string) => ({
              value: encodeURIComponent(JSON.stringify(test_collection)),
            }),
          },
        }}
      />,
    );

    // open mobile filters
    const mobile_open_filters_button = screen.getByTestId(
      "collection-mobile-open-filters-button",
    );
    userEvent.click(mobile_open_filters_button);

    // for each filter group
    // un-check option button
    const filterButtons = screen.getAllByTestId((testId) =>
      testId.startsWith("collection-mobile-filter-button"),
    );
    for (const button of filterButtons) {
      // 2) Click to open its filter popover/panel
      userEvent.click(button);

      // 3) Parse section ID from the button's data-testid
      // Example: "collection-mobile-filter-button-size" => "size"
      const dataTestId = button.getAttribute("data-testid") || "";
      const sectionId = dataTestId.replace(
        "collection-mobile-filter-button-",
        "",
      );

      // 4) Now find all checkboxes for this filter group
      // They start with "collection-mobile-filter-{sectionId}-option-"
      const checkboxes = screen.queryAllByTestId((testId) =>
        testId.startsWith(`collection-mobile-filter-${sectionId}-option-`),
      );

      // 5) Uncheck each one if it's currently checked
      for (const checkbox of checkboxes) {
        // If the checkbox is an HTMLInputElement and is checked, click it again to uncheck
        if (checkbox instanceof HTMLInputElement && checkbox.checked) {
          userEvent.click(checkbox);
        }
      }
    }

    // close mobile filters
    const mobile_close_filters_button = screen.getByTestId(
      "collection-mobile-close-filters-button",
    );
    userEvent.click(mobile_close_filters_button);

    const products = screen.getAllByTestId((testId) =>
      testId.startsWith("collection-product"),
    );
    expect(products.length).toBe(test_collection.products.length);
  });
  it("Sorts products appropriately", () => {
    render(
      <Collection
        container={{
          attributes: {
            getNamedItem: (s: string) => ({
              value: encodeURIComponent(JSON.stringify(test_collection)),
            }),
          },
        }}
      />,
    );

    // open sort menu to get list of options
    const sort_button = screen.getByTestId("collection-open-sort-button");
    userEvent.click(sort_button);
    const sort_option_buttons = screen.getAllByTestId((testId) =>
      testId.startsWith("collection-sort-option-"),
    );
    userEvent.click(sort_button);

    sort_option_buttons.forEach((sort_option_button) => {
      // open sort menu
      const sort_button = screen.getByTestId("collection-open-sort-button");
      userEvent.click(sort_button);

      // click sort option
      userEvent.click(sort_option_button);

      // get sort type
      const sort_test_id = sort_option_button.getAttribute("data-testid") || "";
      const sort_value = sort_test_id.replace("collection-sort-option-", "");

      // get products
      const products = screen.getAllByTestId((testId) =>
        testId.startsWith("collection-product-"),
      );
      if (products.length < 2) {
        return;
      }
      const product_1_handle = products[0]
        .getAttribute("data-testid")
        ?.replace("collection-product-", "");
      const product_2_handle = products[1]
        .getAttribute("data-testid")
        ?.replace("collection-product-", "");
      const product1 = test_collection.products.find(
        (p) => p.handle === product_1_handle,
      );
      const product2 = test_collection.products.find(
        (p) => p.handle === product_2_handle,
      );
      if (!product1 || !product2) {
        return;
      }

      // assert that first element is "cheaper" | "better reviewed" | etc...
      switch (sort_value) {
        case "newest":
          expect(
            new Date(product1.created_at).getTime(),
          ).toBeGreaterThanOrEqual(new Date(product2.created_at).getTime());
          break;
        case "best_reviews":
          const p1r: IProductReview = test_collection.reviews[product1.id];
          const p2r: IProductReview = test_collection.reviews[product2.id];
          expect(parseFloat(p1r.rating.value)).toBeGreaterThanOrEqual(
            parseFloat(p2r.rating.value),
          );
          break;
        case "title_a_z":
          expect(
            product1.title
              .toLowerCase()
              .localeCompare(product2.title.toLowerCase()),
          ).toBeLessThanOrEqual(0);
          break;
        case "title_z_a":
          expect(
            product1.title
              .toLowerCase()
              .localeCompare(product2.title.toLowerCase()),
          ).toBeGreaterThanOrEqual(0);
          break;
        case "price_low_high":
          break;
        case "price_high_low":
          break;
        default:
          return;
      }
    });
  });
});
