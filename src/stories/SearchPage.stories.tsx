import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import SearchPage, { SearchPageProps } from "../components/SearchPage";

const meta: Meta = {
  title: "Components/SearchPage",
  component: SearchPage,
};

export default meta;

const Template: StoryFn<SearchPageProps> = (args) => (
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
