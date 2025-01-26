import React from "react";
import * as ReactDOMClient from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";

import { CartDrawer, ProductForm, NavigationBar, ClubPromoRoast } from ".";
import GempagesAddToCartButton from "./GempagesAddToCartButton";
import { Collection } from "./Collection/Collection";

declare global {
  interface Window {
    klaviyo: any;
    Shopify: any;
  }
}

customElements.define(
  "cart-slide",
  reactToWebComponent(CartDrawer, React, ReactDOMClient, {
    props: ["cart"],
  }),
);

customElements.define(
  "navigation-bar",
  reactToWebComponent(NavigationBar, React, ReactDOMClient),
);

customElements.define(
  "product-form",
  reactToWebComponent(ProductForm, React, ReactDOMClient, {
    props: ["productJSON", "reviews"],
  }),
);

customElements.define(
  "club-promo-roast",
  reactToWebComponent(ClubPromoRoast, React, ReactDOMClient),
);

customElements.define(
  "gempages-add-to-cart-button",
  reactToWebComponent(GempagesAddToCartButton, React, ReactDOMClient, {
    props: ["variant_id", "available"],
  }),
);

customElements.define(
  "lrc-collection",
  reactToWebComponent(Collection, React, ReactDOMClient, {
    props: ["collectionjson", "productsjson"],
  }),
);
