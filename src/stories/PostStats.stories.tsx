import { Meta, StoryFn } from "@storybook/react";
import PostStats, { PostStatsProps } from "../components/PostStats";

const meta: Meta = {
  title: "Components/PostStats",
  component: PostStats,
};

export default meta;

const Template: StoryFn<PostStatsProps> = (args) => (
  <PostStats {...args} />
);

export const Default = Template.bind({});
Default.args = {
  score: 1234,
  num_comments: 56,
};