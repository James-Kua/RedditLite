import { Meta, StoryFn } from "@storybook/react";
import LinkFlairText from "../components/LinkFlairText";
import { LinkFlairRichtext } from "../types/post";

const meta: Meta = {
  title: "Components/LinkFlairText",
  component: LinkFlairText,
};

export default meta;

const Template: StoryFn<{
  link_flair_richtext?: LinkFlairRichtext[];
  link_flair_text?: string;
  link_flair_background_color?: string;
}> = (args) => <LinkFlairText {...args} />;

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