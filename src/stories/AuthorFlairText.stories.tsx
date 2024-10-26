import { Meta, StoryFn } from "@storybook/react";
import AuthorFlairText from "../components/AuthorFlairText";
import { AuthorFlairRichtext } from "../types/post";

const meta: Meta = {
  title: "Components/AuthorFlairText",
  component: AuthorFlairText,
};

export default meta;

const Template: StoryFn<{
  author_flair_richtext?: AuthorFlairRichtext[];
  author_flair_text?: string;
  author_flair_background_color?: string;
}> = (args) => <AuthorFlairText {...args} />;

export const Default = Template.bind({});
Default.args = {
  author_flair_richtext: [
    {
      "a": ":cnrng:",
      "u": "https://emoji.redditmedia.com/sgaobqhwvzg21_t5_2rfxx/cnrng",
      "e": "emoji"
    },
    {
      "a": ":cn:",
      "u": "https://emoji.redditmedia.com/ibp7xzgsl4551_t5_2rfxx/cn",
      "e": "emoji"
    }
  ],
  author_flair_text: ":koafr: :eufnc:",
  author_flair_background_color: "dark"
};