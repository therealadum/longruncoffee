import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { NavigationBar } from "./NavigationBar";

export default {
  title: "Components/NavigationBar",
  component: NavigationBar,
} as ComponentMeta<typeof NavigationBar>;

const Template: ComponentStory<typeof NavigationBar> = (args) => (
  <NavigationBar {...args} />
);

export const NavigationBarBase = Template.bind({});
const args = {};

NavigationBarBase.args = args;
