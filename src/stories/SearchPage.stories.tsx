import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import SearchPage from "../components/SearchPage";

const meta: Meta = {
  title: "Components/SearchPage",
  component: SearchPage,
};

export default meta;

const Template: StoryFn<{ query: string; sort: string; time: string; subreddit: string }> = (args) => (
  <MemoryRouter>
    <SearchPage {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  query: "tech salary",
  subreddit: "askSingapore",
  sort: "relevance",
  time: "year",
};
