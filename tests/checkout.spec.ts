import endpoint from "./configTypes";
import { test, expect } from "@playwright/test";

test("Expect that customer can checkout with one-time purchases", async ({
  page,
}) => {
  await page.goto(endpoint.HOME_URL);
  await page.getByTestId("home-hero-shop-button").click();
});
