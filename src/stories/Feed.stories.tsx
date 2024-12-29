import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Feed, { FeedProps } from "../components/Feed";

const meta: Meta = {
  title: "Components/Feed",
  component: Feed,
};

export default meta;

const Template: StoryFn<FeedProps> = (args) => (
  <MemoryRouter>
    <Feed {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  subreddit: "singapore",
  initialTime: "year",
  initialSort: "",
};
