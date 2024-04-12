import endpoint from "./configTypes";
import { test, expect } from "@playwright/test";

test("Expect that customer can checkout with one-time purchases", async ({
  page,
}) => {
  await page.goto(endpoint.OUT_OF_STOCK_PRODUCT_PAGE);
  // assert lrc-select-one-time-checkout is disabled
  expect(page.getByTestId("lrc-select-one-time-checkout")).toBeDisabled();
});
