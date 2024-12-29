import { Meta, StoryFn } from "@storybook/react";
import AuthorFlairText, { AuthorFlairTextProps } from "../components/AuthorFlairText";

const meta: Meta = {
  title: "Components/AuthorFlairText",
  component: AuthorFlairText,
};

export default meta;

const Template: StoryFn<AuthorFlairTextProps> = (args) => <AuthorFlairText {...args} />;

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