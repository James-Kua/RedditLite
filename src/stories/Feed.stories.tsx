import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Feed from "../components/Feed";

const meta: Meta = {
  title: "Components/Feed",
  component: Feed,
};

export default meta;

const Template: StoryFn<{ subreddit: string; initialTime: string; initialSort: string }> = (args) => (
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
