import config from "./configTypes";
import { test, expect } from "@playwright/test";

test("Product Page > Members-Only products should not list one-time purchase as an option.", async ({
  page,
}) => {
  await page.goto(
    `${config.HOME_URL}/${config.OUT_OF_STOCK_PRODUCT_PAGE}?preview_theme_id=${config.PREVIEW_THEME_ID}`,
  );
  expect(page.getByTestId("lrc-select-one-time-checkout")).toBeHidden();
});

test("Product Page > Club Member Exclusive products should not be purchasable", async ({
  page,
}) => {
  await page.goto(
    `${config.HOME_URL}/${config.CLUB_MEMBER_EXCLUSIVE_PAGE}?preview_theme_id=${config.PREVIEW_THEME_ID}`,
  );
  expect(page.getByTestId("lrc-add-to-cart-button")).toBeDisabled();
});

test("Product Page > Users can add multiple bags from a single product to their subscription", async ({
  page,
}) => {
  await page.goto(
    `${config.HOME_URL}/${config.DEFAULT_PRODUCT_PAGE}?preview_theme_id=${config.PREVIEW_THEME_ID}`,
  );
  // select 12oz
  await page.getByTestId("product-page-option-Size-12 oz").click();
  // select whole bean
  await page.getByTestId("product-page-option-Form-Whole Bean").click();
  // select 2 bags
  await page.getByTestId("product-page-purchase-quantity-selector-2").click();
  // click "add to bag"
  await page.getByTestId("lrc-add-to-cart-button").click();

  await expect(page.getByTestId("lrc-cart")).toBeVisible();
  await expect(
    page.getByTestId("cart-subscription-quantity-45115787673913"),
  ).toContainText("2x");
});
