import React from "react";
import * as ReactDOMClient from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";

import { Header, CartDrawer, ProductForm } from ".";

declare global {
  interface Window {
    klaviyo: any;
  }
}

customElements.define(
  "rwc-header",
  reactToWebComponent(Header, React, ReactDOMClient, {
    props: ["text"],
  }),
);

customElements.define(
  "cart-drawer",
  reactToWebComponent(CartDrawer, React, ReactDOMClient),
);

customElements.define(
  "product-form",
  reactToWebComponent(ProductForm, React, ReactDOMClient, {
    props: ["productJSON", "reviews"],
  }),
);
