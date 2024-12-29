import { Meta, StoryFn } from "@storybook/react";
import LinkFlairText, { LinkFlairTextProps } from "../components/LinkFlairText";

const meta: Meta = {
  title: "Components/LinkFlairText",
  component: LinkFlairText,
};

export default meta;

const Template: StoryFn<LinkFlairTextProps> = (args) => <LinkFlairText {...args} />;

export const Default = Template.bind({});
Default.args = {
  link_flair_richtext: [
    {
      "e": "text",
      "t": "Video"
    }
  ],
  link_flair_text: "Flair",
  link_flair_background_color: "#ff4500"
};