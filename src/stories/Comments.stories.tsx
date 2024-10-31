import { Meta, StoryFn } from "@storybook/react";
import Comments from "../components/Comments";
import { Comment } from "../types/comment";
import "../../src/index.css";

const meta: Meta = {
  title: "Components/Comments",
  component: Comments,
};

export default meta;

const Template: StoryFn<{ comments: Comment[]; postAuthor: string; searchTerm: string }> = (args) => (
  <Comments {...args} />
);

export const Default = Template.bind({});
Default.args = {
  comments: [
    {
      id: "lunja4f",
      body_html:
        '&lt;div class="md"&gt;&lt;p&gt;Such practices are pretty common in many organisations, not just gov ministries and statboards. Cutting costs while purposely overloading employees, especially those lower ranking ones, in the name of productivity is very common strategy exploited by the top management to achieve their objectives to which their remuneration are tied to. They get disproportionately the most rewards if their company/organisation objectives (e.g profitability etc) are achieved, while doing practically nothing.&lt;/p&gt;\n&lt;/div&gt;',
      author: "ZeroPauper",
      created: 1730352615,
      edited: false,
      collapsed: true,
      permalink: "/r/singapore/comments/1gg6npo/purported_resignation_message_from_li_hongyi_as/lunja4f/",
      score: 100,
      created_utc: 1730352615,
      parent_id: "t1_lunf5w3",
      author_flair_richtext: [],
      replies: {
        kind: "Listing",
        data: {
          children: [
            {
              kind: "t1",
              data: {
                id: "reply1",
                body_html: '&lt;p&gt;I completely agree with this.&lt;/p&gt;',
                author: "AnotherUser",
                created: 1730353625,
                edited: false,
                collapsed: false,
                permalink: "/r/singapore/comments/1gg6npo/purported_resignation_message_from_li_hongyi_as/reply1",
                score: 50,
                created_utc: 1730353625,
                parent_id: "t1_lunja4f",
                author_flair_richtext: [],
                replies: {
                  kind: "Listing",
                  data: {
                    children: [],
                  },
                },
              },
            },
          ],
        },
      },
    },
  ],
  postAuthor: "meesiammaihum",
  searchTerm: "",
};

export const WithBlockquotes = Template.bind({});
WithBlockquotes.args = {
  comments: [
    {
      id: "lunja4f",
      body_html:
        '&lt;div class="md"&gt;&lt;blockquote&gt;\n&lt;p&gt;The first point is the minimisation and outright dismissal of the difficulty of the work...&lt;/p&gt;\n&lt;/blockquote&gt;\n\n&lt;p&gt;If this is true, then that’s probably what’s happening in almost every ministry and statboard. &lt;/p&gt;\n&lt;/div&gt;',
      author: "ZeroPauper",
      created: 1730352615,
      edited: 1730352857,
      collapsed: true,
      permalink: "/r/singapore/comments/1gg6npo/purported_resignation_message_from_li_hongyi_as/lunja4f/",
      score: 100,
      created_utc: 1730352615,
      parent_id: "t1_lunf5w3",
      author_flair_richtext: [],
      replies: {
        kind: "Listing",
        data: {
          children: []
        },
      },
    },
  ],
  postAuthor: "meesiammaihum",
  searchTerm: "",
};
