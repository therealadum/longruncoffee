import { ComponentStory, ComponentMeta } from "@storybook/react";

import { BasicUpsell } from "./BasicUpsell";

export default {
  title: "Components/BasicUpsell",
  component: BasicUpsell,
} as ComponentMeta<typeof BasicUpsell>;

const Template: ComponentStory<typeof BasicUpsell> = (args) => (
  <BasicUpsell {...args} />
);

export const Base = Template.bind({});
const args = {
  params: {
    is_in_cart: false,
  },
  variant: {
    id: 123,
  },
};

// @ts-ignore
Base.args = args;
