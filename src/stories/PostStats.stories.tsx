import { Meta, StoryFn } from "@storybook/react";
import PostStats from "../components/PostStats";

const meta: Meta = {
  title: "Components/PostStats",
  component: PostStats,
};

export default meta;

const Template: StoryFn<{ score: number; num_comments: number }> = (args) => (
  <PostStats {...args} />
);

export const Default = Template.bind({});
Default.args = {
  score: 1234,
  num_comments: 56,
};