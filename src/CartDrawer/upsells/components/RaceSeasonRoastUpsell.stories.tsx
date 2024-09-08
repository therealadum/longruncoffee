import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RaceSeasonRoastUpsell } from "./RaceSeasonRoastUpsell";

export default {
  title: "Components/RaceSeasonRoastUpsell",
  component: RaceSeasonRoastUpsell,
} as ComponentMeta<typeof RaceSeasonRoastUpsell>;

const Template: ComponentStory<typeof RaceSeasonRoastUpsell> = (args) => (
  <RaceSeasonRoastUpsell {...args} />
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
