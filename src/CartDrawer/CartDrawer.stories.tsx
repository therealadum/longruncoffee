import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CartDrawer } from "./CartDrawer";

export default {
  title: "Components/CartDrawer",
  component: CartDrawer,
} as ComponentMeta<typeof CartDrawer>;

const Template: ComponentStory<typeof CartDrawer> = (args) => (
  <CartDrawer {...args} />
);

export const CartDrawerBase = Template.bind({});
const args = {};

CartDrawerBase.args = args;
