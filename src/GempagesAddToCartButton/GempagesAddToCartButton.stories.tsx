import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import GempagesAddToCartButton from ".";

export default {
  title: "Components/GempagesAddToCartButton",
  component: GempagesAddToCartButton,
} as ComponentMeta<typeof GempagesAddToCartButton>;

const Template: ComponentStory<typeof GempagesAddToCartButton> = (args) => (
  <GempagesAddToCartButton {...args} />
);

export const GempagesAddToCartButtonBase = Template.bind({});
const args = {
  container: {
    attributes: {
      getNamedItem: (str: string) => ({
        value: "50160742957369",
      }),
    },
  },
};

GempagesAddToCartButtonBase.args = args;
