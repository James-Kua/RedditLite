import { Meta, StoryFn } from "@storybook/react";
import SecureMediaEmbed from "../components/SecureMediaEmbed";

const meta: Meta = {
  title: "Components/SecureMediaEmbed",
  component: SecureMediaEmbed,
};

export default meta;

const Template: StoryFn<{
  url_overridden_by_dest?: string;
  content?: string;
  media_domain_url?: string;
  width: number;
  height: number;
  playing?: boolean;
}> = (args) => <SecureMediaEmbed {...args} />;

export const Default = Template.bind({});
Default.args = {
  url_overridden_by_dest: "https://v.redd.it/vk9mki6au0xd1",
  content: "This is some example content for the embed.",
  media_domain_url: undefined,
  width: 640,
  height: 360,
  playing: true,
};