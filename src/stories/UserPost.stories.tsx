import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import UserPost from "../components/UserPost";
import "../../src/index.css";

const meta: Meta = {
  title: "Components/UserPost",
  component: UserPost,
};

export default meta;

const Template: StoryFn<{ username: string }> = (args) => (
  <MemoryRouter>
    <UserPost {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  username: 'corylulu',
};