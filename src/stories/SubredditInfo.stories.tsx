import { Meta, StoryFn } from "@storybook/react";
import SubredditInfo from "../components/SubredditInfo";
import { JSX } from "react/jsx-runtime";

const meta: Meta = {
  title: "Components/SubredditInfo",
  component: SubredditInfo,
};

export default meta;

const Template: StoryFn = (
  args: JSX.IntrinsicAttributes & { public_description_html?: string; accounts_active?: number; subscribers?: number }
) => <SubredditInfo {...args} />;

export const Default = Template.bind({});
Default.args = {
  public_description_html: "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;Welcome to &lt;a href=\"/r/singapore\"&gt;/r/singapore&lt;/a&gt;: The place for anything Singapore.&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;",
  accounts_active: 120,
  subscribers: 1500,
};
