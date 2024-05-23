import { Browser, Page } from "playwright";

import fs from "fs";
import toml from "toml";
const config = toml.parse(fs.readFileSync("./config.toml", "utf-8"));

declare global {
  const page: Page;
  const browser: Browser;
  const browserName: string;
}

export default {
  HOME_URL: config.HOME_URL ?? "",
  OUT_OF_STOCK_PRODUCT_PAGE: config.OUT_OF_STOCK_PRODUCT_PAGE ?? "",
  DEFAULT_PRODUCT_PAGE: config.DEFAULT_PRODUCT_PAGE ?? "",
  CLUB_MEMBER_EXCLUSIVE_PAGE: config.CLUB_MEMBER_EXCLUSIVE_PAGE ?? "",
  PREVIEW_THEME_ID: config.PREVIEW_THEME_ID ?? "",
};
