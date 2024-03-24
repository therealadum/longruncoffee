import endpoint from "./configTypes";
import { test, expect } from "@playwright/test";

test("Expect to have 3 options for signing up", async ({ page }) => {
  // Go to the Droplets product page of DigitalOcean web page
  await page.goto(endpoint.HOME_URL);

  await expect(page.getByText("Electrolyte power")).toBeVisible();
});
