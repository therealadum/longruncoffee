import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ProgressBarStorybook } from ".";

export default {
  title: "Components/ProgressBar",
  component: ProgressBarStorybook,
} as ComponentMeta<typeof ProgressBarStorybook>;

const Template: ComponentStory<typeof ProgressBarStorybook> = (args) => (
  <div style={{ width: "358px", height: "100vh" }}>
    <ProgressBarStorybook {...args} />
  </div>
);

export const NavigationBarBase = Template.bind({});
const args = {
  totalSubscriptionItems: 1,
  cartSubtotal: 0,
};

NavigationBarBase.args = args;
