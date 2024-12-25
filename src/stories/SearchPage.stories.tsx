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

export const SubredditSearch = Template.bind({});
SubredditSearch.args = {
  query: "tech salary",
  subreddit: "askSingapore",
  sort: "relevance",
  time: "year",
};

export const AllSubredditSearch = Template.bind({});
AllSubredditSearch.args = {
  query: "tech salary",
  subreddit: "",
  sort: "relevance",
  time: "year",
};
