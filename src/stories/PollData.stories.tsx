import { Meta, StoryFn } from "@storybook/react";
import PollData from "../components/PollData";
import "../../src/index.css";

const pollData = {
  voting_end_timestamp: "1703156911050",
  options: [
    { text: "Ruthless", vote_count: 317, id: "26371680" },
    { text: "Alacrity", vote_count: 91, id: "26371681" },
    { text: "Peace", vote_count: 295, id: "26371682" },
    { text: "Thin", vote_count: 159, id: "26371683" },
    { text: "Results", vote_count: 2797, id: "26371684" },
  ],
  user_selection: undefined,
  total_vote_count: 3659,
};

const meta: Meta = {
  title: "Components/PollData",
  component: PollData,
};

export default meta;

const Template: StoryFn<{ poll_data: typeof pollData }> = (args) => <PollData {...args} />;

export const Default = Template.bind({});
Default.args = {
  poll_data: {
    ...pollData,
  },
};
