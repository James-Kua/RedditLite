import { Meta, StoryFn } from "@storybook/react";
import UserKarma, { UserKarmaProps } from "../components/UserKarma";

const meta: Meta = {
  title: "Components/UserKarma",
  component: UserKarma,
};

export default meta;

const Template: StoryFn<UserKarmaProps> = (args) => <UserKarma {...args} />;

export const Default = Template.bind({});
Default.args = {
  iconImg:
    "https://styles.redditmedia.com/t5_uacoe/styles/profileIcon_snooa9ed9e2c-4d3d-466c-82e6-9121dc4992d3-headshot-f.png?width=256&height=256&crop=256:256,smart&s=e52f047a45e16dad78c70420b98c716ef01a4c0e",
  total_karma: 1500,
  comment_karma: 250,
};
