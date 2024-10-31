import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import SinglePost from "../components/SinglePost";

const meta: Meta = {
  title: "Components/SinglePost",
  component: SinglePost,
};

export default meta;

const Template: StoryFn<{ subreddit: string; postId: string; title: string; comment_id?: string }> = (args) => (
  <MemoryRouter>
    <SinglePost {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  subreddit: "leagueoflegends",
  postId: "17yux8f",
  title: "weibo_gaming_vs_t1_2023_world_championship_final",
};

export const WithCommentId = Template.bind({});
WithCommentId.args = {
  subreddit: "leagueoflegends",
  postId: "17yux8f",
  title: "weibo_gaming_vs_t1_2023_world_championship_final",
  comment_id: "k9vni5m",
};

export const NormalPost = Template.bind({});
NormalPost.args = {
  subreddit: "singapore",
  postId: "1gfke9t",
  title: "spotted_a_singapore_shaped_cloud_today",
};

export const Crosspost = Template.bind({});
Crosspost.args = {
  subreddit: "reddevils",
  postId: "1gfvryi",
  title: "manchester_united_1_0_leicester_city_casemiro_15",
};
