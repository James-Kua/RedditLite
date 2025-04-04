import { Meta, StoryFn } from "@storybook/react";
import SubredditIcon, { SubredditIconProps } from "../components/SubredditIcon";

const meta: Meta = {
  title: "Components/SubredditIcon",
  component: SubredditIcon,
};

export default meta;

const Template: StoryFn<SubredditIconProps> = (args) => <SubredditIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  community_icon: "https://styles.redditmedia.com/t5_2qh8c/styles/communityIcon_gk61dqqvha9b1.png?width=256&amp;s=489b5da2c73c03b7c2aa6de987037bf2a9abfdd2",
  icon_img: "",
};
