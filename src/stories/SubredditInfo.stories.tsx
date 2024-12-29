import { Meta, StoryFn } from "@storybook/react";
import SubredditInfo, { SubredditInfoProps } from "../components/SubredditInfo";

const meta: Meta = {
  title: "Components/SubredditInfo",
  component: SubredditInfo,
};

export default meta;

const Template: StoryFn<SubredditInfoProps> = (args) => <SubredditInfo {...args} />;

export const Default = Template.bind({});
Default.args = {
  public_description_html:
    '&lt;!-- SC_OFF --&gt;&lt;div class="md"&gt;&lt;p&gt;Welcome to &lt;a href="/r/singapore"&gt;/r/singapore&lt;/a&gt;: The place for anything Singapore.&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;',
  accounts_active: 120,
  subscribers: 1500,
};
